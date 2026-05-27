---
title: "Appsmith Pricing Teardown 2026"
description: "Appsmith dropped hourly billing in 2025. It's now $15/user/month, Apache 2.0, and the free tier caps at 5 users. Here's what changed and what it means."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "internal tools"]
featured: false
draft: false
coverImage: "/images/blog/appsmith-pricing-cover.jpeg"
tldr: |
  Appsmith is the open-source low-code platform most engineering teams reach for when non-technical people need to edit production data without writing SQL. ~40k GitHub stars, Apache 2.0, and a pricing model that changed materially from the original teardown: hourly billing is gone, replaced by a flat $15/user/month on Business and a $2,500/month entry point on Enterprise.

  - Free forever — up to 5 cloud users, 3 Git repos, Google SSO, public apps only
  - Business — $15/user/month, up to 99 users, unlimited repos/envs/workflows, audit logs, custom roles
  - Enterprise — $2,500/month for 100 users (~$25/user), SAML/OIDC, SCIM, CI/CD, private app embedding
  - Apache 2.0 on core (no AGPL, no relicensing ambiguity)
  - Self-hosting removes the user cap entirely; the only gate is commercial features
faq:
  - question: "Is Appsmith open source?"
    answer: "Yes. Core Appsmith is Apache 2.0. That means you can fork it, self-host it, modify it, and redistribute it without open-sourcing your changes. There is no AGPL clause to worry about."
  - question: "What happened to the hourly billing model?"
    answer: "The original model charged $0.40/hour of usage capped at $20/seat/month. As of 2025/2026, Appsmith has moved to a flat per-user monthly rate: $15/user/month on Business, $2,500/month for 100 users on Enterprise. The hourly meter is gone."
  - question: "What does the free tier include?"
    answer: "Up to 5 users on cloud, 5 workspaces, 3 Git repositories, Google SSO, 3 standard roles, and public apps. Private app embedding is not included. Community support only."
  - question: "What does Business add over Free?"
    answer: "Unlimited workspaces, environments, and Git repos. Workflows and reusable packages. Premium integrations, custom roles, audit logs, branding removal, and email/chat support. Up to 99 users."
  - question: "When does Enterprise make sense?"
    answer: "When you need SAML/OIDC SSO, SCIM provisioning, CI/CD integration, or private app embedding — or when you exceed 99 users. Enterprise starts at $2,500/month for 100 users and is typically billed annually."
  - question: "Can I self-host for free?"
    answer: "Yes, with no user cap. Self-hosting gives you the full community edition. Commercial features (custom SSO, audit logs, etc.) require a Business or Enterprise license even on self-hosted."
pricingTable:
  license: "Apache 2.0"
  stars: "~40k"
  freeTier: "Up to 5 cloud users, 3 Git repos, public apps only"
  cheapestPaid: "$15/user/month (Business)"
  verdict: "Free or self-hosted for small teams; Business for internal tooling at scale; Enterprise only if you need SSO or private embedding"
seo:
  metaTitle: "Appsmith Pricing Teardown 2026: Plans & Billing"
  metaDescription: "Appsmith dropped hourly billing. It's now $15/user/month on Business. Here's the full breakdown of free, Business, and Enterprise tiers."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

Appsmith is the low-code platform engineering teams reach for when the ask is "build an admin panel so ops can edit this table without calling an engineer." ~40k GitHub stars, Apache 2.0 core, and a pricing story that changed between the original teardown and today.

The original model charged per hour of usage — $0.40/hour, capped at $20/seat/month. You could model it against session frequency, and the cap kept costs predictable for power users. That model is gone. Appsmith now charges a flat per-user monthly rate: simpler to sell, simpler to budget, and structurally closer to every other SaaS tool in the category.

