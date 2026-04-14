---
title: "Windmill Pricing Teardown"
description: "Windmill splits users into developers and operators at half the price -- a smart model for internal tools."
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "workflow automation"]
featured: false
draft: true
seo:
  metaTitle: "Windmill Pricing Teardown: Workflow Automation"
  metaDescription: "Windmill splits users into developers and operators at half the price -- smart for internal tools."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

Windmill is an open-source platform for building internal tools and automating workflows — scripts, flows, apps, all from a single UI. Think Airplane or Retool, but self-hostable and actually affordable. ~12k GitHub stars. It solves the "our data team wants to run a SQL script on a schedule and the engineering team won't build a UI for it" problem that every company with 10+ people eventually faces.

- Website: [windmill.dev](https://windmill.dev)
- Pricing: [windmill.dev/pricing](https://windmill.dev/pricing)
- GitHub: [github.com/windmill-labs/windmill](https://github.com/windmill-labs/windmill)

**Plans**

- **Self-hosted open source (free):** Unlimited script executions, up to 10 users with SSO. Full features except enterprise-only add-ons.
- **Enterprise self-hosted — from ~$120/month:**
  - Developers: $20/month each
  - Operators: $10/month each
  - Compute units: $50/worker/month (2GB memory per worker)
- **Cloud:** Similar seat + compute pricing structure.

**Operator seats: the smart tiered user model**

Windmill splits users into two categories:
- **Developers** ($20/month): Can write scripts, build flows, create apps
- **Operators** ($10/month): Can execute existing scripts and apps, but can't create or modify

This is genuinely clever. Most internal tools have a small group of builders (engineers, data analysts) and a much larger group of runners (ops team, customer support, sales ops). If you're charging the same rate for both, you're either overcharging the runners or undercharging the builders.

At half the price for operators, Windmill is explicitly designed for this pattern. A team of 3 developers + 20 operators costs: (3 × $20) + (20 × $10) = $260/month for seats. That's a reasonable number for a proper internal tooling platform.

Compare this to Retool, which charges the same seat rate for everyone and gets expensive fast once you have 20+ people who need access to internal tools.

**Compute units as a separate dimension**

On top of seats, you pay $50/worker/month for compute. A "worker" in Windmill is a process that executes your scripts. For most teams, 1-2 workers is fine for non-critical internal automations. At $50/worker/month, 2 workers = $100/month in compute on top of your seat costs.

This dual-billing (seats + compute) is the same pattern as Windmill's competitors, but the pricing is more transparent than most. You know exactly what you're paying for people and separately for execution capacity.

For heavier workloads — scripts that run frequently, long-running flows, high parallelism needs — compute costs scale independently. A team with light usage but many users pays mostly for seats. A team with heavy automation but few users pays mostly for compute. That's actually more fair than forcing everyone through the same meter.

**The free tier is genuinely usable**

10 users with full OSS features and unlimited executions covers a lot of small teams. The self-hosted open source version isn't crippled — it's the same product, just without enterprise add-ons (audit logging, dedicated support, SLA, etc.).

For a startup with a technical co-founder who can manage a deployment: free tier on a cheap VPS is a serious option. Enterprise tier makes sense when you have compliance requirements or need guaranteed uptime from a vendor.

**vs Airplane (acquired by Airtable)**

Airplane's acquisition killed a lot of teams' plans — classic acquihire, product was deprecated. Windmill is the obvious migration target. Being open source means no acquisition risk. That's not a minor detail when you're building internal tooling that your whole ops workflow depends on.

**License**

MIT for the core open source version. The Enterprise Edition has a commercial license. Standard split: OSS is genuinely open, enterprise features are gated behind a commercial agreement.

**Worth paying for?**

If you have any internal automation needs, the free self-hosted tier is worth setting up just to see if it sticks. Enterprise tier at ~$120+ makes sense once you have 5+ people using it regularly or when compliance requirements make the audit logging non-optional. The operator seat model is the real differentiator — if your user base is mostly runners, you'll save a meaningful amount vs alternatives.

---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=windmill_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*
