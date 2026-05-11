---
title: "Langfuse Pricing Teardown"
description: "Langfuse open sourced almost everything under MIT. The cloud pricing is usage-based with a $170 cliff between Core and Pro — here's what you're actually paying for."
publishedAt: "2026-04-20"
updatedAt: "2026-05-11"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "LLM observability"]
featured: false
draft: false
coverImage: "/images/blog/langfuse-pricing-cover.jpeg"
tldr: |
  Langfuse is open-source LLM observability — 24k+ stars, MIT-licensed core. In June 2025 they moved every product feature (tracing, prompts, evals, playground, annotation queues) to MIT. Only thin enterprise compliance features (SCIM, audit logs, project-RBAC, UI customization) remain commercial.

  - Self-hosting on the MIT version is unusually viable — full product, no seat caps, no retention limits, no usage caps.
  - Cloud Core at $29/month is the easy upgrade once you have production LLM traffic.
  - The Core → Pro jump is $29 → $199 for the same usage — you're paying for 3-year retention + SOC2/ISO27001 reports + higher rate limits, i.e. the compliance wrapper.
  - Teams add-on (+$300) gates SSO behind a $499/mo total. Enterprise at $2,499/mo for SCIM + audit logs + SLAs.
  - The catch when self-hosting is ClickHouse — operating it at production scale is real ops work.
faq:
  - question: "Is Langfuse open source?"
    answer: "Yes — MIT-licensed for the entire core platform: tracing, prompts, evals, datasets, playground, annotation queues. Only SCIM, audit logs, project-RBAC, and UI customization are commercial."
  - question: "What's the cheapest Langfuse Cloud plan?"
    answer: "$29/month for Core (100k units/month, unlimited users, 90-day retention). Hobby at $0 covers 50k units/month for prototypes."
  - question: "Why does Langfuse Cloud Pro cost $199/month?"
    answer: "Compliance — SOC2 + ISO27001 reports, 3-year data access, data retention management, plus higher rate limits. Same included usage as Core; you're paying for the compliance wrapper, not more capacity."
  - question: "Should I self-host Langfuse?"
    answer: "Yes if you have ClickHouse ops capacity. The MIT license means no seat caps, no retention limits, no usage caps — only your infra costs. The catch is operating ClickHouse at production scale."
pricingTable:
  license: "MIT (core)"
  freeTier: "50k units/mo"
  cheapestPaid: "$29/mo (Core)"
  verdict: "Self-host if you can; Pro for SOC2"
seo:
  metaTitle: "Langfuse Pricing Teardown — MIT Core, Usage Billing"
  metaDescription: "Langfuse is MIT-licensed LLM observability with 24k+ GitHub stars. Cloud starts at $29/month with usage-based billing at $8/100k units."
---

Hey, it's Vlad, founder of Beton.

Langfuse is one of those tools that every AI team ends up looking at eventually. You're shipping an LLM-powered feature, something goes wrong, and suddenly you realize you have zero visibility into what your model is actually doing. That's the gap Langfuse fills.

What makes it interesting from a pricing standpoint is the licensing move they made in mid-2025 — they open sourced nearly everything under MIT. The commercial gating is now razor-thin. Let's break it down.

*This post is a part of series on commercial open source software pricing.*

## What is Langfuse

Langfuse is an open source LLM engineering platform. Tracing, prompt management, evaluations, datasets, playground — the full observability and iteration stack for AI applications.

Think of it as Datadog for your LLM layer. You instrument your app with their SDK (Python, JS/TS, or OpenTelemetry), and Langfuse captures every trace — model calls, retrieval steps, agent actions, latency, tokens, cost. Then you use the dashboard to debug, evaluate, and improve.

- 24,400+ GitHub stars
- Y Combinator W23
- Built with TypeScript, backed by ClickHouse
- 5.5M+ monthly SDK installs, 8,000+ self-hosted instances
- Integrations with OpenAI, LangChain, LlamaIndex, LiteLLM, Vercel AI SDK, CrewAI, and dozens more

The project has real momentum. It's become the default open source option in the LLM observability space, competing with Arize, Braintrust, and LangSmith.

## The licensing play

This is where Langfuse stands out — and where the June 2025 announcement changed everything.

**The core platform is MIT**

Not AGPL. Not BSL. Not "sustainable use." MIT. The most permissive license there is. You can fork it, embed it, sell it, build a competing product on top of it. No strings.

And it's not MIT for some stripped-down toy version. All the core product features — tracing, prompt management, LLM-as-a-judge evaluations, annotation queues, playground, prompt experiments, datasets — are MIT.

Before June 2025, features like LLM-as-a-judge, the playground, and annotation queues were commercially licensed. They moved all of it to MIT. Their own blog post says it clearly: "we are open sourcing all remaining Product Features in Langfuse."

**The enterprise edition is a thin shell**

What's left in the commercial `ee/` directory? License checks and enterprise security features:

- SCIM API for automated user provisioning
- Audit logs
- Data retention policies
- Project-level RBAC (org-level RBAC is already MIT)
- UI customization for self-hosted deployments

That's it. The EE license requires a commercial agreement with Langfuse GmbH. You can read and modify the code for dev/testing, but you can't run it in production without paying.

The split is clean: product features are free, platform team / compliance features are paid. SSO (including Okta and AzureAD) is MIT and available in the open source version. That's notably generous — most COSS companies gate SSO behind enterprise pricing.

**What this means in practice**

For a team that just needs LLM observability and evals: self-host the MIT version and you're done. Unlimited users, unlimited traces, unlimited retention, full feature set. No license gotchas.

