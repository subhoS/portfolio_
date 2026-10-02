---
title: "PostgreSQL Indexing: A Practical Guide for Backend Engineers"
description: "Choose the right PostgreSQL index: B-tree column order, partial, covering, expression, GIN and BRIN indexes, reading EXPLAIN ANALYZE, unused indexes."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "Databases"
tags: ["PostgreSQL", "Databases", "Performance", "Backend", "SQL"]
keywords: "PostgreSQL indexing, Postgres index types, composite index column order, partial index, covering index INCLUDE, GIN index jsonb, BRIN index, EXPLAIN ANALYZE, index only scan, unused indexes postgres"
featured: false
faq:
  - q: "How do I know if PostgreSQL is using my index?"
    a: "Run EXPLAIN ANALYZE on the query. If you see Index Scan, Index Only Scan or Bitmap Index Scan with your index name, it is being used. A Seq Scan on a large table, or a high 'Rows Removed by Filter' count, means it is not."
  - q: "What order should columns be in a composite index?"
    a: "Put columns used with equality conditions first, then the column used for ranges or sorting. An index on (customer_id, created_at) serves 'WHERE customer_id = ? ORDER BY created_at DESC' perfectly, while the reverse order does not."
  - q: "Can too many indexes slow down PostgreSQL?"
    a: "Yes. Every index must be updated on each INSERT and on UPDATEs that touch indexed columns, it consumes disk and memory, and it prevents heap-only tuple (HOT) updates. Remove indexes that pg_stat_user_indexes shows are never scanned."
  - q: "When should I use a GIN index in PostgreSQL?"
    a: "Use GIN for values that contain many elements you search inside: jsonb containment queries, arrays, and full-text search with tsvector. For trigram-based LIKE '%term%' searches, use GIN with the pg_trgm extension."
---

The most common reason an API endpoint is slow is not the framework, the language or the cloud provider. It's a query doing a sequential scan over a table that grew a hundred times bigger than it was when the code was written.

At Noisiv Consulting, schema and index work alone **cut database response times by about 60% and raised throughput by 45%** on systems handling millions of requests a day. No rewrite, no new infrastructure: just the right indexes, and removing the wrong ones.

This guide is the mental model and the toolkit I use for that work.

## How a B-tree index works (the five-minute version)

PostgreSQL stores table rows in the *heap*, in no particular order. Finding all orders for customer 42 without an index means reading every page of the table: a **sequential scan**.

A B-tree index is a separate, sorted structure that maps column values to row locations. Because it's sorted, Postgres can jump to `customer_id = 42` in a handful of page reads, walk the matching entries, and fetch only those rows from the heap.

Two consequences shape every indexing decision:

1. **Sorted order means range and sort queries benefit too.** `WHERE created_at > now() - interval '7 days'` and `ORDER BY created_at DESC LIMIT 20` can both use a B-tree.
2. **Indexes aren't free.** Every insert, and every update to an indexed column, must update every relevant index. More indexes mean slower writes, more disk, and more memory competing for cache.

B-tree is the default (`CREATE INDEX` without `USING` creates one) and the right choice for the large majority of indexes.

## Start from the query, not the table

Don't index columns because they "look important". Index for specific queries, starting with the ones that cost the most in total. The `pg_stat_statements` extension tells you exactly which those are:

```sql
SELECT
  round(total_exec_time::numeric, 0) AS total_ms,
  calls,
  round(mean_exec_time::numeric, 2) AS mean_ms,
  left(query, 120) AS query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 15;
```

A query that takes 5 ms but runs 2 million times a day matters more than a 3-second report that runs twice. Sort by total time, not mean time.

## Reading EXPLAIN ANALYZE

`EXPLAIN` shows the plan Postgres intends to use; `EXPLAIN ANALYZE` runs the query and shows what actually happened. Add `BUFFERS` to see how much data was read:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total, status
FROM orders
WHERE customer_id = 42 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;
```

```text
Limit  (cost=0.00..2310.40 rows=20 width=24) (actual time=0.012..186.551 rows=20 loops=1)
  ->  Seq Scan on orders  (cost=0.00..415870.00 rows=3600 width=24) (actual time=0.011..186.540 rows=20 loops=1)
        Filter: ((customer_id = 42) AND (status = 'paid'::text))
        Rows Removed by Filter: 1940231
        Buffers: shared hit=1820 read=24310
