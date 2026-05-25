---
title: "Twenty CRM Pricing Teardown"
description: "Twenty CRM at $9/user/month exposes how much of Salesforce and HubSpot pricing is brand tax."
publishedAt: "2026-04-06"
updatedAt: "2026-05-25"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "CRM"]
featured: false
draft: false
coverImage: /images/blog/twenty-crm-hero.png
tldr: |
  Twenty CRM at $9/user/month is a different pricing universe from Salesforce ($25–$165/seat) and HubSpot ($90/seat Pro). The contrast exposes how much of incumbent CRM pricing is brand tax + ecosystem lock-in, not actual software value.

  - Self-hosted Community Edition is AGPL-3.0, full-featured, no limits — you own the data.
  - Pro at $9/seat/month: unlimited records, custom objects, full API, email integration, standard support.
  - Organization at $19/seat/month: adds SAML/OIDC SSO + priority support.
  - Delta vs. HubSpot Pro for a 10-person team is $810/month — close to $10k/year for essentially the same feature set.
  - AGPL means: free for self-use, but if you build a product on top of Twenty you need a commercial license.
faq:
  - question: "Is Twenty CRM open source?"
    answer: "Yes — AGPL-3.0. The self-hosted Community Edition is the same product as the cloud, no feature gating."
  - question: "How does Twenty pricing compare to Salesforce and HubSpot?"
    answer: "Twenty Pro is $9/seat. Salesforce Starter is $25/seat (with less functionality). Salesforce Enterprise is $165/seat. HubSpot Sales Hub Professional is $90/seat. For a 10-person team that's $810/month less than HubSpot Pro for essentially the same features."
  - question: "Should I self-host Twenty CRM?"
    answer: "If you have a DevOps engineer comfortable with database backups, upgrades, and uptime — yes. If you're a sales-led team with no infra experience, $9/user/month for managed cloud is a bargain to skip the ops burden."
  - question: "Does AGPL block commercial use of Twenty?"
    answer: "Internal company use is fine. AGPL only kicks in if you build a product on top of Twenty (e.g., an industry-specific CRM) and offer it to others — then you need to open-source your product or buy a commercial license."
pricingTable:
  license: "AGPL-3.0"
  freeTier: "Self-hosted (unlimited)"
  cheapestPaid: "$9/seat (Pro)"
  verdict: "Switch from HubSpot/Salesforce when inertia is the only reason to stay"
seo:
  metaTitle: "Twenty CRM Pricing Teardown: Open Source CRM"
  metaDescription: "Twenty CRM at $9/user/month exposes how much of Salesforce and HubSpot pricing is brand tax."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

Twenty is an open-source CRM gunning directly at Salesforce and HubSpot — full contact management, custom objects, API access, email integration. It's hit ~30k GitHub stars, which for a CRM (a category dominated by entrenched incumbents) is impressive. The pitch is: same functionality, fraction of the price, you own the data.

- Website: [twenty.com](https://twenty.com)
- Pricing: [twenty.com/pricing](https://twenty.com/pricing)
- GitHub: [github.com/twentyhq/twenty](https://github.com/twentyhq/twenty)

**Plans**

- **Self-hosted (free):** Full AGPL license. Run it yourself, no limits.
- **Pro — $9/user/month:** Unlimited records, custom objects, full API access, email integration, standard support.
- **Organization — $19/user/month:** Everything in Pro + SAML/OIDC SSO, priority support.

**The contrast with Salesforce is almost comical**

Salesforce Starter is $25/user/month and doesn't include half of what Twenty's $9 plan covers. Salesforce Enterprise is $165/user/month. HubSpot Sales Hub Professional runs $90/user/month.

Twenty at $9 is not just cheaper — it's in a different pricing universe. For a 10-person sales team, the delta between HubSpot Pro and Twenty Pro is $810/month. That's close to $10k/year for essentially the same features.

The interesting question isn't why Twenty is cheaper. It's why incumbents charge so much for a CRM, a product category that's been solved for 20 years. Twenty's pricing exposes how much of Salesforce/HubSpot's cost is brand tax, ecosystem lock-in, and support overhead — not actual software value.

**AGPL: the double-edged sword**

Self-hosting is free — but AGPL comes with strings. If you modify Twenty and offer it as a service to others, you must open-source your modifications. For most companies using it internally, this doesn't matter at all. But if you're building a product on top of Twenty (say, an industry-specific CRM), you either have to open-source your product or pay for a commercial license.

AGPL is intentional. It's the standard play for commercial open source: free for self-use, but building on top requires a conversation (and probably a contract).

**The ops burden question**

The Pro cloud tier is $9/user/month. The self-hosted tier is free. For a 10-person team, that's $90/month you're paying to not deal with database maintenance, upgrades, backups, and uptime.

Whether $90/month is worth avoiding that ops burden depends entirely on your team. A startup with a DevOps engineer: probably self-host. A sales-led team with no infra experience: the $90/month is a bargain.

The pricing works because the self-hosted option is genuinely competitive — it's not crippled. Twenty is betting on most teams being bad at ops, which is statistically correct.

**License**

AGPL v3. Completely free to self-host and use internally. If you're distributing or running a service built on Twenty, you need to open-source your code or negotiate a commercial license with the team.

**Worth paying for?**

At $9/user/month, this is one of the better deals in B2B software. If your team is already using Salesforce or HubSpot and the only reason you haven't switched is inertia, Twenty is worth a serious look. The self-hosted option is free and full-featured — pay only when you want someone else to run it.

---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=twenty-crm_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*

_Last verified 2026-05-25._
