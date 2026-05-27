---
title: "Windmill Pricing Teardown 2026"
description: "Windmill splits users into developers and operators at half the price -- a smart model for internal tools."
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "workflow automation"]
featured: false
draft: false
coverImage: "/images/blog/windmill-pricing-cover.jpeg"
tldr: |
  Windmill is open-source workflow automation and internal tooling — ~12k GitHub stars, MIT-licensed core. Pricing splits users into developers ($20/mo) and operators ($10/mo) on top of a $50/worker/month compute meter, which lines up neatly with how internal tools actually get used: a few builders, many runners.

  - Self-hosted OSS is free for up to 10 users with SSO and unlimited script executions — genuinely usable, not crippled.
  - Enterprise self-hosted starts around $120/month (seats + at least one worker).
  - Operator seats at half the developer rate are the real differentiator — a 3 dev + 20 operator team lands at $260/mo in seats.
  - Compute billed separately at $50/worker/month (2GB memory per worker) keeps heavy-automation and many-user teams from cross-subsidizing each other.
  - Obvious migration target for teams stranded by the Airplane acquihire; OSS license means no acquisition risk.
faq:
  - question: "Is Windmill open source?"
    answer: "Yes — the core is MIT-licensed. The Enterprise Edition has a separate commercial license for add-ons like audit logging, dedicated support, and SLA."
  - question: "What's the free tier?"
    answer: "Self-hosted OSS is free for up to 10 users with SSO and unlimited script executions. It's the same product as Enterprise minus the enterprise-only add-ons."
  - question: "How does Windmill price seats?"
    answer: "Two tiers: developers at $20/month (write scripts, build flows, create apps) and operators at $10/month (execute existing scripts and apps, can't create or modify)."
  - question: "What are compute units?"
    answer: "A worker is a process that executes your scripts, billed at $50/worker/month with 2GB memory per worker. Seats and compute are billed as separate dimensions."
  - question: "When does Windmill beat Retool?"
    answer: "Once you have a user base skewed toward runners. Retool charges the same seat rate for everyone, so a team of 20+ mostly-operator users gets expensive fast; Windmill halves the rate for that group."
pricingTable:
  license: "MIT (core)"
  stars: "~12k"
  freeTier: "10 users, unlimited executions"
  cheapestPaid: "~$120/mo (Enterprise self-hosted)"
  verdict: "Free tier for small teams; Enterprise for operator-heavy orgs"
seo:
  metaTitle: "Windmill Pricing Teardown: Workflow Automation"
  metaDescription: "Windmill splits users into developers and operators at half the price -- smart for internal tools."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

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


## How Windmill pricing scales

Windmill splits seats into developers ($20) and operators ($10, half price), plus a $50/worker compute meter — so a few builders and many runners stays cheap.

<figure class="my-8">
<svg viewBox="0 0 560 130" role="img" aria-label="pricing tiers" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">Operator seat</text><rect x="150" y="10" width="27" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="185" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$10/mo</text><text x="0" y="54" fill="var(--color-text)" font-size="14">Developer seat</text><rect x="150" y="40" width="53" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="211" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$20/mo</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Worker (compute)</text><rect x="150" y="70" width="133" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="291" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$50/mo</text><text x="0" y="114" fill="var(--color-text)" font-size="14">Enterprise floor</text><rect x="150" y="100" width="320" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="478" y="114" fill="var(--color-text-secondary)" font-size="13" font-weight="600">~$120/mo</text></svg>
<figcaption>Windmill unit prices. Operators cost half a developer; compute is metered separately per worker.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
