---
title: "How We Automate Lead Enrichment at Beton"
description: "Every signup hits Supabase, flows through Clay enrichment, formats to JSON, and lands in Attio as a qualified deal via n8n. Minutes end-to-end, no manual work."
publishedAt: "2026-04-22"
author: "Vlad Nadymov"
tags: ["beton", "enrichment", "automation", "plg"]
featured: false
draft: false
seo:
  metaTitle: "How We Automate Lead Enrichment at Beton"
  metaDescription: "Supabase signup → Clay enrichment → JSON → n8n → Attio deal in ~4 seconds. The workflow we run on our own inbound before selling it to anyone else."
---

We had to solve inbound enrichment for ourselves before we could sell it. Our engineer Mikhail built a workflow that takes every signup, enriches it, and creates a deal in our CRM automatically. No manual work. End-to-end — from email to qualified deal — takes minutes.

Here's how it's built.

## The Problem

Most PLG companies get signups and have no idea who the person is. Is this a decision-maker at a 500-person company, or somebody testing tools on a weekend? You need that context to know which signups sales should actually talk to.

Manual enrichment doesn't scale. Even with an Apollo seat, somebody still has to copy emails, run lookups, format fields, and push to the CRM. That's hours a day lost inside sales.

So we built this workflow for ourselves first.

## How It Works

### Entry point: Supabase

Someone signs up to Beton with Google. Supabase captures the email and fires a webhook. That's it — one signup, one automation run.

We'll add more entry points later (Cal.com bookings, manual prospecting via an Attio extension, button-triggered workflows inside Attio, Clay searches), but right now it's just Supabase.

### Enrichment: Clay

The email goes straight into Clay. Clay handles all enrichment through a series of waterfalls — sequential enrichment steps that try different data sources.

What we pull:

- Name (if derivable from the email)
- Domain (extracted from the email)
- Domain type (corporate vs. Gmail/Yahoo/etc.)
- Facebook and Twitter profiles
- Work email (if we can find one and the signup used a personal address)
- Company info (name, size, industry, headcount)
- Technologies the company uses
- Job title and role data

Each waterfall is a distinct enrichment layer. We use the Apollo.io Waterfall as the primary source — no org charts, no decision-maker flags, and the tech stack data is there but you have to dig for it yourself.

Not every field fills. Sometimes we only get a name and a domain. Sometimes we get a full profile. Clay normalizes empty fields as null or dash so the next step doesn't choke on them.

### Formatting: JSON

Once enrichment is done, we format everything into JSON in two passes.

**First pass:** convert Clay's tabular format to JSON. Some fields need cleanup — wrong format, stray whitespace, inconsistent casing. We standardize here.

**Second pass:** reshape for Attio's API. Attio has specific requirements for how data types are structured (dates, lists, nested objects). We rebuild the JSON to match.

We also keep a field-mapping table that tracks which fields are live (green), in progress (yellow), or up next (orange). Makes it easier to see what's actually getting pushed into the CRM.

### Automation: n8n

The formatted JSON goes to n8n. We self-host n8n on our own server — more control, lower cost.

n8n receives the JSON payload and makes three API calls to Attio:

1. Create the company (or update if it exists)
2. Create the contact (or update if it exists)
3. Create the deal and link it to the company and contact

The workflow finishes in about 4 seconds: the webhook receives data from Clay, a Clean node standardizes it, and three sequential Attio API calls handle the CRM updates.

Attio has built-in duplicate detection, so if a company or contact already exists, it updates the record instead of creating a new one. We may add an explicit GET check before creating anything down the line, but Attio's default handling is fine for now.

### Output: Attio CRM

The deal shows up in Attio with all the enriched data attached. Company info, contact details, stack, social profiles — everything sales needs to start a conversation.

From there it's manual. Sales sees the deal and decides whether to reach out.

## What It Costs

We pay for:

- **Clay** — monthly subscription plus enrichment tokens
- **Apollo** — tokens per waterfall lookup
- **n8n** — server hosting (self-hosted, no per-execution fee)
- **Attio** — CRM subscription

The variable cost is enrichment tokens. Every signup triggers several Apollo waterfalls, and each one spends tokens. For a PLG product at our volume, it's affordable. At thousands of signups a day we'd need to optimize which enrichments actually matter.

## What's Next

Right now the workflow handles one entry point (Supabase signups). We're adding:

- Apollo search exports (manual list building)
- Clay search exports (same idea, different tool)
- Cal.com bookings (whoever books a demo gets auto-enriched)

We're also working on better duplicate handling — probably an explicit GET to check whether the contact or company exists before creating a new record.
