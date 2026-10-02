---
title: "Kafka vs RabbitMQ vs Redis Streams: Choosing a Message Queue"
description: "Kafka vs RabbitMQ vs Redis Streams compared: ordering, delivery guarantees, replay, throughput and operations, plus a decision guide from production."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "System Design"
tags: ["Kafka", "RabbitMQ", "Redis", "System Design", "Distributed Systems", "Backend"]
keywords: "Kafka vs RabbitMQ, Kafka vs Redis Streams, RabbitMQ vs Redis, message queue comparison, event streaming vs message broker, choose message queue, Kafka consumer groups, exactly once Kafka"
featured: true
faq:
  - q: "When should I use Kafka instead of RabbitMQ?"
    a: "Use Kafka when you need a durable, replayable event log: high-throughput event streaming, multiple independent consumers of the same data, event sourcing, change data capture or analytics pipelines. Use RabbitMQ when you need flexible routing of individual tasks to workers, per-message acknowledgement, priorities and delayed retries."
  - q: "Is Redis Streams a replacement for Kafka?"
    a: "For small to medium workloads that fit in memory and already use Redis, Redis Streams provides consumer groups, acknowledgements and replay with far less operational overhead. It is not a replacement for Kafka at very high volume or long retention, because data lives in memory and the durability guarantees are weaker."
  - q: "Does Kafka guarantee message ordering?"
    a: "Kafka guarantees ordering only within a partition. Messages with the same key go to the same partition, so ordering is preserved per key (for example, per user or per order), not across the whole topic."
  - q: "What is the difference between a message queue and an event stream?"
    a: "A message queue delivers each message to one consumer and deletes it once acknowledged; it represents work to be done. An event stream keeps an ordered log of events for a retention period, and any number of consumers can read it independently at their own position; it represents facts that happened."
---

"Which message queue should we use?" is one of the first architecture questions a growing backend runs into, and one of the most expensive to get wrong. The three names that come up most are **Apache Kafka**, **RabbitMQ** and **Redis Streams**.

Kafka and Redis are at the core of the systems I build. At Noisiv Consulting, a Kafka and Redis pipeline I designed processes **more than 75,000 messages per second with sub-50ms latency**. At Qid, we used Kafka and Redis to keep verification data synchronized across regions on unreliable networks. Those systems taught me that the right choice depends less on benchmarks and more on one question: **are you moving tasks, or recording events?**

## The one distinction that matters most

**A message queue moves work.** A producer says "please resize this image" or "send this email." One worker picks it up, does it and acknowledges it, and the message is gone. RabbitMQ is the classic example.

**An event log records facts.** A producer says "order 4182 was placed." The event is appended to a log and kept for days or forever. Any number of consumers (billing, analytics, search indexing, notifications) read the log independently, each tracking its own position. Kafka is the classic example.

Redis Streams sits in between: it's an append-only log, like Kafka, but it lives in Redis's memory and is usually used with queue-like semantics.

Once you know which of the two you need, most of the decision makes itself.

## Architecture in one paragraph each

**Kafka** stores data in *topics* split into *partitions*. Each partition is an ordered, append-only log replicated across brokers. Producers append; consumers in a *consumer group* divide the partitions among themselves and commit *offsets* to record progress. Messages aren't deleted when read; they're kept for a retention period (by time or size) or compacted to the latest value per key.

**RabbitMQ** is a broker built around *exchanges* and *queues*. Producers publish to an exchange, which routes messages to queues using bindings (direct, topic patterns, fanout, headers). Consumers receive messages pushed from queues and acknowledge each one; acknowledged messages are removed. Recent versions add *quorum queues* for replicated durability and *streams* for log-style consumption.

**Redis Streams** is a data type (`XADD`, `XREADGROUP`, `XACK`) inside Redis. Each stream is an append-only log with IDs ordered by time. Consumer groups track which entries were delivered to which consumer and which are still pending acknowledgement. You can trim the stream by length or ID to bound memory.

## Side-by-side comparison

