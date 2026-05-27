---
title: "Pricing the Open Source Software, Vol 2"
description: "We tore down 20 open-source tools in 2026 and compared them to 2023: usage rates fell, AI credits arrived, and the SSO tax moved up a tier."
publishedAt: "2026-05-26"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "saas"]
featured: true
draft: true
coverImage: "/images/blog/commercial-open-source-pricing-2026-cover.jpeg"
tldr: |
  Two years after the first round of teardowns, we re-analyzed how 20 commercial open-source tools price — and pulled the 2023 numbers from Wayback to measure the change.

  - Per-unit prices fell where metering is mature: PostHog's per-event price dropped ~36%, ClickHouse storage ~28%
  - Appsmith killed hourly billing for a flat, cheaper seat price; ToolJet split one tier into five and added AI credits
  - The SSO tax hardened — Cal.com moved SSO from its cheapest paid tier up to a pricier one
  - SSO, RBAC, audit logs, and SLAs gate the top tier almost everywhere, from $9/seat (Twenty) to $25k/year (Grafana)
  - Strong copyleft (AGPL-3.0) is now nearly as common as MIT; usage-based pricing rivals per-seat
faq:
  - question: "What is this based on?"
    answer: "Twenty pricing teardowns we published in 2026, each verified against the vendor's live page, plus 2023 figures pulled from Wayback Machine snapshots of the same vendors' pricing pages."
  - question: "How are the 2023 numbers verified?"
    answer: "Each 2023 figure is quoted from an archived snapshot of the vendor's own pricing page from 2023 — not from memory. Eight of the twenty tools have a 2023 baseline; the rest are new to this volume."
  - question: "What changed most since 2023?"
    answer: "Usage-based metering spread beyond databases, AI credits became a standard line item, per-unit prices fell where metering matured, and SSO/compliance features drifted into higher, pricier tiers."
  - question: "What is the SSO tax?"
    answer: "Putting single sign-on, RBAC, audit logs, and SLAs behind the most expensive tier — so a small team needing SSO for a security review pays enterprise prices to get it."
seo:
  metaTitle: "Pricing the Open Source Software, Vol 2"
  metaDescription: "20 open-source tools, 2023 vs 2026: usage rates fell, AI credits arrived, and the SSO tax moved up a tier. Verified pricing analysis."
datasets:
  - name: "Commercial open-source pricing, 2023 vs 2026"
    description: "Entry price, pricing model, free tier, and SSO tier for 20 commercial open-source tools, with 2023 baselines verified against Wayback snapshots of each vendor's pricing page."
    keywords: ["open source pricing", "saas pricing", "pricing teardown", "2023", "2026"]
    url: "https://raw.githubusercontent.com/getbeton/oss-pricing-data/main/data/pricing-2023-2026.csv"
  - name: "Per-unit open-source price changes, 2023 to 2026"
    description: "Verified per-unit price deltas (per event, per TB, per seat) for metered open-source tools between 2023 and 2026."
    keywords: ["usage-based pricing", "price changes", "open source"]
    url: "https://raw.githubusercontent.com/getbeton/oss-pricing-data/main/data/unit-price-changes.csv"
  - name: "The SSO tax across open-source tools (2026)"
    description: "For 13 commercial open-source tools, the plan tier where single sign-on unlocks and the monthly cost of that tier."
    keywords: ["sso tax", "open source", "enterprise pricing", "saas"]
    url: "https://raw.githubusercontent.com/getbeton/oss-pricing-data/main/data/sso-tax.csv"
---

This is the second volume of a running project. The first was a series of pricing teardowns on my personal Substack — read a tool's pricing page line by line, read its license more carefully, decide whether the paid tier is worth it. Two years later I rebuilt the series on the Beton blog, re-verified every current number against the live pricing pages, and pulled the 2023 figures from the Wayback Machine so the comparison is real, not remembered.

