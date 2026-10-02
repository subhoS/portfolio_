# Launch & Distribution Kit

Everything needed to get the new site indexed, rank for "Subhadeep Datta", and push the articles to social.
Copy, paste, post. Replace `https://subhadeep-datta.dev` if the production domain is different.

---

## 1. Day-one setup (30 minutes, biggest SEO impact)

These steps are what make Google connect your name to this site. Do them before posting anything.

1. **Set `SITE_URL`** in Vercel → Project → Settings → Environment Variables to the real production URL
   (e.g. `https://subhadeep-datta.dev`). Every canonical URL, sitemap entry and OG image depends on it.
2. **Google Search Console** → add the domain → verify (DNS, or set `GOOGLE_VERIFICATION_CODE` in Vercel) →
   Sitemaps → submit `/sitemap.xml` → URL Inspection → "Request indexing" for `/`, `/about` and `/blog`.
3. **Bing Webmaster Tools** → import from Search Console (one click) → submit the sitemap.
   Bing also powers ChatGPT search, Copilot and DuckDuckGo results.
4. After each deploy, run `npm run indexnow` to notify Bing, Yandex and other IndexNow engines instantly.
5. **Link back to the site from every profile.** This is the strongest signal that they're all the same person:
   - **LinkedIn:** Contact info → Website → `https://subhadeep-datta.dev` (type: Personal). Also add it to the Featured section.
   - **GitHub:** Profile → Website → the site URL. Create a `subhoS/subhoS` profile README linking to the site and latest articles.
   - **X:** Bio link → the site URL.
   - Any other profiles (Hirerkey team page, Noisiv Consulting team page, conference pages, Medium, dev.to): same link.
6. **Use the same name and headline everywhere:** "Subhadeep Datta — Full Stack Engineer & CTO". Consistency is how search engines merge profiles into one entity.
7. Ask Hirerkey and Noisiv Consulting to link to `https://subhadeep-datta.dev` from their team/about pages. Links from companies you're associated with are high-trust entity signals.

---

## 2. Launch posts

### LinkedIn: site launch

> I rebuilt my website from scratch, and wrote 12 new deep-dive articles to go with it.
>
> Six years of building backends (Hirerkey, Noisiv Consulting, Qid) taught me a lot that never made it out of Slack threads and postmortems. So I wrote it down:
>
> → Redis caching strategies that survive production
> → Kafka vs RabbitMQ vs Redis Streams: how to actually choose
> → Idempotency keys: making API retries safe
> → Rate limiting algorithms, with Redis Lua implementations
> → PostgreSQL indexing for backend engineers
> → Model Context Protocol (MCP): build your first server
> → Shipping LLM features to production
> → Offline-first architecture for bad networks
> → Monolith vs microservices: when to split
> → How I approach system design interviews as a CTO
> → From software engineer to CTO: what actually changes
> → What a fractional CTO actually does
>
> Every article is written from systems I've built or debugged. No fluff.
>
> 👉 https://subhadeep-datta.dev/blog
>
> Which one should I go deeper on next?
>
> #SoftwareEngineering #SystemDesign #BackendDevelopment #CTO #AI

### X: launch thread

1/ I rebuilt my site and wrote 12 deep dives on the stuff I've learned building backends that handle millions of requests a day.

Here's the list 🧵 https://subhadeep-datta.dev/blog

2/ Redis caching that survives production: cache-aside, TTL jitter, stampede protection, hot keys.
https://subhadeep-datta.dev/blog/redis-caching-strategies

3/ Kafka vs RabbitMQ vs Redis Streams. The real question: are you moving tasks or recording events?
https://subhadeep-datta.dev/blog/kafka-vs-rabbitmq-vs-redis-streams

4/ Idempotency keys: why every POST that moves money needs one, and the crash gap most implementations miss.
https://subhadeep-datta.dev/blog/idempotency-keys-api-design

