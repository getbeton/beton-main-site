---
title: "n8n Pricing Teardown"
description: "n8n charges per workflow execution, not per step. Here's why that matters for complex automations with AI chains and conditional branching."
publishedAt: "2026-03-25"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "automation"]
featured: true
draft: false
coverImage: "/images/blog/n8n-pricing-cover.jpeg"
seo:
  metaTitle: "n8n Pricing Teardown — Execution-Based Pricing"
  metaDescription: "n8n charges per workflow execution, not per step. Analysis of pricing tiers, licensing, and the 13x cliff between Pro and Business."
---

n8n is a workflow automation tool designed for technical teams. It occupies a middle ground between Zapier (which is user-friendly but expensive) and building everything from scratch (free but time-consuming).

The platform enables users to connect apps, databases, APIs, and AI models into automations called workflows. With over 180,000 GitHub stars, it represents the most-starred workflow automation project globally and has accelerated growth as development teams recognize their need to productionize AI agents.

*Disclosure: Beton uses n8n for core GTM automation.*

## The Distinctive Feature: Execution-Based Pricing

Unlike most automation tools that charge per step (Zapier calls these "tasks"), n8n employs execution-based pricing. One complete workflow run — from trigger to finish — costs the same regardless of how many steps it contains.

For straightforward automations this distinction matters little. However, for complex workflows involving AI chains, multi-API enrichment pipelines, and conditional branching, this represents a substantial structural advantage. A 40-step workflow costs identically to a 2-step one.

## Pricing Plans

**Starter — EUR 20/month (annual)**
- 2,500 executions monthly
- 5 concurrent executions
- 1 shared project, 50 AI Workflow Builder credits
- Cloud-hosted

**Pro — EUR 50/month (annual)**
- Custom execution quota (user-configured)
- 20 concurrent executions
- 3 shared projects, 150 AI credits
- Workflow history, global variables, admin roles, execution search
- Cloud-hosted

**Business — EUR 667/month (annual)**
- 40,000 executions monthly
- 6 shared projects
- SSO, SAML, LDAP, Git version control, multiple environments
- Self-hosted only

**Enterprise — Contact sales**
- 200+ concurrent executions, unlimited projects
- Log streaming, external secret store, 365-day execution logs
- Cloud or self-hosted options

Annual billing provides 17% savings. Startups with under 20 employees receive 50% off Business tier pricing.

## The Pricing Cliff

A substantial jump exists between Pro (EUR 50/month) and Business (EUR 667/month) — a 13-fold increase. The Business tier requires self-hosting while adding essential enterprise features like SSO, multi-environment setup, and Git-based version control. This pricing structure intentionally targets organizations possessing existing DevOps capacity seeking simply a license.

## Licensing Considerations

The Community Edition operates under n8n's Sustainable Use License — neither MIT, Apache, nor OSI-approved. Key restriction: users may self-host for their own team but cannot create competing products or operate it as a managed service for customers.

License selection directly influences monetization strategy. Apache 2.0 or MIT would permit anyone to fork and commercialize n8n-as-a-service. The Sustainable Use License prevents this, protecting n8n's cloud business while permitting community use.

AGPLv3 takes a different approach: requiring modified version distributions to be open-sourced while preventing AGPL code embedding in commercial customer products without licensing.

For typical n8n users automating their own infrastructure, the license remains irrelevant. For anyone considering building atop n8n, it presents a deal-breaker.

## Value Assessment

Self-hosting users needing SSO or multiple environments should almost always pay for Business tier — these represent substantive features rather than luxuries.

Individual contributors and small teams should begin with Community Edition self-hosted, which provides genuine completeness with all integrations, unlimited workflows, and unlimited users.

Migration to cloud Pro (EUR 50/month) makes sense upon requiring parallel executions or workflow history.

One consideration: AI Workflow Builder credits function as a second metering mechanism layered atop executions. Currently limits remain generous enough to avoid impact, yet as agentic workflows dominate usage patterns, this represents the transparent next monetization lever.
