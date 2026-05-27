---
title: "Grafana Pricing Teardown 2026"
description: "Grafana has five active billing meters and a $25k/year enterprise cliff with nothing in between."
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "observability"]
featured: false
draft: false
coverImage: "/images/blog/grafana-pricing-cover.jpeg"
tldr: |
  Grafana is the observability stack most engineers have already touched — metrics, logs, traces, profiles, k6 load tests, all in one place. ~66k GitHub stars, AGPL on the core, and a cloud business explicitly positioned against Datadog bill shock. The pricing story is five usage meters, a generous free tier on volume but tight on retention, and a steep cliff from Pro to Enterprise.

  - Free forever — all services, 14-day metric retention, 3-day log retention
  - Pro starts at $19/month minimum + pay-as-you-go on five meters (metrics, logs, traces, profiles, k6)
  - Enterprise starts at a $25,000/year spend commit with nothing in between Pro and Enterprise
  - Adaptive metrics auto-drops unqueried series — the explicit answer to Datadog overage horror stories
  - AGPL on core Grafana (Apache 2.0 on Agent/Alloy); enterprise plugins ship under separate commercial licenses
faq:
  - question: "Is Grafana open source?"
    answer: "Core Grafana is AGPL. Grafana Agent and Alloy are Apache 2.0. AGPL means modifications to Grafana itself must be open-sourced if distributed, but running a private Grafana instance internally is fine. Some enterprise plugins ship under separate commercial licenses."
  - question: "What does Grafana Cloud actually charge for?"
    answer: "Five usage meters: metrics (per active series), logs (per GB ingested), traces (per GB ingested), profiles (per GB ingested), and k6 tests (per virtual user hour). Each meter is individually transparent with published per-unit rates."
  - question: "How much is the cheapest paid plan?"
    answer: "Pro starts at $19/month as the minimum, then pay-as-you-go above the free tier limits. You get 13 months of metrics retention and 30 days of logs retention."
  - question: "Why is the jump from Pro to Enterprise so steep?"
    answer: "There is no upper-mid-market tier. Enterprise SSO, advanced RBAC, data source permissions, and SLA all live behind a $25,000/year minimum spend commit. A mid-sized team that has outgrown Pro's self-service but doesn't need everything in Enterprise has no clean option."
  - question: "How does Grafana position against Datadog?"
    answer: "Explicitly on bill predictability. Adaptive metrics automatically drops series that aren't being queried, reducing active series count without manual cleanup. Per-meter rates are published so you can model costs — the opposite of Datadog's opaque overage model."
pricingTable:
  license: "AGPL (core), Apache 2.0 (Agent/Alloy)"
  stars: "~66k"
  freeTier: "All services, 14-day metrics / 3-day logs retention"
  cheapestPaid: "$19/mo minimum (Pro) + usage"
  verdict: "Pro for growing teams; Enterprise only if you'll commit $25k/year"
seo:
  metaTitle: "Grafana Pricing Teardown: Observability Platform"
  metaDescription: "Grafana has five active billing meters and a $25k/year enterprise cliff with nothing in between."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

Grafana is the observability platform most engineers have used without realizing it — metrics visualization, log aggregation, distributed tracing, all in one place. ~66k GitHub stars, which puts it in the "foundational infrastructure" category alongside tools like Kubernetes and Prometheus. Grafana Labs has built a full cloud observability stack (Loki for logs, Tempo for traces, Mimir for metrics) to compete directly with Datadog, New Relic, and Dynatrace.

