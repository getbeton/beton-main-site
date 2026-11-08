---
title: "How Beton works: Inspector tracks, the agent hunts"
description: "Beton is now two halves that do one job. Inspector is the app you log into — integrations, tracking, workspaces, CRM routing. The agent is the open-source pipeline that hunts for signals in your data and hands them back. Here's how they fit together, with the code."
publishedAt: "2026-06-01"
author: "Vlad Nadymov"
tags: ["product update", "beton", "architecture"]
featured: true
draft: false
coverImage: "/images/blog/inspector-agent/data-flow.jpg"
tldr: |
  Beton split into two clean halves this month. Inspector (the Next.js app) handles integrations, event tracking, multi-user workspaces, and routing signals into your CRM. The agent — open-source `inspector-ml-backend`, codename Mason — does the discovery: it reads your site, maps your warehouse, and runs a hypothesis loop to find reusable signals.

  - **The handoff shipped.** We deleted Inspector's hand-written detection engine entirely. Inspector no longer decides which patterns matter — the agent discovers them, Inspector tracks them.
  - **Sign up → onboard → the agent fires automatically.** On onboarding-complete, Inspector kicks off an agent session in the background, no button to press.
  - **The agent is a 4-stage pipeline.** Site discovery → warehouse analysis → a signal-hunting loop (Explorer proposes a query, Reviewer approves it) → finalize, with a holdout rerun to check the signal still holds.
  - **What it produces:** reusable signal definitions with cohort evidence, which Inspector then tracks on a cron and syncs to Attio.
faq:
  - question: "Is the agent open source?"
    answer: "Yes. The discovery agent lives in the inspector-ml-backend repo on GitHub under AGPLv3. It's built on Google's ADK. The app (Inspector) talks to it over HTTP; the agent calls back into Inspector for data access so no warehouse credentials ever leave your workspace."
  - question: "What's the difference between Inspector and the agent?"
    answer: "Inspector is the product you log into — it owns integrations, event tracking, workspaces and RBAC, field mapping, and CRM routing. The agent is the discovery brain — it reads your site and warehouse and proposes signals. Inspector tracks whatever the agent (or you) defines."
  - question: "Does the agent need my database credentials?"
    answer: "No. The agent never receives credentials. When it needs to run a query, it calls back into Inspector's read-only SQL proxy, and Inspector resolves the credentials server-side and runs the query for it. The agent only ever sees results, never secrets."
seo:
  metaTitle: "How Beton works: Inspector tracks, the agent hunts"
  metaDescription: "Inside Beton's architecture: the app handles integrations, tracking and CRM routing; the open-source agent discovers signals in your warehouse."
---

hey, it's [Vlad](https://www.linkedin.com/in/vlad-nadymov/), founder of Beton.

this month we finished a change we've been building toward for a while: Beton is now two clean halves that do one job between them. it's worth explaining how they fit, because it's the whole product in one diagram — and because both halves are open and you can read the code.

the short version: **Inspector is the app, the agent is the brain.** Inspector handles everything you touch — connecting PostHog and your warehouse, tracking events, workspaces, mapping signals into your CRM. the agent does the part that used to be a person's job: reading your data and figuring out which behaviors actually predict revenue.

### the job we're hired to do

every team we talk to has the same shape of problem. there's behavioral data sitting in a warehouse. everyone agrees there's signal in it — which accounts are about to churn, which trial users are about to convert, which customers are quietly stalling before renewal. and nobody has the analyst-hours to go hunting for that signal, validating it, and wiring it into the CRM so a human actually acts on it.

so the job is narrow: **find the behaviors in my data that predict revenue, prove they hold, and put them where my team works — without me hiring someone to stare at the warehouse all day.** that's the job. the two halves below are how we do it.

## what changed: we deleted our own detection engine

until this month, Inspector shipped with a hand-written detection engine — a tree of hard-coded detectors (`arr-decrease`, `trial-ending`, `approaching-seat-limit`, and ~20 more) plus a scoring config we maintained by hand. it worked, but it encoded *our* guesses about what matters, not what's actually true in your data.