| Feature | Kafka | RabbitMQ | Redis Streams |
| --- | --- | --- | --- |
| Model | Distributed, partitioned log | Broker with routing to queues | In-memory append-only log |
| Best at | High-throughput event streaming, replay | Task distribution, complex routing | Lightweight streams on existing Redis |
| Ordering | Per partition (per key) | Per queue, single consumer | Per stream |
| Replay | Yes, by offset or timestamp | Not for classic queues (streams: yes) | Yes, by ID while not trimmed |
| Retention | Days to forever, on disk | Until acknowledged | Until trimmed; bounded by memory |
| Throughput | Very high (hundreds of thousands+/sec per cluster) | High (tens of thousands/sec per queue) | High, bounded by a single shard per stream |
| Consumer scaling | Up to number of partitions per group | Add competing consumers freely | Add consumers to the group |
| Routing | Topic + key only | Rich: topic patterns, headers, fanout | None built in |
| Delayed / priority messages | Not natively | Yes (priority queues, delayed via plugin or TTL + DLX) | Not natively |
| Operational weight | Highest | Medium | Lowest if you already run Redis |

The throughput numbers are deliberately rough; real numbers depend on message size, replication, batching and hardware. The shape is what matters: Kafka scales out horizontally by adding partitions and brokers, RabbitMQ scales per queue, and a Redis stream lives on one shard.

## Ordering: what you actually get

Kafka guarantees order **within a partition**, and the producer chooses the partition by hashing the message key. Use the entity ID as the key (`orderId`, `userId`) and every event for that entity stays in order, while different entities are processed in parallel. This is the single most important Kafka design decision you'll make: choose keys that match the ordering your business logic needs.

RabbitMQ preserves order within a queue, but once you have multiple competing consumers, messages are processed in parallel and can *complete* out of order. A redelivered message (after a consumer crash) also goes back into the queue and can be processed after later ones. If you need strict per-entity ordering in RabbitMQ, you need one consumer per queue or consistent-hash exchanges to shard by key.

Redis Streams entries are strictly ordered by ID, but as with RabbitMQ, multiple consumers in a group process them in parallel.

## Delivery guarantees, honestly

All three systems give you **at-least-once delivery** in normal configurations: a message can be delivered more than once if a consumer crashes after processing but before acknowledging. That leads to a rule I apply everywhere:

> Every consumer must be idempotent. Processing the same message twice should be harmless.

Kafka offers "exactly-once semantics" through idempotent producers and transactions, but this guarantee covers reading from Kafka, processing, and writing back to Kafka atomically. The moment your consumer writes to an external database, sends an email or calls an API, you're back to at-least-once and need idempotency on your side. The usual approach is to store a processed-message ID (or use the event ID as a unique key) in the same database transaction as the side effect. I wrote a full guide to that pattern in [Idempotency Keys: How to Make API Retries Safe](/blog/idempotency-keys-api-design).

## Code: the same consumer in each system

### Kafka (KafkaJS)

```ts
import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "billing", brokers: ["kafka-1:9092"] });
const consumer = kafka.consumer({ groupId: "billing-service" });

await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: false });

await consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value!.toString());
    await chargeOnce(event.orderId, event.amount); // idempotent
  },
});
```

Offsets are committed automatically after `eachMessage` resolves. If the handler throws, the offset isn't committed and the message is retried, which is exactly why `chargeOnce` must be idempotent.

### RabbitMQ (amqplib)

```ts
import amqp from "amqplib";

const conn = await amqp.connect(process.env.AMQP_URL!);
const ch = await conn.createChannel();
await ch.assertQueue("billing.orders", { durable: true });
ch.prefetch(20); // at most 20 unacknowledged messages per consumer

ch.consume("billing.orders", async (msg) => {
  if (!msg) return;
  try {
    const event = JSON.parse(msg.content.toString());
    await chargeOnce(event.orderId, event.amount);
    ch.ack(msg);
  } catch (err) {
    ch.nack(msg, false, false); // send to the dead-letter exchange, don't requeue forever
  }
});
```

`prefetch` is the most important RabbitMQ tuning knob. Without it, the broker will push as many messages as it can to a single consumer, which starves the others and balloons memory.

### Redis Streams (node-redis)

