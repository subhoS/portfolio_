---
title: "Idempotency Keys: How to Make API Retries Safe"
description: "How idempotency keys stop double charges when clients retry: the design, a PostgreSQL and Node.js implementation, edge cases and idempotent consumers."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "Backend"
tags: ["API Design", "Backend", "Distributed Systems", "PostgreSQL", "Node.js"]
keywords: "idempotency key, idempotent API, API retries, Idempotency-Key header, prevent duplicate payments, exactly once processing, idempotent consumer, at least once delivery"
faq:
  - q: "What is an idempotency key?"
    a: "An idempotency key is a unique value the client generates and sends with a request, usually in an Idempotency-Key header. The server stores the result of the first request with that key and returns the same result for any retry, so an operation like a payment happens at most once even if the request is sent several times."
  - q: "Which HTTP methods are idempotent?"
    a: "By definition GET, HEAD, PUT, DELETE and OPTIONS are idempotent, and POST and PATCH are not. Idempotency keys are mainly used to make POST requests, such as creating payments or orders, safe to retry."
  - q: "How long should idempotency keys be stored?"
    a: "Long enough to cover every realistic retry window, commonly 24 hours. After that they can be deleted by a scheduled job or a TTL. Payment providers such as Stripe keep keys for about 24 hours."
  - q: "What happens if two requests with the same idempotency key arrive at the same time?"
    a: "The server must let only one of them execute. A unique constraint on the key makes the second insert fail; that request should then either wait for the first to finish or return a 409 Conflict telling the client to retry later."
---

A user taps "Pay". The request reaches your server, the payment goes through, and then the mobile network drops before the response arrives. The app shows an error. The user taps "Pay" again.

Did you just charge them twice?

If your API isn't idempotent, the honest answer is "probably". Networks fail *after* the server has done its work all the time: timeouts, load balancer resets, phones switching from Wi-Fi to mobile data. Clients retry, and they should. The server's job is to make sure **retrying is always safe**.

Idempotency keys are the standard way to do it. Stripe popularized the pattern, and it applies to any operation with side effects: creating orders, sending messages, issuing refunds, provisioning resources.

## What "idempotent" means

An operation is idempotent if doing it once or doing it many times leaves the system in the same state.

- `PUT /users/42 {"name": "Asha"}` is idempotent. Run it ten times and the name is still "Asha".
- `DELETE /orders/7` is idempotent. After the first call the order is gone; later calls change nothing.
- `POST /payments {"amount": 500}` is **not** idempotent. Each call creates a new payment.

The HTTP spec defines GET, HEAD, PUT, DELETE and OPTIONS as idempotent, and POST and PATCH as not. In practice, the dangerous operations are almost always POSTs, which is exactly where we need help.

## The idea in one sentence

**The client generates a unique key for each logical operation and sends it with every attempt; the server executes the operation once and replays the stored response for every retry.**

```http
POST /v1/payments HTTP/1.1
Idempotency-Key: 6f1c2a7e-3b4d-4e8a-9c71-2d5f0b8e4a10
Content-Type: application/json

{ "orderId": "ord_8812", "amount": 49900, "currency": "INR" }
```

The key is generated *once per user intent*, not once per HTTP attempt. When the app retries the same payment, it sends the same key. If the user starts a different payment, the app generates a new one. A UUIDv4 is the usual choice.

## Server design

The server needs a small table:

```sql
CREATE TABLE idempotency_keys (
  key            text        NOT NULL,
  account_id     bigint      NOT NULL,
  request_hash   text        NOT NULL,
  status         text        NOT NULL DEFAULT 'processing', -- processing | completed
  response_code  int,
  response_body  jsonb,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (account_id, key)
);
```

Three details are easy to miss:

1. **Scope keys to the caller** (`account_id` in the primary key). Otherwise one customer could, by accident or on purpose, collide with another's key and receive their response.
2. **Store a hash of the request body.** If a client reuses a key with a *different* payload, that's a bug on their side, and you should reject it with `422` rather than silently replaying an unrelated response.
3. **Track `processing` vs `completed`.** This is what makes concurrent duplicates safe.

## The request flow

For every request carrying an `Idempotency-Key`:

1. **Try to insert** a row with status `processing`.
2. If the insert **succeeds**, this request owns the key: run the operation, store the response, mark it `completed`, return the response.
3. If the insert **fails on the unique constraint**, a previous attempt exists:
   - If the stored `request_hash` differs, return `422 Unprocessable Entity`.
   - If it's `completed`, return the stored status code and body: the replay.
   - If it's still `processing`, another attempt is running right now: return `409 Conflict` (with `Retry-After`) so the client retries shortly.

Here's that flow in Node.js with PostgreSQL:

