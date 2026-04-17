---
title: "We Open-Sourced Our Agent Testing Tool"
description: "Dryfit generates synthetic analytics databases with hidden ground truth so you can benchmark AI agents on product-signal discovery. MIT licensed."
publishedAt: "2026-04-16"
author: "Vlad Nadymov"
tags: ["open source", "beton", "agents"]
featured: true
draft: false
coverImage: "/images/blog/dryfit-hero.jpg"
seo:
  metaTitle: "We Open-Sourced Our Agent Testing Tool — Dryfit"
  metaDescription: "Dryfit generates synthetic analytics databases with hidden ground truth so you can benchmark AI agents on product-signal discovery. MIT licensed."
---

At Beton, we build AI that detects revenue signals -- expansion readiness, churn risk, upsell timing — inside product analytics data. We needed a way to know whether they actually work.

We had no customers -- so no data at hand. Our CTO had experience with generating different kinds of synthetic data before. 

So we built Dryfit. It helps us build signal validation tools for our ADK-based agentic system. 

## What it does

Dryfit generates a PostgreSQL events table that looks like real product telemetry — pageviews, feature usage, API calls, billing events — with synthetic but realistic patterns. Hidden inside the data are planted signals: behavioral sequences that indicate expansion, churn, or other outcomes.

Alongside the database, Dryfit outputs a ground truth manifest that maps every planted signal to specific event IDs. Your agent runs against the database. You compare its findings to ground truth. You get a precise score.

Think of it as unit tests for signal discovery.

## Who this is for

If you're building any of the following, Dryfit solves the "what do I test against" problem:

- **RevOps / PLG tools** that detect expansion or churn signals in product usage data. You need to know your agent catches the right accounts — not just the obvious ones.
- **Customer health scoring systems** where you're assigning risk or readiness scores based on behavioral patterns. Without ground truth, you're guessing whether your scores are meaningful.
- **AI agents that analyze product analytics** — the new wave of tools that connect to PostHog, Amplitude, or a data warehouse and surface insights. Your demo works, but does it work on messy, realistic data at scale?
- **Data teams evaluating vendor claims.** If someone tells you their AI "finds signals in your data," hand them a Dryfit database and ask for their precision and recall.
- **SQL practice on product data.** If you want to practice writing analytical queries against realistic product databases — or run a Kaggle-style signal discovery competition within your team — Dryfit gives you a ready-made dataset with verifiable ground truth.

The common thread: you need a realistic dataset where you know the right answers ahead of time.

## Business model coverage

Different SaaS business models produce different signal patterns. A seat-based product expands through invite, signup, activation sequences. A usage-based product shows acceleration in API calls or compute hours. A freemium product hits tier limits before converting.

Dryfit ships 12 scenario configs covering the most common models: seat-based, usage-based, transaction volume, storage, contact/record-based, feature-gated, marketplace, revenue-share, credits/tokens, hybrid, freemium-to-paid, and event-volume.

Each config defines the event vocabulary, positive signal paths (leading to the success event), negative signal paths (similar but not converting), and noise parameters. You can use them as-is or author your own.

## How to use it

```bash
uv sync
uv run dryfit -c configs/posthog_seat_based_mvp.yaml --print-summary
```

For visual inspection, spin up the Docker Compose stack with Grafana:

```bash
docker compose up -d
```

## Why open source

We think the agentic AI space has a benchmarking gap. Everyone is building agents that "analyze data" or "find insights," but there's no standardized way to measure whether they actually find anything real. Dryfit is our contribution to closing that gap.

MIT licensed. Use it, fork it, extend it.

Built by [Aleksandr Markelov](https://github.com/Sashmark97).

**GitHub:** [github.com/getbeton/dryfit](https://github.com/getbeton/dryfit)
