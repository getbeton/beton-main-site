---
title: "PostHog Pricing Teardown 2026"
description: "PostHog meters 13 products separately, with 1M free events a month and identified-event overages from $0.000198 down to $0.0000010 at scale."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "product analytics"]
featured: false
draft: false
coverImage: "/images/blog/posthog-pricing-cover.jpeg"
tldr: |
  PostHog started as a product analytics tool and is now 13 products on one bill. ~34.7k GitHub stars, MIT core with a proprietary EE directory, and a per-event price that dropped since the original teardown. The free tier covers 1M events, 5K replays, 1.5K survey responses, error tracking, AI observability, and logs before you pay anything.

  - Free forever covers 13 product lines — analytics, replays, feature flags, surveys, error tracking, data warehouse, pipelines, AI observability, logs, workflows, and more
  - Pay-as-you-go starts at $0/month with a credit card; first 1M events each month stay free
  - Identified-event overages start at $0.000198/event (the 1M–2M tier) and fall to $0.0000010 above 250M; the first 1M events each month are free
  - Session replay free tier dropped from 15K to 5K recordings — the one free tier that got worse
  - Platform add-ons (Boost $250/mo, Scale $750/mo, Enterprise $2,000/mo) gate team-size features like SSO, RBAC, and SLAs
faq:
  - question: "Is PostHog open source?"
    answer: "MIT for most of the codebase. The `ee` directory (enterprise edition features) carries a separate proprietary license. PostHog maintains a `posthog-foss` companion repo that strips all proprietary code for fully FOSS-compliant self-hosting."
  - question: "What does the free tier actually include?"
    answer: "1M product analytics events, 5K session recordings, 1M feature flag requests, 1.5K survey responses, 100K error tracking exceptions, 1M data warehouse rows, 100K AI observability events, 50 GB logs, and 2K PostHog AI credits — all monthly, all free."
  - question: "How much does the cheapest paid plan cost?"
    answer: "Technically $0 — Pay-as-You-Go starts at $0/month once you add a credit card; you pay only for usage above the free tier. The first 1M identified events each month are free, and the next 1M (the 1M–2M tier) bills at $0.000198/event — so 2M events/month works out to about $198."
  - question: "What do the platform add-ons unlock?"
    answer: "Boost ($250/mo), Scale ($750/mo), and Enterprise ($2,000/mo) gate team-oriented features — SSO, advanced RBAC, priority support, SLAs. The specifics aren't fully enumerated on the pricing page; you need to compare tiers directly or contact sales."
  - question: "How does PostHog pricing compare to Amplitude or Mixpanel?"
    answer: "PostHog is cheaper per event at volume, and the free tier is more generous than Mixpanel's. The key difference is that PostHog bundles session replay, feature flags, surveys, and error tracking in the same account — you're not buying separate tools."
pricingTable:
  license: "MIT (core), proprietary (EE directory)"
  stars: "~34.7k"
  freeTier: "1M events, 5K replays, 1M flag requests, 1.5K survey responses, plus 9 other product free tiers"
  cheapestPaid: "$0/mo (pay-as-you-go above free tier); first 1M events stay free each month"
  verdict: "Free for small products; economical for mid-size; gets expensive fast above 15M events/month"
seo:
  metaTitle: "PostHog Pricing Teardown: 13 Products, One Bill"
  metaDescription: "PostHog meters 13 products separately, with 1M free events a month and identified-event overages from $0.000198 down to $0.0000010 at scale."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

PostHog launched as a product analytics alternative to Mixpanel. It's now 13 products on one bill: analytics, session replay, feature flags, A/B testing, surveys, error tracking, a data warehouse, data pipelines, AI observability, logs, workflows, and a PostHog AI assistant. ~34.7k GitHub stars. We use it at Beton for product analytics — PostHog events are the raw material Beton's PQL scoring runs on.

