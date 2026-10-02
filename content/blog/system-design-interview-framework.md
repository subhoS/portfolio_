---
title: "How to Approach a System Design Interview: A CTO's Framework"
description: "A step-by-step system design interview framework from a CTO who runs them: requirements, estimation, API and data design, deep dives and trade-offs."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "System Design"
tags: ["System Design", "Career", "Interviews", "Distributed Systems", "Architecture"]
keywords: "system design interview, how to approach system design interview, system design interview framework, system design interview tips, back of the envelope estimation, design a URL shortener, senior engineer interview"
featured: true
faq:
  - q: "How should I structure a 45-minute system design interview?"
    a: "Roughly: 5 minutes clarifying requirements, 5 minutes estimating scale, 5 minutes on the API and data model, 10 minutes on a high-level design, 15 minutes deep-diving into the hardest parts, and 5 minutes on bottlenecks, failure modes and trade-offs."
  - q: "What do interviewers look for in a system design interview?"
    a: "They look for structured thinking, asking the right clarifying questions, sound reasoning about scale, clear trade-offs instead of buzzwords, depth in at least one area, awareness of failure modes, and the ability to adapt when requirements change."
  - q: "How do I prepare for system design interviews?"
    a: "Learn the core building blocks (load balancers, caches, queues, databases, replication, sharding, CDNs), practice back-of-the-envelope estimation, work through common problems out loud with a timer, and study how real systems you have used or built handle scale and failure."
  - q: "Is it okay to not know the answer in a system design interview?"
    a: "Yes. There is no single correct answer. Saying what you would need to measure, offering two options with their trade-offs, and asking which constraint matters more is a strong signal. Bluffing about a technology you don't understand is a weak one."
---

I've been on both sides of the system design interview. These days, as a CTO hiring engineers at Hirerkey and advising client teams at Noisiv Consulting, I'm usually the one asking the questions. The most common reason I see strong engineers do badly isn't a lack of knowledge. It's a lack of **structure**: they jump straight to drawing boxes, spend twenty minutes on the wrong problem, and run out of time before showing what they actually know.

This is the framework I wish every candidate used. It works for any prompt: "design a URL shortener", "design a chat app", "design a ride-hailing backend". And it's close to how real design reviews should work, too.

## What the interview is actually measuring

There's no single correct design for "build Twitter". The interviewer is scoring **how you think**:

- Do you **clarify** before you build?
- Can you **reason about scale** with numbers rather than adjectives?
- Do you make **explicit trade-offs** ("I'll choose X because Y, at the cost of Z")?
- Can you go **deep** on at least one hard part?
- Do you anticipate **failure**?
- Do you **communicate** so the interviewer can follow, and adapt when they push back?

Keep those six things in mind and every step below will make sense.

## The six-step framework

Here's how I'd spend a 45-minute session:

| Step | Time | Output |
| --- | --- | --- |
| 1. Clarify requirements | ~5 min | Functional + non-functional requirements, explicit scope |
| 2. Estimate scale | ~5 min | Requests/sec, storage, bandwidth, read/write ratio |
| 3. API and data model | ~5 min | Core endpoints, entities, access patterns |
| 4. High-level design | ~10 min | The end-to-end request path |
| 5. Deep dives | ~15 min | The 1–2 hardest components, in detail |
| 6. Wrap up | ~5 min | Bottlenecks, failure modes, what you'd do next |

I'll walk through each using a classic prompt: **design a URL shortener** like bit.ly.

## Step 1: Clarify requirements

Never start designing immediately. Ask questions that change the design.

**Functional requirements**: what the system does:

- Users submit a long URL and get a short one. Can they choose a custom alias?
- Short links redirect to the long URL. Do links expire?
- Do we need click analytics? Real time, or is a daily report fine?
- Do users have accounts?

**Non-functional requirements**: how well it must do it:

- How many new links per day? How many redirects?
- What redirect latency is acceptable?
- Availability target: is a broken redirect worse than a slow one?
- Must a link work the instant it's created everywhere in the world?