5/ Rate limiting: token bucket vs sliding window, plus the race condition that breaks naive Redis limiters.
https://subhadeep-datta.dev/blog/rate-limiting-algorithms-explained

6/ MCP explained, with a TypeScript server you can run in 10 minutes.
https://subhadeep-datta.dev/blog/model-context-protocol-mcp-explained

7/ The rest: PostgreSQL indexing, LLMs in production, offline-first, monolith vs microservices, system design interviews, engineer → CTO, fractional CTOs.

All here: https://subhadeep-datta.dev/blog

---

## 3. One post per article (schedule: 2–3 per week)

Posting all 12 at once wastes them. Space them out so each gets its own reach.
Suggested order: strongest search topics and widest audiences first.

| Week | Mon | Thu |
| --- | --- | --- |
| 1 | Site launch (above) | Redis caching |
| 2 | Kafka vs RabbitMQ vs Redis Streams | System design interviews |
| 3 | Idempotency keys | MCP explained |
| 4 | Engineer → CTO | Rate limiting |
| 5 | PostgreSQL indexing | LLMs in production |
| 6 | Offline-first | Monolith vs microservices |
| 7 | Fractional CTO | SEO-first portfolio |

**Format tips that work on LinkedIn:** hook in the first line, short lines, one concrete number or lesson, link at the end (or in the first comment), one question to invite comments. Reply to every comment within the first hour.

---

### Redis caching strategies
**LinkedIn**
> Adding a Redis cache at Qid cut our database load by 40%.
>
> It's also the fix most likely to cause an incident a month later.
>
> What tutorials skip:
> • Always set a TTL, even when you invalidate explicitly. Invalidation code has bugs; TTLs heal them.
> • Add jitter. 50,000 keys warmed at deploy will all expire in the same second.
> • Protect hot keys from stampedes: single-flight, a short lock, or stale-while-revalidate.
> • Design for Redis being down. If you can't survive a cold cache, it's not a cache, it's a dependency.
>
> Full guide with Node.js code 👇
> https://subhadeep-datta.dev/blog/redis-caching-strategies

**X**
> One popular cache key expiring at the wrong moment can push a primary database to 100% CPU.
>
> Cache stampedes, TTL jitter, hot keys and the other things Redis tutorials skip:
> https://subhadeep-datta.dev/blog/redis-caching-strategies

### Kafka vs RabbitMQ vs Redis Streams
**LinkedIn**
> "Which message queue should we use?" has one question hiding inside it:
>
> Are you moving tasks, or recording events?
>
> Tasks → RabbitMQ (or honestly, a Postgres jobs table).
> Events → Kafka.
> Already running Redis and the volume fits in memory → Redis Streams.
>
> And whatever the docs say about exactly-once: make every consumer idempotent.
>
> Full comparison (ordering, replay, failure handling, ops cost):
> https://subhadeep-datta.dev/blog/kafka-vs-rabbitmq-vs-redis-streams

**X**
> Kafka vs RabbitMQ vs Redis Streams, in one line:
> tasks → RabbitMQ, events → Kafka, already-have-Redis → Streams.
>
> The long version, from running all three in production:
> https://subhadeep-datta.dev/blog/kafka-vs-rabbitmq-vs-redis-streams

### System design interview framework
**LinkedIn**
> I run system design interviews as a CTO. The most common reason strong engineers fail isn't knowledge.
>
> It's structure.
>
> They jump straight to boxes, spend 20 minutes on load balancers, and run out of time before showing what they know.
>
> The framework I wish every candidate used:
> 1. Clarify requirements (5 min)
> 2. Estimate scale (5 min)
> 3. API + data model (5 min)
> 4. High-level design (10 min)
> 5. Deep dives (15 min)
> 6. Failure modes & trade-offs (5 min)
>
> Worked example (URL shortener) and what interviewers actually score:
> https://subhadeep-datta.dev/blog/system-design-interview-framework

