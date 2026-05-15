---
title: "First-party vs third-party signals — and how to actually use them"
description: "Third-party intent is a category-level guess. First-party signals are the buyer using your product. Here's the operational difference, a working schema, the scoring model, and the false-positive math nobody publishes."
publishedAt: "2026-05-15"
author: "Vlad Nadymov"
tags: ["signals", "revops", "plg", "posthog", "postgres", "attio"]
featured: true
draft: false
coverImage: "/images/blog/first-party-vs-third-party/slide-1-comparison.png"
tldr: |
  Third-party signals (web visits, hiring, intent feeds) tell you something happened in the buyer's category. First-party signals (clicks, billing events, API calls) tell you something happened in your product. If you sell to people who use the product before they buy, first-party is the higher-quality system on quality, freshness, and feedback. If you sell to enterprise buying committees on 18-month cycles, third-party still earns its seat. Most teams need one done well, not both done badly.

  This post is the operational version: definitions, a working Postgres schema, a scoring model you can ship in a weekend, and the false-positive math the rest of the category goes quiet on.
seo:
  metaTitle: "First-party vs third-party signals — Beton"
  metaDescription: "Operational difference between first-party and third-party signals, a working schema, a scoring model, and the false-positive math nobody publishes."
---

We spent the last two weeks reading every signal-based selling vendor's marketing site we could find.

Roughly half of the category sells third-party intent feeds. The other half sells first-party scoring. Almost every vendor's pitch assumes you already know the difference and have a strong opinion about which one you want.

You probably don't. The category does not make the difference easy to see, partly because some of the loudest vendors sell both and would prefer the question stay blurry.

Here it is, in plain terms.

<aside class="cta-card">
  <span class="cta-eyebrow">Beton in one line</span>
  <p class="cta-body">Open-source revenue intelligence. Point it at your PostHog and Postgres data, get scored accounts routed to your CRM in seconds.</p>
  <a class="cta-button" href="https://getbeton.ai/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=first-party-vs-third-party&amp;utm_content=cta-top">Start a workspace</a>
</aside>

## Two definitions, operationally

Third-party signals are what other people's data says about a company. Hiring activity. Job ads. Web visits to anonymized IP ranges. Earnings transcripts. G2 review reads. Public filings.

Vendors selling this layer include 6sense, Demandbase, ZoomInfo, Bombora, G2's buyer-intent product, Apollo's intent feed, and Clearbit (now folded into HubSpot Breeze). Above them sit GTM platforms that combine third-party intent with community, web, and CRM data — Common Room, Unify, Salesmotion, MarketBetter, Warmly.

![Third-party signals — six source types and the vendors selling them](/images/blog/first-party-vs-third-party/slide-3-third-party.png)

First-party signals are what people did inside your product. Clicked the "Invite teammate" button three times. Started a trial and didn't add a card. Sent ten messages through your API in an afternoon. Hit a paywall on a Tuesday at 2 PM.

Vendors building tooling on this layer include Pocus, Correlated, UserMotion, Toplyne, MadKudu, Reo.dev (developer activity specifically), Endgame, and Beton.

![First-party signals — six source categories worth scoring and the vendors building on them](/images/blog/first-party-vs-third-party/slide-2-first-party.png)

The third-party world is downstream of the buyer's decisions about who else's tool to use. The first-party world is the buyer using yours.

We have nothing against third-party data. The vendors above are real businesses doing real work.

If you sell to enterprise marketing teams running 18-month deal cycles and need to know when the buying committee is researching solutions before they ever fill out a form, the third-party category has spent a decade building exactly for that shape of sale. The math is good when the deal shape matches.

The problem starts when companies that don't sell that way buy a third-party tool anyway, then ask the data to behave like first-party data. It won't. The signal-to-noise ratio is wrong for the job.

## Where first-party wins, mechanically

Three things matter when you're scoring a lead.<sup class="sidenote-ref" data-n="1">[1]</sup>

<aside class="sidenote" data-n="1">
  <span class="sidenote-text">Want to route your PostHog and Postgres events into Attio without building it yourself?</span>
  <a class="sidenote-link" href="https://getbeton.ai/?utm_source=blog&amp;utm_content=sidenote-1">Start a Beton workspace</a>
</aside>

The first is signal quality. Did this person express intent toward *your* product, or toward the category?

"Visited an anonymous IP in your ICP" is a category-level guess. "Hit the integration page for our PostHog connector, then opened the API docs" is a product-level statement.

The second has less reach. It should also have substantially better precision, which is the whole bet.

Quantifying that precision honestly is a separate post and a separate piece of work — we will publish it once Beton has the deal volume to compute the numbers ourselves rather than borrow them.

The second is freshness. Third-party feeds run on the data provider's cadence, usually daily or weekly batch. Hiring intent updates when somebody re-scrapes the careers page.

By the time the signal reaches your CRM, the buyer has either bought somebody else's tool or filled out your form. First-party events fire in seconds.

We built Beton's webhook → Attio path to route a PostHog event to a CRM record in under four seconds end-to-end; the architecture is unremarkable, the cadence is just the right one for sales work.

Speed-to-lead has been the industry's holy metric for a decade, and first-party signals are the only signals fast enough to honor it.

The third is feedback. When a third-party signal fires and the deal closes, you don't know which part of the signal mattered. The whole feed is opaque, a proprietary model on someone else's data.

When a first-party signal fires and the deal closes, you can ask the database. You know which event the user did, on which page, after how many sessions, and whether the other deals that closed had the same shape.

Your scoring model improves because you can audit it.

## What first-party signals are not

A clarifying paragraph before the how-to.

PostHog as a number on a dashboard is fine. PostHog as the input layer to an account routing system is what this post is about.