- Website: [appsmith.com](https://www.appsmith.com)
- Pricing: [appsmith.com/pricing](https://www.appsmith.com/pricing)
- GitHub: [github.com/appsmithorg/appsmith](https://github.com/appsmithorg/appsmith)

**Plans**

- **Free:** Always free. Up to 5 users on cloud, 5 workspaces, 3 Git repos, Google SSO, 3 standard roles, public apps. Community support.
- **Business — $15/user/month:** Everything in Free, plus unlimited workspaces, environments, and Git repos. Workflows, reusable packages, premium integrations, custom roles, audit logs, branding removal. Up to 99 users. Email and chat support.
- **Enterprise — $2,500/month for 100 users:** Everything in Business, plus SAML/OIDC SSO, SCIM provisioning, CI/CD integration, private app embedding, custom integrations, dedicated support with SLAs. Unlimited users beyond the 100-user base.

Self-hosting is a fourth option: community edition, no user cap, no license fee. Commercial features require a paid license even on self-hosted — same tier structure, different delivery.

**The billing model shift matters**

Hourly billing priced on engagement, not headcount. Ten ops staff who each open one app twice a day paid little. A hundred running heavy sessions paid more, but the $20/seat cap bounded it.

Flat per-user is the opposite logic: headcount determines cost, regardless of session depth. Appsmith apps typically have a small developer team (2-5 people) and a larger consumer population (ops, support, finance) who only read and edit data. Under hourly billing, light consumers were cheap. Under flat per-user, every added workspace member costs $15/month whether they log in daily or once a quarter.

The 5-user free cap is the sharpest version of this: a 6-person cloud team is immediately on paid. At $15/user/month, a 30-person consumer base costs $450/month, or $5,400/year — real money for a non-revenue tooling budget, and a common reason teams push toward self-hosting.

**The free tier is narrow**

Three Git repos is a real constraint. Past a handful of distinct internal apps, you either consolidate into monolithic apps (bad for maintainability) or upgrade. The original teardown flagged this; it still holds.

The 5-user cloud cap is tight. Any team past a small startup hits it in the first month. Free works as a trial or for small projects, not as a long-term option for an internal tooling program.

**The Enterprise gate**

Private app embedding — putting internal Appsmith apps inside your existing product or portal — sits behind Enterprise. So does SAML/OIDC SSO. Both are standard requirements above 50 people.

$2,500/month for 100 users is $25/user/month, a $10/user premium over Business. Defensible if SSO and CI/CD save engineering time. But there's no mid-tier between Business at $15/user (capped at 99 users) and Enterprise at $2,500/month. Hit the 99-user ceiling and the next step doubles your per-user cost and is typically billed annually.

**License**

Apache 2.0 on the core, which is clean. No AGPL ambiguity, no source-available relicensing risk. You can fork, modify, and self-host with no obligation to open-source your changes or pay a license fee.

Commercial features — audit logs, custom SSO, CI/CD, SCIM — are gated to paid plans whether you self-host or use cloud. The license doesn't restrict using the software; it restricts feature access above the community tier.

Apache 2.0 is a genuine open-source license, not a marketing claim. For teams weighing vendor lock-in, this is one of the cleaner postures in low-code.

**Worth paying for?**

Free is a starting point for projects under 5 users or any team planning to self-host. Self-hosted community edition has no user cap and no license fee — the right default for most organizations with an ops team or a preference for on-premises tools.

Business at $15/user/month is justified when you're on cloud and need Git repos beyond 3, audit logs, or custom roles. Unlimited environments and workflows pay off for teams running internal tooling across multiple stages.

Enterprise at $2,500/month makes sense for strict SSO requirements or a real private-embedding use case — an Appsmith app inside a customer portal, say. At 100 users it's $25/user; per-user cost drops as you add seats beyond that.

The pricing creates friction at the 99-user Business ceiling combined with the annual Enterprise commitment. A 100-person ops team that needs SSO has nothing between $15/user/month and $2,500/month billed annually. That forcing function is why self-hosting stays competitive even for teams that would otherwise be happy on cloud.

---


## How Appsmith pricing scales

Appsmith bills a flat per-user rate, so cost is linear in users — until SSO. SAML lives on Enterprise (~$25/user at 100 users), and below 100 users you still pay the $2,500/month Enterprise floor.

<figure class="my-8">
<svg viewBox="0 0 760 296" role="img" aria-label="pricing scales by users" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="64" y1="250.0" x2="560" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="64" y1="194.0" x2="560" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$500</text><line x1="64" y1="138.0" x2="560" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,000</text><line x1="64" y1="82.0" x2="560" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,500</text><line x1="64" y1="26.0" x2="560" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$2,000</text><text x="64.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 users</text><text x="188.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 users</text><text x="312.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 users</text><text x="436.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 users</text><text x="560.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 users</text><polyline points="64.0,248.3 188.0,241.6 312.0,233.2 436.0,208.0 560.0,166.0" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="64.0" cy="248.3" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="188.0" cy="241.6" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="312.0" cy="233.2" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="436.0" cy="208.0" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="560.0" cy="166.0" r="3.5" fill="var(--color-primary-600)"></circle><text x="568" y="170.0" fill="var(--color-primary-600)" font-size="12" font-weight="600">Business $15/user</text><polyline points="64.0,247.2 188.0,236.0 312.0,222.0 436.0,180.0 560.0,110.0" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2.5"></polyline><circle cx="64.0" cy="247.2" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="188.0" cy="236.0" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="312.0" cy="222.0" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="436.0" cy="180.0" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="560.0" cy="110.0" r="3.5" fill="var(--color-text-tertiary)"></circle><text x="568" y="114.0" fill="var(--color-text-tertiary)" font-size="12" font-weight="600">Enterprise ~$25/user</text></svg>
<figcaption>Monthly cost as Appsmith scales by user. Business is flat per-seat; Enterprise (SSO) costs more per seat and starts at a $2,500/mo floor.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
