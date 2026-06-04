---
title: "Billing Live, Agent Wiring & First Real Signups"
description: "7 MVP signups, Stripe billing live, PostHog and Attio integrations operational, and agent wiring in progress with session-level authorization."
publishedAt: "2026-02-04"
author: "Vlad Nadymov"
tags: ["product update", "beton"]
featured: false
draft: false
coverImage: "/images/blog/billing-live-cover.png"
seo:
  metaTitle: "Billing Live, Agent Wiring & First Signups"
  metaDescription: "Stripe billing live, PostHog and Attio integrations operational, agent wiring in progress with session-level authorization, and 7 MVP signups."
---

## What's Going On

We've scored and emailed 700 B2B leads, with 60 conversations resulting in a $90K qualified pipeline from cold outreach. We now have 8 letters of intent plus paying customers, 110 newsletter subscribers, and 216 LinkedIn followers. 7 MVP signups and we're monitoring user behavior through PostHog.

## Billing & Onboarding Live

We launched Stripe integration with streamlined billing. Customers connect PostHog, add payment information, and hook up Attio with minimal friction. Self-hosted users need only one environment variable to access the full application without billing screens.

Unlike competitors charging $30K+ annually upfront, Beton uses monthly pricing based on tracked users — significantly more affordable for early-stage PLG companies on an ACV basis.

## PostHog and Attio Integrations

Both integrations are now operational. The system works by having customers connect PostHog during signup. Beton examines table structures via API without accessing raw data. The agent crawls client websites, generates SQL queries executed through PostHog's API, and automatically creates deals in Attio when signals trigger.

## Agent Wiring in Progress

A demo mode is under development for users wanting to explore without immediate payment. We're building the API layer connecting Inspector (the UI connecting to data warehouses) and the Agent (built on Google ADK). Inspector provides website URLs while the Agent studies them and explores data through Inspector rather than direct database access, then constructs SQL pipelines that Inspector executes.

Session-level authorization is being implemented to prevent cross-client data access.

## Lead Automation Workflow

The process flows: signup via Supabase -> email to Clay -> Apollo enriches data -> JSON packaging for n8n -> Attio creates company, person, and deal automatically with zero manual intervention.
