---
title: "Dify Pricing Teardown"
description: "Dify has 139k GitHub stars and a modified Apache 2.0 license that quietly bans multi-tenant use. Here's how the cloud pricing actually works — and why the licensing is the real story."
publishedAt: "2026-04-28"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "AI agents"]
featured: false
draft: false
coverImage: "/images/blog/dify-pricing-cover.jpeg"
tldr: |
  Dify is the most-starred open source AI agent platform on GitHub — 139k stars, modified Apache 2.0 license, cloud from $0 to $159/month plus an Enterprise tier. The headline is "Apache 2.0," but a multi-tenant restriction makes it functionally a Sustainable Use license for anyone trying to resell it.

  - Sandbox is a 200-credit lifetime demo, not a real free tier.
  - Pro at $59/month (5k credits, 3 seats) is the right starting point for solo devs and 2–3 person teams.
  - Team at $159/month unlocks 50 seats, unlimited triggers, and the Langfuse/Langsmith integration — the standard play for growing AI-native startups.
  - Message credits meter underlying model calls, not user messages — budget 3–5x what you'd naively expect.
  - Self-hosting Community Edition is fine for internal use; embedding Dify in a SaaS you sell requires a commercial license from LangGenius.
faq:
  - question: "Is Dify open source?"
    answer: "Yes, but under a modified Apache 2.0 license. The modification adds two clauses: no multi-tenant use without written permission, and no removing the Dify logo from the console or apps."
  - question: "What's the cheapest paid Dify plan?"
    answer: "Pro at $59/month ($590/year with 17% off) — 5,000 message credits/month, 1 workspace, 3 team members, 50 apps, 500 knowledge documents, and 5GB knowledge storage."
  - question: "Can I use the self-hosted Community Edition to build a SaaS on top of Dify?"
    answer: "No. The modified Apache 2.0 license bans operating Dify in a multi-tenant environment without written permission from LangGenius. Internal self-hosting at one company is fine; reselling to external customers requires a commercial Enterprise license."
  - question: "What is a Dify message credit?"
    answer: "Roughly one LLM completion — a chatbot reply, an agent step, or a workflow execution that calls a model. A single multi-step agent conversation can burn 5–15 credits, so 5,000 Pro credits go faster than they look."
  - question: "When should I upgrade from Pro to Team?"
    answer: "When you hit the 3-seat cap, the 20k trigger cap, or need the Langsmith/Langfuse integration. Team at $159/month is a 2.7x price jump for 2x credits, but the seat and trigger limits are usually what force the upgrade, not the credits."
pricingTable:
  license: "Modified Apache 2.0"
  stars: "139k"
  freeTier: "200 credits (lifetime)"
  cheapestPaid: "$59/mo (Pro)"
  verdict: "Pro for solo, Team for startups, Enterprise to resell"
seo:
  metaTitle: "Dify Pricing Teardown — Modified Apache 2.0"
  metaDescription: "Dify is a 139k-star agentic platform. Free Sandbox, $59 Pro, $159 Team — and a modified Apache 2.0 license with anti-SaaS clauses."
---

Hey, it's Vlad, founder of Beton.

Dify is the most-starred AI agent platform on GitHub. 139k stars, growing fast, and basically every team building an LLM-powered product has at least clicked through their docs. They sit somewhere between a no-code workflow builder and a full agentic backend — RAG pipelines, prompt management, tool calls, MCP integrations, chat UIs, the whole stack in a single Docker compose.

What's interesting from a pricing standpoint isn't the cloud tiers. It's the license. Dify ships under "modified Apache 2.0" — which sounds friendly, until you read the modification.

*This post is a part of series on commercial open source software pricing.*

## What is Dify

Dify is an open source platform for building production-ready AI applications. You drag nodes together to wire up agents, connect knowledge bases, plug in models, expose the result as a chatbot or an API, and ship.

The pitch is "Vercel for AI agents" — a single platform that handles the boring parts (model routing, RAG pipelines, observability, multi-LLM support, deployment) so you can focus on the prompts and tools. It supports OpenAI, Anthropic, Llama, Azure OpenAI, Hugging Face, Replicate, plus local models via Ollama.

