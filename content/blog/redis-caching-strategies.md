---
title: "Redis Caching Strategies That Survive Production"
description: "Cache-aside, write-through and write-behind in Node.js, plus what tutorials skip: invalidation, TTL jitter, cache stampedes, hot keys and eviction."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "Backend"
tags: ["Redis", "Caching", "Backend", "Performance", "System Design"]
keywords: "Redis caching strategies, cache aside pattern, write through cache, cache stampede, cache invalidation, Redis TTL, thundering herd, Redis eviction policy, Node.js Redis cache"
featured: true
faq:
  - q: "What is the best caching strategy for Redis?"
    a: "For most read-heavy applications, cache-aside (lazy loading) is the best default: read from Redis, fall back to the database on a miss, then populate the cache with a TTL. Add write-through or explicit invalidation for data that must be fresh, and stampede protection for hot keys."
  - q: "What is a cache stampede?"
    a: "A cache stampede (or thundering herd) happens when a popular key expires and many requests miss the cache at the same moment, all hitting the database to rebuild the same value. It is prevented with request coalescing, a short-lived lock, probabilistic early expiration, or serving stale data while one worker refreshes it."
  - q: "How long should a Redis TTL be?"
    a: "As long as the business can tolerate stale data, and no longer. Configuration and reference data can live for hours; user-facing data that changes often usually needs seconds to a few minutes. Always add random jitter so keys created together don't all expire together."
  - q: "Which Redis eviction policy should I use for a cache?"
    a: "For a pure cache, allkeys-lru or allkeys-lfu are good defaults, so Redis evicts the least useful keys when memory is full. Use volatile-* policies only when the same Redis instance also stores data without a TTL that must never be evicted."
---

Caching is the highest-leverage performance fix I know. At Qid, adding a Redis caching layer in front of our verification lookups **cut database load by 40%**, and that headroom is what let us absorb traffic spikes of five times normal load at peak hours.

It's also the fix most likely to cause a subtle production incident a month later. Stale data, a cache stampede after a deploy, a single hot key pinning one Redis CPU core at 100%: none of these show up in a tutorial, and all of them show up in production.

This guide covers the four caching patterns, when to use each, and the production details that decide whether your cache helps or hurts.

## First: should this be cached at all?

A cache is a copy of data that can be wrong. Before adding one, answer three questions:

1. **Is the read path actually the bottleneck?** If the slow part is an unindexed query, fix the index first. (I wrote about that in [Why Your API Is Slow](/blog/why-your-api-is-slow).)
2. **How stale can this data be?** Seconds? Minutes? Never? The answer picks your pattern and TTL.
3. **What's the read-to-write ratio?** Caching shines at 10:1 and above. Data that's written as often as it's read gains little and adds invalidation work.

Good candidates: user profiles, product catalogs, permissions, feature flags, configuration, computed aggregates, and responses from slow third-party APIs. Poor candidates: account balances, inventory counts at checkout, anything where a stale read costs money.

## Pattern 1: Cache-aside (lazy loading)

The application owns the logic. On a read, check Redis; on a miss, read the database and populate the cache.