Then **state the scope out loud**: "I'll focus on creating links and redirecting, with basic click counts. Custom aliases are in scope; user accounts and link editing are out of scope for now." This shows judgment and protects your time.

## Step 2: Estimate scale

You don't need precise numbers, just the right order of magnitude, because that's what decides between "one Postgres instance" and "a sharded cluster". Say your assumptions out loud and round aggressively.

Assume **100 million new links per month** and a **100:1 read-to-write ratio**:

```text
Writes:  100M / month ÷ (30 × 86,400 s) ≈ 40 links/sec       (peak ×3 ≈ 120/sec)
Reads:   40 × 100 ≈ 4,000 redirects/sec                      (peak ≈ 12,000/sec)

Storage: ~500 bytes per link (URL + metadata)
         100M × 12 months × 5 years × 500 B ≈ 3 TB over 5 years

Key space: base62 with 7 characters = 62^7 ≈ 3.5 trillion codes, plenty
```

Now you've learned things that shape the design: it's **extremely read-heavy** (so caching matters), writes are modest (so a single primary database is fine for writes), and the data is small enough that storage isn't the challenge. Latency and availability of redirects are.

A few numbers worth memorizing for these estimates: a day has ~86,400 seconds (call it 100,000), a month ~2.6 million seconds, and a single well-tuned relational database handles thousands of simple queries per second, while an in-memory cache handles tens of thousands or more per node.

## Step 3: API and data model

Define the contract before the components:

```http
POST /api/links
{ "url": "https://example.com/very/long/path", "alias": "launch" }   // alias optional
→ 201 { "code": "launch", "shortUrl": "https://sho.rt/launch" }

GET /{code}
→ 301/302 Location: https://example.com/very/long/path
```

Call out decisions as you go: **302 (temporary)** redirects mean every click reaches our servers, so we can count it; **301 (permanent)** lets browsers cache the redirect, which is faster but loses analytics. Given the analytics requirement, I'd choose 302.

The data model is simple:

```text
links:  code (PK), long_url, created_at, expires_at, owner_id
clicks: code, ts, country, referrer   → append-only, aggregated
```

Name the **access pattern** that matters most: "look up `long_url` by `code`". It's a single key lookup, perfectly suited to a key-value access path and a cache.

## Step 4: High-level design

Now draw the request flow end to end:

```text
            ┌─────────┐
Client ───▶ │   CDN   │ (optional edge cache for hot links)
            └────┬────┘
                 ▼
          ┌──────────────┐
          │ Load balancer │
          └──────┬───────┘
                 ▼
        ┌──────────────────┐     miss     ┌────────────┐
        │ Stateless API ×N │ ───────────▶ │  Database  │ (primary + read replicas)
        └──┬───────────┬───┘ ◀─────────── └────────────┘
           │           │
     ┌─────▼────┐  ┌───▼─────────────┐
     │  Redis   │  │ Click events →  │──▶ aggregation job ──▶ analytics store
     │  cache   │  │ queue (Kafka)   │
     └──────────┘  └─────────────────┘
```

Walk through both paths:

- **Create:** API validates the URL, generates a code, writes to the database, returns the short URL.
- **Redirect:** API checks Redis for the code; on a miss, reads a replica and populates the cache; returns a 302; publishes a click event to a queue **asynchronously**, so analytics never slows down the redirect.

Keep this stage simple. The interviewer wants to see a working system before the clever parts.

## Step 5: Deep dives

This is where senior candidates separate themselves. Pick the one or two hardest problems, or ask the interviewer which they'd like to explore, and go deep. For a URL shortener, the interesting ones are:

### Generating unique short codes

Options, with trade-offs:

1. **Hash the URL** (e.g. first 7 characters of a base62-encoded hash). Deterministic, but collisions need handling, and the same URL from two users yields the same code, which may or may not be desired.
2. **Random codes** with a uniqueness check on insert. Simple; collision probability is tiny at our scale with 7+ characters, and a unique constraint plus a retry handles it.
3. **A counter encoded in base62.** Guaranteed unique and compact, but a single counter is a bottleneck and codes are guessable. Fix both by giving each API server a **range of IDs** (allocated in blocks of, say, 10,000 from a coordination service or a database sequence), and optionally shuffling the ID bits before encoding.

