---
title: "ClickHouse Pricing Teardown 2026"
description: "ClickHouse Cloud starts at $66/month for Basic and $499/month for Scale — with a free trial but no permanent free tier."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "database"]
featured: false
draft: false
coverImage: "/images/blog/clickhouse-pricing-cover.jpeg"
tldr: |
  ClickHouse is a column-oriented OLAP database built for real-time analytical queries at scale. Originally developed at Yandex, it spun out as an independent company that raised $300M at a $2B valuation. ~47.6k GitHub stars, Apache 2.0 core, and a managed cloud with three tiers and no permanent free tier.

  - No permanent free tier — ClickHouse Cloud offers a 30-day trial only ($300 in credits)
  - Usage-based: storage is $25.30 per 1 TB/month on every tier; compute runs $0.2181/$0.2985/$0.3903 per unit-hour on Basic/Scale/Enterprise
  - Worked example: a small Basic service (6h/day) is ~$66.52/month; running it 24/7 is ~$186/month
  - Scale example bills start at $499.38/month (multi-replica, auto-scaling, private networking)
  - Enterprise example bills run ~$2,669 to ~$9,714/month — custom configs, HIPAA/PCI, SAML/SSO, CMEK
  - Self-hosting on Apache 2.0 is a genuine alternative — anyone who can run a Docker container can skip Cloud entirely
faq:
  - question: "Is ClickHouse open source?"
    answer: "Yes. The core ClickHouse database is Apache 2.0. ClickHouse Cloud is a separate managed service with its own billing. There are no BSL or open-core license restrictions on the core engine — you can self-host without commercial restrictions."
  - question: "Is there a free tier on ClickHouse Cloud?"
    answer: "No permanent free tier. ClickHouse Cloud offers a 30-day trial with $300 in credits, but after the trial you must pick a paid plan or self-host. Basic's published rates are $25.30 per 1 TB/month storage plus $0.2181 per compute unit/hour; a realistic small Basic service works out to about $66.52/month in ClickHouse's own example."
  - question: "What does the cheapest paid plan include?"
    answer: "Basic bills storage at $25.30 per 1 TB/month and compute at $0.2181 per unit/hour. ClickHouse's worked example puts a small service at $66.52/month, but that assumes only 6 hours of activity per day (1 replica, 8 GiB RAM, 2 vCPU, 500 GB compressed storage, 500 GB backup, daily backups with 1-day retention). Run it 24/7 and the same config is $186.27/month. Single-zone only — no high availability. Storage is capped at 1 TB per service."
  - question: "What does Scale add over Basic?"
    answer: "Scale's example bills start at $499.38/month. It adds multi-replica deployments across 2+ availability zones, automatic vertical scaling and manual horizontal scaling, compute-compute separation, configurable backups, private networking, and S3 role-based access. Unlimited storage instead of Basic's 1 TB cap, and a higher compute rate ($0.2985 vs $0.2181 per unit/hour)."
  - question: "Why would someone pay for Cloud over self-hosting?"
    answer: "Operational simplicity: no cluster management, no hardware provisioning, automatic scaling, managed backups. For teams without dedicated infrastructure engineers, that's worth paying for. For teams that have someone who can manage a cluster, the Apache 2.0 license makes self-hosting a legitimate cost control option."
pricingTable:
  license: "Apache 2.0 (core)"
  stars: "~47.6k"
  freeTier: "30-day trial only (no permanent free tier)"
  cheapestPaid: "Basic usage-based: $25.30/TB-mo storage + $0.2181/unit-hr compute (~$66.52/mo small-service example)"
  verdict: "Self-host for cost control; Cloud makes sense only if you're paying for operational simplicity"
seo:
  metaTitle: "ClickHouse Pricing Teardown: Cloud Plans Explained"
  metaDescription: "ClickHouse Cloud starts at $66/month for Basic and $499/month for Scale, with a 30-day free trial but no permanent free tier."
---

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

