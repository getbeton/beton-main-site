---
title: "We Rebuilt Beton: Automated Signal Discovery"
description: "Complete product pivot toward automated signal discovery for PLG sales teams. The system analyzes data warehouses, runs statistical tests, and creates CRM deals when signals fire."
publishedAt: "2026-01-22"
author: "Vlad Nadymov"
tags: ["product update", "beton", "signal discovery"]
featured: true
draft: false
coverImage: "/images/blog/rebuilt-beton-cover.png"
seo:
  metaTitle: "We Rebuilt Beton — Automated Signal Discovery"
  metaDescription: "Beton integrates with PostHog data warehouses to discover behavioral signals predicting account expansion. Statistical validation, not guesswork."
---

## The Problem

Product-led growth companies accumulate substantial first-party data — product usage events, billing records, CRM history, support tickets, and customer attributes. Yet extracting meaningful signals from this data proves difficult.

Revenue and sales teams typically depend on intuition: "visited pricing page 3+ times" or "invited 2+ team members." While reasonable-sounding, these rarely predict conversion reliably.

Sales teams are usually last in line for dedicated analysts, and seed or Series A companies lack budget for this role. Sales operations teams work without proper tools for discovering product-qualified leads.

Consequently, inbound representatives spend significant time on leads unlikely to convert, wasting approximately 80% of their capacity — representing lost salaries and missed opportunities.

## What We Built

Beton integrates with PostHog data warehouses to identify patterns predicting account expansion. The system validates patterns against historical conversion data by executing thousands of SQL queries, automatically tracking them, and creating new deals in your CRM when signals activate.

The distinguishing factor: rather than monitoring manually-defined signals, Beton discovers signals you weren't aware existed.

### 1. Data Schema Analysis

An AI agent examines your data warehouse schema and generates hypotheses about potential expansion signals, including product usage patterns, billing changes, support ticket content, and cross-attribute combinations.

### 2. Statistical Testing

The system runs thousands of statistical tests through your data warehouse API. Only aggregated test results are retrieved — never raw customer data — preserving sensitive information in your infrastructure while enabling comprehensive analysis.

### 3. CRM Integration

When an account triggers a validated signal, Beton creates a deal record in your CRM with context explaining why the account qualified, providing sales representatives actionable leads instead of guesswork.

## How It Works

Beton's Inspector interface sits atop your PostHog data warehouse, querying data via PostHog's Query API. Even in the cloud version, row-level data access is prohibited — only aggregated query results are utilized.

The agentic system, built with Google ADK, deploys multiple agents with distinct toolsets and objectives to analyze signal data comprehensively while remaining robust to varying user data schemas and business practices.

Self-hosted versions allow users to provide their own API keys. Future iterations will enable self-hosters to use the agent via API, allowing Beton's agent to direct the locally-hosted Inspector with all queries executing on-premise, with the agent receiving only test results.

## Deployment Options

The codebase will be released on GitHub (ensuring both agent and frontend function properly from a single Docker container). Self-hosting is complimentary when you supply your own LLM API keys.

The cloud version costs $0.5 per tracked user monthly with monthly billing. Customer data remains in your warehouse — only statistical aggregates are received.

## What's Next

Pilot customer onboarding begins in Q1 2026. Organizations using PostHog as a data warehouse with inbound sales operations are the target market.

Planned features include backtesting to validate signals against historical data and continuous monitoring detecting when signals lose effectiveness as cohorts evolve.