The signal is a heads-up, not a substitute for the rep deciding who to call. And it is not free. You will spend real engineering time wiring events properly.

The next section is about that.

## How to actually use them

This is the section the rest of the category does not write, so let us write it.

Start with three event categories worth scoring above everything else.

### Activation events

The events that tell you the user got what they came for. "Created a workspace." "Connected a data source." "Ran their first query."

If a person hits these, they are demonstrating the only thing that matters: they understood the product enough to use it.

Activation has been the cleanest predictor of paid conversion in every published PLG study we have read; it should hold against any firmographic feature you can join onto it, and the literature is consistent on this even if your specific numbers will not be.

### Friction events

The events that tell you a user hit something they couldn't get past. Paywall view. Trial-expired modal. "Upgrade to add another seat." A 403 on an API call to a premium endpoint.

Most teams instrument these for product analytics and never wire them into a sales pipeline.

They are the highest-precision sales signals in your database. Somebody who hits your paywall has by definition done enough work to find your paywall.

### Expansion events

The events that tell you an existing customer is about to need more. Hit a usage limit. Added the fifth user to a workspace built for ten. Started a workflow that calls the API three times faster than their plan allows.

These are the cleanest expansion signals on earth, and almost nobody routes them to CS.

Pocus has been making this case for years; the gap is execution, not narrative.

## The schema

Once you have categories, build a simple scoring model. Skip the deep learning and the "co-dynamic" branding.

Add the events with weights, normalize by recency, and route to the rep when the score crosses a threshold. A hand-tuned baseline of five to eight events is enough to start. The model gets fancier later if precision-recall on the holdout warrants it.

A Postgres-backed warehouse takes three tables:

```sql
-- events: one row per action, ingested from PostHog / Segment / your API
create table events (
  occurred_at timestamptz not null,
  user_id     text        not null,
  account_id  text,
  event_name  text        not null,
  properties  jsonb
);

-- accounts: one row per company, joined to your CRM
create table accounts (
  account_id      text primary key,
  domain          text,
  signed_up_at    timestamptz,
  plan            text,
  attio_record_id text
);

-- account_scores: one row per (account, day), recomputed nightly
create table account_scores (
  account_id          text not null,
  scored_on           date not null,
  score               numeric,
  contributing_events jsonb,
  primary key (account_id, scored_on)
);
```

The scoring query is whatever the team agrees on. A weighted sum that decays linearly over fourteen days is enough to start. Output the top contributing events as JSON. Route to Attio when the score crosses the threshold the rep believes the bar is at.

Beton does this end-to-end against your Postgres or PostHog warehouse, but you can roll it yourself in a weekend with dbt and a webhook. The pattern is more important than the tool.<sup class="sidenote-ref" data-n="2">[2]</sup>

<aside class="sidenote" data-n="2">
  <span class="sidenote-text">Beton ships this schema, the scoring model, and the Attio routing out of the box. AGPLv3.</span>
  <a class="sidenote-link" href="https://github.com/getbeton/inspector">Read the source on GitHub</a>
</aside>

<aside class="cta-card">
  <span class="cta-eyebrow">Skip the weekend</span>
  <p class="cta-body">Beton runs this exact pattern against your warehouse — scoring, routing, and audit logs — with PostHog and Postgres wired up in minutes.</p>
  <a class="cta-button" href="https://getbeton.ai/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=first-party-vs-third-party&amp;utm_content=cta-after-schema">Try it on your data</a>
</aside>

## The part nobody publishes

Here every signal-based selling vendor goes quiet: the false-positive rate.

If you fire a sales alert on every user who hits a paywall, half of them are tire-kickers who will never buy and the other half are existing customers on a trial who already pay you.

Your reps learn within two weeks that the alert means nothing, and they stop opening them. The category has a name for this, alerts that cry wolf, but the math goes unwritten.

Two practices fix it.

Run holdouts. For your scoring model's first month, hold back 20% of accounts at random. Don't route them. Watch what they do.

If the held-out cohort converts at the same rate as the routed cohort, your model is doing nothing. Most first-pass models do nothing.

Yours will get better when you can prove which events move conversion and which were vibes.

Log every score you produce.<sup class="sidenote-ref" data-n="3">[3]</sup> Don't just write the current score to the row, write the contributing events as JSON, every day.

When a deal closes, you can reach back six months and ask: what did the signal look like the week before they signed? That post-hoc question is the only way to learn from your own pipeline.

Most teams cannot answer it because they overwrote yesterday's score with today's score. Don't.

<aside class="sidenote" data-n="3">
  <span class="sidenote-text">Beton writes a row per (account, day, score, contributing-events JSON) automatically — six months of post-hoc audit, free.</span>
  <a class="sidenote-link" href="https://getbeton.ai/?utm_source=blog&amp;utm_content=sidenote-3">See it on your accounts</a>
</aside>

## What this means for your stack

If you sell to enterprise buyers and need to know when the buying committee is researching, you still need a third-party intent feed.

6sense, Demandbase, ZoomInfo, Bombora, Common Room — pick the one that fits your buying motion and write the rest off. Buy it for that.

If you sell to people who use a product before they buy — PLG, dev tools, modern SaaS, anything with a free trial — first-party signals are the higher-quality system.

Buy a warehouse you trust, instrument honestly, and route the events. We built Beton to take that work off you, but the architecture is the same whether you use us or build it yourself.

The category has spent five years convincing the market that you need both. Most teams need one of them, done well.

If you want to see what this looks like against your own PostHog and Postgres data, [start a workspace at getbeton.ai](https://getbeton.ai/?utm_source=blog&utm_medium=cta&utm_campaign=first-party-vs-third-party&utm_content=footer). The agent is open source under AGPLv3 if you'd rather read the scoring code first — [inspector-ml-backend on GitHub](https://github.com/get-beton).
