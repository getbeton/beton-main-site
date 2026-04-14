---
title: "Grafana Pricing Teardown"
description: "Grafana has five active billing meters and a $25k/year enterprise cliff with nothing in between."
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "observability"]
featured: false
draft: true
seo:
  metaTitle: "Grafana Pricing Teardown: Observability Platform"
  metaDescription: "Grafana has five active billing meters and a $25k/year enterprise cliff with nothing in between."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

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

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/).

*I build [Beton](https://getbeton.ai?utm_source=learninglate&utm_campaign=grafana_teardown&utm_medium=substack) — open source revenue intelligence for B2B SaaS.*
