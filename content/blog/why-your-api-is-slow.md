---
title: "Why Your API Is Slow (And How to Fix It)"
date: "2025-12-15"
excerpt: "Most API performance issues come from the same handful of mistakes. Here's how to identify and fix the most common bottlenecks in your backend, with real examples and practical solutions."
description: "A practical guide to diagnosing and fixing slow APIs. Covers N+1 queries, missing indexes, payload bloat, connection pooling, and caching strategies with code examples in Node.js and SQL."
keywords: "API performance, slow API fix, N+1 query problem, database indexing, API caching, connection pooling, backend optimization, Node.js performance"
tags: ["Backend", "Performance", "Node.js", "System Design", "Tutorial"]
author: "Subhadeep Datta"
featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop"
---

## Introduction: The Slow API Problem

You've shipped your API. It works. Users are signing up. And then someone pings you on Slack: "Hey, the dashboard takes 8 seconds to load."

I've been there. Multiple times. And in almost every case, the fix wasn't some exotic optimization. It was one of five common issues hiding in plain sight.

This article covers the most frequent reasons your API is slow and how to fix each one with minimal effort. No theory dumps — just practical patterns you can apply today.

---

## 1. The N+1 Query Problem

This is the silent killer. Your code looks clean, your logic is correct, but your database is screaming.

### What Happens

You query a list of users, then for each user, you query their orders:

```javascript
// ❌ N+1 problem: 1 query for users + N queries for orders
const users = await db.query("SELECT * FROM users LIMIT 100");

for (const user of users) {
  const orders = await db.query(
    "SELECT * FROM orders WHERE user_id = $1",
    [user.id]
  );
  user.orders = orders;
}
```

That's 101 database queries for 100 users. Scale that to 10,000 users and your database connection pool is toast.

### The Fix

Use a JOIN or batch query:

```javascript
// ✅ Single query with JOIN
const result = await db.query(`
  SELECT u.*, json_agg(o.*) as orders
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  GROUP BY u.id
  LIMIT 100
`);
```

Or if you're using an ORM like Prisma:

```typescript
// ✅ Prisma: eager loading
const users = await prisma.user.findMany({
  take: 100,
  include: { orders: true },
});
```

**Impact:** 101 queries → 1 query. Response time drops from seconds to milliseconds.

---

## 2. Missing Database Indexes

If you've never thought about indexes, your queries are doing full table scans. On a table with a million rows, that's the difference between 2ms and 2 seconds.

### How to Spot It

Run `EXPLAIN ANALYZE` on your slow queries:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 42 AND status = 'completed';
```

If you see `Seq Scan` instead of `Index Scan`, you're missing an index.

### The Fix

```sql
-- Create a composite index for the most common query pattern
CREATE INDEX idx_orders_user_status
ON orders (user_id, status);
```

### Rules of Thumb

- Index columns you filter by (`WHERE`), sort by (`ORDER BY`), or join on (`JOIN`)
- Composite indexes should match your query pattern (leftmost columns first)
- Don't over-index — every index slows down writes
- Monitor slow query logs regularly

**Impact:** Query time from 2000ms → 5ms on a table with 1M rows.

---

## 3. Payload Bloat

Your API returns everything. The client needs 5 fields. You're sending 47.

### The Problem

```javascript
// ❌ Returns entire user object with nested data
app.get("/api/users", async (req, res) => {
  const users = await User.find(); // Returns ALL fields
  res.json(users);
});
```

A single user object might be 3KB. Multiply by 1000 users, and you're sending 3MB of JSON over the wire.

### The Fix

Select only what you need:

```javascript
// ✅ Return only the fields the client needs
app.get("/api/users", async (req, res) => {
  const users = await User.find()
    .select("id name email avatar role")
    .lean();
  res.json(users);
});
```

Other techniques:

- **Pagination**: Don't return 10,000 records at once. Use `limit` and `offset` or cursor-based pagination
- **Compression**: Enable gzip/brotli compression on your server
- **Sparse fieldsets**: Let clients specify which fields they want (like GraphQL does)

```javascript
// Cursor-based pagination (faster than offset for large datasets)
app.get("/api/users", async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  const users = await User.find(
    cursor ? { _id: { $gt: cursor } } : {}
  )
    .select("id name email")
    .limit(Number(limit) + 1)
    .sort({ _id: 1 });

  const hasMore = users.length > limit;
  const results = hasMore ? users.slice(0, -1) : users;

  res.json({
    data: results,
    nextCursor: hasMore ? results[results.length - 1]._id : null,
  });
});
```

**Impact:** 3MB → 200KB response. Pages load 10x faster on slow connections.

---

## 4. Connection Pool Exhaustion

Every time you open a new database connection, there's overhead: TCP handshake, authentication, setting up the session. If you're creating a new connection per request, you'll hit a wall fast.

### The Problem

```javascript
// ❌ New connection on every request
app.get("/api/data", async (req, res) => {
  const client = new Client({ connectionString: DB_URL });
  await client.connect(); // Expensive!
  const result = await client.query("SELECT * FROM data");
  await client.end();
  res.json(result.rows);
});
```

### The Fix

Use a connection pool:

```javascript
import { Pool } from "pg";

