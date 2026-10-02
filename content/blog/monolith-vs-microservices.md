---
title: "Monolith vs Microservices: How to Choose, and When to Split"
description: "Monolith vs modular monolith vs microservices: the real costs, the signals that justify splitting, drawing service boundaries and the strangler fig."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "Architecture"
tags: ["Architecture", "Microservices", "System Design", "Backend", "Distributed Systems"]
keywords: "monolith vs microservices, modular monolith, when to use microservices, microservices disadvantages, service boundaries, strangler fig pattern, microservices migration, distributed monolith"
faq:
  - q: "Should a startup use microservices?"
    a: "Usually not at the start. A well-structured monolith (ideally a modular monolith) lets a small team move fastest, deploy simply and change its domain model cheaply. Split out services later, when a specific scaling, team-autonomy or reliability problem justifies the operational cost."
  - q: "What is a modular monolith?"
    a: "A modular monolith is a single deployable application divided into modules with explicit boundaries: each module owns its data and exposes a public interface, and other modules may not reach into its internals. It gives much of the design benefit of microservices without the cost of a distributed system."
  - q: "What is a distributed monolith?"
    a: "A distributed monolith is a system split into services that are still tightly coupled: they share a database, must be deployed together, or call each other synchronously in long chains. It has the costs of microservices and the rigidity of a monolith, and is the most common failure mode of premature splitting."
  - q: "What is the strangler fig pattern?"
    a: "The strangler fig pattern migrates a monolith incrementally: put a routing layer in front of it, build new functionality (or extract one capability at a time) as a separate service, route the relevant traffic to it, and repeat until the old code can be removed. It avoids a risky big-bang rewrite."
---

Few architecture debates generate as much heat as monolith vs microservices. One side points at Netflix and Amazon; the other points at teams drowning in Kubernetes YAML to serve a few thousand users.

I've worked on both ends: monoliths that should have been split years earlier, and microservice systems that should never have been split at all. As a consulting CTO I'm often called in after the second kind, and I've deployed microservices that genuinely cut downtime by 60% because they isolated failures that used to take down everything. The answer is never "always" or "never". It's "what problem are you solving?".

## Definitions, quickly

- **Monolith:** one codebase, one deployable unit, usually one database. All features run in the same process.
- **Modular monolith:** still one deployable unit, but divided internally into modules with strict boundaries. Each module owns its own data and exposes a defined interface.
- **Microservices:** many independently deployable services, each owning its data and communicating over the network through APIs or events.

The modular monolith is the option most teams forget, and the one most of them should probably pick first.

## What microservices actually cost

Microservices don't remove complexity; they move it from the code into the network and into operations. Before choosing them, be honest about the bill:

- **Network failure everywhere.** A function call that couldn't fail becomes a remote call that can time out, fail halfway, or succeed without you hearing back. Every interaction needs timeouts, retries, idempotency and circuit breakers.
- **No more transactions across features.** Creating an order and reserving inventory used to be one database transaction. Across services, it's a saga with compensating actions, or eventual consistency the business has to accept.
- **Observability becomes mandatory.** One user request touches six services. Without distributed tracing, correlation IDs and centralized logs, debugging is guesswork.
- **Operational overhead per service:** CI/CD pipelines, deploy configuration, dashboards, alerts, on-call ownership, dependency upgrades, security patches. Multiply by the number of services.
- **Data duplication and synchronization.** Services need each other's data; you'll be replicating it through events and handling staleness.
- **Harder refactoring.** Moving a responsibility from one module to another in a monolith is a refactor. Moving it between services is a migration.

None of these are reasons to never use microservices. They're the price, and you should get something for it.

## What microservices actually buy you

- **Independent deployment.** Teams ship on their own schedule without coordinating a release train.
- **Team autonomy at scale.** When you have many teams, clear service ownership reduces coordination costs. This is the strongest argument, and it's an organizational one.
- **Independent scaling.** A CPU-heavy image-processing component can scale separately from the lightweight API.
- **Fault isolation.** A memory leak in the reporting service no longer takes down checkout.
- **Technology fit.** A Python service for ML inference next to Java and Node.js services for everything else.

## The decision signals

Here's the checklist I use with clients. Split when you see **real, current pain** in one of these, not anticipated pain:

| Signal | What it looks like | Splitting helps? |
| --- | --- | --- |
| Team contention | Many teams blocked on one deploy pipeline, constant merge conflicts | Yes, the strongest reason |
| Divergent scaling | One component needs 20× the resources of the rest | Yes, for that component |
| Fault isolation | One feature's failures repeatedly take down unrelated ones | Yes |
| Different reliability or compliance needs | Payments needs stricter controls than marketing pages | Often |
| Slow builds and tests | CI takes 45 minutes | Maybe; try modularizing and caching first |
| "It's what scalable companies do" | No specific problem | No |
| A small team (< ~10 engineers) | Everyone works on everything | Rarely |