```ts
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const TTL_SECONDS = 300;

export async function getUser(id: string) {
  const key = `user:v1:${id}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  if (user) {
    await redis.set(key, JSON.stringify(user), { EX: TTL_SECONDS });
  }
  return user;
}
```

**Why it's the default:** only data that's actually requested gets cached, a Redis outage degrades to "slower" instead of "down", and it's easy to reason about.

**The weakness:** the first request after a miss pays full price, and the cache can serve stale data until the TTL expires unless you invalidate on write.

Two details in that snippet matter more than they look:

- **The `v1` in the key.** When the shape of the cached object changes, bump the version. Old entries simply stop being read and expire on their own. No flush, no deploy-day errors from parsing an old format.
- **Not caching `null` here.** If you *do* get many lookups for IDs that don't exist (scrapers, broken links), cache a short-lived sentinel for misses, or every bad request goes straight to the database. This is called **negative caching**.

## Pattern 2: Write-through

Every write goes to the database and then immediately updates the cache.

```ts
export async function updateUser(id: string, patch: Partial<User>) {
  const user = await db.users.update(id, patch);
  await redis.set(`user:v1:${id}`, JSON.stringify(user), { EX: TTL_SECONDS });
  return user;
}
```

Reads stay fast and fresh, and you combine it with cache-aside for the read path. The cost is extra latency on every write, and you'll cache data that may never be read.

A safer variant for most teams is **write-invalidate**: delete the key on write instead of setting it, and let the next read repopulate it.

```ts
export async function updateUser(id: string, patch: Partial<User>) {
  const user = await db.users.update(id, patch);
  await redis.del(`user:v1:${id}`);
  return user;
}
```

Deleting is more robust than setting because it avoids a race where two concurrent writers update the database in one order and the cache in the other, leaving the cache permanently holding the older value.

## Pattern 3: Write-behind (write-back)

Writes go to the cache first and are flushed to the database asynchronously, usually in batches.

This is how you absorb write bursts: counters, analytics events, view counts, rate-limit buckets. It's also the riskiest pattern, because **data that's only in Redis can be lost**. Use it only when losing the last few seconds of writes is acceptable, or when Redis persistence (AOF with `appendfsync everysec`) plus a durable queue makes the risk acceptable.

In practice I rarely implement raw write-behind. If writes need buffering, I put them on a durable log like Kafka and let a consumer batch them into the database. That's the design behind a pipeline I built at Noisiv that moves **75,000+ messages per second at sub-50ms latency**. The cache is for reads; the log is for writes.

## Pattern 4: Refresh-ahead

Refresh popular keys *before* they expire, so users never see a miss. You can do this with a background job for a known set of hot keys (homepage data, top products), or opportunistically on read, as shown in the stampede section below.

## Cache invalidation: pick a strategy on purpose

There's a famous joke about cache invalidation being one of the two hard problems in computer science. It's hard because there's no universal answer, only trade-offs:

| Strategy | Freshness | Complexity | Use it for |
| --- | --- | --- | --- |
| TTL only | Stale up to TTL | Lowest | Data where minutes of staleness is fine |
| Delete on write | Fresh after write | Low | Entities updated through your own API |
| Event-driven (CDC / pub/sub) | Near real time | Medium–high | Data changed by many services or directly in the DB |
| Versioned keys | Instant switch | Low | Config, schema changes, bulk updates |

My rule of thumb: **always have a TTL, even when you also invalidate explicitly.** Invalidation code has bugs. A TTL guarantees that any bug heals itself eventually.

When several services write the same data, explicit deletes get scattered and forgotten. That's when change data capture (CDC) pays off: stream database changes (for example with Debezium into Kafka) and have one consumer invalidate the cache. I covered the CDC approach in [Building a Modern Search System](/blog/building-modern-search-system), and the same idea works for caches.

## TTL jitter: don't let keys expire together

If you warm 50,000 keys at deploy time with a 300-second TTL, they all expire in the same second. Add jitter:

```ts
const ttlWithJitter = (base: number, spread = 0.1) =>
  Math.round(base * (1 - spread + Math.random() * spread * 2));

await redis.set(key, value, { EX: ttlWithJitter(300) }); // 270–330s
```

It's one line of code and it removes a whole category of synchronized load spikes.

## Cache stampedes: the outage hiding in your hottest key

A stampede (or thundering herd) happens when a popular key expires and hundreds of concurrent requests all miss at once. Every one of them runs the same expensive query, the database slows down, the rebuilds take longer, and more requests pile up. A single expiring key for an expensive dashboard aggregate is enough to push a primary database to 100% CPU.

There are three good defenses, and they combine well.

### 1. Request coalescing (single flight)

Within one process, make concurrent misses for the same key share a single database call:

```ts
const inflight = new Map<string, Promise<unknown>>();

async function singleFlight<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;
  const p = load().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}
```

This turns 500 concurrent misses on one Node.js instance into one query. With 20 instances, that's 20 queries instead of 10,000.

### 2. A short distributed lock

Across instances, let only one worker rebuild the value while the others wait briefly or serve stale data:

```ts
async function getWithLock<T>(key: string, ttl: number, load: () => Promise<T>): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = `lock:${key}`;
  const gotLock = await redis.set(lockKey, "1", { NX: true, PX: 5_000 });

  if (gotLock) {
    try {
      const value = await load();
      await redis.set(key, JSON.stringify(value), { EX: ttlWithJitter(ttl) });
      return value;
    } finally {
      await redis.del(lockKey);
    }
  }

  // Someone else is rebuilding: wait briefly, then retry the cache.
  await new Promise((r) => setTimeout(r, 50));
  return getWithLock(key, ttl, load);
}
```

The lock has an expiry (`PX: 5000`) so a crashed worker can't hold it forever. In production, cap the number of retries so a slow rebuild can't turn into an unbounded loop.

### 3. Stale-while-revalidate

The most user-friendly option: store a "soft" expiry inside the value and keep the Redis key alive longer. When the soft expiry passes, serve the stale value immediately and refresh it in the background:

```ts
type Entry<T> = { value: T; freshUntil: number };

