---
title: "Rate Limiting Algorithms Explained: Token Bucket to Sliding Window"
description: "Fixed window, sliding window, token bucket and leaky bucket rate limiters explained, with atomic Redis Lua implementations and proper 429 responses."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "System Design"
tags: ["System Design", "Redis", "API Design", "Backend", "Distributed Systems"]
keywords: "rate limiting algorithms, token bucket algorithm, sliding window rate limiter, leaky bucket, fixed window counter, Redis rate limiter, distributed rate limiting, 429 Too Many Requests, rate limit headers"
featured: false
faq:
  - q: "Which rate limiting algorithm is best?"
    a: "For most APIs, the token bucket is the best default: it enforces an average rate while allowing short bursts, and needs only two values per client. The sliding window counter is a good alternative when you want limits that read like 'N requests per minute' without the burst problems of a fixed window."
  - q: "What is the difference between token bucket and leaky bucket?"
    a: "A token bucket allows bursts up to the bucket size and then limits to the refill rate. A leaky bucket smooths traffic into a constant outflow rate, queuing or rejecting requests that arrive faster. Token bucket is better for APIs; leaky bucket is better for protecting a downstream system that needs steady load."
  - q: "How do you implement distributed rate limiting?"
    a: "Store limiter state in a shared, fast store such as Redis and update it atomically, usually with a Lua script so the read-check-write happens as a single operation. Key the state by client identity (API key, user ID or IP) and set a TTL so idle keys expire."
  - q: "What HTTP status code should a rate limiter return?"
    a: "429 Too Many Requests, with a Retry-After header telling the client when to try again, and ideally RateLimit headers describing the limit, remaining quota and reset time."
---

Every public API eventually meets a client that sends too many requests: a buggy retry loop, a scraper, a customer's cron job that fires every second instead of every hour, or an actual attack. Without a rate limiter, one noisy client degrades the service for everyone else.

Rate limiting sounds simple: "100 requests per minute". But there are at least five algorithms, they behave very differently at the edges, and the distributed version has a race condition that catches most first implementations. This guide walks through each algorithm, when to use it, and a production-ready Redis implementation.

## What a rate limiter is protecting

It helps to be explicit about the goal, because it changes the algorithm:

- **Fairness:** stop one tenant from consuming capacity meant for all of them.
- **Cost control:** cap expensive operations (LLM calls, SMS, third-party APIs billed per request).
- **Abuse prevention:** slow down credential stuffing and scraping.
- **Protecting a fragile dependency:** keep load on a downstream system steady.

The first three usually want *bursts allowed, average enforced*. The last one wants *smooth, constant flow*.

## 1. Fixed window counter

Count requests per client in fixed windows of time (`12:00:00–12:00:59`, `12:01:00–12:01:59`). If the count exceeds the limit, reject.

```lua
-- KEYS[1] = "rl:{client}:{window_start}", ARGV[1] = limit, ARGV[2] = window seconds
local count = redis.call("INCR", KEYS[1])
if count == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[2])
end
return count <= tonumber(ARGV[1]) and 1 or 0
```

**Pros:** trivial, one counter per client, very cheap.

**The flaw:** bursts at the boundary. With a limit of 100/minute, a client can send 100 requests at 12:00:59 and another 100 at 12:01:00: 200 requests in two seconds, all allowed. For fairness that's usually acceptable; for protecting a fragile backend it isn't.

## 2. Sliding window log

Store the timestamp of every request in a sorted set. On each request, drop timestamps older than the window, count what's left, and allow if under the limit.

```lua
-- KEYS[1] = "rl:{client}", ARGV: now_ms, window_ms, limit, request_id
redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, ARGV[1] - ARGV[2])
if redis.call("ZCARD", KEYS[1]) < tonumber(ARGV[3]) then
  redis.call("ZADD", KEYS[1], ARGV[1], ARGV[4])
  redis.call("PEXPIRE", KEYS[1], ARGV[2])
  return 1
end
return 0
```

