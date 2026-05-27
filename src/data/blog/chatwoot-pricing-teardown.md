---
title: "Chatwoot Pricing Teardown 2026"
description: "Chatwoot is MIT-licensed for almost everything — except the enterprise directory, which ships under a separate commercial license and requires a paid subscription to run in production."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "customer support"]
featured: false
draft: false
coverImage: "/images/blog/chatwoot-pricing-cover.jpeg"
tldr: |
  Chatwoot is the open-source shared inbox most support teams reach for when they want out of Intercom pricing. ~29.7k GitHub stars, MIT for most of the codebase — but the `enterprise/` directory ships under a separate source-available commercial license that requires a paid subscription to run in production. The pricing is per-agent/month with four cloud tiers, plus a self-hosted path that mirrors the same tiers. Captain AI ships credit bundles into Startups and above.

  - Hacker (free forever) — 2 agents max, 500 conversations/month, 30-day data retention, no Captain AI
  - Startups — $19/agent/month (annual), unlimited conversations, 300 Captain AI credits/month
  - Business — $39/agent/month (annual), 500 Captain AI credits/month, teams + automations
  - Enterprise — $99/agent/month (annual), SSO/SAML, audit logs, video/voice support, 800 Captain AI credits/month
  - Captain AI overages: $20 per 1,000 credits beyond your plan's monthly allowance
  - MIT core + separate commercial EE license — the enterprise directory is source-available but not open source
faq:
  - question: "Is Chatwoot open source?"
    answer: "Most of it is MIT. The `enterprise/` directory ships under a separate commercial license — source-available, but production use requires a paid subscription and active agreement with Chatwoot Inc. The MIT core covers most of the product; SSO, audit logs, agent capacity management, and custom branding sit in the enterprise directory. Captain AI is gated to paid tiers, not bundled with the free Community edition."
  - question: "What does the free tier actually give you?"
    answer: "2 agents, 500 conversations per month, 30-day data retention, live chat only (no email, social, or messaging channels). No Captain AI credits. Usable for a very small team testing the product; not usable for a real support operation."
  - question: "How much is the cheapest paid plan?"
    answer: "Startups at $19/agent/month billed annually. A 5-person support team pays $95/month. Includes unlimited conversations, all channels (email, social, WhatsApp, Telegram, SMS, TikTok, Facebook, Instagram), 1-year data retention, and 300 Captain AI credits per month."
  - question: "What is Captain AI and how does the credit system work?"
    answer: "Captain is Chatwoot's AI layer — an AI assistant that handles initial inquiries from a help center/FAQ knowledge base, a co-pilot that suggests responses to human agents, smart FAQ gap detection, and conversation memory across sessions. Plans include a monthly credit bundle (300 on Startups, 500 on Business, 800 on Enterprise). Overages cost $20 per 1,000 additional credits."
  - question: "Does self-hosted Chatwoot cost the same as cloud?"
    answer: "The Community edition is free to self-host with no seat limits, but it has no Captain AI, voice calls, custom branding, agent capacity, roles/permissions, SSO/SAML, or SLA. Self-hosted also offers two paid tiers: Premium Support at $19/agent/month (adds Captain AI, voice, branding, agent capacity, roles/permissions, priority support) and Enterprise at $99/agent/month (adds SSO/SAML and SLA) — the same headline prices as the equivalent cloud plans. You're paying for the license and support, not the hosting."
pricingTable:
  license: "MIT (core), commercial source-available (enterprise/ directory)"
  stars: "~29.7k"
  freeTier: "2 agents, 500 conversations/month, 30-day retention, live chat only"
  cheapestPaid: "$19/agent/month (Startups, annual billing)"
  verdict: "Strong MIT core for teams under 20 agents; enterprise features cost the same whether cloud or self-hosted"
seo:
  metaTitle: "Chatwoot Pricing Teardown: Open-Source Customer Support"
  metaDescription: "Chatwoot is MIT for almost everything except the enterprise directory, which needs a separate commercial license to run in production."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