Planning Time: 0.120 ms
Execution Time: 186.590 ms
```

What to look for:

- **`Seq Scan` on a big table** with a selective filter: a missing index.
- **`Rows Removed by Filter`** in the hundreds of thousands: Postgres read far more than it returned.
- **`read=` in Buffers**: pages fetched from disk rather than memory.
- **Estimated vs actual rows** wildly different (`rows=3600` estimated vs a different actual): stale statistics; run `ANALYZE orders`.
- **`Sort` nodes with `external merge`**: a sort spilled to disk; an index that provides the order may remove the sort entirely.

## Composite indexes: column order is everything

For the query above, the ideal index is:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer_status_created
  ON orders (customer_id, status, created_at DESC);
```

Now the plan becomes:

```text
Limit  (actual time=0.031..0.074 rows=20 loops=1)
  ->  Index Scan using idx_orders_customer_status_created on orders (actual time=0.030..0.070 rows=20 loops=1)
        Index Cond: ((customer_id = 42) AND (status = 'paid'::text))
Execution Time: 0.098 ms
```

From 186 ms to 0.1 ms. The ordering rule that makes it work:

1. **Equality columns first** (`customer_id = ?`, `status = ?`).
2. **Then the range or sort column** (`created_at`).

Because the index is sorted by `customer_id`, then `status`, then `created_at`, all the matching entries sit next to each other *already in the requested order*. Postgres reads the first 20 and stops. No sort, no scanning.

The **leftmost-prefix rule** follows from the same sorting: an index on `(a, b, c)` helps queries filtering on `a`, on `a, b`, or on `a, b, c`, but generally not queries filtering only on `b` or `c`. So an index on `(customer_id, status, created_at)` also serves `WHERE customer_id = ?`, and you don't need a separate single-column index for that.

## Partial indexes: index only the rows you query

If most queries only touch a small, well-defined subset of rows, index just that subset:

```sql
-- Workers only ever poll for pending jobs, which are <1% of the table.
CREATE INDEX CONCURRENTLY idx_jobs_pending
  ON jobs (run_at)
  WHERE status = 'pending';
```

The index stays tiny no matter how many completed jobs pile up, fits in memory, and is cheap to maintain. Other great uses: `WHERE deleted_at IS NULL` for soft deletes, and partial unique indexes like "one active subscription per user":

```sql
CREATE UNIQUE INDEX one_active_subscription
  ON subscriptions (user_id)
  WHERE status = 'active';
```

The query's `WHERE` clause must match the index predicate for Postgres to use it.

## Covering indexes and index-only scans

Even with a perfect index, Postgres usually visits the heap to fetch the columns you `SELECT`. If the index contains every column the query needs, it can skip the heap entirely with an **index-only scan**. `INCLUDE` adds payload columns to the index without making them part of the sort key:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer_created_cover
  ON orders (customer_id, created_at DESC)
  INCLUDE (total, status);
```

Index-only scans rely on the *visibility map*, which `VACUUM` maintains. On tables with heavy updates and lagging autovacuum, you'll see `Heap Fetches` climb in the plan and the benefit shrink. Healthy vacuuming is part of indexing.

## Expression indexes

An index on `email` doesn't help `WHERE lower(email) = ?`, because the indexed value isn't the value being compared. Index the expression itself:

```sql
CREATE UNIQUE INDEX CONCURRENTLY idx_users_email_lower ON users (lower(email));

