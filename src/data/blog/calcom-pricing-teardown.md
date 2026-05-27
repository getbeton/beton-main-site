---
title: "Cal.com Pricing Teardown 2026"
description: "Cal.com has a real free tier for individuals, $12/seat Teams, $28/seat Organizations — and an MIT license that makes self-hosting genuinely frictionless."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "scheduling"]
featured: false
draft: false
coverImage: "/images/blog/calcom-pricing-cover.jpeg"
tldr: |
  Cal.com is the open-source Calendly alternative most engineering teams reach for. ~44.6k GitHub stars, MIT licensed (the whole codebase, not a dual-license with a proprietary EE directory), and a seat-based pricing model that stays reasonable up to mid-size teams before handing you off to a custom Enterprise quote.

  - Free forever — 1 user, unlimited event types, calendar/video connections, 100+ app integrations
  - Teams: $12/seat/month (billed yearly) — round-robin, routing forms, remove branding
  - Organizations: $28/seat/month (billed yearly) — SAML SSO, SCIM, SOC 2/HIPAA/ISO 27001, sub-teams
  - Enterprise: custom pricing — dedicated database, SLA & uptime guarantees, HRIS integrations, priority support
  - Self-hosting is an MIT-licensed first-class path with no license compliance overhead
faq:
  - question: "Is Cal.com open source?"
    answer: "Yes, MIT licensed — the full codebase under one permissive license. Unlike tools that use a dual-license with a proprietary enterprise directory (e.g. PostHog, GitLab), Cal.com's MIT license lets you self-host, modify, and embed without any copyleft obligations or commercial license purchase."
  - question: "What does the free tier include?"
    answer: "One user, unlimited event types, unlimited calendar and video connections, email/SMS notifications, 100+ app integrations, and Stripe/PayPal payment collection. The single-user cap is the real limit — you can do a lot as one person before hitting it."
  - question: "How much is the cheapest paid plan?"
    answer: "Teams starts at $12/seat/month billed annually. A team of 5 is $720/year. There's a 14-day free trial, and Cal.com badges annual billing as 'Save 25%' over monthly."
  - question: "What does Organizations add over Teams?"
    answer: "Organizations ($28/seat/month) adds SAML SSO, SCIM provisioning, SOC 2 / HIPAA / ISO 27001 compliance, domain-wide delegation, unlimited sub-teams, a company subdomain, and role-based permissions. If you need any compliance certification for enterprise sales, you need Organizations or above."
  - question: "Is self-hosting a real option?"
    answer: "Yes, and it's the clearest self-hosting story in this series. MIT license means no copyleft, no commercial license requirement, no locked enterprise features. You get the full product. The tradeoff is infrastructure maintenance — but for a team that already runs its own stack, it's a straight cost calculation."
pricingTable:
  license: "MIT"
  stars: "~44.6k"
  freeTier: "1 user, unlimited event types, 100+ integrations"
  cheapestPaid: "$12/seat/month (Teams, billed annually)"
  verdict: "Self-host for free if you run your own infra; Teams tier is fair for small teams; Organizations only if you need compliance certs"
seo:
  metaTitle: "Cal.com Pricing Teardown: Scheduling Platform"
  metaDescription: "Cal.com has a real free tier for individuals, $12/seat Teams, $28/seat Organizations — and an MIT license that makes self-hosting genuinely frictionless."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

Cal.com is the open-source scheduling tool engineers reach for to avoid Calendly's pricing without building a custom booking flow. ~44.6k GitHub stars, MIT licensed, backed by a commercial cloud product with four tiers from free to custom enterprise.

The original Substack teardown covered an earlier version of the pricing. Two things changed since: the per-seat prices are now published as definite numbers, and a new Organizations tier sits between Teams and Enterprise. The star count was 23.6k then — it has nearly doubled.

