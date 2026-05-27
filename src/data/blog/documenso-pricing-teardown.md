---
title: "Documenso Pricing Teardown 2026"
description: "Documenso has 12.7k GitHub stars, AGPL-3.0 licensing, and a $250/month Platform tier that quietly bets on DocuSign's per-envelope pricing being the competitor's biggest weakness. Here's how it actually works."
publishedAt: "2026-04-28"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "e-signature"]
featured: false
draft: false
coverImage: "/images/blog/documenso-pricing-cover.png"
tldr: |
  Documenso is the open-source DocuSign alternative — 12.7k stars, AGPL-3.0 licensed, hosted from $0 to $250/month. The actual product you're paying for at the $250 Platform tier is permission to embed under a non-AGPL license, not features.

  - Free forever for low-volume users (5 docs/month, no watermark, no card required)
  - Teams at $40/month is the SMB sweet spot — a 20-person company at $160/mo lands well under DocuSign's equivalent
  - Platform at $250/month flat is the AGPL escape hatch for embedded or white-labeled use
  - Vs. DocuSign per-envelope billing, Documenso wins big at scale (e.g., $250 vs. $25,000+/mo at 50k signs)
  - Self-host for internal use only — AGPL still applies if you embed Documenso into a SaaS you sell
faq:
  - question: "Is Documenso open source?"
    answer: "Yes, AGPL-3.0. The full product — UI, API, document workflow, audit trail — ships under AGPL on GitHub. Self-hosting is supported via Docker compose and a Helm chart."
  - question: "What's the cheapest paid Documenso plan?"
    answer: "$25/month effective on Individual ($300/year prepay), or $40/month effective on Teams ($480/year, 5 users included plus $8/user beyond)."
  - question: "Does AGPL allow embedding Documenso into a commercial product?"
    answer: "No. AGPL requires you to release any product that links to Documenso under AGPL too. Embedded or white-labeled use requires the $250/month Platform plan or a self-hosted Enterprise commercial license."
  - question: "When does Documenso beat DocuSign on price?"
    answer: "Documenso Platform is $250/month flat for unlimited envelopes; DocuSign charges roughly $0.50–$2 per envelope. The break-even is around 250–500 signatures/month — beyond that Documenso wins, and the gap widens fast at scale."
pricingTable:
  license: "AGPL-3.0"
  freeTier: "5 docs/mo"
  cheapestPaid: "$25/mo (Individual)"
  verdict: "Teams for SMB, Platform for embedders"
seo:
  metaTitle: "Documenso Pricing Teardown — AGPL-3.0 DocuSign Alternative"
  metaDescription: "Documenso is a 12.7k-star DocuSign alternative. Free, $25 Individual, $40 Teams, $250 Platform — and AGPL-3.0 does all the heavy lifting."
---

Hey, it's [Vlad](https://www.linkedin.com/in/vlad-nadymov/), founder of Beton.

Documenso bills itself as "the open source DocuSign alternative." 12.7k stars on GitHub, AGPL-3.0 licensed, hosted product from $0 to $250/month across four tiers. The most interesting thing about it isn't the prices — it's what AGPL-3.0 does to the buying decision.