- Website: [posthog.com](https://posthog.com)
- Pricing: [posthog.com/pricing](https://posthog.com/pricing)
- GitHub: [github.com/PostHog/posthog](https://github.com/PostHog/posthog)

**Plans**

- **Free:** No credit card. 1 project, 1-year data retention, unlimited team members, community support. Full free-tier allowances across all 13 product lines (see below).
- **Pay-as-You-Go — from $0/month:** Credit card required for overages. Upgrades to 6 projects and 7-year data retention. Email support. Same monthly free allowances as Free; you pay only for usage above them.
- **Platform Add-Ons:** Boost ($250/mo), Scale ($750/mo), Enterprise ($2,000/mo). These gate SSO, RBAC, SLAs, and higher-touch support. Unlike most SaaS vendors, PostHog doesn't force you into a named annual tier — the add-ons are incremental.

**Free-tier allowances across all products**

The 2026 free tier is broader than the original teardown described. Per month:

- Product Analytics: 1M events
- Session Replay (standard): 5K recordings
- Session Replay (mobile): 2.5K recordings
- Feature Flags: 1M requests
- Surveys: 1,500 responses
- Error Tracking: 100K exceptions
- Data Warehouse: 1M rows + unlimited historical syncs
- Data Pipelines: 10K events, 1M rows
- AI Observability: 100K events
- PostHog AI: 2K credits (~$20 value)
- Workflows: 10K messages per channel
- Logs: 50 GB ingested
- Web Analytics: bundled with Product Analytics

For a product with a few thousand monthly active users, this is a real free tier, not a demo.

**The event pricing**

Product analytics meters *identified* events (anonymous events are cheaper). The first 1M events each month are free; above that, the per-event rate drops steeply by volume tier:

- First 1M events/mo: free
- 1M–2M: $0.0001980/event
- 2M–15M: $0.0000697/event
- 15M–50M: $0.0000360/event
- 50M–100M: $0.0000146/event
- 100M–250M: $0.0000037/event
- 250M+: $0.0000010/event

The marginal rate falls roughly 200x between the first paid band and the 250M+ band. PostHog gets cheap on analytics volume at scale to drive adoption of the higher-margin adjacent products — replays, surveys, pipelines.

A product doing 2M identified events/month pays for the 1M above the free tier at $0.000198 — about **$198/month**. PostHog's pricing calculator puts **51M identified events/month at ~$3,934/month** for product analytics alone. Group-analytics events bill separately, starting around $0.000071/event.

**The free tier that got worse**

Session replay went from 15K free recordings/month (per the original teardown) to 5K — a 66% cut. Analytics and feature flags stayed flat or expanded; replay was the trade.

The economics explain it. Storing and serving video recordings costs more per unit than counting analytics events. 5K free recordings still covers a product in early traction, but the allowance dropped.

**How the 13-product model actually bills**

Each product meters independently. Separate free-tier buckets, and overages on one product don't affect another. You can set billing limits per product to cap spend and prevent surprise invoices.

So a team that uses analytics heavily but rarely uses surveys never overpays for surveys. The bundling is additive, not averaging — you pay for what you use, not for what's available.

The downside is complexity. Thirteen billing meters is a lot to track. PostHog's usage dashboard handles it, but modeling your bill in a spreadsheet means knowing your volumes across every dimension, not just events.

**License**

MIT for the main codebase. The `ee` directory — enterprise features — ships under a separate proprietary license. PostHog maintains `posthog-foss`, a FOSS-compliant build that strips the EE directory. Self-hosters who want pure open source use `posthog-foss`; everyone else uses the main build, where enterprise features stay locked until a license key unlocks them.

A common dual-license pattern (Gitlab and Metabase run variations). Most self-hosted teams use the main build and never touch the EE code. It only matters under a strict OSS policy.

**Worth paying for?**

The free tier is the most generous in this series. Thirteen products, usage limits, no time restriction. For an early-stage product, PostHog free beats any paid analytics tool.

Pay-as-you-go makes sense once you have product-market fit and want 7-year retention, multiple projects, and email support. A product at 2M identified events/month pays about $198/month for analytics.

The math turns harder at scale. PostHog's calculator puts 51M identified events/month at ~$3,934/month for analytics alone, and session replay — metered separately, per recording — can dwarf analytics costs for a high-traffic consumer app. Still cheaper than Amplitude or Mixpanel at equivalent scale, but not trivial. Model your volumes in PostHog's calculator before committing.

The add-on cliff is real. SSO or an SLA jumps you from $0 to $250–$2,000/month. The pricing page doesn't enumerate the feature boundaries, so you can't tell when you'd need Scale vs. Boost without a sales call.

Beton integrates with PostHog directly — [PostHog → Beton](https://getbeton.ai/integrations/posthog?utm_source=learninglate&utm_campaign=posthog_teardown&utm_medium=blog) turns product events into PQL signals.

---


## How PostHog pricing scales

PostHog meters identified events, and the marginal rate drops ~200× as volume climbs — the first paid million costs $0.000198/event, the band above 250M just $0.0000010. Heavy usage gets progressively cheaper per event.

<figure class="my-8">
<svg viewBox="0 0 570 190" role="img" aria-label="marginal rate by volume" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="13">1M–2M</text><rect x="130" y="10" width="330" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="468" y="24" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$0.000198</text><text x="0" y="54" fill="var(--color-text)" font-size="13">2M–15M</text><rect x="130" y="40" width="265" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="403" y="54" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$0.0000697</text><text x="0" y="84" fill="var(--color-text)" font-size="13">15M–50M</text><rect x="130" y="70" width="224" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="362" y="84" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$0.0000360</text><text x="0" y="114" fill="var(--color-text)" font-size="13">50M–100M</text><rect x="130" y="100" width="167" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="305" y="114" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$0.0000146</text><text x="0" y="144" fill="var(--color-text)" font-size="13">100M–250M</text><rect x="130" y="130" width="82" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="220" y="144" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$0.0000037</text><text x="0" y="174" fill="var(--color-text)" font-size="13">>250M</text><rect x="130" y="160" width="3" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="141" y="174" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$0.0000010</text></svg>
<figcaption>PostHog's marginal per-event rate by monthly volume tier (log scale). First 1M events free.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=posthog_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*