If your team is small, your product is still finding its shape, and your problem is "we need to ship faster", the answer is almost always a monolith with good internal structure.

## Start with a modular monolith

A modular monolith gives you most of the *design* benefits of microservices at a fraction of the cost:

```text
src/
  modules/
    orders/
      api.ts          ← the only thing other modules may import
      service.ts
      repository.ts   ← owns the orders tables; nobody else queries them
    billing/
      api.ts
      ...
    identity/
      api.ts
      ...
  shared/             ← small, boring, stable utilities only
```

The rules that make it work:

1. **Each module owns its tables.** Other modules never query them directly; they call the module's API.
2. **Modules talk through public interfaces** (functions or in-process events), never by importing internals.
3. **Enforce the boundaries with tooling:** lint rules or dependency checks that fail the build when `billing` imports from `orders/repository`.
4. **Keep shared code small.** A giant `shared` folder is how modular monoliths quietly turn back into big balls of mud.

If you do this well, extracting a module into a service later is mostly mechanical: the boundary already exists, the data is already separated, and the interface already exists. You've made the expensive decision reversible.

## Drawing service boundaries

When you do split, the boundaries matter far more than the technology. Bad boundaries create a **distributed monolith**: services that share a database, must be deployed together, or call each other in long synchronous chains. You get all the costs of microservices with none of the independence.

Good boundaries follow **business capabilities**, not technical layers:

- ✅ `orders`, `billing`, `identity`, `notifications`, `search`
- ❌ `database-service`, `validation-service`, `api-service`

Tests for a good boundary:

- **Can it be deployed alone** without coordinating with other teams?
- **Does it own its data,** or does it need another service's tables?
- **Is it changed for one reason?** If every new feature touches services A, B and C together, they're probably one service.
- **Can it do its main job if its neighbors are down?** Prefer asynchronous events over synchronous calls for anything that doesn't need an immediate answer.

## Migrating: the strangler fig

If you've decided to move from a monolith to services, don't rewrite. Big-bang rewrites famously run late, miss behaviors nobody documented, and freeze feature work for months.

Use the **strangler fig pattern** instead, named after a vine that gradually grows around a tree:

1. **Put a routing layer** (API gateway or reverse proxy) in front of the monolith.
2. **Pick one capability** with a clear boundary and real pain: frequently changed, needs independent scaling, or has a distinct owner.
3. **Build it as a service** with its own data store. Sync data from the monolith with change data capture or events during the transition.
4. **Route that capability's traffic** to the new service, behind a feature flag so you can roll back instantly.
5. **Delete the old code path** from the monolith once you're confident.
6. **Repeat**, and stop when the remaining monolith no longer causes pain. There's no prize for extracting everything.

## Communication patterns that keep services independent

- **Events for facts, calls for questions.** "Order placed" is an event other services react to (via Kafka or another broker; see [Kafka vs RabbitMQ vs Redis Streams](/blog/kafka-vs-rabbitmq-vs-redis-streams)). "What's this customer's credit limit?" is a synchronous call, and it should be rare.
- **Avoid long synchronous chains.** If A calls B, which calls C, which calls D, your availability is the product of all four, and your latency is the sum.
- **Timeouts and circuit breakers on every remote call,** so one slow service doesn't exhaust the threads and connections of everything upstream.
- **Make consumers idempotent,** because messages will be delivered more than once ([here's how](/blog/idempotency-keys-api-design)).
- **Use the outbox pattern** to publish events reliably: write the event to an outbox table in the same transaction as the business change, and relay it to the broker asynchronously.

## A pragmatic default

For most teams, the path looks like this:

1. **Start with a modular monolith.** One deployable, strong internal boundaries, one database with clear table ownership.
2. **Extract services only for specific, current pain:** a component with very different scaling needs, a domain owned by a separate team, or a critical path that needs isolation.
3. **Invest in the platform before the second or third service:** CI/CD templates, observability, service templates, secrets management.
4. **Keep the number of services proportional to the number of teams.** A rough heuristic: if you have more services than engineers, something has gone wrong.

## Key takeaways

- **Microservices solve organizational and scaling problems** at the cost of distributed-systems complexity. Make sure you have the problem before paying the cost.
- **A modular monolith** captures most of the design benefits and keeps future extraction cheap.
- **Split on business capabilities with owned data,** or you'll build a distributed monolith.
- **Migrate incrementally with the strangler fig pattern,** never with a big-bang rewrite.
- **Prefer events over synchronous chains,** and design every consumer to be idempotent.