// ✅ Pool created once at startup, shared across requests
const pool = new Pool({
  connectionString: DB_URL,
  max: 20,           // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

app.get("/api/data", async (req, res) => {
  const result = await pool.query("SELECT * FROM data");
  res.json(result.rows);
});
```

### Connection Pool Sizing

A good formula: `pool size = (cores * 2) + effective_spindle_count`

For most web apps, 10–20 connections per instance is a safe starting point. Monitor your pool usage — if connections are always maxed out, you have a bigger problem upstream.

**Impact:** Connection time from 100ms → 1ms per query. Eliminates random timeouts under load.

---

## 5. No Caching Strategy

If you're hitting the database for data that barely changes, you're wasting cycles.

### What to Cache

- **User profiles** (change rarely)
- **Configuration/feature flags** (change on deploy)
- **Search results** (same queries repeat often)
- **Aggregated data** (expensive to compute, slow to change)

### Simple Redis Caching Pattern

```javascript
import Redis from "ioredis";

const redis = new Redis();

async function getCachedOrFetch(key, fetchFn, ttl = 300) {
  // Check cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Cache miss — fetch from DB
  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// Usage
app.get("/api/user/:id", async (req, res) => {
  const user = await getCachedOrFetch(
    `user:${req.params.id}`,
    () => db.query("SELECT * FROM users WHERE id = $1", [req.params.id]),
    600  // Cache for 10 minutes
  );
  res.json(user);
});
```

### Cache Invalidation

The hard part. Three strategies:

1. **TTL-based**: Set an expiry. Simple but data can be stale
2. **Write-through**: Update cache on every write. Always fresh but adds write latency
3. **Event-driven**: Use pub/sub or CDC to invalidate on changes. Best of both worlds

**Impact:** Response time for cached endpoints: 200ms → 5ms. Database load drops by 60-80%.

---

## Putting It Together: A Performance Checklist

Before you start optimizing, profile first. Don't guess — measure.

1. **Enable slow query logging** in your database
2. **Add request timing middleware** to your API
3. **Use APM tools** (Datadog, New Relic, or even simple `console.time`)
4. Run through these five checks in order

| Issue | Detection | Fix | Typical Impact |
|-------|-----------|-----|----------------|
| N+1 queries | Query count per request | JOINs or eager loading | 10-100x faster |
| Missing indexes | `EXPLAIN ANALYZE` | Add targeted indexes | 100-1000x faster |
| Payload bloat | Response size monitoring | Field selection + pagination | 5-15x smaller |
| Connection exhaustion | Pool monitoring | Connection pooling | Eliminates timeouts |
| No caching | Cache hit ratio = 0 | Redis + TTL strategy | 10-40x faster |

---

## Conclusion

Slow APIs aren't a mystery. They're almost always one of these five things. The good news is that fixing them is straightforward, and the performance gains are dramatic.

Start with the easiest wins: add an index, enable caching, trim your payloads. Then dig deeper into N+1s and connection management as you scale.

Your users won't know what changed. They'll just notice that everything feels faster.

---

## Key Takeaways

- **N+1 queries** are the #1 cause of slow APIs — always check your query count
- **Database indexes** are free performance — use `EXPLAIN ANALYZE` to find missing ones
- **Return only what clients need** — smaller payloads = faster responses
- **Connection pooling** is non-negotiable for production APIs
- **Cache aggressively** — most data doesn't change that often