- Website: [cal.com](https://cal.com)
- Pricing: [cal.com/pricing](https://cal.com/pricing)
- GitHub: [github.com/calcom/cal.com](https://github.com/calcom/cal.com)

**Plans**

- **Free:** Always free. One user. Unlimited event types, calendar and video connections, email and SMS notifications, 100+ app integrations, and payment collection via Stripe or PayPal. The single-user cap is the hard limit — everything else is unlimited.
- **Teams — $12/seat/month (billed yearly, badged "Save 25%"):** 14-day free trial. Adds round-robin scheduling, collective events, team workflows, routing forms, managed event types, and removing Cal.com branding. Fits a scheduling-heavy sales or success team.
- **Organizations — $28/seat/month (billed yearly, badged "Save 25%"):** 14-day free trial. Adds SAML SSO and SCIM provisioning, SOC 2 / HIPAA / ISO 27001 compliance, a company subdomain, domain-wide delegation, unlimited sub-teams, route-by-custom-variable, and role-based permissions. The compliance bundle is the unlock: if your buyers require SOC 2 evidence, you need this tier.
- **Enterprise — custom pricing:** Dedicated database, SLA and uptime guarantees, HRIS and directory integrations, priority support, dedicated onboarding and engineering support. Sales call required.

**The seat pricing math**

At the Teams tier, a 10-person team is $1,440/year, a 50-person team $7,200/year. That undercuts Calendly's Teams tier ($16/seat/month annual, ~$9,600/year for 50 seats) for comparable features.

Organizations at $28/seat/month pushes a 50-person team to $16,800/year. That's the compliance tax — SAML, SCIM, and the certification stack cost roughly 2.3x the base Teams rate. Worth it only if your sales process requires SOC 2 evidence or enterprise SSO. If it does, there's no alternative tier.

There's no mid-point between Organizations ($28/seat) and Enterprise (custom). The jump to a dedicated database and SLA guarantees goes straight to "talk to sales," so the pricing ceiling is opaque.

**The self-hosting case**

Cal.com's MIT license makes self-hosting structurally different from most tools in this series. MIT is permissive — run it internally, modify it, embed it in a product, distribute it, with no copyleft obligations or commercial license fees. There's no `/ee` enterprise directory under a separate proprietary license. No "self-host, but enterprise features need a license key."

The full product, including SSO and compliance tooling, ships under MIT.

So a team that already runs its own infrastructure can deploy Cal.com, configure SAML, and skip the $28/seat/month Organizations tier. The only cost is infrastructure and maintenance time. A 100-person engineering team spending a few hours on deployment and occasional upgrades should self-host. A 5-person startup with no ops capacity should take the cloud tier.

This is the most straightforward self-hosting trade-off in the series — no legal gray areas, no missing features, just infrastructure cost vs. subscription cost.

**What the free tier actually covers**

The single-user limit is real, but within it the free tier is generous. Unlimited event types means separate booking pages for discovery calls, demos, and customer check-ins without restriction. The 100+ integrations include every major calendar (Google, Outlook, Apple) and video tool (Zoom, Google Meet, Teams). Stripe and PayPal payment collection is included on the free tier — unusual, since most scheduling tools gate payments behind paid plans.

For a solo founder, consultant, or individual contributor, the free tier is a complete product. Upgrading to Teams adds people, not core functionality.

**Where the pricing story gets murky**

Platform and API pricing — embedding Cal.com scheduling in a third-party product — isn't listed. The enterprise page references an "Enterprise API" and lists "white-label" as an Enterprise feature, but publishes no per-booking or per-seat API rates. This tier targets companies building scheduling into their own products (a CRM vendor wanting a built-in booking flow). Custom quote territory.

The published rates are annual-billed: Cal.com shows Teams ($12/seat/month) and Organizations ($28/seat/month) under a "YEARLY" toggle with a "Save 25%" badge. The badge implies a higher month-to-month rate, but the page surfaces only the annual figures by default, so the monthly numbers aren't quoted here. The annual rates ($12 and $28) run throughout this teardown.

**License**

MIT, applied to the full codebase by Cal.com, Inc. Copyright 2020-present.

The simplest licensing story in this series. No dual-license, no commercial license for enterprise features, no copyleft obligations for self-hosted deployments. Fork it, modify it, ship a product on it — the only requirement is preserving the copyright notice.

The contrast with tools like PostHog or Metabase (proprietary EE directories) matters for teams with strict OSS policies, legal review, or products that embed scheduling. Cal.com clears those reviews cleanly.

**Worth paying for?**

For a single user: the free tier is a complete product. There's no reason to pay.

For a team under 20 seats that needs round-robin, routing forms, or branding removal: Teams at $12/seat/month is reasonable. The Calendly comparison holds — equivalent features at a lower price from an OSS-backed vendor.

For a team that needs SOC 2 or SSO: Organizations at $28/seat/month is the only cloud option. Self-hosting is the alternative if you have the infrastructure capacity, with no legal friction under MIT.

For teams building scheduling into a product: the white-label and API path requires a conversation. No published pricing.

Self-hosting is the sharpest differentiator here. Most tools in this series carry a self-hosting restriction — a proprietary EE directory, features behind license keys, or an AGPL clause that complicates SaaS embedding. Cal.com has none. If you have infrastructure, the cloud pricing is optional.

---




## How Cal.com pricing scales

Cal.com bills per seat, so cost rises linearly with team size — until you need SSO. SAML lives on Organizations ($28/seat), more than double Teams ($12/seat). A 25-person team pays $300/month on Teams, or $700/month once a security review demands SSO.

<figure class="my-8">
<svg viewBox="0 0 760 296" role="img" aria-label="pricing scales by seats" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="64" y1="250.0" x2="560" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="64" y1="194.0" x2="560" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$500</text><line x1="64" y1="138.0" x2="560" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,000</text><line x1="64" y1="82.0" x2="560" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,500</text><line x1="64" y1="26.0" x2="560" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$2,000</text><text x="64.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 seats</text><text x="188.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 seats</text><text x="312.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 seats</text><text x="436.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 seats</text><text x="560.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 seats</text><polyline points="64.0,248.7 188.0,243.3 312.0,236.6 436.0,216.4 560.0,182.8" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="64.0" cy="248.7" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="188.0" cy="243.3" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="312.0" cy="236.6" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="436.0" cy="216.4" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="560.0" cy="182.8" r="3.5" fill="var(--color-primary-600)"></circle><text x="568" y="186.8" fill="var(--color-primary-600)" font-size="12" font-weight="600">Teams $12/seat</text><polyline points="64.0,246.9 188.0,234.3 312.0,218.6 436.0,171.6 560.0,93.2" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2.5"></polyline><circle cx="64.0" cy="246.9" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="188.0" cy="234.3" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="312.0" cy="218.6" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="436.0" cy="171.6" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="560.0" cy="93.2" r="3.5" fill="var(--color-text-tertiary)"></circle><text x="568" y="97.2" fill="var(--color-text-tertiary)" font-size="12" font-weight="600">Orgs $28/seat (SSO)</text></svg>
<figcaption>Monthly cost as Cal.com scales by seat. The gap between the two lines is the SSO tax.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=calcom_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*
