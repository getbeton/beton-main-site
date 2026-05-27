---
title: "ToolJet Pricing Teardown 2026"
description: "ToolJet went from one flat seat price to five cloud tiers, added AI credits to every plan, and kept AGPL — while Appsmith, the closest comparable, ships under Apache 2.0. That difference matters more than the per-seat number."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "internal tools"]
featured: false
draft: false
coverImage: "/images/blog/tooljet-pricing-cover.jpeg"
tldr: |
  ToolJet is the AGPL-licensed drag-and-drop internal-tool builder competing with Retool and Appsmith. ~38k GitHub stars, active releases (v3.20 shipped May 2026), and a pricing structure that completely changed since 2023 — five tiers on cloud, builder-seat billing, AI credits as the new upsell hook.

  - Free forever — 2 builders, 50 end users, 2 apps, 100 AI credits/month
  - Cheapest paid — Starter at $19/builder/month (20% off annual), bumps you to 2,000 AI credits/builder
  - Team at $199/builder/month is the realistic production tier for most orgs (unlimited end users + apps, SSO, Git sync, audit logs)
  - Enterprise — custom, adds SCIM, custom AI models, air-gapped self-hosting option
  - AGPL on core: running a private internal-tools instance is fine; distributing a modified ToolJet as a product triggers copyleft. Appsmith is Apache 2.0 — no such constraint.
faq:
  - question: "Is ToolJet open source?"
    answer: "Yes. The core is AGPL-3.0 licensed on GitHub (~38k stars). AGPL means you can self-host and modify freely for internal use, but if you distribute a modified version externally — as a product or service — those modifications must be open-sourced. Running ToolJet internally for your own teams does not trigger the copyleft clause."
  - question: "What does ToolJet's Free tier actually include?"
    answer: "2 builder seats, 50 end users, 2 apps, and 100 AI credits per month. No SSO, no Git sync. Usable for a solo developer prototyping one internal tool; too constrained for a team shipping production apps."
  - question: "What is the cheapest paid plan?"
    answer: "Starter at $19/builder/month (20% off billed annually). It keeps the same 2-builder/50-end-user/2-app limits as Free but jumps the AI allowance from 100 to 2,000 credits per builder, adds unlimited add-on credits, unlimited AI page generation, and 5 AI agents (Free gets 2). It is not the right tier for teams that need workflows or unlimited apps."
  - question: "How does ToolJet's license differ from Appsmith's?"
    answer: "ToolJet is AGPL-3.0; Appsmith is Apache 2.0. AGPL is copyleft: if you distribute a modified version of ToolJet (e.g., build a product on top of it), you must open-source your modifications. Apache 2.0 has no such requirement. For pure internal use both licenses are fine. For ISVs or SaaS builders who want to fork and ship, Apache 2.0 is the more permissive choice."
  - question: "What tier do most production teams land on?"
    answer: "Team at $199/builder/month. It is the first tier with unlimited end users, unlimited apps, SSO, custom user groups, white-labeling, Git sync, and audit logs — the table stakes for a real production deployment. Pro at $79 caps you at 100 end users and 5 apps, which most teams hit quickly."
pricingTable:
  license: "AGPL-3.0"
  stars: "~38k"
  freeTier: "2 builders, 50 end users, 2 apps, 100 AI credits/month"
  cheapestPaid: "$19/builder/month (Starter, 20% off billed annually)"
  verdict: "Team ($199/builder/month) for production orgs; Free for solo prototyping; Enterprise only for SCIM/air-gap/custom-AI requirements"
seo:
  metaTitle: "ToolJet Pricing Teardown: Internal Tools Builder"
  metaDescription: "ToolJet went from flat seat pricing to five tiers with AI credits. AGPL license vs Appsmith's Apache 2.0 — and why it matters before you fork."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

ToolJet is the open-source internal-tool builder that shows up alongside Retool and Appsmith. Drag-and-drop frontend, 80+ data source connectors, built-in database, workflow automation. ~38k GitHub stars, v3.20 shipped May 2026 — not abandonware.