- Website: [dify.ai](https://dify.ai)
- Pricing: [dify.ai/pricing](https://dify.ai/pricing)
- GitHub: [github.com/langgenius/dify](https://github.com/langgenius/dify) — **139,400+ stars**, 21,800+ forks
- License: modified Apache 2.0 (the modification matters — see below)
- Backed by: not officially disclosed, but it's a LangGenius Inc. product, Chinese-origin, with significant enterprise traction in APAC

For context: 139k stars puts Dify well ahead of n8n (180k but a much older project), Langfuse (~24k), and Flowise (~30k). It's the de-facto leader in the "open source AI agent platform" category by raw popularity.

## The licensing play

This is where Dify gets genuinely interesting — and where most readers stop reading the license.

The repo says **"Apache 2.0"** at the top, and most engineers will see that and assume permissive paradise. It's not. It's Apache 2.0 with two extra clauses bolted on, and one of them is the entire game.

**Clause 1 — no multi-tenant use without permission:**

> "Unless explicitly authorized by Dify in writing, you may not use the Dify source code to operate a multi-tenant environment. Tenant Definition: Within the context of Dify, one tenant corresponds to one workspace."

In plain English: you can self-host Dify for your own company. You **cannot** stand up a Dify instance and let multiple paying customers share it as a service. If you wanted to wrap Dify in a SaaS skin and resell agentic workflows to your customers — the business that Dify itself is in — you need a commercial license from LangGenius.

This is functionally a "Sustainable Use" clause stapled onto Apache 2.0. Same intent as Elastic's SSPL or Sentry's BSL: the upstream vendor reserves the right to be the only one making money from operating the software at scale.

**Clause 2 — you can't remove the Dify logo:**

> "You may not remove or modify the LOGO or copyright information in the Dify console or applications."

If you self-host and want to white-label the UI for your team, you're technically violating the license. For internal use this is mostly nuisance-level. For anyone embedding Dify in a product, this is a deal-breaker without a commercial agreement.

**What this actually means for the reader:**

- **Self-hosting for internal use at one company:** totally fine. Spin up Docker, build agents for your team, no payment required. Unlimited workspaces effectively, because the multi-tenant clause only triggers when you serve external customers.
- **Building a product on top of Dify for your customers:** you need a commercial license. Not optional. Same situation as building a managed Sentry service or a managed Elastic.
- **Forking Dify into your own competing platform:** technically allowed under Apache 2.0 base, but the multi-tenant clause kicks in the moment you operate it. Practically: don't.

This isn't bad faith. It's the standard COSS playbook — give the product away to maximize bottom-up adoption, monetize the SaaS layer, prevent AWS-style strip-mining. But calling it "Apache 2.0" is borderline misleading. It's Apache 2.0 in the same way the Sustainable Use License is "MIT-flavored." The name on the tin doesn't tell you the rules.

## Pricing structure

Dify Cloud is priced per workspace per month. The billable unit is **message credits**, which roughly correspond to one round-trip LLM call.

**Cloud plans:**

- **Sandbox (free)** — 200 message credits total (not per month — total to try the product), 1 workspace, 1 user, 5 apps, 50 knowledge documents, 50MB knowledge storage, 30-day log history, 5,000 API calls/month. No credit card required.
- **Professional — $59/month** ($590/year, 17% off) — 5,000 message credits/month, 1 workspace, 3 team members, 50 apps, 500 knowledge documents, 5GB knowledge storage, 20,000 trigger events/month, unlimited log history, no Dify API rate limit, priority email support.
- **Team — $159/month** ($1,590/year) — 10,000 message credits/month, 1 workspace, 50 team members, 200 apps, 1,000 knowledge documents, 20GB knowledge storage, unlimited triggers, top-priority document processing, advanced analytics integrations (Langsmith/Langfuse), priority email support.
- **Enterprise — talk to sales** — Self-hosted or dedicated cloud, SOC2 Type II report, role management, WebApp branding customization (i.e. the only way to legally remove the logo), unlimited everything, support SLA.

**Self-hosted plans:**

- **Community Edition (free)** — modified Apache 2.0. Self-host on your infra. All core features for internal use. Ungated except for the multi-tenant restriction.
- **Enterprise (self-hosted)** — custom pricing. Includes commercial license, audit logs, fine-grained RBAC, SSO/SCIM, branding removal, SLA, dedicated support.

Free for verified students and educators (their education program covers the Pro tier).

## The message credit math

The credit system is where the real cost story lives. Dify defines a "message credit" as roughly one LLM completion — a chatbot reply, an agent step, a workflow execution that calls a model. That's intentionally vague because the actual consumption depends on which model you wired in.

5,000 credits/month on Pro sounds like a lot until you realize what an agent actually does. A single user conversation with a multi-step agent might burn 5–15 credits — one for the planner, several for tool calls, one for the synthesizer. A RAG-backed support bot answering 100 customer questions a day at 5 credits each = 15,000 credits/month. You're already off Pro and into Team territory, or buying overage (which exists but isn't priced publicly on the page — you have to ask sales).

This is the standard agent-pricing trap. Per-message billing looks cheap on the surface because the user thinks in "messages I send" but the platform meters "model calls under the hood." The two numbers diverge by 3-10x for any non-trivial agent.

The Team plan at $159/month with 10k credits/month works out to roughly **$0.016 per credit**. If your average agent burn is 5 credits per user interaction, you're paying ~$0.08 per interaction in platform fees, on top of whatever you pay OpenAI or Anthropic for the actual model.

For a team running their own production AI feature with even modest volume, the credit ceiling on Pro and Team will be the binding constraint long before any other limit. Plan accordingly, or self-host.

## The pricing cliff

Sandbox to Pro: 200 lifetime credits to 5,000/month. This isn't really a cliff, it's the on-ramp. Sandbox is a glorified demo — you can't realistically build anything past a hello-world.

Pro ($59) to Team ($159) is a 2.7x price jump for a 2x increase in message credits. What you're really buying with that extra $100/month:

1. **47 more team members** (3 → 50). For most early teams, the seat cap on Pro is the actual binding constraint. The moment you have an engineering team, a PM, and a couple of analysts wanting to view logs, you're upgrading.
2. **4x knowledge storage** (5GB → 20GB) and 2x documents (500 → 1,000). Matters for RAG-heavy use cases. Doesn't matter at all for pure agent/workflow use cases.
3. **Unlimited triggers** (vs. 20k/month on Pro). If you're running scheduled workflows or webhook-triggered agents at any volume, this matters fast.
4. **Top-priority document processing.** Dify's vector indexing has a queue. On Pro you wait. On Team you don't. Realistic impact: 30 seconds vs. 5 minutes when you upload a knowledge base.
5. **Advanced analytics integrations** with Langsmith/Langfuse. If you're already running Langfuse (which you should be — see [my Langfuse teardown](/blog/langfuse-pricing-teardown)), this is the integration that pipes your Dify trace data into your real observability stack.

For solo developers and 2-person teams, Pro is enough. The seat cap forces the upgrade once you have any kind of cross-functional team.

The bigger cliff is Team to Enterprise. The page doesn't show a price. From conversations and public discussions, Dify Enterprise self-hosted licenses start at five figures annually, scaling with usage. That's the SaaS license you're buying when you actually want to wrap Dify in your own product — at which point you're paying not just for support and SLA, but for the right to operate the thing commercially at all.

## Self-hosted vs. cloud

The self-hosted option is genuinely viable for internal use. Docker compose gets you running in 5 minutes. Helm chart for production Kubernetes. The community edition has functionally all the features — model providers, agent flows, RAG, MCP integrations, the whole thing.

The catch is operating it. Dify's stack includes PostgreSQL, Redis, a vector database (Weaviate/Qdrant/Milvus depending on config), a worker queue, the API, the web frontend. That's six containers minimum, and at production scale you're managing all of them. The vector DB is the painful one — Qdrant is fine until your knowledge base hits real volume, then you're tuning sharding.

For a single team with a few internal AI tools, self-hosting saves you the $59-$159/month and gives you full control of your data. For anyone building customer-facing AI features, the operational overhead probably exceeds the cloud cost — and you can't legally use the self-hosted version commercially as a multi-tenant product anyway.

## Worth paying for?

**Sandbox** is a demo. Don't plan to do real work on it.

**Pro at $59/month** is the right starting point for any solo dev or 2-3 person team who wants to ship an LLM feature without operating their own agent infrastructure. The credits will run out fast if you're doing anything ambitious, but the price-to-time-saved ratio is excellent. Easy yes.

**Team at $159/month** is the standard play for any growing AI-native startup. The Langfuse integration alone is worth $40 of the markup if you're serious about observability. The 50-seat cap removes the noise, the unlimited triggers remove the second-biggest gotcha. If you're past the prototype stage, this is where you live.

**Enterprise** is real money for real companies. If you're building a product on top of Dify, you don't have a choice — the multi-tenant license clause makes the cloud or self-hosted Enterprise license mandatory.

**Self-host** if you have ops capacity and you're deploying internal-only AI tools. The community edition is feature-complete for that case. The licensing trap only triggers when you start serving external customers.

The honest take: Dify's pricing is reasonable for what it is, but the message-credit metering will bite anyone who underestimates how many model calls a real agent makes. Budget for 3-5x the credits you'd naively expect, and pick your tier based on the team-size and trigger limits, not the headline credit allocation. And if you ever plan to wrap Dify in a product you sell to others, read the license modification carefully before you build anything — the word "Apache" is doing a lot of work in that filename, and the modification underneath is the actual rule.

---

*I build [Beton](https://getbeton.ai?utm_source=blog&utm_campaign=dify_teardown&utm_medium=organic) — open source revenue intelligence for B2B SaaS.*