I'd pick option 3 with range allocation for scale, or option 2 for simplicity, and I'd say *why*.

### Making redirects fast and highly available

- Cache hot codes in Redis with a long TTL. Links are effectively immutable, which makes caching easy.
- With a **100:1 read ratio and a skewed popularity distribution**, a small cache achieves a very high hit rate.
- Serve the most popular links from the **CDN edge** for global latency.
- Reads go to **replicas**; if the primary fails, redirects keep working while creation degrades.

Mention the failure mode: a viral link expiring from the cache can cause a stampede. Protect it with request coalescing. (I've covered the details in [Redis Caching Strategies That Survive Production](/blog/redis-caching-strategies).)

### Scaling storage

At 3 TB over five years, a single well-provisioned Postgres instance with replicas is fine for a long time. Say so. If we needed to scale writes further, we'd **shard by code**, since every lookup includes it. Knowing when *not* to shard is a senior signal.

### Analytics at scale

Clicks go to a durable log (Kafka) and are aggregated in batches into counts per link per day. Never do `UPDATE links SET clicks = clicks + 1` on the redirect path: it turns every read into a write on the hottest rows. (For choosing between queues, see [Kafka vs RabbitMQ vs Redis Streams](/blog/kafka-vs-rabbitmq-vs-redis-streams).)

## Step 6: Wrap up with failure modes and trade-offs

Spend the last minutes like a reviewer looking for weaknesses:

- **Single points of failure:** what happens if Redis, the database primary, or a whole region goes down?
- **Abuse:** rate limit link creation, and scan for malicious URLs (phishing is a real problem for shorteners).
- **Bottlenecks at 10× scale:** which component breaks first, and what would you change?
- **What you'd monitor:** redirect p99 latency, cache hit ratio, error rate, queue lag.

End with a one-sentence summary of your design and its key trade-off. It leaves a strong final impression.

## Signals that impress interviewers

- **Numbers over adjectives.** "About 4,000 reads per second at peak" instead of "lots of traffic".
- **Trade-offs stated explicitly.** "A 301 is faster but costs us analytics; given the requirements, 302."
- **Reaching for simple first.** One database until the numbers say otherwise. Over-engineering is a red flag.
- **Owning a deep dive.** Real detail about IDs, caching, consistency or failure handling.
- **Thinking about operations:** monitoring, deploys, abuse, cost.
- **Collaboration.** Checking in ("Does this level of detail work, or should I go deeper on storage?") and adjusting gracefully when challenged.

## Common mistakes

- **Designing before clarifying.** Building the wrong system very well is still building the wrong system.
- **Buzzword architecture.** Kubernetes, microservices, Kafka and three databases for a problem that fits on two servers.
- **Going silent.** The interviewer can't score thinking they can't hear.
- **Spending all the time on the easy parts.** Load balancers and stateless API servers deserve thirty seconds, not ten minutes.
- **Ignoring failure.** Every component fails eventually. Say what happens when it does.
- **Defending a choice to the death.** When an interviewer adds a constraint, they want to see you adapt, not argue.

## How to practice

1. **Learn the building blocks** until you can explain each in two minutes: load balancers, caches, CDNs, queues and logs, SQL vs NoSQL, replication, sharding, consistent hashing, rate limiting.
2. **Practice estimation** until it feels routine.
3. **Do mock interviews out loud, with a timer.** Talking while designing is a separate skill from designing.
4. **Study systems you've worked on.** "At Qid we had to handle 5× traffic spikes on unreliable networks, so we..." is far more convincing than anything memorized, and it's what makes your answers different from everyone else's.

System design interviews reward exactly what good engineering rewards: understand the problem, size it honestly, build the simplest thing that works, and be clear about what it would take to make it better.