This post analyzes what changed across [all 20 teardowns](/blog/teardowns/). Eight of them have a 2023 baseline; the rest are new to this volume. The raw data — every number with its source — is [public on GitHub](https://github.com/getbeton/oss-pricing-data).

<div class="not-prose" style="margin:32px 0;padding:24px;border:2px solid var(--color-border);background:var(--color-surface-raised)">
  <div style="font-size:18px;font-weight:700;margin-bottom:8px">Get every pricing teardown in your inbox</div>
  <div style="font-size:14px;color:var(--color-text-secondary);margin-bottom:16px">We tear down open-source pricing — what it really costs, what the license allows, whether it's worth paying for. No spam.</div>
  <form data-inline-subscribe style="display:flex;gap:12px;flex-wrap:wrap">
    <input type="email" name="email" required placeholder="you@company.com" style="flex:1;min-width:200px;padding:10px 16px;font-size:14px;border:2px solid var(--color-border);background:var(--color-surface);color:var(--color-text)" />
    <button type="submit" style="padding:10px 20px;font-size:14px;font-weight:700;background:var(--color-text);color:var(--color-surface);border:none;cursor:pointer">Subscribe</button>
  </form>
  <p data-sub-ok class="hidden" style="margin-top:12px;font-size:14px;color:#16a34a;font-weight:600">Check your inbox — we sent you a confirmation link</p>
  <p data-sub-err class="hidden" style="margin-top:12px;font-size:14px;color:#dc2626;font-weight:600">Something went wrong. Please try again.</p>
</div>

## The license is now a sales tool

<figure class="my-8" data-email-img="/images/blog/vol2-license.png">
<svg viewBox="0 0 560 130" role="img" aria-label="License across the 20 tools (2026). Strong copyleft (AGPL) is now nearly as common as permissive MIT." style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">MIT / MIT core</text><rect x="150" y="10" width="330" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="488" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">8</text><text x="0" y="54" fill="var(--color-text)" font-size="14">AGPL-3.0</text><rect x="150" y="40" width="289" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="447" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">7</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Apache 2.0</text><rect x="150" y="70" width="124" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="282" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">3</text><text x="0" y="114" fill="var(--color-text)" font-size="14">Source-available</text><rect x="150" y="100" width="82" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="240" y="114" fill="var(--color-text-secondary)" font-size="13" font-weight="600">2</text></svg>
<figcaption>License across the 20 tools (2026). Strong copyleft (AGPL) is now nearly as common as permissive MIT.</figcaption>
</figure>

Permissive MIT is still the most common license, but strong copyleft is right behind it. Seven of the twenty ship under AGPL-3.0 — a license that lets anyone read, run, and modify the code, but forces any networked modification to be open-sourced too. That clause makes it legally awkward for a cloud provider to take the project, host it, and resell it without contributing back. AGPL is the open-source answer to "what stops AWS from eating us."

The MIT count also overstates how open these tools really are. PostHog, Infisical, Chatwoot, and others put their core under MIT, then keep enterprise features — SSO, RBAC, audit logs — in a separate directory under a commercial license. The code is open. The features a company needs at scale are not. That open-core split is the dominant monetization pattern in the set.

## From seats to usage

<figure class="my-8" data-email-img="/images/blog/vol2-model.png">
<svg viewBox="0 0 560 100" role="img" aria-label="Primary pricing model (2026). Usage-based metering now rivals the per-seat model." style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="24" fill="var(--color-text)" font-size="14">Per-seat / per-user</text><rect x="150" y="10" width="330" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="488" y="24" fill="var(--color-text-secondary)" font-size="13" font-weight="600">8</text><text x="0" y="54" fill="var(--color-text)" font-size="14">Usage-based</text><rect x="150" y="40" width="289" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="447" y="54" fill="var(--color-text-secondary)" font-size="13" font-weight="600">7</text><text x="0" y="84" fill="var(--color-text)" font-size="14">Flat tiered</text><rect x="150" y="70" width="206" height="18" fill="var(--color-primary-600)" rx="1"></rect><text x="364" y="84" fill="var(--color-text-secondary)" font-size="13" font-weight="600">5</text></svg>
<figcaption>Primary pricing model (2026). Usage-based metering now rivals the per-seat model.</figcaption>
</figure>

The clearest structural change is metering. Usage-based pricing — pay per event, per GB, per run, per credit — used to be a database thing. Now it is everywhere: PostHog meters events, ClickHouse meters compute and storage, Grafana meters five separate signals, Firecrawl and Langfuse and Novu meter credits and runs. Seven of the twenty price primarily on usage, nearly matching the eight that still price per seat.

## What two years changed

For the eight tools covered in both volumes, here is the 2023-to-2026 delta. Every 2023 figure is quoted from an archived snapshot of that vendor's pricing page.

| Tool | 2023 | 2026 | What changed |
|---|---|---|---|
| Appsmith | $0.40/hr per user, capped $20/user-mo | $15/user-mo, flat | Dropped hourly billing for a flat, lower seat price |
| Cal.com | $12/seat — SSO at Teams | $12/seat — SSO at Organizations ($28) | Price held; SSO moved up a tier |
| Chatwoot | $19/agent; Enterprise $99 | $19/agent; Enterprise $99 | Unchanged |
| ClickHouse | $35.33/TB-mo + $0.2160/unit-hr | $25.30/TB-mo + $0.2181/unit-hr | Storage ~28% cheaper; compute roughly flat |
| Metabase | Cloud Starter $85 (+$5/user); Pro $500 | Starter $100 (+$6/user); Pro $575 | Base prices up ~15–18% |
| PostHog | $0.00031/event | $0.000198/event (first paid tier) | Per-event price fell ~36%; grew to 13 products |
| ToolJet | Business $24/builder + $8/end-user | Starter $19/builder; AI credits added | Split into five tiers, added AI credits |
| n8n | Execution-tiered (slider, no static price) | €20/mo Starter | Published a clear Starter price |

## Compute got cheaper; seats got simpler

The headline most people miss: where metering is mature, the per-unit price went *down*. Vendors got more efficient and passed some of it on to win adoption.

| Unit | 2023 | 2026 | Change |
|---|---|---|---|
| PostHog — identified event (first paid tier) | $0.00031 | $0.000198 | −36% |
| ClickHouse — storage per TB-month | $35.33 | $25.30 | −28% |
| ClickHouse — compute per unit-hour | $0.2160 | $0.2181 | ~flat |
| Appsmith — seat cap per user-month | $20 | $15 | −25% |

<figure class="my-8" data-email-img="/images/blog/vol2-evo.png">
<svg viewBox="0 0 500 256" role="img" aria-label="Entry price, 2023 vs 2026, for the tools covered in both volumes. Verified against Wayback snapshots of each vendor's 2023 pricing page." style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><rect x="110" y="6" width="14" height="14" fill="var(--color-text-tertiary)" rx="1"></rect><text x="130" y="17" fill="var(--color-text-secondary)" font-size="13">2023</text><rect x="180" y="6" width="14" height="14" fill="var(--color-primary-600)" rx="1"></rect><text x="200" y="17" fill="var(--color-text-secondary)" font-size="13">2026</text><text x="0" y="52" fill="var(--color-text)" font-size="14">Cal.com</text><rect x="110" y="30" width="36" height="15" fill="var(--color-text-tertiary)" rx="1"></rect><text x="153" y="42" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$12</text><rect x="110" y="48" width="36" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="153" y="60" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$12</text><text x="0" y="96" fill="var(--color-text)" font-size="14">Appsmith</text><rect x="110" y="74" width="60" height="15" fill="var(--color-text-tertiary)" rx="1"></rect><text x="177" y="86" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$20 cap</text><rect x="110" y="92" width="45" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="162" y="104" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$15</text><text x="0" y="140" fill="var(--color-text)" font-size="14">Chatwoot</text><rect x="110" y="118" width="57" height="15" fill="var(--color-text-tertiary)" rx="1"></rect><text x="174" y="130" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$19</text><rect x="110" y="136" width="57" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="174" y="148" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$19</text><text x="0" y="184" fill="var(--color-text)" font-size="14">ToolJet</text><rect x="110" y="162" width="72" height="15" fill="var(--color-text-tertiary)" rx="1"></rect><text x="189" y="174" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$24</text><rect x="110" y="180" width="57" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="174" y="192" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$19</text><text x="0" y="228" fill="var(--color-text)" font-size="14">Metabase</text><rect x="110" y="206" width="255" height="15" fill="var(--color-text-tertiary)" rx="1"></rect><text x="372" y="218" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$85</text><rect x="110" y="224" width="300" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="417" y="236" fill="var(--color-text-secondary)" font-size="12" font-weight="600">$100</text></svg>
<figcaption>Entry price, 2023 vs 2026, for the tools covered in both volumes. Verified against Wayback snapshots of each vendor's 2023 pricing page.</figcaption>
</figure>

The flat-rate tools mostly held or nudged up (Metabase +15–18%, Cal.com and Chatwoot flat), while the metered and hourly models came down. The lesson for buyers: on a usage-priced tool, time is on your side — rates trend down as the vendor scales. On a per-seat tool, you pay today's price and it rarely falls.

## AI credits: the line item that didn't exist in 2023

None of the 2023 snapshots had an AI credit. By 2026 they are everywhere: ToolJet grants 2,000 AI credits per builder, Dify sells credit bundles, PostHog runs a separate AI-observability meter, and Chatwoot bills its Captain AI assistant at $20 per 1,000 credits. AI features arrived as a metered add-on bolted onto the existing model rather than folded into the base price — a new axis of spend on top of seats and usage. Budget for it separately; it is the easiest line to overlook and the fastest to grow.

## Where pricing starts

<figure class="my-8" data-email-img="/images/blog/vol2-entry.png">
<svg viewBox="0 0 520 452" role="img" aria-label="Cheapest fixed monthly paid tier, 2026, sorted. Most cluster $5–$30; the jump to $59+ is steep. PostHog, ClickHouse, and Grafana are excluded — usage-priced, no fixed entry." style="width:100%;height:auto;font-family:Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"><text x="0" y="20" fill="var(--color-text)" font-size="14">Coolify</text><rect x="110" y="9" width="14" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="132" y="20" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$5</text><text x="0" y="46" fill="var(--color-text)" font-size="14">Plane</text><rect x="110" y="35" width="16" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="134" y="46" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$6/seat</text><text x="0" y="72" fill="var(--color-text)" font-size="14">Twenty CRM</text><rect x="110" y="61" width="25" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="143" y="72" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$9/seat</text><text x="0" y="98" fill="var(--color-text)" font-size="14">Cal.com</text><rect x="110" y="87" width="33" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="151" y="98" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$12/seat</text><text x="0" y="124" fill="var(--color-text)" font-size="14">Appsmith</text><rect x="110" y="113" width="41" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="159" y="124" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$15/user</text><text x="0" y="150" fill="var(--color-text)" font-size="14">Firecrawl</text><rect x="110" y="139" width="44" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="162" y="150" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$16</text><text x="0" y="176" fill="var(--color-text)" font-size="14">Infisical</text><rect x="110" y="165" width="50" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="168" y="176" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$18/identity</text><text x="0" y="202" fill="var(--color-text)" font-size="14">Chatwoot</text><rect x="110" y="191" width="52" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="170" y="202" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$19/agent</text><text x="0" y="228" fill="var(--color-text)" font-size="14">ToolJet</text><rect x="110" y="217" width="52" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="170" y="228" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$19/builder</text><text x="0" y="254" fill="var(--color-text)" font-size="14">n8n</text><rect x="110" y="243" width="60" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="178" y="254" fill="var(--color-text-secondary)" font-size="13" font-weight="600">~$22</text><text x="0" y="280" fill="var(--color-text)" font-size="14">Documenso</text><rect x="110" y="269" width="69" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="187" y="280" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$25</text><text x="0" y="306" fill="var(--color-text)" font-size="14">Langfuse</text><rect x="110" y="295" width="80" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="198" y="306" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$29</text><text x="0" y="332" fill="var(--color-text)" font-size="14">Novu</text><rect x="110" y="321" width="82" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="200" y="332" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$30</text><text x="0" y="358" fill="var(--color-text)" font-size="14">Dify</text><rect x="110" y="347" width="162" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="280" y="358" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$59</text><text x="0" y="384" fill="var(--color-text)" font-size="14">Temporal</text><rect x="110" y="373" width="275" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="393" y="384" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$100</text><text x="0" y="410" fill="var(--color-text)" font-size="14">Metabase</text><rect x="110" y="399" width="275" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="393" y="410" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$100 base</text><text x="0" y="436" fill="var(--color-text)" font-size="14">Windmill</text><rect x="110" y="425" width="330" height="15" fill="var(--color-primary-600)" rx="1"></rect><text x="448" y="436" fill="var(--color-text-secondary)" font-size="13" font-weight="600">$120</text></svg>
<figcaption>Cheapest fixed monthly paid tier, 2026, sorted. Most cluster $5–$30; the jump to $59+ is steep. PostHog, ClickHouse, and Grafana are excluded — usage-priced, no fixed entry.</figcaption>
</figure>

For the tools with a fixed monthly entry tier, most start cheap — between $5 and $30/month, a self-hoster's convenience fee. Above it sits a gap to the $59–$120 tier, where the tool is priced as serious infrastructure. PostHog, ClickHouse, and Grafana don't appear here — they have no fixed entry price, only usage, so a quiet month costs almost nothing and a busy one can cost thousands.

## The SSO tax, quantified

The entry price is rarely where the real money is. Single sign-on, SCIM, RBAC, audit logs, and SLAs sit behind a higher tier almost everywhere. Here is the tier you actually have to buy to get SSO, sorted by cost:

| Tool | SSO unlocks at | Cost of that tier |
|---|---|---|
| Twenty CRM | Pro | $9/seat-mo |
| Infisical | Pro | $18/identity-mo |
| Cal.com | Organizations | $28/seat-mo |
| Chatwoot | Enterprise | $99/agent-mo |
| PostHog | Boost add-on | $250/mo |
| Langfuse | Enterprise | $499/mo |
| Temporal | Enterprise | $500/mo |
| Metabase | Pro | $575/mo base |
| Appsmith | Enterprise | $2,500/mo (100 users) |
| Grafana | Enterprise | $25,000/year commit |
| ToolJet / n8n / Windmill | Enterprise | custom / contact sales |

The spread is enormous — from $9/seat (Twenty CRM treats SSO as table stakes) to a $25,000/year floor (Grafana). And the tax is migrating: Cal.com offered SAML SSO on its cheapest paid Teams tier in 2023; by 2026 it sits one tier up, on Organizations at $28/seat. The feature didn't change. Its price did. If you build on any of these, find out where the SSO line is *before* a customer's security review forces you across it.

## What it means if you're buying

- **Read the license before the price.** AGPL is fine internally; it only bites if you host and resell. The open-core split matters more — check whether the features you need are in the open core or the commercial directory.
- **On usage-priced tools, expect rates to fall.** PostHog and ClickHouse both cut per-unit prices since 2023. Model your real volumes in the vendor's calculator; the headline rate is a ceiling that tends to drop.
- **Price in the SSO tax early.** The jump from a $20/month plan to a $25k/year commit is usually triggered by SSO or compliance, not features. Know where that line is before you build.
- **Track the AI meter separately.** AI credits are a new, easy-to-miss axis of spend. Treat them like any other usage line.

## The full series

Every teardown below was re-verified against the vendor's live pricing in 2026.

- [PostHog](/blog/posthog-pricing-teardown/) — product analytics, usage-metered across 13 products
- [ClickHouse](/blog/clickhouse-pricing-teardown/) — columnar database, compute + storage by usage
- [Metabase](/blog/metabase-pricing-teardown/) — BI, base + per-user, $20k/year enterprise floor
- [Cal.com](/blog/calcom-pricing-teardown/) — scheduling, MIT, $12/seat Teams
- [Appsmith](/blog/appsmith-pricing-teardown/) — internal tools, hourly billing dropped for $15/user
- [ToolJet](/blog/tooljet-pricing-teardown/) — internal tools, five tiers + AI credits
- [Chatwoot](/blog/chatwoot-pricing-teardown/) — support inbox, MIT core + Captain AI credits
- [Grafana](/blog/grafana-pricing-teardown/) — observability, five usage meters, $25k/year floor
- [Dify](/blog/dify-pricing-teardown/) — LLM app platform, modified Apache + credit bundles
- [Langfuse](/blog/langfuse-pricing-teardown/) — LLM observability, MIT core, usage units
- [Firecrawl](/blog/firecrawl-pricing-teardown/) — web scraping, credit-based
- [n8n](/blog/n8n-pricing-teardown/) — workflow automation, per-execution
- [Windmill](/blog/windmill-pricing-teardown/) — workflow/internal tools, developer/operator split
- [Temporal](/blog/temporal-pricing-teardown/) — durable execution, $100/month floor
- [Plane](/blog/plane-pricing-teardown/) — project management, AGPL, $6/seat
- [Twenty CRM](/blog/twenty-crm-pricing-teardown/) — CRM, AGPL, $9/seat
- [Documenso](/blog/documenso-pricing-teardown/) — e-signing, AGPL-3.0
- [Infisical](/blog/infisical-pricing-teardown/) — secrets management, MIT core + proprietary EE
- [Novu](/blog/novu-pricing-teardown/) — notifications, run-metered
- [Coolify](/blog/coolify-pricing-teardown/) — self-hosted PaaS, $5/month cloud

We build [Beton](/) on top of a lot of these. Reading their pricing and licenses closely is part of the job — and the same data-quality discipline goes into the signals we ship.