Chatwoot is the open-source alternative to Intercom, Zendesk, and Salesforce Service Cloud — a shared inbox for live chat, email, social, and messaging from one interface. ~29.7k GitHub stars: meaningfully adopted, not just starred. The latest release (v4.14.0, May 2026) ships the Captain AI agent as a first-class feature.

- Website: [chatwoot.com](https://www.chatwoot.com)
- Pricing: [chatwoot.com/pricing](https://www.chatwoot.com/pricing)
- GitHub: [github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)

**Plans**

- **Hacker — free:** 2 agents, 500 conversations/month, 30-day data retention, live chat only. No Captain AI. No email or social channels.
- **Startups — $19/agent/month (annual):** Unlimited conversations, all channels, 1-year data retention, 300 Captain AI credits/month, live chat and priority email support.
- **Business — $39/agent/month (annual):** Everything in Startups plus teams, automation rules, custom attributes, pre-chat forms, campaigns, 500 Captain AI credits/month, 2-year data retention.
- **Enterprise — $99/agent/month (annual):** SSO/SAML, audit logs, agent capacity management, video and voice support (20+ agents), dedicated account manager (20+ agents), 800 Captain AI credits/month, 3-year data retention.

Self-hosted Community is free with the MIT core and no agent cap. Two paid self-hosted tiers mirror the cloud headline prices: Premium Support at $19/agent/month (adds Captain AI, voice calls, custom branding, agent capacity, roles/permissions, priority support) and Enterprise at $99/agent/month (adds SSO/SAML and SLA). You buy the license and support, not the infrastructure.

**The free tier is narrow**

500 conversations per month is about 17 a day. Live chat only — no email routing, no WhatsApp, no social. The 2-agent cap makes it a solo or duo test environment, not a tier.

Intercom and Zendesk restrict their free tiers similarly. Hacker exists to evaluate the product, not run support on it. Past a couple hundred conversations a day, you're on Startups at minimum.

**Captain AI: the credit question**

Captain is four things: an AI assistant that handles initial inquiries from your help center and past conversations, a co-pilot that drafts responses for human agents, FAQ gap detection, and conversation memory. The co-pilot is the reason most teams will consider it.

Each paid plan includes a monthly credit bundle — 300 on Startups, 500 on Business, 800 on Enterprise. Overages run $20 per 1,000 credits. Chatwoot doesn't publish a per-interaction credit cost, so you can't model your bill in advance without usage data. This is the murkiest part of the pricing.

Captain is included in every paid tier, not a separate add-on. Intercom's Fin AI bills per resolution on top of seat costs — a meaningful structural difference.

**The per-seat math**

Seat-based pricing is straightforward to model. A 10-person support team:

- Startups: $190/month (annual)
- Business: $390/month (annual)
- Enterprise: $990/month (annual)

Startups to Business is $200/month for 10 seats. You buy teams (routing by skill or shift), automation rules, custom attributes, and pre-chat forms. Past basic volume, automations alone justify it.

Business to Enterprise is $600/month for 10 seats. The gated items are SSO/SAML and audit logs — compliance requirements at enterprise companies, not nice-to-haves. If IT security requires centralized identity, you pay Enterprise whether you want the rest of the tier or not.

**MIT core vs. commercial EE: the actual split**

This is the part that matters for self-hosted teams.

Chatwoot's LICENSE file is MIT for the main codebase. The carve-out: everything under the `enterprise/` directory ships under a separate `enterprise/LICENSE` — commercial and source-available, not open source. Production use requires a valid enterprise subscription and active agreement with Chatwoot Inc. Modification for development and testing is allowed; production modification is not without a subscription. Chatwoot retains IP rights on modifications.

In practice: SSO/SAML, audit logs, agent capacity management, and custom branding live in the enterprise directory. The MIT core covers all channels, automations, help center, custom attributes, and reporting. Captain AI is gated separately — it ships with cloud paid tiers and self-hosted Premium Support and above, not with the free Community edition. Most teams self-hosting for cost reasons never hit the enterprise directory.

This dual-license pattern — MIT core plus commercial EE directory — is common across OSS SaaS: PostHog, GitLab, and Metabase all use variants. The practical risk is accidental production use of enterprise code. The full Docker image includes the enterprise code; if your install exposes an SSO login page, you're running enterprise code and should have a subscription. Most teams don't worry about this unless they're large enough for a lawyer to notice — but it's worth knowing what you run.

**License**

MIT for the main codebase, including most product features and all channels. The `enterprise/` directory ships under a separate commercial source-available license — production use requires a Chatwoot Enterprise subscription. Self-hosted Community (MIT only) is genuinely free with no agent limit; self-hosted Enterprise costs the same $99/agent/month as cloud Enterprise.

The MIT core is wide enough that most support teams never touch the enterprise directory. The commercial license matters only when you need SSO, audit logs, or agent capacity management.

**Worth paying for?**

Replacing Intercom or Zendesk Suite — both materially higher per-seat before AI add-ons — Chatwoot Startups at $19/seat is a significant cost cut. Channel support is comparable: email, WhatsApp, Facebook, Instagram, Telegram, SMS, TikTok, API. Captain AI credits ship in every paid tier; Intercom's Fin AI charges per resolution on top of seat costs.

The free Hacker tier is not a real option for production support. Past a few hundred conversations a day, the choice is Startups vs. Business, not free vs. paid.

Self-hosted Community is the strongest free option in the category — no agent cap, full MIT core, production-ready. The trade: you own the infrastructure and get no Captain AI, which on self-hosted starts at Premium Support ($19/agent/month).

Enterprise at $99/seat fits compliance-driven buyers who need SSO and audit logs. The Business-to-Enterprise gap is real, but if IT controls identity providers, you were never staying on Business.

---


## How Chatwoot pricing scales

Chatwoot bills per agent. The Startups tier ($19/agent) scales cheaply, but SSO/SAML only appears on Enterprise ($99/agent) — a 5× jump per seat for the same headcount.

<figure class="my-8">
<svg viewBox="0 0 760 296" role="img" aria-label="pricing scales by agents" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="64" y1="250.0" x2="560" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="64" y1="194.0" x2="560" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,250</text><line x1="64" y1="138.0" x2="560" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$2,500</text><line x1="64" y1="82.0" x2="560" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$3,750</text><line x1="64" y1="26.0" x2="560" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="56" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$5,000</text><text x="64.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 agents</text><text x="188.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 agents</text><text x="312.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 agents</text><text x="436.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 agents</text><text x="560.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 agents</text><polyline points="64.0,249.1 188.0,245.7 312.0,241.5 436.0,228.7 560.0,207.4" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="64.0" cy="249.1" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="188.0" cy="245.7" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="312.0" cy="241.5" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="436.0" cy="228.7" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="560.0" cy="207.4" r="3.5" fill="var(--color-primary-600)"></circle><text x="568" y="211.4" fill="var(--color-primary-600)" font-size="12" font-weight="600">Startups $19/agent</text><polyline points="64.0,245.6 188.0,227.8 312.0,205.6 436.0,139.1 560.0,28.2" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2.5"></polyline><circle cx="64.0" cy="245.6" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="188.0" cy="227.8" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="312.0" cy="205.6" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="436.0" cy="139.1" r="3.5" fill="var(--color-text-tertiary)"></circle><circle cx="560.0" cy="28.2" r="3.5" fill="var(--color-text-tertiary)"></circle><text x="568" y="32.2" fill="var(--color-text-tertiary)" font-size="12" font-weight="600">Enterprise $99/agent (SSO)</text></svg>
<figcaption>Monthly cost as Chatwoot scales by agent. SSO forces the Enterprise tier at 5× the per-agent rate.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