**X**
> I interview engineers as a CTO. The #1 system design mistake isn't missing knowledge, it's missing structure.
>
> The 6-step framework I wish every candidate used:
> https://subhadeep-datta.dev/blog/system-design-interview-framework

### Idempotency keys
**LinkedIn**
> The payment succeeded. The network dropped before the response arrived. The user tapped "Pay" again.
>
> Did you just charge them twice?
>
> Idempotency keys make retries safe: execute once, replay the stored response for every retry. The unique constraint does the heavy lifting; the hard part is what happens when the server crashes mid-request.
>
> Design + PostgreSQL/Node.js implementation:
> https://subhadeep-datta.dev/blog/idempotency-keys-api-design

**X**
> Retries are inevitable. Double charges shouldn't be.
>
> How idempotency keys work, with a Postgres + Node.js implementation and the crash gap most versions miss:
> https://subhadeep-datta.dev/blog/idempotency-keys-api-design

### MCP explained
**LinkedIn**
> Ten AI tools × ten internal systems used to mean up to a hundred custom integrations.
>
> The Model Context Protocol (MCP) turns that into one server per system, usable by any MCP-compatible AI app.
>
> I wrote a practical guide: hosts, clients and servers, tools vs resources vs prompts, a TypeScript server you can run today, and the security rules I insist on before connecting models to production systems.
>
> https://subhadeep-datta.dev/blog/model-context-protocol-mcp-explained

**X**
> MCP explained + build your first MCP server in TypeScript.
>
> Bonus: the security rules (least privilege, confirmation, prompt injection) nobody should skip.
> https://subhadeep-datta.dev/blog/model-context-protocol-mcp-explained

### From software engineer to CTO
**LinkedIn**
> Engineer → Tech Lead → Consulting CTO → Co-Founder & CTO, in about five years.
>
> There was never one big jump. Each role quietly changed what "a good day" meant:
>
> Engineer: your output is code.
> Tech lead: your output is the team's output.
> CTO: your output is the company's ability to build.
>
> What stopped mattering, what started mattering, and my advice for engineers who want to lead:
> https://subhadeep-datta.dev/blog/from-software-engineer-to-cto

**X**
> Engineer: your output is code.
> Tech lead: your output is the team's output.
> CTO: your output is the company's ability to build.
>
> What actually changes on the way up:
> https://subhadeep-datta.dev/blog/from-software-engineer-to-cto

### Rate limiting algorithms
**LinkedIn**
> A naive distributed rate limiter lets through far more than its limit under load.
>
> The bug: GET the count, check it in app code, SET the new count. Two servers read 99, both allow, both write 100.
>
> Fix: make it atomic with a Redis Lua script.
>
> Token bucket vs sliding window vs leaky bucket, with production-ready implementations:
> https://subhadeep-datta.dev/blog/rate-limiting-algorithms-explained

**X**
> Your Redis rate limiter probably has a race condition.
>
> Token bucket, sliding window, leaky bucket, and the atomic Lua versions:
> https://subhadeep-datta.dev/blog/rate-limiting-algorithms-explained

### PostgreSQL indexing
**LinkedIn**
> In the guide's worked example, one composite index takes a query from 186 ms to 0.1 ms.
>
> The rule that makes composite indexes work: equality columns first, then the range or sort column.
>
> Plus partial indexes, covering indexes with INCLUDE, GIN for jsonb, BRIN for huge tables, and how to find the indexes you should delete:
> https://subhadeep-datta.dev/blog/postgresql-indexing-guide

**X**
> Composite index column order, in one rule: equality first, then range/sort.
>
> The practical Postgres indexing guide:
> https://subhadeep-datta.dev/blog/postgresql-indexing-guide

### Shipping LLM features to production
**LinkedIn**
> An LLM demo takes an afternoon. An LLM feature people can trust takes engineering.
>
> The checklist I use at Hirerkey: evals in CI, structured outputs, grounding with verifiable citations, prompt-injection defenses, streaming, cost per feature, fallbacks, and a kill switch.
>
> https://subhadeep-datta.dev/blog/shipping-llm-features-to-production

