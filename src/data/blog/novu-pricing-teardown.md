---
title: "Novu Pricing Teardown 2026"
description: "Novu's free tier has 24-hour log retention, making it a dev environment, not a production one."
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "notifications"]
featured: false
draft: true
tldr: |
  Novu is open-source notification infrastructure — ~36k GitHub stars, MIT-licensed, unifying email, SMS, push, in-app, and chat behind a single API. Free covers 10k workflow runs/month but only 24-hour activity retention, which makes it a dev environment, not a production one.

  - Billing unit is "workflow runs," not messages — captures orchestration usage, not just delivery
  - Free at $0 covers 10k runs/month, 2 environments, 3 team members, 24-hour retention
  - Pro at $30/month is mostly a retention unlock (7 days), not a volume unlock
  - Team at $250/month adds RBAC, 10 environments, 90-day retention, unlimited members — a steep jump from Pro
  - MIT license means full self-hosting is on the table for teams that want to own the infra
faq:
  - question: "Is Novu open source?"
    answer: "Yes, MIT-licensed. The full product is on GitHub at github.com/novuhq/novu with no license restrictions for commercial use, so self-hosting is a real option for teams in fintech or healthcare that need full ownership."
  - question: "What does Novu charge for and how is usage measured?"
    answer: "Novu bills per workflow run, not per message sent. A single trigger event passing through your workflow logic counts as one run, regardless of how many channels it fans out to."
  - question: "What's the cheapest paid Novu plan?"
    answer: "Pro starts at $30/month. It bumps you to 30,000+ workflow runs, extends retention to 7 days, and removes Novu branding."
  - question: "Why is the free tier not usable in production?"
    answer: "Activity log retention is capped at 24 hours. If a notification fails on Thursday, the logs are gone by Friday — there's no way to debug production incidents past a one-day window."
  - question: "Does Novu replace SendGrid and Twilio?"
    answer: "No. Novu is the orchestration layer, not the delivery layer. You still need SendGrid or Postmark for email and Twilio for SMS; Novu sits on top and gives you a unified API across them."
pricingTable:
  license: "MIT"
  stars: "~36k"
  freeTier: "10k runs/mo"
  cheapestPaid: "$30/mo (Pro)"
  verdict: "Pro the moment you're in production"
seo:
  metaTitle: "Novu Pricing Teardown: Notification Infra"
  metaDescription: "Novu's free tier has 24-hour log retention, making it a dev environment, not a production one."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

Novu is open-source notification infrastructure — a unified API for sending email, SMS, push notifications, in-app notifications, and chat messages from a single platform. ~36k GitHub stars. The problem it solves: every growing product eventually builds a notification system, then rebuilds it, then rebuilds it again. Novu is the "just use this" answer instead of duct-taping together SendGrid, Twilio, and a custom in-app notification table.

- Website: [novu.co](https://novu.co)
- Pricing: [novu.co/pricing](https://novu.co/pricing)
- GitHub: [github.com/novuhq/novu](https://github.com/novuhq/novu)

**Plans**

- **Free — $0:** 10,000 workflow runs/month, all channels, 2 environments, 3 team members, 24-hour activity retention.
- **Pro — from $30/month:** 30,000+ runs, 7-day retention, Novu branding removed.
- **Team — from $250/month:** 250,000+ runs, 10 environments, unlimited team members, RBAC, 90-day retention.
- **Enterprise:** Custom, 10M+ runs, unlimited environments.

**"Workflow runs" as the billing unit**

Most notification platforms bill per message sent. Novu bills per workflow run — a single trigger event that passes through your workflow logic (filter → decide channel → deliver → track delivery → handle failures).

This is actually a smarter billing metric. One "send a password reset email" notification might be a single workflow run. One "send a weekly digest" notification that evaluates 10,000 user preferences and sends 7,000 emails triggers 10,000 workflow runs.

The billing unit captures your usage of the orchestration layer, not just the delivery. If your workflows are simple (trigger → send), workflow runs ≈ messages sent. If your workflows are complex (trigger → evaluate → branch → retry → track), the multiplier grows.

For most use cases, this is more predictable than per-message billing because you control the complexity of your workflows. But it means you need to actually think about how Novu counts runs before you estimate costs.

**24-hour retention on free is essentially non-functional for production**

The free tier's 24-hour activity log retention is the single biggest friction point. If something breaks in production on a Friday night, you have until Saturday night to debug it. Your notification that failed on Thursday? Gone.

This isn't accidental. It's the conversion mechanic. Retention is cheap to provide (it's disk space), but it's psychologically painful to lose. The moment you're shipping notifications to real users, 24-hour logs feel dangerously short. Pro's 7-day retention is the minimum viable retention for production ops.

The move from free to Pro ($30/month) is primarily a retention unlock, not a volume unlock. 10k vs 30k runs is fine for most small apps; losing your logs after 24 hours is not.

**The 3-member cap on free**

Free tier caps at 3 team members. If you have a 4-person team, you're at Pro. It's a soft lock — the retention issue would probably push you there anyway, but the member cap ensures you can't linger on free as you grow.

Team at $250/month is a big jump from Pro ($30/month). The delta buys you RBAC, 10 environments (instead of 2), 90-day retention, and unlimited members. For a SaaS company where engineering + growth + ops all touch notification workflows, RBAC and multiple environments are legitimate needs. But the pricing cliff is steep.

**The multi-channel value proposition**

Novu's real pitch isn't any single channel — it's the unified API across all channels. If you're already using SendGrid for email and Twilio for SMS, you have two billing relationships, two integration points, two places for things to break. Novu wraps all of that in one abstraction layer.

The catch: Novu doesn't provide the actual sending infrastructure. You still need SendGrid or Postmark for email delivery, Twilio for SMS. Novu is the orchestration layer, not the delivery layer. For teams that don't realize this upfront, the architecture can feel like more complexity, not less.

**License**

MIT. Full self-hosting capability, no license restrictions for commercial use. For teams that want full ownership of their notification infrastructure (common in fintech, healthcare), self-hosted Novu is a real option.

**Worth paying for?**

Pro at $30/month is worth it the moment you're in production — purely for the retention upgrade. Free tier's 24-hour logs make it a development environment, not a production one. The unified multi-channel orchestration is genuine value if you're managing more than one notification channel. Team tier at $250 is a significant step; justify it when you actually hit the team size or environment limits.

---


## How Novu pricing scales

Novu's Free tier covers 10k runs; Pro ($30) is mostly a retention unlock, and Team ($250) is a steep jump for RBAC and longer retention.

<figure class="my-8">
<svg viewBox="0 0 560 100" role="img" aria-label="pricing tiers" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">Free</text><rect x="150" y="10" width="2" height="18" fill="var(--color-text-tertiary)" rx="1"></rect><text x="160" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$0 (10k runs)</text><text x="0" y="54" fill="var(--color-text)" font-size="14">Pro</text><rect x="150" y="40" width="38" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="196" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$30/mo</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Team</text><rect x="150" y="70" width="320" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="478" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$250/mo</text></svg>
<figcaption>Novu pricing by tier. The Pro→Team jump is steep for what's mostly RBAC + retention.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=novu_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*