**Pros:** exact. "No more than 100 requests in *any* 60-second period."

**Cons:** memory grows with the limit. A limit of 10,000 requests per hour means storing up to 10,000 entries per client. Fine for low limits on sensitive endpoints (login attempts, password resets), wasteful for high-volume APIs.

## 3. Sliding window counter

A clever approximation that gets most of the accuracy of the log with the memory of the fixed window. Keep counters for the current and previous window, and weight the previous one by how much of it still overlaps the sliding window:

```text
estimated = current_count + previous_count × (1 − elapsed_in_current / window)
```

If the window is one minute, we're 15 seconds into the current minute, the previous minute had 80 requests and the current one has 30:

```text
estimated = 30 + 80 × (1 − 15/60) = 30 + 60 = 90
```

With a limit of 100, this request is allowed. The approximation assumes requests in the previous window were evenly spread, which is close enough in practice; Cloudflare has described using this approach at very large scale.

**Pros:** two counters per client, no boundary bursts, limits that read naturally ("100 per minute").

**Cons:** approximate, so not ideal when you need an exact guarantee.

## 4. Token bucket

Picture a bucket that holds up to `capacity` tokens and refills at `rate` tokens per second. Each request takes one token. No token, no request.

- A client that's been idle has a full bucket and can burst up to `capacity` requests immediately.
- Sustained traffic is limited to `rate` per second.

You don't need a timer to refill the bucket. Store the token count and the time of the last update, and compute the refill lazily on each request:

```lua
-- KEYS[1] = "tb:{client}"
-- ARGV: capacity, refill_per_sec, now_ms, cost
local capacity = tonumber(ARGV[1])
local rate     = tonumber(ARGV[2])
local now      = tonumber(ARGV[3])
local cost     = tonumber(ARGV[4])

local state  = redis.call("HMGET", KEYS[1], "tokens", "ts")
local tokens = tonumber(state[1]) or capacity
local ts     = tonumber(state[2]) or now

-- Refill based on elapsed time, capped at capacity.
tokens = math.min(capacity, tokens + (now - ts) / 1000 * rate)

local allowed = 0
local retry_after_ms = 0
if tokens >= cost then
  tokens = tokens - cost
  allowed = 1
else
  retry_after_ms = math.ceil((cost - tokens) / rate * 1000)
end

redis.call("HSET", KEYS[1], "tokens", tokens, "ts", now)
-- Expire idle buckets once they would be full again anyway.
redis.call("PEXPIRE", KEYS[1], math.ceil(capacity / rate * 1000) + 1000)

return { allowed, math.floor(tokens), retry_after_ms }
```

**Pros:** allows natural bursts (a page load firing 10 API calls at once), enforces a long-run average, constant memory, and supports **weighted costs**: an expensive search can cost 10 tokens while a cheap lookup costs 1.

**Cons:** two parameters to tune instead of one, and limits are slightly less intuitive to explain to customers.

This is my default for API rate limiting. AWS API Gateway and Stripe both describe their limits in token-bucket terms (a steady rate plus a burst).

## 5. Leaky bucket

The mirror image of the token bucket. Requests enter a queue (the bucket) and leave at a fixed rate. If the bucket is full, new requests are rejected.

The leaky bucket doesn't allow bursts through; it **smooths** them. That makes it the right tool when you're protecting something that needs steady load: a legacy system, a third-party API with a strict per-second limit, an SMS gateway. In practice, the "queue" is often an actual job queue with a fixed number of workers, rather than a rate-limiter data structure.

## Comparison

| Algorithm | Allows bursts? | Accuracy | Memory per client | Best for |
| --- | --- | --- | --- | --- |
| Fixed window | Yes, up to 2× at boundaries | Low at edges | 1 counter | Simple quotas, internal tools |
| Sliding log | No | Exact | O(limit) | Low limits on sensitive endpoints |
| Sliding window counter | Limited | Approximate, good | 2 counters | General per-minute API limits |
| Token bucket | Yes, up to capacity | Exact for its model | 2 values | Default for public APIs |
| Leaky bucket | No, smooths traffic | Exact for its model | Queue | Protecting a downstream system |