For a 500-person company that needs SCIM, audit logs, and data retention policies: you're buying the enterprise license. Fair enough.

The bet Langfuse is making is that cloud convenience and enterprise compliance features are enough to build a business on, even when the core product is completely free. Given 8,000+ self-hosted instances, the top-of-funnel seems to be working.

## Pricing structure

Langfuse Cloud uses usage-based pricing on top of flat monthly tiers. The billable unit is anything you send to their tracing API — traces, observations (spans, events, generations), and scores. One LLM call might generate multiple units depending on your instrumentation depth.

**Cloud plans:**

- **Hobby (free)** — 50k units/month, 30-day data access, 2 users. No credit card required. Enough to evaluate the product on a side project.
- **Core — $29/month** — 100k units included, unlimited users, 90-day data access. Overage at $8/100k units (graduated — drops to $7 at 1M, $6.50 at 10M, $6 at 50M+). In-app support with 48h response SLO.
- **Pro — $199/month** — 100k units included (same as Core), unlimited users, 3-year data access, data retention management, unlimited annotation queues, high rate limits (20k ingestion req/min vs 4k on Core), SOC2 & ISO27001 reports, BAA available for HIPAA.
- **Pro + Teams add-on — $499/month** — Everything in Pro plus enterprise SSO (Okta), SSO enforcement, fine-grained RBAC, dedicated Slack/MS Teams support channel with 24h response SLO.
- **Enterprise — $2,499/month** — Everything in Pro + Teams plus audit logs, SCIM API, custom rate limits, uptime SLA, support SLA, dedicated support engineer. Yearly commitment available with custom volume pricing and AWS Marketplace billing.

**Self-hosted plans:**

- **Open Source (free)** — MIT license. All core platform features. Unlimited everything. You manage your own ClickHouse instance.
- **Enterprise (self-hosted)** — Custom pricing. Bundled with ClickHouse Cloud/BYOC/Private. Adds project-level RBAC, audit logs, data retention, SCIM, server-side data masking, UI customization, dedicated support engineer, solutions architect support.

**The graduated usage pricing:**

| Volume tier | Rate per 100k units |
|---|---|
| 0 - 100k | Included in plan |
| 100k - 1M | $8 |
| 1M - 10M | $7 |
| 10M - 50M | $6.50 |
| 50M+ | $6 |

So a team generating 5M units/month on Core pays: $29 base + $0 (first 100k) + $72 (next 900k at $8) + $280 (next 4M at $7) = $381/month. Not cheap, but predictable.

## The pricing cliff

The Core-to-Pro jump is the elephant in the room. $29 to $199 — a $170/month increase — for the exact same included usage (100k units).

What do you actually get for that $170?

1. **3 years data access vs 90 days.** This is the big one. If you're building LLM features in a B2B product and need to look at historical traces for debugging or compliance, 90 days is genuinely limiting. Three years is essentially "forever" for most teams.
2. **Data retention management.** The ability to set TTLs and auto-delete data. Required for GDPR-conscious teams.
3. **Unlimited annotation queues** (vs 3 on Core). If you're doing systematic human evals, this matters.
4. **SOC2 & ISO27001 reports.** The compliance checkbox. If your customers are asking for these, you need Pro.
5. **Higher rate limits.** Ingestion jumps from 4k to 20k requests/minute. API from 100 to 1,000 requests/minute.

For a solo developer or small startup without compliance requirements, Core is fine. For any B2B team whose customers will send a security questionnaire, Pro is effectively mandatory. That's intentional pricing design — compliance as the upgrade trigger.

Then there's the Teams add-on at $300/month on top of Pro. Enterprise SSO and RBAC. If your company's IT policy mandates Okta login for all tools, you're at $499/month before any usage charges. That's the real "enterprise tax."

And from $499 to Enterprise at $2,499 — a 5x jump — you're buying audit logs, SCIM provisioning, SLAs, and a dedicated human. This is pure enterprise sales territory. The product doesn't change much; the support and compliance wrapper does.

## Does it make sense to pay?

**Self-hosting is genuinely viable.** Unlike Firecrawl where the value is managed infrastructure (proxies, browser pools), Langfuse's value as a self-hosted tool is the product itself. Docker compose gets you running in minutes. Helm chart for production Kubernetes. Terraform templates for AWS, Azure, GCP. The MIT license means no restrictions whatsoever.

The catch is ClickHouse. Langfuse uses ClickHouse as its analytics database, and operating ClickHouse at scale is non-trivial. For a small team doing a few million traces/month, a single ClickHouse instance is fine. For high-volume production use, you need to think about replication, backups, and schema migrations. That's real ops work.

**Cloud Core at $29/month is an easy yes** the moment you have a production LLM feature. The alternative — tailing logs, grepping for model outputs, manually checking responses — is absurd once you've seen proper tracing. $29/month is below the "think about it" threshold for any team with revenue.

**Pro at $199/month is the compliance trigger.** You'll know when you need it because a customer or your security team will tell you. Until then, Core is enough.

**Teams add-on ($300/month) is SSO tax.** Skip it unless your IT department forces the issue.

**Self-host if you can.** The MIT license is clean, the product is complete, and you dodge the unit-based billing entirely. If you're already running ClickHouse or comfortable adding it to your stack, self-hosting is the highest-value option. No usage limits, no retention limits, no seat caps. You trade monthly fees for infra management.

The honest take: Langfuse's pricing is reasonable for what it is, but the real story is the licensing. An MIT-licensed platform this feature-complete, with this much community adoption, makes self-hosting an unusually strong play. The cloud pricing exists for teams who value convenience over ops overhead — and there's nothing wrong with that.

---

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*

_Last verified 2026-05-11._
