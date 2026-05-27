---
title: "Twenty CRM Pricing Teardown 2026"
description: "Twenty CRM at $9/user/month exposes how much of Salesforce and HubSpot pricing is brand tax."
publishedAt: "2026-04-06"
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

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

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


## How Twenty CRM pricing scales

Twenty bills per seat and treats SSO as nearly table stakes — Organization ($19/seat) is only ~2× Pro ($9/seat), versus the 3–5× jumps elsewhere in this series.

<figure class="my-8">
<svg viewBox="0 0 760 296" role="img" aria-label="pricing scales by seats" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="64" y1="250.0" x2="560" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="64" y1="194.0" x2="560" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$250</text><line x1="64" y1="138.0" x2="560" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$500</text><line x1="64" y1="82.0" x2="560" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$750</text><line x1="64" y1="26.0" x2="560" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,000</text><text x="64.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 seats</text><text x="188.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 seats</text><text x="312.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 seats</text><text x="436.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 seats</text><text x="560.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 seats</text><polyline points="64.0,248.0 188.0,239.9 312.0,229.8 436.0,199.6 560.0,149.2" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="64.0" cy="248.0" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="188.0" cy="239.9" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="312.0" cy="229.8" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="436.0" cy="199.6" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="560.0" cy="149.2" r="3.5" fill="var(--color-primary-600)"></circle><text x="568" y="153.2" fill="var(--color-primary-600)" font-size="12" font-weight="600">Pro $9/seat</text><polyline points="64.0,245.7 188.0,228.7 312.0,207.4 436.0,143.6 560.0,37.2" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2.5"></polyline><circle cx="64.0" cy="245.7" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="188.0" cy="228.7" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="312.0" cy="207.4" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="436.0" cy="143.6" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="560.0" cy="37.2" r="3.5" fill="var(--color-text-tertiary)"></circle><text x="568" y="41.2" fill="var(--color-text-tertiary)" font-size="12" font-weight="600">Organization $19/seat (SSO)</text></svg>
<figcaption>Monthly cost as Twenty scales by seat. The SSO tier is only ~2× — cheap by this series' standards.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
