---
title: "Novu Pricing Teardown"
description: "Novu's free tier has 24-hour log retention, making it a dev environment, not a production one."
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "notifications"]
featured: false
draft: true
seo:
  metaTitle: "Novu Pricing Teardown: Notification Infra"
  metaDescription: "Novu's free tier has 24-hour log retention, making it a dev environment, not a production one."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

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

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=novu_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*
