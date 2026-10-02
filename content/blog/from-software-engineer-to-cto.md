---
title: "From Software Engineer to CTO: What Actually Changes"
description: "Subhadeep Datta on going from software engineer to tech lead to co-founder and CTO: the skills that stop mattering, the ones that start, and advice."
date: "2026-10-02"
author: "Subhadeep Datta"
category: "Leadership"
tags: ["Leadership", "Career", "CTO", "Engineering Management", "Startups"]
keywords: "software engineer to CTO, how to become a CTO, tech lead to CTO, startup CTO responsibilities, engineering leadership lessons, first time CTO advice, Subhadeep Datta CTO"
featured: true
faq:
  - q: "How do you become a CTO?"
    a: "Most CTOs get there by progressively taking ownership beyond their own code: leading a project, then a team, then the technical direction of a product, often while staying close to the architecture. Founding or joining a startup early is the fastest route; growing into the role at a larger company takes longer but builds depth in management."
  - q: "Does a CTO still write code?"
    a: "At an early-stage startup, usually yes, often a lot. As the company grows, the CTO's leverage shifts to architecture, hiring, technical strategy and unblocking teams, and hands-on coding becomes selective: prototypes, critical reviews and occasional deep dives."
  - q: "What is the difference between a tech lead and a CTO?"
    a: "A tech lead is accountable for how one team builds one thing well. A CTO is accountable for whether the whole company's technology strategy, architecture, people and spending support the business, including saying no to work that doesn't."
  - q: "What is a consulting or fractional CTO?"
    a: "A consulting or fractional CTO provides CTO-level leadership part time: architecture and scaling decisions, hiring and team structure, vendor and build-versus-buy choices, and technical due diligence, for companies that need senior technical judgment but not a full-time executive."
---

People sometimes ask me how I went from writing React components to being a co-founder and CTO in about five years. The honest answer is that there wasn't a single jump. Each role quietly changed what "doing a good job" meant, and the hardest part was noticing the change before it noticed me.

My path so far:

- **Software Engineer at Videtorrium** (2020–2021): shipping features for a hiring platform in React and Node.js, and mentoring a few engineers newer than me.
- **Partner Technology Manager at Noisiv Consulting** (2021–2023): owning the technology lifecycle for more than 20 clients across several countries.
- **Technology Lead at Qid** (2021–2024): leading a team of five engineers building a digital check-in platform integrated with India Stack.
- **Consulting CTO at Noisiv Consulting** (2023–present): architecture for systems handling millions of API requests a day.
- **Co-Founder & CTO at Hirerkey** (2025–present): building an AI-native Human Capital Management platform.

Here's what changed at each step, and what I'd tell an engineer who wants to make the same moves.

## As an engineer: your output is code

Early on, the job is clear. You take a well-defined problem and turn it into working, maintainable software. Being good means writing code that works, is easy to change, and doesn't wake anyone up at night.

The habits that mattered most later weren't the obvious ones:

- **Understanding why a feature existed,** not just what it should do. Engineers who ask "what problem is this solving?" get pulled into the conversations where decisions are made.
- **Owning things end to end:** writing the code, then watching it in production, reading the error logs, and fixing what broke without being asked.
- **Teaching.** Mentoring juniors forced me to explain *why* we did things a certain way. Explaining your reasoning is the core skill of every role that comes after.

## As a tech lead: your output is the team's output

Leading the engineering team at Qid was the biggest shift. Suddenly, my personal code was a small fraction of what got shipped, and the measure of my work was what **five people** produced together.

What I had to learn:

**Unblocking beats contributing.** An hour I spend clearing a blocker for two engineers is worth more than an hour of my own coding. A lead who takes the hardest tickets and disappears into them becomes the bottleneck.

**Architecture is a communication problem.** We were building for traffic spikes of five times normal load, in places with poor connectivity. The design was only as good as the team's shared understanding of it. Short written design docs, with the trade-offs spelled out, did more for quality than any amount of code review. (Some of what we learned is in [Offline-First Architecture](/blog/offline-first-architecture).)

