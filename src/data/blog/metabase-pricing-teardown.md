---
title: "Metabase Pricing Teardown 2026"
description: "Metabase pricing: Starter at $100/mo, Pro at $575/mo, Enterprise from $20k/year — and the open-source edition still runs free under AGPL with almost everything except embedded analytics."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "analytics"]
featured: false
draft: false
coverImage: "/images/blog/metabase-pricing-cover.jpeg"
tldr: |
  Metabase is the BI tool most small-to-mid-size teams reach for first: ~47k GitHub stars, a genuinely usable free self-hosted edition, and a cloud business built on a base-plus-per-user model. The short version: self-hosting under AGPL is still free and covers nearly everything except embedded analytics. Cloud starts at $100/mo.

  - Open source / self-hosted: free, AGPL, 20+ data sources, unlimited dashboards — no embedded analytics
  - Starter: $100/mo base (5 users, +$6/user/mo) — backups and hosting, still no SSO or embedded analytics
  - Pro: $575/mo base (10 users, +$12/user/mo) — SSO, row/column-level permissions, multi-tenant embedded analytics, white-label
  - Enterprise: custom, from $20k/year — air-gap deployment, dedicated success engineer, 1-day SLA
  - AGPL core means self-hosting is clean for internal use; commercial license required for Pro/Enterprise self-hosted
  - Embedded analytics is the real paywall: it lives entirely behind Pro/Enterprise
faq:
  - question: "Is Metabase open source?"
    answer: "The core is AGPL-3.0. That means you can self-host for free internally without open-sourcing your own code, but if you modify Metabase and distribute it (including embedding it for external customers), AGPL terms apply. The commercial editions — Pro self-hosted and Enterprise — ship under a separate commercial license that lifts those restrictions."
  - question: "What does the free self-hosted edition actually include?"
    answer: "Almost everything: 20+ data sources, unlimited dashboards and questions, SQL editor, models, AI-powered questions, notifications. The one notable exclusion is embedded analytics — if you want to embed Metabase dashboards into a customer-facing product, you need Pro or Enterprise."
  - question: "How much is the cheapest paid plan?"
    answer: "Starter on Cloud is $100/month (billed $1,080/year annual) for 5 included users, then $6/user/month. It adds automatic backups, upgrades, and multi-region hosting — but no SSO and no embedded analytics. If you need either, Starter doesn't help."
  - question: "What does Pro actually unlock?"
    answer: "Row and column-level permissions, SSO, multi-tenant embedded analytics, usage analytics, white-label customization (custom colors, fonts, UI elements). That is the whole embedded analytics story — Pro is the entry point for building a data product on top of Metabase."
  - question: "When does Enterprise make sense?"
    answer: "When you need air-gap deployment, a dedicated success engineer, procurement assistance, or a 1-day support SLA. It starts around $20k/year. There is nothing between Pro's flat base-plus-per-user and Enterprise's custom contract."
pricingTable:
  license: "AGPL-3.0 (open source / self-hosted), commercial (Pro/Enterprise self-hosted)"
  stars: "~47k"
  freeTier: "Self-hosted, AGPL, unlimited dashboards — no embedded analytics"
  cheapestPaid: "$100/mo base (Starter Cloud, 5 users) + $6/user/mo"
  verdict: "Self-host for internal BI; pay Pro ($575/mo) if you need embedded analytics or SSO"
seo:
  metaTitle: "Metabase Pricing Teardown: BI Platform 2026"
  metaDescription: "Metabase pricing: Starter at $100/mo, Pro at $575/mo, Enterprise from $20k/year — and self-hosting under AGPL is still free."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

Metabase shows up in almost every seed-stage startup's tech stack: quick to install, SQL-optional, free to self-host. ~47k GitHub stars puts it past "is this maintained?" and into foundational data tooling. Metabase, Inc. runs a cloud business on top of the AGPL core, in four tiers: Open Source / Starter / Pro / Enterprise.