SELECT * FROM users WHERE lower(email) = lower($1);
```

The same applies to `date(created_at)`, JSON field extraction (`(data->>'tenant_id')`) and any function you filter by. The query must use exactly the same expression.

## Beyond B-tree: GIN, GiST, BRIN and hash

| Index type | Good for | Example |
| --- | --- | --- |
| **B-tree** | Equality, ranges, sorting: the default | `customer_id`, `created_at` |
| **GIN** | Values containing many elements | `jsonb @>`, arrays, full-text `tsvector`, trigram `LIKE '%x%'` |
| **GiST** | Geometric, range types, nearest-neighbor | PostGIS, `tstzrange` overlap, exclusion constraints |
| **BRIN** | Huge tables where values correlate with physical order | append-only `events.created_at` |
| **Hash** | Equality only | Rarely better than B-tree in practice |

Two of these come up constantly in backend work.

**GIN for jsonb.** If you store flexible attributes in `jsonb` and query by containment:

```sql
CREATE INDEX CONCURRENTLY idx_products_attrs ON products USING gin (attributes jsonb_path_ops);

SELECT * FROM products WHERE attributes @> '{"color": "black", "size": "M"}';
```

`jsonb_path_ops` makes a smaller, faster index for `@>` queries; the default operator class supports more operators (like key-existence `?`).

**GIN with pg_trgm for "contains" search.** A B-tree can't help `ILIKE '%datta%'`, but a trigram index can:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY idx_users_name_trgm ON users USING gin (name gin_trgm_ops);

SELECT * FROM users WHERE name ILIKE '%datta%';
```

**BRIN for time-series.** On a 500-million-row append-only events table, a B-tree on `created_at` might be tens of gigabytes. A BRIN index stores just the min and max per block range and can be a few megabytes, yet still lets Postgres skip almost all of the table for time-range queries, because rows are physically stored in time order.

## Creating indexes safely in production

A plain `CREATE INDEX` blocks writes to the table for the whole build. On a busy table that's an outage. Use:

```sql
CREATE INDEX CONCURRENTLY idx_name ON table (...);
```

It takes longer and can't run inside a transaction block (so check how your migration tool handles it), but writes continue. If it fails partway, it leaves an `INVALID` index behind; drop it and try again:

```sql
SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;
```

## Finding indexes you should delete

Unused indexes are pure cost. Postgres tracks how often each index is scanned:

```sql
SELECT
  s.relname AS table_name,
  s.indexrelname AS index_name,
  pg_size_pretty(pg_relation_size(s.indexrelid)) AS size,
  s.idx_scan AS scans
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan = 0
  AND NOT i.indisunique
  AND NOT i.indisprimary
ORDER BY pg_relation_size(s.indexrelid) DESC;
```

Before dropping anything, check the statistics have been accumulating long enough to include monthly jobs, and check replicas: these counters are per server, so an index unused on the primary may be serving read queries on a replica.

Also look for **duplicate and redundant indexes**. If you have both `(customer_id)` and `(customer_id, created_at)`, the first is usually redundant.

## Common reasons Postgres ignores your index

- **Low selectivity.** If a filter matches a large share of the table, a sequential scan really is cheaper. An index on a boolean `is_active` column that's true for 95% of rows will rarely be used. (A partial index on the rare value might be.)
- **Function or type mismatch.** `WHERE lower(email) = ...` against a plain index, or comparing a `text` column to a numeric parameter.
- **Leading wildcard.** `LIKE '%term'` can't use a B-tree. Use trigram GIN.
- **Stale statistics.** Bulk loads can leave the planner with bad estimates. Run `ANALYZE`.
- **Small tables.** For a table that fits in a few pages, scanning it is faster than walking an index. That's correct behavior.
- **`OR` across different columns.** Sometimes rewriting as a `UNION ALL` of two indexed queries helps.

## A checklist for every slow query

1. Find it with `pg_stat_statements`, ranked by total time.
2. Run `EXPLAIN (ANALYZE, BUFFERS)` with realistic parameters.
3. Design the index from the query: equality columns, then range or sort column, `INCLUDE` what's selected.
4. Consider partial or expression indexes if the query targets a subset or a computed value.
5. Create it with `CONCURRENTLY`.
6. Re-run `EXPLAIN ANALYZE` and confirm the plan changed.
7. Every few months, remove indexes that are never scanned.

Indexing isn't a one-time task; it follows your query patterns. If you want the broader picture of where API latency comes from beyond the database, see [Why Your API Is Slow](/blog/why-your-api-is-slow). For taking load off the database entirely, see [Redis Caching Strategies That Survive Production](/blog/redis-caching-strategies).