*This post is a part of [series on commercial open source software pricing](https://learninglate.substack.com/p/pricing-the-commercial-open-source-software).*

## What is Documenso

Open source e-signature. You upload a PDF, drag signature fields onto it, send it, recipients sign, you get a sealed PDF with an audit trail. Same loop as DocuSign, Dropbox Sign, Adobe Sign, PandaDoc — but the source is on GitHub.

- Website: [documenso.com](https://documenso.com)
- Pricing: [documenso.com/pricing](https://documenso.com/pricing)
- GitHub: [github.com/documenso/documenso](https://github.com/documenso/documenso) — **12.7k stars**
- License: AGPL-3.0 (this matters — see below)

For context: DocuSign does ~$3B/year at a $15B+ market cap. Dropbox Sign and Adobe Sign carve up most of the rest. Documenso is the open source insurgent — not at scale yet, but the only credible "we run the source ourselves" option in the category. Even Google Docs has launched their own e-sign in a "make your complements free" defensive move.

## The AGPL-3.0 gate

The license does most of the work the sales team would otherwise have to do.

AGPL-3.0 is the most aggressive permissive-adjacent OSS license in widespread use. It's GPL with one extra clause: if you run AGPL software over a network and let users interact with it, you must release your modified source to those users. Fork Documenso, host it, let your customers sign through your product, and **you have to release whatever you built around it under AGPL too**.

Self-hosting an internal company instance? Fine — your "users" are employees, and the source is already public. Embedding Documenso into a SaaS you sell to others? Not fine — your product becomes a "derivative work" the moment it links to Documenso's, and most commercial codebases cannot ship AGPL-derived code without becoming legally encumbered.

This is why the **Platform plan exists at $250/month**. It's not a feature tier — it's the AGPL escape hatch. White-labeling, embedded signing, unlimited API are real features, but the actual thing you're paying $250/month for is permission.

DocuSign and Dropbox Sign extract revenue through per-envelope pricing. Documenso extracts it through licensing. Same destination, different road.

## Pricing structure

**Hosted plans:**

- **Free — $0/month.** 5 documents/month, up to 10 recipients per doc, no credit card. Free forever, not a trial.
- **Individual — $30/month** ($300/year, effectively $25/mo annual). Unlimited documents, API access for personal use, email support.
- **Teams — $48/month** ($480/year, effectively $40/mo annual). 5 included users + $8/mo per additional user. Unlimited documents, embedded signing, API access for automation.
- **Platform — $300/month** ($3,000/year, effectively $250/mo annual). Unlimited users, documents, API. Embedded signing with white-label, Slack support. **This is the AGPL commercial license tier.**
- **Enterprise — talk to sales.** Cloud or self-hosted, advanced compliance, tailored support.

**Self-hosted:**

- **Community Edition (free, AGPL-3.0).** Unlimited signatures, no envelope cap, full feature parity for internal use. The catch is you take on AGPL's obligations.
- **Enterprise (self-hosted).** Custom commercial license for orgs that want self-hosting *and* commercial-product embedding.

## The Free tier is unusually generous

Most signing tools give you a "free trial" — 3 signs, then the wall. Documenso's Free is 5 documents per month, indefinitely, no credit card, no watermark, 10 recipients per doc. DocuSign's free is a 30-day trial. Dropbox Sign's free is 3 docs/month with watermarks. Adobe Sign has none.

That's enough to handle a freelancer's contract flow or an indie founder's NDAs without ever paying. Hit the cap, and the upgrade to Individual at $25 is right there. Product-led growth with the brakes off.

## The pricing cliff

Individual ($25) → Teams ($40) → Platform ($250). The first jump is fine. The second is dramatic: $210/month more for "unlimited everything."

In practice, you don't pay Platform because you ran out of seats — Teams scales linearly at $8/extra user and most growing companies could ride it indefinitely. You pay $250 because you crossed a specific Rubicon: **you want to embed Documenso into a product you sell.**

The marketing copy calls Platform "perfect for builders." That understates it. White-label and unlimited API are window dressing on a license sale. For internal-use companies — even very large ones — Teams is the right answer through hundreds of employees.

## Vs. DocuSign: the math depends on volume

DocuSign API plans start around $20/month for 10 envelopes, then scale to $0.50–$2.00 per envelope at enterprise volume. Dropbox Sign runs similar: $99/month base for 200 requests + overage. Documenso Platform is $250/month flat, unlimited.

- **500 signs/month** on DocuSign at ~$1/envelope = $500/mo. Documenso = $250/mo flat.
- **5,000 signs/month** at $0.50/envelope = $2,500/mo. Documenso = $250/mo flat.
- **50,000 signs/month** = $25k+/mo on DocuSign. Documenso = still $250.

For any product team building signing into their own SaaS, the comparison isn't "Documenso vs. DocuSign as e-sig tools." It's "$250/month flat vs. a tax that scales with your customer adoption."

The trade-off: DocuSign's brand, audit certifications stack, and integration surface (Salesforce, Workday, every legal tool ships a connector) are real assets — especially for a SaaS selling into Fortune 500 procurement. For technical buyers with high signature volume, Documenso Platform is the rational choice anyway.

## Self-hosting the AGPL way

The repo ships Docker compose and a Helm chart. The stack is PostgreSQL, Redis, the server, and SMTP — smaller than most COSS deployments. Operationally you take on TLS, backups, SMTP, security review, and AGPL obligations if you ever expose it externally.

For internal-use deployments at a single company, self-hosting is right once you're past Teams' break-even or have hard data-residency requirements. For embedding into a commercial product, self-hosting is *not* a way around Platform — AGPL still applies, and most proprietary codebases can't accept that.

## Worth paying for?

**Free** is genuinely usable for low-volume individuals. 5 docs/month with no watermark is more than most people's actual contract flow.

**Individual at $25/month** is a clean upgrade if you hit Free's cap and sign more than 5 things a month.

**Teams at $40/month** is the SMB sweet spot. A 20-person company at $160/mo lands well under DocuSign's equivalent.

**Platform at $250/month** is the right answer if and only if you're embedding Documenso into a product. The features are valuable; the AGPL escape hatch is the actual line item. If you're not embedding, you're overpaying.

**Self-host** if you have ops capacity and you only need internal use. Don't self-host as a way to dodge Platform if you intend to embed — AGPL doesn't permit that.

The honest take: Documenso's pricing is built around one strategic bet — that DocuSign's per-envelope billing is the category's biggest weakness for technical buyers, and that AGPL is a clean enough fence to monetize the people who want to escape it. For internal-use customers, Teams is the obvious win. For builders, Platform's $250/month against unlimited envelopes is one of the better deals in dev tools — as long as you understand the actual product you're buying is a license, not a feature set.

---


## How Documenso pricing scales

Documenso's tiers climb gently until the $250 Platform plan — which you pay not for features but for permission to embed under a non-AGPL license.

<figure class="my-8">
<svg viewBox="0 0 560 130" role="img" aria-label="pricing tiers" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">Free</text><rect x="150" y="10" width="2" height="18" fill="var(--color-text-tertiary)" rx="1"></rect><text x="160" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$0</text><text x="0" y="54" fill="var(--color-text)" font-size="14">Individual</text><rect x="150" y="40" width="32" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="190" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$25/mo</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Teams</text><rect x="150" y="70" width="51" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="209" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$40/mo (5 users)</text><text x="0" y="114" fill="var(--color-text)" font-size="14">Platform</text><rect x="150" y="100" width="320" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="478" y="114" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$250/mo (embed license)</text></svg>
<figcaption>Documenso pricing by tier. Platform is the AGPL escape hatch, not a feature jump.</figcaption>
</figure>

*I build [Beton](https://getbeton.ai?utm_source=blog&utm_campaign=documenso_teardown&utm_medium=organic) — open source revenue intelligence for B2B SaaS.*
