---
title: "Offline-First Architecture: Building Apps That Work on Bad Networks"
description: "Design offline-first apps: local-first storage, an outbox for writes, idempotent sync, conflict resolution and backends that absorb reconnect storms."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "System Design"
tags: ["System Design", "Architecture", "Mobile", "Distributed Systems", "Backend"]
keywords: "offline first architecture, offline first app, sync engine design, outbox pattern mobile, conflict resolution sync, last write wins, CRDT, low bandwidth app design, local first software"
featured: false
faq:
  - q: "What is offline-first architecture?"
    a: "Offline-first means the app reads from and writes to local storage first, so it works without a network, and synchronizes with the server in the background when a connection is available. The network becomes an optimization rather than a requirement for every action."
  - q: "How do offline-first apps handle conflicts?"
    a: "Common strategies are last-write-wins using server-assigned versions, field-level merging, domain-specific rules (for example, a cancellation always beats an update), and CRDTs for collaborative data. Many conflicts can be avoided entirely by designing writes as append-only events instead of overwrites."
  - q: "What is the outbox pattern in mobile apps?"
    a: "The outbox is a local, durable queue of pending writes. Every user action is saved to local data and to the outbox in one transaction; a background sync process sends outbox entries to the server, with retries and idempotency keys, and removes them once acknowledged."
  - q: "When should you not build offline-first?"
    a: "When every action needs a real-time authoritative answer from the server, such as making a payment, booking the last seat or trading, offline-first adds complexity without benefit. Those flows can still queue the request and show a clear pending state, but they cannot complete offline."
---

Most software is written in an office with fast Wi-Fi and tested on the same network. Then it ships to places where the signal drops in the stairwell, the basement has no coverage, and "4G" means a few kilobytes per second at peak hours.

At Qid, we built a secure digital check-in platform that had to work in exactly those places. It processed **more than 100,000 verifications in its first six months** and needed to absorb traffic spikes of **five times normal load** at peak hours, often at sites where connectivity was unreliable. The design that made it work was **offline-first**: treat the network as an optimization, not a requirement.

This article covers the architecture: how to structure local storage, sync, conflict handling and the backend so an app keeps working when the network doesn't.

## Online-first vs offline-first

Most apps are **online-first**: every action is a network request, and the UI waits for the server.

```text
User taps "Check in" → POST /checkins → spinner → (network drops) → error, data lost, user retries
```

An **offline-first** app inverts this:

```text
User taps "Check in" → write to local DB + outbox → UI updates instantly
                                     ↓ (background, whenever the network allows)
                            sync engine → POST /sync → server acknowledges → outbox entry cleared
```

The user's action succeeds locally, immediately. Getting the data to the server becomes a separate, retryable background concern.

This isn't only about having no network at all. The bigger win is on **bad** networks: requests that take eight seconds, or succeed on the server but time out on the client. Offline-first apps feel fast everywhere, because the UI never waits on the network.

## The four building blocks

### 1. A local database as the source of truth for the UI

The UI reads from and writes to a local store: SQLite on mobile (directly or through a library), IndexedDB in browsers. The UI never renders directly from an API response. Server data flows into the local database, and the UI observes the local database.

This one rule removes a whole class of bugs. There's one place the UI gets data from, whether it was just written by the user, synced from the server, or loaded from a previous session.

### 2. An outbox for writes

Every user action that changes data is written in **one local transaction** to:

- the local tables (so the UI shows it immediately), and
- an **outbox** table describing the change to send.

```sql
CREATE TABLE outbox (
  id           TEXT PRIMARY KEY,   -- client-generated UUID, doubles as the idempotency key
  entity       TEXT NOT NULL,      -- e.g. 'checkin'
  operation    TEXT NOT NULL,      -- 'create' | 'update' | 'cancel'
  payload      TEXT NOT NULL,      -- JSON
  created_at   INTEGER NOT NULL,
  attempts     INTEGER NOT NULL DEFAULT 0,
  last_error   TEXT
);
```

Because both writes happen in one transaction, you can't end up with a local change that never syncs, or an outbox entry for a change that didn't happen. The app can be killed, the phone restarted, the battery can die: the outbox survives.

### 3. A sync engine

A background process drains the outbox whenever a connection is available:

```ts
async function drainOutbox() {
  const batch = await db.all(`SELECT * FROM outbox ORDER BY created_at LIMIT 50`);
  if (batch.length === 0) return;

  const res = await fetchWithTimeout("/api/sync", {
    method: "POST",
    body: JSON.stringify({ changes: batch.map(({ id, entity, operation, payload }) => ({ id, entity, operation, payload: JSON.parse(payload) })) }),
    timeoutMs: 15_000,
  });

  const { applied, rejected } = await res.json(); // server reports per-change results
  await db.transaction(async (tx) => {
    for (const id of applied) await tx.run(`DELETE FROM outbox WHERE id = ?`, id);
    for (const r of rejected) await tx.run(`UPDATE outbox SET attempts = attempts + 1, last_error = ? WHERE id = ?`, r.reason, r.id);
  });
}
```

Key properties:

- **Batching.** On a slow, high-latency link, one request with 50 changes is dramatically better than 50 requests. Round trips are the enemy on bad networks.
- **Ordered per entity.** Changes to the same record are sent in the order they happened.
- **Backoff with jitter** between failed attempts, so a fleet of devices doesn't retry in lockstep.
- **Triggers:** run on app start, when connectivity returns, after each local write (debounced), and periodically.

