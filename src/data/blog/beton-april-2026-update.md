---
title: "Beton April 2026 Update"
description: "Slack integration, MCP server with OAuth, security audit, blog migration, and open-sourcing the agent."
publishedAt: "2026-04-14"
author: "Vlad Nadymov"
tags: ["product update", "beton"]
featured: true
draft: false
coverImage: "/images/blog/lobster-newsletter-apr26.jpg"
seo:
  metaTitle: "Beton April 2026 — Slack, MCP OAuth, Open Source"
  metaDescription: "Slack integration, MCP server with OAuth, 32 vulnerabilities fixed, blog moved off Substack, and open-sourcing the Beton agent."
---

Two months since the last update. Here's what shipped and what's coming.

## Slack Integration

When a signal fires, Beton now pushes Block Kit-formatted notifications to your Slack channel with the context reps need to act — account name, signal type, confidence score, and a direct link back to Inspector. Full OAuth V2 flow, channel picker in settings, one-click setup.

## MCP Server: Now with OAuth

We upgraded the embedded MCP server from API key auth to interactive OAuth login following RFC 9728. Streamable HTTP transport, dual-auth support, and a settings page with four tabs — setup instructions, method reference, connected sessions, and request logs. If you're wiring AI agents into your RevOps stack, this is the cleanest integration point we offer.

## Security Audit

We ran a penetration test and remediated 32 vulnerabilities across multiple review rounds — cross-tenant data leaks, XSS vectors, error message sanitization, SSRF surface area. The boring kind of work that matters most.

## Blog Moved to Our Own Platform

We migrated the blog from Substack to getbeton.ai. Every post now lives on our domain, which means the SEO value of our content actually compounds for us instead of for Substack. Same content, better distribution mechanics.

## Marketing Site Updates

Added real company logos from signups as social proof. Fixed a pile of Google Search Console 404s — trailing slash redirects, catch-all rules that were blocking live pages, blog.getbeton.ai now redirects properly. Added an open source tools section and structured data improvements.

On the SEO side, we launched a separate website to A/B test our approach — it pulls 1,500 views per day using the same playbook. The Beton site doesn't see that kind of traffic yet, which tells us the problem is with our site specifically, not the strategy. We're digging into what's different and fixing it.

## Coming Up

**Postgres as a data source** is shipping this week. Same pattern as PostHog — schema analysis, hypothesis generation, statistical testing — but against raw Postgres databases. This opens Beton to teams that warehouse data outside PostHog or want to cross-reference multiple sources.

We're also actively building **HubSpot integration** — full bidirectional sync with OAuth auth, a polling engine, MCP tools, and native signal detectors. And **multi-user workspaces** with invitations and role-based access are in progress, so your team can share one signal pipeline without stepping on each other's field mappings.

But the big one: **we're open-sourcing the Beton agent this week.** Alongside it, we're launching statistical validation methods — a proper library of them. More on that very soon.