**X**
> The model is the easy part to change.
>
> Evals, guardrails, latency and cost: the production checklist for LLM features:
> https://subhadeep-datta.dev/blog/shipping-llm-features-to-production

### Offline-first architecture
**LinkedIn**
> At Qid we processed 100,000+ verifications in six months, often where the network barely worked.
>
> What made it possible: offline-first. Write locally, sync in the background, make every sync idempotent, and design the backend for reconnect storms.
>
> https://subhadeep-datta.dev/blog/offline-first-architecture

**X**
> Treat the network as an optimization, not a requirement.
>
> Outboxes, idempotent sync, conflict resolution and backends built for reconnect storms:
> https://subhadeep-datta.dev/blog/offline-first-architecture

### Monolith vs microservices
**LinkedIn**
> Microservices solve organizational problems at the cost of distributed-systems problems.
>
> Make sure you have the first before paying for the second.
>
> Start with a modular monolith. Split for specific, current pain. Migrate with the strangler fig, never a rewrite.
>
> https://subhadeep-datta.dev/blog/monolith-vs-microservices

**X**
> If you have more services than engineers, something has gone wrong.
>
> Monolith vs modular monolith vs microservices, and when to split:
> https://subhadeep-datta.dev/blog/monolith-vs-microservices

### What a fractional CTO does
**LinkedIn**
> Many startups need senior technical judgment before they need a full-time CTO.
>
> What a fractional CTO actually does, the signs you need one, how engagements work, and how to choose the right person:
> https://subhadeep-datta.dev/blog/what-does-a-fractional-cto-do
>
> (If that's you, my DMs are open.)

**X**
> Non-technical founder about to spend serious money on a product? Agency building it and you can't tell if it's good?
>
> That's what fractional CTOs are for:
> https://subhadeep-datta.dev/blog/what-does-a-fractional-cto-do

### SEO-first developer portfolio
**LinkedIn**
> Search my name and this site should come up first. Here's exactly how I built it to make that happen: structured data, consistent profiles, generated OG images, and a content strategy that compounds.
>
> https://subhadeep-datta.dev/blog/building-an-seo-first-developer-portfolio

**X**
> How I built my portfolio to rank for my own name (Next.js, JSON-LD, OG images, sitemaps):
> https://subhadeep-datta.dev/blog/building-an-seo-first-developer-portfolio

---

## 4. Cross-posting (reach + backlinks)

Republish each article 3–7 days after it goes live on your site, **always with a canonical URL pointing back** so Google credits your site, not the copy:

- **dev.to:** front matter `canonical_url: https://subhadeep-datta.dev/blog/<slug>`
- **Hashnode:** Article settings → "Are you republishing?" → original URL
- **Medium:** Import a story (medium.com/p/import) with your URL; it sets the canonical automatically
- **LinkedIn articles:** paste the intro + key takeaways and link to the full post (LinkedIn has no canonical)

Communities where these topics do well (read each community's self-promotion rules first, and engage, don't just drop links):
- Hacker News (Show HN only for things people can try; otherwise regular submissions)
- r/programming, r/node, r/PostgreSQL, r/ExperiencedDevs, r/softwarearchitecture, r/LocalLLaMA (for MCP/LLM posts)
- daily.dev (submit the RSS feed: https://subhadeep-datta.dev/rss.xml)
- Newsletters that accept submissions: Node Weekly, Postgres Weekly, Bytes, TLDR

---

## 5. Keep it compounding

- **Publish one new article every 2 weeks.** Consistency beats bursts for search.
- **Refresh old articles** when you learn something new and bump `updated:` in the front matter.
- **Check Search Console monthly:** queries where you rank 8–20 are the cheapest wins. Expand those articles.
- **Run `npm run audit:seo`** (against `npm start`) before deploying; it checks every page's title, description, canonical, H1, JSON-LD and internal links.