### 4. Idempotent sync on the server

Here's the failure that breaks naive sync: the server applies a batch, the response is lost on the way back, and the client sends the same batch again. Without protection, every check-in is recorded twice.

The fix is that every change carries a **client-generated UUID**, and the server records which IDs it has applied, in the same transaction as the change itself:

```sql
INSERT INTO applied_changes (change_id) VALUES ($1) ON CONFLICT DO NOTHING;
-- If no row was inserted, this change was already applied: report it as applied again and skip.
```

Retries become harmless. This is the same idea as API idempotency keys, applied to sync; I've written about the pattern in detail in [Idempotency Keys: How to Make API Retries Safe](/blog/idempotency-keys-api-design).

## Pulling changes down: delta sync

Clients also need the server's changes. Sending the full dataset on every sync wastes the scarce bandwidth you're designing around. Instead, use **delta sync** with a cursor:

```http
GET /api/changes?since=184_221_907&limit=500
→ { "changes": [...], "cursor": "184_222_407", "hasMore": true }
```

The cursor should come from a **monotonically increasing server-side sequence** (a database sequence, or a log offset), not from timestamps. Client clocks are wrong surprisingly often, and server timestamps can collide or arrive out of order across concurrent transactions.

Deletions need special handling: if a record is deleted on the server, the client must learn about it. Keep **tombstones** (records of deletions) long enough for every client to sync, or the deleted record will live on forever on a device that was offline for a week.

Other bandwidth savers that made a real difference for us:

- **Compress payloads** (gzip or brotli), and keep JSON lean: short field names matter at a few KB/s.
- **Send only what the device needs:** scope sync by site, user or date range.
- **Lazy-load large blobs** like images separately from the metadata, and let them sync last.

## Conflict resolution

If two devices edit the same record while offline, someone has to decide what wins. There's no universal answer, but there's an order of preference.

**1. Design conflicts away.** Many conflicts exist only because data is modeled as mutable state. Model actions as **append-only events** instead: "checked in at 09:14", "checked out at 17:02". Two devices adding events never conflict; you merge the lists. Most of our core flows worked this way.

**2. Field-level merging.** If one device changed the phone number and another changed the address, keep both. Track changes per field, not per record.

**3. Domain rules.** Business logic often has a natural answer. A cancellation beats a modification; an approval by a supervisor beats an edit by a clerk; a verification result from the authoritative system beats a locally cached one.

**4. Last write wins, with server versions.** For everything else, LWW is acceptable if it's done carefully: each record has a version number assigned by the server. A client update includes the version it was based on; if the server's version has moved on, the server decides (apply, reject, or merge) instead of blindly overwriting newer data.

**5. CRDTs** (conflict-free replicated data types) guarantee that replicas converge automatically. They shine for collaborative editing (text, lists, whiteboards) and are worth reaching for when many people edit the same data concurrently. For most business records, simpler rules suffice.

Whatever you choose, **surface unresolvable conflicts to a human** rather than silently discarding someone's work.

## Designing the backend for reconnect storms

Offline-first changes the *shape* of traffic your backend sees. Devices that were offline all come back at once: when a site's network recovers, at shift change, when everyone arrives in the morning. Instead of a smooth flow of small requests, you get bursts of large sync batches.

What helped us absorb spikes of 5× normal load:

- **Accept fast, process asynchronously.** The sync endpoint validates the batch, writes it to a durable queue (Kafka, in our case), and acknowledges. Workers apply changes at a steady rate. The device gets its acknowledgement quickly; the database never sees the full spike.
- **Cache the read side aggressively.** Reference data that every device pulls (configurations, lists, policies) was served from Redis, which cut database load by about 40%.
- **Rate limit per device, not per IP.** Many devices at one site share a single IP address.
- **Jitter on the client.** Randomizing each device's sync start by a few seconds after reconnecting flattens the peak dramatically, for free.
- **Make every endpoint idempotent,** because on bad networks, retries are the normal case, not the exception.

## UX: honest about state

Offline-first UX isn't about pretending the network doesn't exist. It's about being honest:

- Show **sync state** where it matters: a small "3 changes waiting to sync" indicator builds trust; a silent app makes people tap buttons twice.
- Distinguish **"saved on this device"** from **"confirmed by the server"** for actions where the difference matters.
- **Never lose user input.** If a change is rejected by the server, keep it visible with an explanation and a way to fix it.
- Some actions genuinely require the server (a payment, booking the last available slot). Queue them with a clear **pending** state rather than faking success.

## When not to go offline-first

Offline-first adds real complexity: a local database, a sync protocol, conflict handling, migrations on every device. It's worth it when users work in the field, connectivity is unreliable, or perceived speed is a competitive advantage. It's overkill for an internal admin dashboard used on office Wi-Fi.

You can also adopt it incrementally: start with an outbox for the two or three most important write actions, and keep everything else online-first.

## Key takeaways

- **Write locally first, sync in the background.** The UI should never block on the network.
- **Use a durable outbox,** written in the same local transaction as the change.
- **Make sync idempotent** with client-generated change IDs, because lost acknowledgements are guaranteed on bad networks.
- **Use delta sync with server-side cursors and tombstones,** not full refreshes or client timestamps.
- **Prefer append-only events** to avoid conflicts; use field-level merges, domain rules or versioned last-write-wins for the rest.
- **Design the backend for reconnect storms:** accept quickly, queue, process at a steady rate, and cache shared reads.