- Website: [tooljet.com](https://www.tooljet.com)
- Pricing: [tooljet.com/pricing](https://tooljet.com/pricing)
- GitHub: [github.com/ToolJet/ToolJet](https://github.com/ToolJet/ToolJet)

**Plans**

ToolJet's cloud offering has five tiers as of mid-2026, up from three in earlier versions. All paid plans carry a 20% annual discount.

- **Free — $0:** 2 builders, 50 end users, 2 apps, 100 AI credits/month. No Git sync, no SSO.
- **Starter — $19/builder/month:** Same seat limits as Free (2 builders, 50 end users, 2 apps) but raises the AI allowance from 100 to 2,000 credits/builder, adds unlimited add-on credits, unlimited AI page generation, and 5 AI agents. Useful only to evaluate the AI builder without hitting the seat cap.
- **Pro — $79/builder/month:** Unlimited builders, 100 end users, 5 apps, 2,000 AI credits/builder, unlimited AI agents, custom styling, version control, email support. The 5-app and 100-end-user caps bite most teams within months.
- **Team — $199/builder/month:** Unlimited end users, unlimited apps, 2,000 AI credits/builder, SSO, custom user groups, white-labeling, Git sync, audit logs, modules. The production tier — the first plan where the per-seat price matches what you get.
- **Enterprise — custom:** Adds SCIM provisioning, custom AI credit allocations, custom model integrations (bring your own LLM), dedicated support manager, optional expert services and training. Self-hosted Enterprise adds air-gapped deployment and multi-instance options.

Self-hosted tiers mirror cloud: Pro at $79/builder/month, Team at $199/builder/month, same feature gates; Enterprise custom.

**The AI credits angle**

Every paid tier ships 2,000 AI credits per builder per month (Free gets 100); Enterprise negotiates custom allocations and models. The agent builder — AI workflows that call data sources and trigger actions — is capped per tier: 2 agents on Free, 5 on Starter, unlimited on Pro, Team, and Enterprise.

AI credits as a billing dimension is new in 2026. Whether it becomes a real cost depends on how much your team uses AI app generation. Teams that mostly maintain existing tools won't notice; teams shipping new apps regularly should size it.

**The 5-app wall on Pro**

Pro at $79/builder/month looks like the "real features" tier — version control, custom styling, email support. But 5 apps and 100 end users cap it. Five tools is not many: ticket dashboard, inventory tracker, onboarding form, support queue, data entry tool, and you're done. Most production teams skip Pro and go straight to Team. Pro is effectively a long trial before committing to $199/builder.

**License**

ToolJet is AGPL-3.0 — the same license as Grafana's core. Copyleft, with a network provision. What it means for internal tooling:

Running ToolJet privately for your own teams is fine. Modify it, extend it, self-host it — no code disclosure required, as long as you don't distribute it externally.

The copyleft clause activates when you distribute a modified ToolJet as a product or service. An ISV that forks ToolJet and resells it as a white-labeled platform must open-source those modifications.

For enterprises using ToolJet as infrastructure, AGPL is not a problem. The Appsmith comparison is where it matters.

Appsmith is Apache 2.0: ~40k GitHub stars, comparable feature set, similar self-hosted/cloud split, $15/user/month Business tier. Apache 2.0 is permissive — fork it, modify it, ship a product on top, no obligation to open-source your changes. For a team building an internal-tools product (not just using one), Apache 2.0 removes a legal risk that AGPL introduces.

ToolJet and Appsmith are close enough on UX and features that the license is a real selection criterion. Not the only one — connectors, component library, self-hosting ops all matter — but beyond pure internal use, the license difference counts.

**Worth paying for?**

Free is a reasonable start for a solo developer or a team prototyping one or two tools. The 2-builder cap forces a decision the moment a second person starts building.

Starter at $19 is a narrow tier — AI credit flexibility, same hard caps as Free. Worth it only if AI generation is your specific bottleneck.

Team at $199/builder/month is the honest production price. Three builders is $597/month, roughly $7,200/year. Retool's comparable tier (SSO, Git sync, unlimited apps and end users) runs similar or higher depending on end-user counts. Appsmith's Enterprise for 100 users is $2,500/month — a per-user axis that favors ToolJet for orgs with many end users and few builders.

Self-hosting is a real cost-control option: self-hosted Pro and Team cost the same as cloud, but you own the infrastructure and data.

Enterprise is justified if you need SCIM, air-gapped deployment, or your own LLM models. Otherwise Team is the ceiling.

---


## How ToolJet pricing scales

ToolJet bills per builder. Starter ($19) is AI-credit-focused; Team ($199/builder) is the real production tier (SSO, Git, audit logs) — a 10× per-builder jump.

<figure class="my-8">
<svg viewBox="0 0 760 296" role="img" aria-label="pricing scales by builders" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="64" y1="250.0" x2="560" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="64" y1="194.0" x2="560" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$2,500</text><line x1="64" y1="138.0" x2="560" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$5,000</text><line x1="64" y1="82.0" x2="560" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$7,500</text><line x1="64" y1="26.0" x2="560" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$10,000</text><text x="64.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 builders</text><text x="188.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 builders</text><text x="312.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 builders</text><text x="436.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 builders</text><text x="560.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 builders</text><polyline points="64.0,249.6 188.0,247.9 312.0,245.7 436.0,239.4 560.0,228.7" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="64.0" cy="249.6" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="188.0" cy="247.9" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="312.0" cy="245.7" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="436.0" cy="239.4" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="560.0" cy="228.7" r="3.5" fill="var(--color-primary-600)"></circle><text x="568" y="232.7" fill="var(--color-primary-600)" font-size="12" font-weight="600">Starter $19/builder</text><polyline points="64.0,245.5 188.0,227.7 312.0,205.4 436.0,138.6 560.0,27.1" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2.5"></polyline><circle cx="64.0" cy="245.5" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="188.0" cy="227.7" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="312.0" cy="205.4" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="436.0" cy="138.6" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="560.0" cy="27.1" r="3.5" fill="var(--color-text-tertiary)"></circle><text x="568" y="31.1" fill="var(--color-text-tertiary)" font-size="12" font-weight="600">Team $199/builder</text></svg>
<figcaption>Monthly cost as ToolJet scales by builder. Production features force the 10×-pricier Team tier.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