- Website: [grafana.com](https://grafana.com)
- Pricing: [grafana.com/pricing](https://grafana.com/pricing)
- GitHub: [github.com/grafana/grafana](https://github.com/grafana/grafana)

**Plans**

- **Free:** Always free, all services, limited usage per month. 14-day metric retention, 3-day log retention.
- **Pro — from $19/month + usage:** Pay-as-you-go above free tier limits. 13 months metrics retention, 30 days logs. Starts at $19/month as the minimum.
- **Enterprise — starts at $25,000/year spend commit:** Full enterprise features, SLA, dedicated support, advanced RBAC, data source permissions.

**Usage dimensions: metrics, logs, traces, profiles, k6**

Most observability tools pick one or two dimensions to charge on. Grafana has five active meters:
- **Metrics:** Per active series
- **Logs:** Per GB ingested
- **Traces:** Per GB ingested
- **Profiles:** Per GB ingested
- **k6 tests:** Per virtual user hour

This is the "bring your own complexity" model. If you're running a simple stack with a handful of services, your bill is low. If you're running a large distributed system that emits high-cardinality metrics + verbose logs + distributed traces, every meter is running.

The upside vs Datadog: each meter is individually transparent and relatively cheap. You can tune each one by reducing cardinality, adjusting sampling rates, or filtering noisy logs. Datadog's pricing is notoriously opaque; Grafana publishes per-unit rates and you can model your costs.

**The "Datadog bill shock" positioning**

Grafana explicitly markets against Datadog's infamous overage bills. Their adaptive metrics feature automatically drops series that aren't being queried — reducing your active series count and bill without requiring manual intervention.

This is smart positioning. Datadog horror stories (teams getting $300k/month surprise bills) spread virally in the engineering community. Grafana is the "we know Datadog's rep, here's how we're different" pitch.

Whether it holds up at scale depends on your specific usage patterns. Teams that emit lots of metrics with high cardinality (user IDs, request IDs as label dimensions) will still have expensive bills on any platform. Grafana's tooling helps, but it doesn't save you from yourself if your instrumentation is undisciplined.

**The free tier is genuinely generous**

14-day metric retention and 3-day log retention on a free tier is more than most comparable tools offer. For a developer testing instrumentation or a small project, this is usable — not just a demo.

The catch is retention, not usage volume. 3-day log retention makes production debugging painful. "We had an incident 5 days ago and need the logs" is a very normal request. Free tier doesn't support it.

**The $25,000 enterprise cliff**

There's no "upper mid-market" tier between Pro (pay-as-you-go) and Enterprise ($25k/year). If you need enterprise SSO, advanced RBAC, data source permissions, or an SLA, the minimum spend is $25,000/year.

That's a hard wall. A 50-person company that's grown out of Pro's self-service but doesn't need everything in Enterprise is stuck choosing between overpaying for Enterprise or finding workarounds. The gap between Pro and Enterprise pricing is one of the steepest in this series.

**License**

AGPL for core Grafana. Apache 2.0 for several components (Grafana Agent, Alloy). AGPL means modifications to Grafana itself must be open-sourced if distributed — but running a private Grafana instance internally is fine. Some enterprise plugins have commercial licenses separate from the core.

**Worth paying for?**

Free tier is a good starting point and genuinely usable for small/medium projects. Pro's pay-as-you-go is the right model for most growing companies — you pay for what you use, and the per-unit rates are transparent. Self-hosting is a real option for cost control and data sovereignty. Enterprise at $25k/year is justified for large engineering orgs with compliance requirements — but it's a significant commitment with nothing in between.

---


## How Grafana pricing scales

Grafana's Pro tier starts at a $19/month minimum then meters five separate signals; the next step is a $25,000/year Enterprise commit (~$2,083/month) with nothing in between.

<figure class="my-8">
<svg viewBox="0 0 560 100" role="img" aria-label="pricing tiers" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">Free</text><rect x="150" y="10" width="2" height="18" fill="var(--color-text-tertiary)" rx="1"></rect><text x="160" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$0</text><text x="0" y="54" fill="var(--color-text)" font-size="14">Pro</text><rect x="150" y="40" width="3" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="161" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$19/mo min + usage</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Enterprise</text><rect x="150" y="70" width="320" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="478" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$25k/yr (~$2,083/mo)</text></svg>
<figcaption>Grafana pricing by tier. The Pro→Enterprise cliff is the steepest in the series.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
