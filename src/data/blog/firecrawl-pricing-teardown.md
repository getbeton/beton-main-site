---
title: "Firecrawl Pricing Teardown 2026"
description: "Firecrawl has one of the smartest GTM setups in open source. The trick isn't in the pricing page — it's in the licensing."
publishedAt: "2026-02-18"
updatedAt: "2026-06-22"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "web scraping"]
featured: true
draft: false
coverImage: "/images/blog/firecrawl-pricing-cover.png"
tldr: |
  Firecrawl runs one of the smartest GTM setups in OSS web scraping. The core engine is AGPL-3.0 (so competitors can't fork-and-host as a service). Fire Enrich and other extensions are MIT-licensed (so the funnel runs free).

  - Self-hosting is technically possible but operationally painful — proxies, headless browser pools, anti-bot detection at scale.
  - Credit-based pricing: 1 page = 1 credit. Free 500 credits, Hobby $16/mo (3k credits), Standard ~$83–99/mo (100k), Growth $333/mo (500k).
  - AI Extract is a separate subscription starting at $89/mo — easy to miss when budgeting.
  - Lower tiers cap crawls at 50 pages, which gets painful fast on docs, catalogs, archives.
  - The bet: freshness beats cheapness. Worth paying if you're building AI agents that need real-time web data.
faq:
  - question: "Is Firecrawl open source?"
    answer: "Yes — the scraping core is AGPL-3.0. Fire Enrich and several Firecrawl-based extension tools are MIT-licensed."
  - question: "Can I self-host Firecrawl for free?"
    answer: "Technically yes — the AGPL repo is public. In practice you take on proxy rotation, headless browser pools, retry logic, and anti-bot detection at scale. The managed cloud is what you're really paying for."
  - question: "How much does Firecrawl cost for 100k pages/month?"
    answer: "Around $83–$99/month on the Standard plan, plus separate AI Extract pricing if you use that feature (starts at $89/mo)."
  - question: "Does AGPL prevent commercial use of Firecrawl?"
    answer: "No — internal company use is fine. AGPL only bites if you build a public product that wraps Firecrawl, in which case you need the cloud subscription or a commercial license."
pricingTable:
  license: "AGPL-3.0 (core), MIT (extensions)"
  freeTier: "500 credits"
  cheapestPaid: "$16/mo (Hobby)"
  verdict: "Pay for the cloud — self-host is too operationally hard"
seo:
  metaTitle: "Firecrawl Pricing Teardown — AGPL Core, MIT Funnel"
  metaDescription: "Firecrawl uses AGPL-3.0 for the core engine and MIT for Fire Enrich. Credit-based pricing at $0.005/page, plus a separate AI extract subscription."
---

Hey, it's Vlad, founder of Beton.

I've had a habit of writing on pricing of COSS (commercial open source software) companies. Want to bring it back to life.

First one is Firecrawl.

Firecrawl has one of the smartest GTM setups I've seen in open source. The trick isn't in the pricing page — it's in the licensing.


## How Firecrawl pricing scales

Firecrawl scales by credits in flat tiers, plus a separate AI-Extract subscription that's easy to miss when budgeting.

<figure class="my-8">
<svg viewBox="0 0 560 130" role="img" aria-label="pricing tiers" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">Free</text><rect x="150" y="10" width="2" height="18" fill="var(--color-text-tertiary)" rx="1"></rect><text x="160" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$0 (500 cr)</text><text x="0" y="54" fill="var(--color-text)" font-size="14">Hobby</text><rect x="150" y="40" width="15" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="173" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$16/mo (3k cr)</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Standard</text><rect x="150" y="70" width="86" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="244" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">~$90/mo (100k cr)</text><text x="0" y="114" fill="var(--color-text)" font-size="14">Growth</text><rect x="150" y="100" width="320" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="478" y="114" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$333/mo (500k cr)</text></svg>
<figcaption>Firecrawl pricing by tier (credit-based). AI Extract is billed separately from $89/mo.</figcaption>
</figure>

*This post is a part of series on commercial open source software pricing.*

## What is Firecrawl

Firecrawl is a web scraping API that turns websites into LLM-ready markdown or structured data.

Think of it as the plumbing layer between "the internet" and your AI agent — it handles proxies, JavaScript rendering, anti-bot bypasses and gives you clean output.

They've raised from Y Combinator and are growing fast in the AI tooling space.

## The licensing play

This is where it gets interesting. Firecrawl doesn't have one product — it has two, with very different licenses.

**The core scraping engine is AGPL-3.0**

You can self-host it, sure.

But AGPL means that if you wrap it into your product and serve it to users, you have to open source your entire codebase.

So competitors can't just take Firecrawl and build their own UI on top. And even if you self-host it just for internal use — good luck juggling rotating proxies, headless browsers and anti-bot detection at scale.

That's the hard part. That's what you're actually paying Firecrawl for when you buy their cloud.

**Fire Enrich (and many other Firecrawl-based tools) are MIT**

This is their data enrichment tool — 650+ stars, fully open, do whatever you want with it. You could fork it and build a competing product tomorrow.

But here's the thing: Fire Enrich is basically a collection of small system prompts that call GPT and tell it to go scrape the web for company data.

Each "agent" is a thin wrapper.

So when you use it, you end up paying Firecrawl for scraping infrastructure and OpenAI for tokens.

The MIT license is generous because the product is a funnel, not a moat. Smart. Really smart.

## Pricing structure

Firecrawl uses credit-based pricing: 1 page scraped = 1 credit.

**Scrape & Crawl plans:**

- **Free** — 500 credits, no credit card required. Enough to test
- **Hobby** — $16/month for 3,000 credits (~$0.005/page)
- **Standard** — ~$83-99/month for 100,000 credits + 50 concurrent browsers
- **Growth** — $333/month for 500,000 credits + 100 concurrent browsers
- **Enterprise** — custom pricing, sales call

But here's what catches people off guard: the AI extract feature is a completely separate subscription.

It runs on tokens, not credits. Starts at $89/month.

So if you thought your Standard plan covers everything — it doesn't. You need two subscriptions to use the full product.

**Extract plans (separate):**

- **Starter** — $89/month
- **Explorer** — $359/month
- **Pro** — $719/month

Lower-tier plans also cap crawls at 50 pages, which gets painful fast if you're scraping anything with depth — docs, catalogs, archives.

## Does it make sense to pay?

Almost certainly yes, if you're building AI agents that need web data.

Self-hosting Firecrawl is technically possible but practically painful. Web scraping at scale is an infrastructure nightmare — you need proxy rotation, browser pools, retry logic, anti-detection.

This is the kind of thing where "just run a Docker" doesn't cut it.

Unlike ClickHouse or Metabase where the self-hosted version is genuinely usable, Firecrawl's value *is* the managed infrastructure.

The real question is whether the cost per contact makes sense for enrichment use cases.

When you use Fire Enrich, you're not buying a database lookup at fractions of a cent. You're scraping live web pages and running LLM inference on every single query.

That adds up fast — scraping credits + OpenAI tokens per contact.

For high-volume enrichment (think Clay or Apollo scale), this could get expensive compared to traditional data providers that pre-crawl and cache everything.

Firecrawl's bet is that freshness beats cheapness. Instead of stale database records, you get real-time data every time.

Whether that tradeoff works depends on your volume and how much you care about data being current vs. data being cheap.

_Last verified 2026-06-22._