ClickHouse is a column-oriented analytical database built for queries that bring a transactional database to its knees — billions of rows, sub-second aggregations, millions of events per second. Yandex built it for Metrica, their web analytics product, and open-sourced it in 2016. The company that formed around it raised $300M at a $2B valuation. At ~47.6k GitHub stars, it's an infrastructure default in the OSS database world.

- Website: [clickhouse.com](https://clickhouse.com)
- Pricing: [clickhouse.com/pricing](https://clickhouse.com/pricing)
- GitHub: [github.com/ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)

**Plans**

ClickHouse Cloud runs three tiers on AWS, GCP, and Azure. Compute and storage bill separately, metered per minute in 8 GiB RAM increments. The dollar figures below are ClickHouse's own worked examples from the docs (AWS us-east-1) — specific replica, storage, backup, and egress configs bundled into one monthly total. They are illustrative, not floor prices. The real floor is the per-unit rate: $25.30/month of storage plus the compute you consume.

- **Basic — example bill $66.52/month:** ClickHouse's worked example puts a small service at $66.52/month, assuming 6 hours of activity per day (1 replica, 8 GiB RAM, 2 vCPU, 500 GB compressed data + 500 GB backup). The same config runs $106.44 at 12h/day and $186.27 at 24h/day. Daily backups, 1-day retention. Single-zone only. Storage capped at 1 TB per service. 8–12 GiB total memory, not configurable.
- **Scale — example bill from $499.38/month:** 2+ replicas across multiple availability zones. Unlimited storage. Automatic vertical scaling, manual horizontal scaling. Compute-compute separation. Configurable backup schedule and retention. Private networking and S3 role-based access. Higher per-unit compute rate ($0.2985/unit/hr). The published examples run $499.38, $986.92, and $1,474.47/month by replica size.
- **Enterprise — example bills from $2,669/month:** High-memory configs and large storage at the highest compute rate ($0.3903/unit/hr). The published examples range from $2,669.40/month (5 TB) to $9,713.79/month (20 TB). SAML/SSO, private regions, transparent data encryption / CMEK, HIPAA and PCI compliance, scheduled upgrades, named lead support engineer. Contact-sales tier; starting prices vary.

Storage bills the same across all three tiers at $25.30 per 1 TB/month (varies by region and cloud provider). The compute rate climbs with the tier: $0.2181/unit/hr on Basic, $0.2985 on Scale, $0.3903 on Enterprise, metered per minute in 8 GiB RAM increments. Data transfer bills separately — public internet egress from $0.1152/GB, inter-region egress from $0.0312/GB. ClickPipes (managed ingestion) adds $0.04/GB ingested plus $0.20/hr per compute unit.

There is no permanent free tier. ClickHouse Cloud offers a 30-day trial with $300 in credits.

**The self-hosting math**

It's hard to imagine a team that needs ClickHouse at scale but lacks someone who can run a Docker container.

The Apache 2.0 license puts no commercial restrictions on self-hosting. ClickHouse runs on a single server for development and scales to a cluster for production, with official Docker images and Kubernetes Helm charts. A 16 GiB cloud VM costs roughly $80–150/month by provider and region — comparable to Basic, but without the 1 TB storage cap and with full config control.

The case for Cloud is operational burden, not capability. No infrastructure engineers and you want zero cluster maintenance? Cloud removes real work. If someone can manage a Postgres server, they can manage ClickHouse — and Apache 2.0 means you're not paying for that capability.

**The ~7.5x gap between Basic and Scale**

ClickHouse's example bills put a small Basic service around $66/month and the entry Scale service at $499/month — a ~7.5x jump. The per-unit rates barely differ ($0.2181 vs $0.2985 per compute unit/hour), so the gap is bigger configs and more replicas, not a rate hike. What you buy: multi-zone redundancy, auto-scaling, compute-compute separation, private networking, configurable backups.

For production, the Basic limits matter. Single-zone means no high availability. The 1 TB storage cap is low for a database sold as "analytics at scale." Manual-only scaling means sizing for peak — overprovisioning or scrambling during spikes.

Basic is a development or staging environment, not a production tier. The real choice is Scale vs. self-hosting, and Scale's ~$500/month is the threshold where self-hosting starts looking attractive.

**Compute + storage separation**

ClickHouse Cloud separates compute and storage billing — the right model for an OLAP database. Storage grows predictably; compute scales down to zero when idle (Scale and Enterprise). You don't pay for compute when no queries run — useful for clear peak/off-peak patterns.

Basic benefits less cleanly. Its example bill assumes 6 hours of activity per day, so the $66.52 figure bakes in significant idle time. Running Basic continuously costs $186.27/month — nearly 3x the headline.

**License**

Apache 2.0 for the core ClickHouse database. No BSL restrictions, no open-core commercial license on the engine. ClickHouse Cloud is a separate product built on top, billed separately. The database you'd self-host is the same one powering Cloud — no feature-gating between the open-source build and the managed service, only the operational layer differs.

That sets ClickHouse apart from tools that keep their best features proprietary. The columnar engine, query optimizer, and integrations are all Apache 2.0. You pay Cloud for infrastructure operations, not feature access.

**Worth paying for?**

ClickHouse Cloud makes sense for teams that need real-time OLAP without managing a cluster — and will pay $499/month or more for Scale, the first production-grade tier. Basic is a staging environment with a storage cap; the $66/month headline doesn't change that.

For teams with any infrastructure capability, self-hosting is the answer. Apache 2.0, no commercial restrictions, runs on any cloud or on-prem. 47.6k GitHub stars and an active community mean solid documentation, maintained packages, and real answers in forums.

Enterprise requires a sales conversation, sized for large data volumes (examples start at 5 TB) with compliance needs. At that scale, you already know whether Cloud Enterprise or a managed cluster on your own infrastructure fits better.

---


## How ClickHouse pricing scales

ClickHouse Cloud meters storage at a flat $25.30 per TB-month (compute is billed separately by usage), so the storage component of the bill scales linearly with data volume.

<figure class="my-8">
<svg viewBox="0 0 660 296" role="img" aria-label="cost scales by TB" style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><line x1="70" y1="250.0" x2="600" y2="250.0" stroke="var(--color-border)" stroke-width="1"></line><text x="62" y="254.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$0</text><line x1="70" y1="194.0" x2="600" y2="194.0" stroke="var(--color-border)" stroke-width="1"></line><text x="62" y="198.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$500</text><line x1="70" y1="138.0" x2="600" y2="138.0" stroke="var(--color-border)" stroke-width="1"></line><text x="62" y="142.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,000</text><line x1="70" y1="82.0" x2="600" y2="82.0" stroke="var(--color-border)" stroke-width="1"></line><text x="62" y="86.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$1,500</text><line x1="70" y1="26.0" x2="600" y2="26.0" stroke="var(--color-border)" stroke-width="1"></line><text x="62" y="30.0" fill="var(--color-text-secondary)" font-size="12" text-anchor="end">$2,000</text><text x="70.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">1 TB</text><text x="202.5" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">5 TB</text><text x="335.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">10 TB</text><text x="467.5" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">25 TB</text><text x="600.0" y="272" fill="var(--color-text-secondary)" font-size="12" text-anchor="middle">50 TB</text><polyline points="70.0,247.2 202.5,235.8 335.0,221.7 467.5,179.2 600.0,108.3" fill="none" stroke="var(--color-primary-600)" stroke-width="2.5"></polyline><circle cx="70.0" cy="247.2" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="202.5" cy="235.8" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="335.0" cy="221.7" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="467.5" cy="179.2" r="3.5" fill="var(--color-primary-600)"></circle><circle cx="600.0" cy="108.3" r="3.5" fill="var(--color-primary-600)"></circle></svg>
<figcaption>ClickHouse storage cost by volume ($25.30/TB-month). Compute is metered separately on top.</figcaption>
</figure>

This post is a part of series on commercial open source software pricing. See full list of articles [here](/blog/teardowns/).

*I build [Beton](https://getbeton.ai) — open source revenue intelligence for B2B SaaS.*