```ts
import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const hash = (body: unknown) => crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");

export function idempotent(handler: (req: Request) => Promise<{ status: number; body: unknown }>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.header("Idempotency-Key");
    if (!key) return res.status(400).json({ error: "Idempotency-Key header is required" });

    const accountId = req.user.accountId;
    const requestHash = hash(req.body);

    const inserted = await db.query(
      `INSERT INTO idempotency_keys (key, account_id, request_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING key`,
      [key, accountId, requestHash],
    );

    if (inserted.rowCount === 0) {
      const { rows } = await db.query(
        `SELECT request_hash, status, response_code, response_body
           FROM idempotency_keys WHERE key = $1 AND account_id = $2`,
        [key, accountId],
      );
      const existing = rows[0];
      if (existing.request_hash !== requestHash) {
        return res.status(422).json({ error: "Idempotency-Key reused with a different request" });
      }
      if (existing.status === "processing") {
        return res.status(409).set("Retry-After", "1").json({ error: "Request is already being processed" });
      }
      return res.status(existing.response_code).set("Idempotent-Replayed", "true").json(existing.response_body);
    }

    try {
      const result = await handler(req);
      await db.query(
        `UPDATE idempotency_keys
            SET status = 'completed', response_code = $3, response_body = $4
          WHERE key = $1 AND account_id = $2`,
        [key, accountId, result.status, JSON.stringify(result.body)],
      );
      return res.status(result.status).json(result.body);
    } catch (err) {
      // Release the key so the client can retry a failed attempt.
      await db.query(`DELETE FROM idempotency_keys WHERE key = $1 AND account_id = $2`, [key, accountId]);
      return next(err);
    }
  };
}

app.post("/v1/payments", idempotent(async (req) => {
  const payment = await payments.create(req.body);
  return { status: 201, body: payment };
}));
```

The unique primary key does the heavy lifting. Two identical requests racing each other can't both insert the row, so only one ever executes the handler.

## The hard part: crashes in the middle

The code above has a gap. Suppose the handler charges the card, and then the server crashes **before** the `UPDATE ... completed`. The row is stuck in `processing`, the client gets `409` forever, and you don't know whether the charge happened.

There are two ways to close the gap.

**Make the side effect and the key update atomic.** When the operation is purely a database write (create an order, record a transfer), do it in the same transaction as the idempotency row. Either both commit or neither does:

```ts
await db.tx(async (t) => {
  await t.query(`INSERT INTO idempotency_keys (...) VALUES (...)`); // fails on duplicates
  const order = await t.one(`INSERT INTO orders (...) VALUES (...) RETURNING *`);
  await t.query(`UPDATE idempotency_keys SET status='completed', response_body=$1 ...`, [order]);
});
```

**Pass idempotency downstream.** When the side effect is an external call (a payment provider, an email API), you can't wrap it in your transaction. Instead, forward a derived key to the downstream service if it supports one. Payment providers almost always do. Then a retry after a crash is safe: you run the handler again, the provider recognizes the key, and it returns the original charge instead of creating a new one. Pair this with a recovery job that finds rows stuck in `processing` for longer than a timeout and either completes or releases them.

For multi-step operations (reserve inventory, charge card, create shipment), record progress as you go. Store a "recovery point" on the idempotency row after each step, so a retry resumes from the last completed step instead of starting over.

## Errors: replay or retry?

Which failures should be stored and replayed, and which should free the key for another attempt?

- **Store and replay** final outcomes: success (`2xx`) and business errors that won't change on retry (`400` validation errors, `402` card declined).
- **Release the key** for transient failures: `5xx`, timeouts, a downstream outage. The next attempt should actually try again.

Getting this wrong in one direction means a declined card is retried until it succeeds without the user re-confirming; in the other, a temporary outage permanently "succeeds" as a failure.

## Expiring keys

Keys don't need to live forever, only longer than any realistic retry window. Twenty-four hours is a common choice. A nightly job (or a partitioned table you drop by day) keeps the table small:

```sql
DELETE FROM idempotency_keys WHERE created_at < now() - interval '24 hours';
```

## Idempotent consumers: the same idea for queues

Message brokers like Kafka, RabbitMQ and Redis Streams deliver messages **at least once**. A consumer can crash after processing a message but before acknowledging it, so the message comes back. (I compare how each broker handles this in [Kafka vs RabbitMQ vs Redis Streams](/blog/kafka-vs-rabbitmq-vs-redis-streams).)

The fix is the same pattern with a different key: use the event's unique ID.

```ts
async function handle(event: { id: string; orderId: string; amount: number }) {
  await db.tx(async (t) => {
    const fresh = await t.query(
      `INSERT INTO processed_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING event_id`,
      [event.id],
    );
    if (fresh.rowCount === 0) return; // already handled: skip
    await t.query(`UPDATE accounts SET balance = balance - $2 WHERE order_id = $1`, [event.orderId, event.amount]);
  });
}
```

The deduplication record and the side effect commit together. A redelivered event finds its ID already present and does nothing.

Sometimes you can avoid the extra table by making the write naturally idempotent: an upsert keyed on a business identifier, `SET status = 'shipped'` instead of incrementing a counter, or a unique constraint on `(order_id, type)` for ledger entries.

## Client-side rules

The server is only half of it. Clients should:

- Generate the key **once per user action** and persist it until the action definitely succeeds or fails. On mobile, that means storing it so a retry after an app restart still uses the same key.
- Retry only on network errors, `409`, `429` and `5xx`, with exponential backoff and jitter.
- Never reuse a key for a different payload.

## Key takeaways

- **Retries are inevitable,** so any non-idempotent operation will eventually run twice. Design for it before it costs someone money.
- **Idempotency keys** let clients retry POST requests safely: execute once, replay the stored response.
- **A unique constraint** on (caller, key) is what makes concurrent duplicates safe.
- **Close the crash gap** with a single transaction for database-only work, and by passing idempotency keys downstream for external calls.
- **Queue consumers need the same treatment,** keyed on event IDs, because every major broker delivers at least once.