**Saying no, with reasons.** Every stakeholder had urgent requests. Protecting the team's focus meant explaining trade-offs in business terms: "if we build this now, the verification flow slips two weeks."

**Code review is teaching at scale.** I learned to separate "this is wrong" from "I would have done it differently", and to only block on the first.

## As a manager of client technology: your output is decisions

Working across 20+ client engagements at Noisiv taught me something a single product team never would: **the same technical problem has different right answers in different businesses.** A startup that might pivot next quarter and a bank with a ten-year horizon should not have the same architecture.

That's where I learned to think in trade-offs: cost against speed, build against buy, consistency against availability, and to make decisions with incomplete information, write down why, and revisit them when the facts change.

## As a CTO: your output is the company's ability to build

The CTO role, whether as Consulting CTO at Noisiv or as co-founder at Hirerkey, is less about any particular system and more about whether the organization can keep building the right things, faster, without falling over.

### Strategy: technology in service of the business

At Hirerkey, the technical choices (Java and Node.js services, MongoDB, Kafka, and LLM and RAG features to automate HR workflows) only matter because they serve a business goal. A CTO has to be fluent in that goal: who the customers are, what they'll pay for, and what the company can afford. The best architecture for an idea that isn't proven yet is usually the one that lets you change your mind cheaply.

### Architecture: fewer, bigger decisions

I write less code than I used to, but the code-level decisions I do make have long half-lives: data models, service boundaries, the choice of message broker, what's synchronous and what's asynchronous. Those decisions are expensive to reverse, so they deserve the most care. Most others don't, and a good CTO lets the team make them.

### People: hiring is the job

The single highest-leverage thing a CTO does is decide who joins the team. Every hire changes the team's culture, its speed and its standards. I spend far more time on hiring and on [running system design interviews](/blog/system-design-interview-framework) than I ever expected to.

### Saying what you don't know

As an engineer, admitting you don't know something feels risky. As a CTO, *not* admitting it is the risk. A founder-level technical leader who bluffs about a technology will eventually make the company bet on that bluff.

## What stops mattering, and what starts

| Skill | As an engineer | As a CTO |
| --- | --- | --- |
| Writing code fast | Very important | Occasionally useful |
| Depth in one stack | Very important | Useful as a foundation |
| Breadth across systems | Nice to have | Essential |
| Writing and explaining | Helpful | The main way you work |
| Understanding the business | Helpful | Non-negotiable |
| Hiring and developing people | Rarely your job | The most leveraged part of the job |
| Making decisions with incomplete information | Rare | Daily |

The skills on the left don't disappear. Credibility with engineers still comes from having been very good at the craft, and from staying hands-on enough to understand what you're asking people to do.

## Advice for engineers who want to lead

1. **Own something end to end,** in production, not just in pull requests. Ownership is the currency of trust.
2. **Write.** Design docs, postmortems, onboarding notes, blog posts. Writing is how leadership scales beyond the people in the room. It's also why I keep [this blog](/blog).
3. **Learn the business.** Ask your product and sales colleagues what customers complain about. The engineer who understands revenue gets invited to strategy discussions.
4. **Mentor before you have the title.** Leading is a skill you can practice from any seat.
5. **Get comfortable with trade-offs.** Stop looking for the right answer and start looking for the best answer for this team, this budget and this timeline.
6. **Seek breadth deliberately.** Spend time in areas outside your specialty: infrastructure if you're frontend, product if you're backend, data if you've never touched it.
7. **Take the bigger scope before you feel ready.** I didn't feel ready to lead a team at Qid or to co-found Hirerkey. Readiness mostly comes from doing the job.

## Closing thought

The path from engineer to CTO isn't a ladder where each rung adds a bit more of the same skill. Each step changes what the job *is*. The engineers who make the transition well are the ones who notice when their old definition of a good day no longer applies, and are willing to find a new one.

If you're on that path and want to compare notes, [I'm always happy to talk](/contact).