async function getSWR<T>(key: string, freshFor: number, load: () => Promise<T>) {
  const raw = await redis.get(key);
  const entry: Entry<T> | null = raw ? JSON.parse(raw) : null;

  const refresh = () =>
    singleFlight(key, async () => {
      const value = await load();
      const next: Entry<T> = { value, freshUntil: Date.now() + freshFor * 1000 };
      // Keep the key around 10x longer than its fresh window, so stale data is available.
      await redis.set(key, JSON.stringify(next), { EX: freshFor * 10 });
      return value;
    });

  if (!entry) return refresh();
  if (Date.now() > entry.freshUntil) void refresh(); // background, don't await
  return entry.value;
}
```

Users almost never wait on a rebuild, and only one refresh per process runs at a time.

## Hot keys and big keys

Redis runs commands on a single thread per shard, so one extremely popular key can saturate a shard while the rest of the cluster idles. Signs: one Redis node at high CPU, rising p99 latency, `redis-cli --hotkeys` (with an LFU eviction policy enabled) pointing at a handful of keys.

Fixes, roughly in order of effort:

- **Add a tiny in-process cache** (a few seconds, an LRU with a size cap) in front of Redis for the hottest keys. Even a 1-second local cache can remove most of the Redis traffic for a key read thousands of times a second.
- **Replicate the key**: write `config:v3:0` through `config:v3:7` and have readers pick one at random, spreading the load across shards.
- **Break up big keys.** A 5 MB JSON blob is slow to serialize, slow to transfer and blocks the shard while it's read. Store a hash, or split it into smaller keys.

## Memory and eviction

When Redis runs out of memory, the `maxmemory-policy` decides what happens. For a dedicated cache:

```conf
maxmemory 4gb
maxmemory-policy allkeys-lfu
```

`allkeys-lru` evicts the least recently used keys; `allkeys-lfu` evicts the least *frequently* used ones, which handles "a scraper touched every key once" better. The default policy, `noeviction`, makes writes fail when memory is full, which is the right behavior for a primary data store and the wrong one for a cache.

If the same instance holds data that must never be evicted (sessions without a TTL, queues), either move that data to a separate instance or use a `volatile-*` policy that only evicts keys with a TTL. Separate instances are simpler to reason about.

## Treat Redis as optional

Your cache will be unavailable at some point: a failover, a network blip, a deploy. Design for it:

- **Set short timeouts** on Redis calls (tens of milliseconds) so a slow cache doesn't make every request slow.
- **Catch cache errors and fall through to the database**, with a circuit breaker so you don't hammer the database harder than it can handle.
- **Load-test with the cache cold.** If the system can't survive an empty cache, you don't have a cache, you have a hidden dependency.

## What to measure

You can't tune what you can't see. Track:

- **Hit ratio** per key prefix. A cache with a 30% hit rate is mostly overhead.
- **Latency** of Redis calls at p50 and p99.
- **Evictions** (`evicted_keys` in `INFO stats`). Steady evictions mean the cache is too small for the working set.
- **Memory fragmentation** and used memory against `maxmemory`.
- **Database load before and after.** That's the number that justifies the cache.

## Key takeaways

- **Cache-aside plus delete-on-write** is the right default for most applications.
- **Always set a TTL, and add jitter.** Explicit invalidation will have bugs; TTLs heal them.
- **Protect hot keys from stampedes** with single-flight, a short lock, or stale-while-revalidate.
- **Version your keys** so format changes never require a flush.
- **Design for Redis being down.** Short timeouts, graceful fallback, and a load test with a cold cache.

Caching done well is invisible: pages are fast and nobody thinks about it. Caching done carelessly is the incident you'll be explaining in a postmortem. The difference is almost entirely in the details above.