so we removed it. the [commit that did this](https://github.com/getbeton/inspector/commit/5a4c47d) deletes the entire heuristics tree and replaces "decide which patterns matter" with "let the agent discover them; Inspector just tracks." that one diff is the spine of everything below.

Inspector got simpler and the agent got smarter. here's the flow.

## the data flow, end to end

<aside class="cta-card">
  <span class="cta-eyebrow">Read the source</span>
  <p class="cta-body">Both halves are public. The app and the agent are separate repos — open them side by side as you read.</p>
  <a class="cta-button" href="https://github.com/getbeton/inspector-ml-backend">Open the agent on GitHub</a>
</aside>

1. **you finish onboarding.** you connect a data source (PostHog or a Postgres warehouse), point us at a CRM, and that's it.

2. **Inspector fires the agent — automatically.** there's no "run analysis" button. when onboarding completes, the [`/api/onboarding/complete`](https://github.com/getbeton/inspector/blob/main/src/app/api/onboarding/complete/route.ts#L26-L72) route schedules the agent kick-off inside Next's `after()`, so the request returns to you instantly while the work continues server-side.

```ts
after(async () => {
    const res = await fetch(runUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(runPayload),
    });
    if (!res.ok) {
        await updateSessionStatus(sessionId, 'failed', `Agent run failed: ${res.status}`);
    } else {
        await updateSessionStatus(sessionId, 'running');
    }
});
```
<small>— [`src/lib/agent/agent-service.ts`](https://github.com/getbeton/inspector/blob/main/src/lib/agent/agent-service.ts#L63-L180)</small>

3. **a session gets tracked.** every run is a row in `workspace_agent_sessions` — `created` → `running` → `completed`/`failed`. the kick-off is idempotent: if a session ran in the last 24 hours, it won't fire again.<sup class="sidenote-ref">[1]</sup>

<aside class="sidenote" data-n="1">
  <span class="sidenote-text">Being honest: getting these sessions to run reliably end-to-end was the hard part this month. A chunk of the work was making the background fetch and session lifecycle robust instead of silently stuck.</span>
</aside>

4. **the agent does its thing** (next section), calling *back* into Inspector whenever it needs data — through a read-only SQL proxy. **no credentials are ever sent to the agent.** it asks Inspector to run a query; Inspector resolves your secrets server-side and returns only results.

5. **discovered signals come home.** the agent's output is a set of signal definitions, which land back in Inspector as `signal_definitions` with `source='agent'`. this is a defined contract — Inspector exposes the [ingestion endpoint](https://github.com/getbeton/inspector/blob/main/src/app/api/agent/signals/route.ts#L67-L149) and the agent fills it.

```ts
const rows = items.map((c) => ({
  workspace_id: workspaceId,
  source: 'agent',
  name: c.name,
  query_template: c.query_template,
  interpretation: c.interpretation ?? null,
  status: c.status ?? 'promoted',
  promotion_evidence: c.promotion_evidence ?? null,
  created_by: `agent:${session_id}`,
}))
await supabase.from('signal_definitions')
  .upsert(rows, { onConflict: 'workspace_id,name' })
```
<small>— [`src/app/api/agent/signals/route.ts`](https://github.com/getbeton/inspector/blob/main/src/app/api/agent/signals/route.ts#L67-L149)</small>

6. **Inspector tracks, forever after.** a daily cron walks *every* active signal definition — the ones the agent found and any you wrote by hand — and refreshes the metrics. a second cron re-runs each signal and [syncs the results to Attio](https://github.com/getbeton/inspector/blob/main/src/app/api/cron/sync-signals/route.ts#L1-L22): add the accounts that now match, remove the ones that don't.

![How Inspector and the agent hand work off to each other](/images/blog/inspector-agent/data-flow.jpg)

## what Inspector does (the half you log into)

Inspector is a Next.js app. its job is to be the boring, reliable infrastructure around the agent:

- **sources:** PostHog and Postgres warehouses. connect a production replica, a Supabase project, or a dedicated analytics warehouse.
- **destinations:** Attio today. signals route in as list membership + field values.
- **multi-user workspaces with real RBAC** — owner / admin / member, with a [static permission matrix](https://github.com/getbeton/inspector/blob/main/src/lib/auth/permissions.ts#L40-L51) so you can see who configured the pipeline that produced a signal and who's responsible for acting on it.
- **editable field mapping.** map a signal's output onto CRM fields with source / property / formula pickers; the config is stored as JSON and [merged on save](https://github.com/getbeton/inspector/blob/main/src/app/api/integrations/attio/mappings/route.ts#L39-L90) rather than overwritten.


none of this is glamorous. it's the part that has to never break so the interesting half can do its job.

### what it actually feels like to use

the whole point of the split is that the work disappears. you connect a source, point us at Attio, and finish onboarding. that's the last button you press. there's no model to configure, no detector to write, no rules engine to tune.

a little later, signals start showing up on your signals page — each one a plain-English definition you can read ("accounts that did X then stopped doing Y within 30 days"), with the cohort evidence behind it and the exact query it runs. you decide which ones go live. the ones you keep get tracked on a schedule and pushed into your CRM as account membership, so your team sees them where they already work instead of in yet another dashboard.

the mental model is simple: **you curate, the agent hunts, Inspector does the plumbing.**

![Signals page — agent-discovered and hand-written definitions, side by side](/images/blog/inspector-agent/signals-list.jpg)

## what the agent does (the open-source brain)

the agent — repo name `inspector-ml-backend`, codename Mason — is a Python service built on Google's ADK. it runs as a [four-stage pipeline](https://github.com/getbeton/inspector-ml-backend/blob/master/projects/upsell_ranker/versions/v0.0.2/upsell_agent/agent.py#L463-L466):

```python
root_agent = SequentialAgent(
    name="upsell_pipeline",
    sub_agents=[upsell_worker, dwh_analyst, signal_agent_root, pipeline_finalize_agent],
)
```

1. **site discovery.** it fetches your homepage, summarizes your business model, product, ICP, and pricing, and writes that context back into Inspector. this matters because a behavioral event is meaningless without knowing what the product does — "user did X three times" only means something once the agent knows what X is.

![Site discovery — the agent's scraped context blocks about your business](/images/blog/inspector-agent/site-discovery.jpg)

2. **warehouse analysis.** read-only exploration of your data: it discovers tables and columns, finds the behavioral fact tables, and flags the revenue/expansion columns (ARR, seats, usage).

![Warehouse analysis — the agent's map of your tables and how they join](/images/blog/inspector-agent/agent-warehouse.jpg)

3. **the signal-hunting loop.** this is the only stage that loops, and it's the heart of the thing. each iteration runs a two-model pair:
   - an **Explorer** proposes exactly one reusable signal and writes the query for it — restricted to a safe, read-only subset of SQL.
   - a **Reviewer** approves or rejects it on grain clarity, temporal logic, and whether it actually lines up with a real success event.

   the loop exits *deterministically from state*, not because a model "feels done" — it stops when it's promoted enough signals, hit too many failures, or run its iteration budget:

```python
reached_limits = (
    iteration >= max_iterations
    or promoted_count >= target_promoted
    or failures >= max_failures
)
should_exit = reached_limits and iteration >= min_iterations_before_exit
```
<small>— [`signal_agent/agent.py`](https://github.com/getbeton/inspector-ml-backend/blob/master/projects/upsell_ranker/versions/v0.0.2/signal_agent/agent.py#L43-L388)</small>

4. **finalize.** the strongest candidates get packaged with their evidence, and the agent does a **holdout rerun** — it shifts each promoted signal's time window by two weeks, re-runs the query, and checks the pattern still holds. a signal that only worked on the data it was discovered from doesn't survive.

**what it produces:** reusable signal definitions, each with a query template, a plain-English interpretation, and **cohort evidence** — how the converting cohort behaves versus the rest. it's not a black-box score; it's a definition you can read, audit, and edit.

![Query history — the actual HogQL the agent wrote and ran while hunting](/images/blog/inspector-agent/agent-queries.jpg)

<aside class="cta-card">
  <span class="cta-eyebrow">Try Beton</span>
  <p class="cta-body">Connect a warehouse, finish onboarding, and the agent goes hunting. You don't write the detectors — it finds them.</p>
  <a class="cta-button" href="https://inspector.getbeton.ai/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=inspector-agent-explainer&amp;utm_content=cta-bottom">Start a workspace</a>
</aside>

## what it's finding in the wild

the system is in pilots now, and the problem shape is consistent across very different businesses.

our furthest-along pilot is with a **marketplace platform** serving thousands of small-business sellers. each seller is tiny in revenue terms, but the long tail is most of their volume — and account managers can't watch thousands of accounts by hand, so churn shows up at renewal time when it's already too late. we're running a backtested signal hunt on their warehouse: which behavioral sequences predict a seller slipping toward churn over the next 30 days, discovered from historical data and confirmed on a holdout window so we're not fooling ourselves.

three more live conversations, same underlying ask in different verticals:

- **a delivery marketplace** wants to catch repeat-buy frequency degrading inside the renewal window, before the customer churns on price.
- **a PLG marketing platform** wants to know which first-week behaviors predict 14-day retention versus expansion versus no-show, routed into a tiered onboarding response.
- **a security vendor** wants to find big accounts that are technically still paying but have quietly stopped using the product — the leading indicator of non-renewal.

different industries, identical job: behavioral data in a warehouse, known signal inside it, no team-time to hunt it manually. that's the wedge.

## why split it this way

two reasons.

**failures get localized.** when discovery was one monolithic prompt, a failure anywhere blew up the whole run and debugging was miserable. as named stages with their own traces, a failure is contained and you can see exactly which step did what.<sup class="sidenote-ref">[2]</sup>

<aside class="sidenote" data-n="2">
  <span class="sidenote-text">We route the agent's model calls through a single factory and wire observability at import time, so every run is traceable. That telemetry layer is staged on a branch right now, not yet on main.</span>
</aside>

**the brain can improve without touching the app.** because the agent is a separate, open-source service talking to Inspector over a defined contract, we can make discovery smarter — better priors, better review, more statistical rigor — without redeploying the product. and you can read every line of how it decides.

that's the whole system: **Inspector tracks, the agent hunts.** one's the reliable infrastructure you log into, the other's the open-source brain that does the work a RevOps analyst would do if they had the time to stare at your warehouse all day.

— [Vlad](https://www.linkedin.com/in/vlad-nadymov/)