```ts
await redis.xGroupCreate("orders", "billing", "0", { MKSTREAM: true }).catch(() => {});

while (true) {
  const res = await redis.xReadGroup("billing", consumerName, { key: "orders", id: ">" }, { COUNT: 50, BLOCK: 5000 });
  for (const stream of res ?? []) {
    for (const { id, message } of stream.messages) {
      await chargeOnce(message.orderId, Number(message.amount));
      await redis.xAck("orders", "billing", id);
    }
  }
}
```

Entries that were delivered but never acknowledged (because a consumer died) stay in the *pending entries list*. A separate loop should use `XAUTOCLAIM` to reassign entries that have been pending too long, otherwise they're stuck forever. That's the step most Redis Streams tutorials leave out.

## Failure handling and retries

How each system deals with a message that keeps failing tells you a lot about what it was designed for:

- **RabbitMQ** has first-class *dead-letter exchanges*: reject a message without requeueing and it's routed to a DLX, where you can inspect it, alert on it, or replay it after a delay. Retry-with-backoff is a well-trodden pattern (TTL queues that dead-letter back into the main queue).
- **Kafka** has no built-in per-message retry. A poison message blocks its partition if you keep retrying it. The standard pattern is retry topics (`orders.retry.1m`, `orders.retry.10m`) and a dead-letter topic, implemented by your consumer or framework.
- **Redis Streams** gives you the pending list and a delivery counter per entry; you implement the "after N attempts, move it to a dead-letter stream" logic yourself.

## Operations: the cost nobody puts in the benchmark

Running Kafka well means thinking about partition counts, replication factor, `min.insync.replicas`, broker disk, consumer lag monitoring and rebalances. Modern Kafka runs in KRaft mode without ZooKeeper, which removes a moving part, but it's still the heaviest of the three. Managed offerings (Confluent Cloud, Amazon MSK, Aiven, Redpanda as a Kafka-compatible alternative) are often worth the money for small teams.

RabbitMQ is lighter, but clustering and queue durability need care: use quorum queues for anything you can't lose, and monitor queue depth, unacknowledged counts and memory alarms.

Redis Streams is the easiest if Redis is already in your stack, but remember the constraints: data is in memory, so retention is bounded by RAM, and durability depends on your persistence settings and replication. Always trim streams (`XADD ... MAXLEN ~ 1000000`) or they'll grow until Redis runs out of memory.

## A decision guide

Choose **Kafka** when:

- Several independent services need the same events (the "fan-out to many teams" case).
- You need to replay history: rebuild a search index, backfill a new service, reprocess after a bug fix.
- You're doing change data capture, event sourcing, or analytics pipelines.
- Throughput is high and growing.

Choose **RabbitMQ** when:

- You're distributing *tasks* to workers: emails, image processing, report generation, webhooks.
- You need rich routing, priorities, per-message TTLs or delayed retries.
- Messages should disappear once handled, and nobody needs to replay them.

Choose **Redis Streams** when:

- You already run Redis and want a lightweight queue or stream without new infrastructure.
- Volume and retention fit comfortably in memory.
- You can accept Redis's durability model, or the data can be regenerated.

And a fourth option worth naming: **a database table plus `SELECT ... FOR UPDATE SKIP LOCKED`** in PostgreSQL. For a few hundred jobs per second, a jobs table is transactional with your business data, easy to inspect and needs no new infrastructure. Plenty of successful products never outgrow it.

## How I combine them

The systems I build rarely use just one. A common shape:

1. **Kafka** as the durable backbone of business events (`order.placed`, `user.verified`), consumed by many services.
2. **Redis** for caching and for short-lived, high-frequency coordination (rate limits, deduplication sets, real-time counters).
3. A **task queue** (RabbitMQ, or a Postgres-backed queue) for side-effect jobs triggered by those events, where retries and dead-lettering matter more than replay.

## Key takeaways

- **Tasks or events?** Tasks point to RabbitMQ (or a jobs table). Events point to Kafka. Redis Streams is the pragmatic middle when Redis is already there.
- **Ordering is per partition or per queue,** never global. Choose message keys to match your business invariants.
- **Assume at-least-once delivery** and make every consumer idempotent, whatever the marketing says about exactly-once.
- **Plan for poison messages** with dead-letter queues or topics from day one.
- **Count the operational cost,** not just the throughput. The best queue is the one your team can run at 3 a.m.