## Why the Lua scripts matter: the distributed race

With several API servers sharing a limiter, the naïve approach is:

1. `GET` the current count.
2. Check it against the limit in application code.
3. `SET` the new count.

Two servers can both read `99`, both decide "under 100", and both write `100`. Under real load, that race lets through far more than the limit.

Redis runs a Lua script atomically: no other command executes in the middle of it. That's why every implementation above is a script rather than a sequence of calls from Node.js. Load it once and invoke it by SHA:

```ts
import { createClient } from "redis";
import { readFileSync } from "node:fs";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();
const sha = await redis.scriptLoad(readFileSync("token_bucket.lua", "utf8"));

export async function take(clientId: string, cost = 1) {
  const [allowed, remaining, retryAfterMs] = (await redis.evalSha(sha, {
    keys: [`tb:${clientId}`],
    arguments: ["100", "10", String(Date.now()), String(cost)], // burst 100, 10/sec sustained
  })) as number[];
  return { allowed: allowed === 1, remaining, retryAfterMs };
}
```

One subtlety: the script uses the API server's clock (`Date.now()`). If your servers' clocks drift, limits get slightly fuzzy. For tighter guarantees, call `redis.call("TIME")` inside the script to use Redis's clock instead.

In a Redis Cluster, a script can only touch keys in the same hash slot. Keep each client's state in a single key (as above), or use a hash tag like `rl:{client42}:a` and `rl:{client42}:b` to force related keys onto the same slot.

## Telling clients what happened

A good rate limiter is also a good API citizen. Return `429 Too Many Requests` with headers that let well-behaved clients slow down instead of hammering you:

```ts
app.use(async (req, res, next) => {
  const id = req.header("X-API-Key") ?? req.ip;
  const { allowed, remaining, retryAfterMs } = await take(id);

  res.set("RateLimit-Limit", "100");
  res.set("RateLimit-Remaining", String(Math.max(0, remaining)));

  if (!allowed) {
    res.set("Retry-After", String(Math.ceil(retryAfterMs / 1000)));
    return res.status(429).json({ error: "rate_limited", retryAfterMs });
  }
  next();
});
```

`Retry-After` is standard HTTP. The `RateLimit-*` headers come from an IETF draft that many APIs already follow; whichever names you choose, document them.

## Production details that matter

- **Identify clients by the most specific identity you have.** API key or user ID beats IP address. Many users share an IP (offices, mobile carriers using NAT), and attackers rotate IPs cheaply.
- **Layer your limits.** A generous global limit per IP at the edge (CDN or gateway), a per-account limit in the API, and tight limits on sensitive endpoints like login, OTP and password reset.
- **Decide what happens when Redis is down.** Fail open (allow everything) protects availability; fail closed protects the backend. Most APIs fail open with a local in-memory fallback limiter, and alert loudly.
- **Exempt health checks and internal traffic,** or your own monitoring will trip the limiter during an incident, exactly when you need it most.
- **Rate limit before expensive work.** Check the limit before parsing large bodies, hitting the database or calling an LLM.
- **Log rejections with the client identity.** A sudden spike of 429s for one customer is usually a bug in their integration, and they'll appreciate you telling them.

## Key takeaways

- **Token bucket** is the best default for APIs: bursts allowed, average enforced, constant memory, weighted costs.
- **Sliding window counter** gives intuitive "N per minute" limits without fixed-window boundary bursts.
- **Sliding log** is exact but memory-hungry; use it for low limits on sensitive endpoints.
- **Leaky bucket** smooths traffic to protect fragile downstream systems.
- **Make distributed limiters atomic** with Redis Lua scripts, or concurrent requests will race past the limit.
- **Return 429 with `Retry-After`** so good clients can back off gracefully.