- Website: [metabase.com](https://www.metabase.com)
- Pricing: [metabase.com/pricing](https://www.metabase.com/pricing)
- GitHub: [github.com/metabase/metabase](https://github.com/metabase/metabase)

**Plans**

- **Open Source — free, self-hosted:** The AGPL-licensed edition. 20+ data sources, unlimited dashboards and questions, SQL editor, models, AI-powered questions, basic permissions. No cloud hosting, no automatic backups. Embedded analytics excluded.
- **Starter — $100/month (annual: $1,080/year):** Cloud-hosted, 5 users included, +$6/user/month. Adds automatic backups, upgrades, multi-region hosting, 3-day email/chat support. No SSO, no embedded analytics — someone else runs the infrastructure, no commercial features unlocked.
- **Pro — $575/month (annual: $6,210/year):** Cloud or self-hosted (commercial license). 10 users included, +$12/user/month. Unlocks row/column-level permissions, SSO, multi-tenant embedded analytics, usage analytics, white-label. Self-hosted Pro is the entry point for teams that need data residency plus the commercial features.
- **Enterprise — custom, from $20k/year:** All Pro features plus air-gap deployment, dedicated success engineer, procurement assistance, 1-day SLA. No published per-seat rate.

**The embedded analytics paywall**

The most consequential line in the pricing table is a negative: "Embedded Analytics not available" on Open Source and Starter.

If you're building a product that surfaces data to end users — a customer-facing operations dashboard, white-labeled reports, analytics embedded in your SaaS — the AGPL free tier and the $100/month Starter tier are both dead ends. You land on Pro at $575/month minimum, or Enterprise.

The paywall is well-constructed. Internal BI (your team queries your data) is free or cheap. Customer-facing BI (Metabase as the engine behind someone else's analytics) is a commercial use case, priced as one. The split is defensible.

**Starter is mostly a hosting bill**

Starter at $100/month gives you automatic backups, cloud hosting, and support response times. It does not give you SSO, row-level permissions, or embedded analytics — those live behind Pro.

For a team that wants cloud hosting without self-managing infrastructure, Starter is legitimate: you're paying for operations, not features. But a team eyeing Starter as a stepping stone to SSO hits a wall — there's no mid-tier between "just hosting" and the full Pro feature set at $575/month.

Per-user rates add up on Pro. A 20-person team pays $575 base + 10 extra users × $12 = $695/month. A 50-person team pays $575 + 40 × $12 = $1,055/month.

**Self-hosted Pro is the underrated option**

Pro runs cloud or self-hosted. Self-hosted Pro requires a commercial license but unlocks every commercial feature without cloud hosting costs. For teams with existing infrastructure and strict data residency requirements, self-hosted Pro at $6,210/year for 10 users is worth comparing against cloud — the per-user cost is identical, but you skip the hosting bill.

**License**

Metabase core is AGPL-3.0. For internal use — your team queries your own data — it's a clean option. AGPL requires open-sourcing modifications if you distribute them, but running a private instance against your warehouse isn't distribution.

The commercial case is where it gets specific. The repository holds both the AGPL code and the commercial edition source; commercial features are gated by a license key, not separate code. To embed Metabase in a customer-facing product without AGPL's copyleft obligations, you need a commercial license — Pro or Enterprise.

One nuance: the AGPL restriction applies to distributing a modified Metabase, not to using it via API or embedding dashboards. But Metabase's embedding terms require a commercial license regardless. The rule: internal use is free; customer-facing use is paid.

**Worth paying for?**

Self-host the AGPL edition for internal BI if your team can handle the ops. It covers nearly everything except embedded analytics, and the v0.61 line is current as of May 2026 — actively maintained.

Starter is worth $100/month if you want Metabase without managing infrastructure and don't need SSO or embedded analytics. It's a hosting convenience, not a path to Pro features.

Pro at $575/month is justified when embedded analytics or SSO is a real requirement. White-label and multi-tenant make it the right tier for teams building a data product on top of Metabase. At that price, compare against Grafana (its own enterprise cliff) and other embedded analytics options.

Enterprise from $20k/year fits scale with compliance needs (air-gap, dedicated SLA) or procurement assistance and named support. At that floor, Metabase is steering larger accounts into custom contracts.

---


## How Metabase pricing scales

Metabase charges a base plus per-user. SSO and embedded analytics sit on Pro, where both the base ($575 vs $100) and the per-user rate ($12 vs $6) roughly double.

<figure class="my-8">
<svg viewBox="0 0 760 296" role="img" aria-label="pricing scales by users" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="64" y1="250.0" x2="560" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="64" y1="194.0" x2="560" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$500</text><line x1="64" y1="138.0" x2="560" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,000</text><line x1="64" y1="82.0" x2="560" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,500</text><line x1="64" y1="26.0" x2="560" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$2,000</text><text x="64.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 users</text><text x="188.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 users</text><text x="312.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 users</text><text x="436.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 users</text><text x="560.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 users</text><polyline points="64.0,238.1 188.0,235.4 312.0,232.1 436.0,222.0 560.0,205.2" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="64.0" cy="238.1" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="188.0" cy="235.4" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="312.0" cy="232.1" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="436.0" cy="222.0" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="560.0" cy="205.2" r="3.5" fill="var(--color-primary-600)"></circle><text x="568" y="209.2" fill="var(--color-primary-600)" font-size="12" font-weight="600">Starter $100+$6/user</text><polyline points="64.0,184.3 188.0,178.9 312.0,172.2 436.0,152.0 560.0,118.4" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2.5"></polyline><circle cx="64.0" cy="184.3" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="188.0" cy="178.9" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="312.0" cy="172.2" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="436.0" cy="152.0" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="560.0" cy="118.4" r="3.5" fill="var(--color-text-tertiary)"></circle><text x="568" y="122.4" fill="var(--color-text-tertiary)" font-size="12" font-weight="600">Pro $575+$12/user (SSO)</text></svg>
<figcaption>Monthly cost as Metabase scales by user. Pro (SSO + embedding) raises both the base and the per-user rate.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
