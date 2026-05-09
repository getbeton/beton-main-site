---
title: "Upsell based on usage"
subtitle: "Trigger sales outreach on usage milestones"
description: "Automatically detect when customers hit usage milestones that indicate readiness for a higher tier, and route timely upsell opportunities to your sales team."
icon: "rocket"
order: 5
featured: true
problem: "Usage-based pricing creates natural upsell moments, but they're easy to miss. Customers hitting limits often self-serve downgrades or workarounds instead of upgrading, because no one reached out at the right time."
solution: "Beton monitors usage metrics in PostHog — API calls, data volume, active users — and triggers CRM updates when customers approach or exceed plan thresholds, enabling timely outreach from your sales team."
benefits:
  - "Catch upsell moments as they happen, not after the fact"
  - "Trigger proactive outreach when customers hit usage ceilings"
  - "Reduce involuntary downgrades and self-serve workarounds"
  - "Connect usage data directly to CRM for sales visibility"
integrations:
  - "posthog"
  - "zoho"
  - "pipedrive"
seo:
  metaTitle: "Usage-Based Upsell — Beton Revenue Intelligence"
  metaDescription: "Trigger sales outreach when customers hit usage milestones. Detect upsell moments in PostHog data and route them to your CRM in real time."
---

## The expansion moment is short, and most teams miss it

Usage-based pricing has a pleasant-sounding theory: customers expand naturally as they grow, the product captures their growth, revenue scales with usage. In practice, the moment a customer realizes they're approaching a tier ceiling is the most expensive moment of the relationship. They're going to make a decision in the next few days, and the decision is *usually not "upgrade."* It's one of:

1. **Downgrade behavior** — they cap their usage manually, ration access internally, and live below the line because nobody told them upgrading was easy.
2. **Self-serve workaround** — they create a second account, split their workload, or build a wrapper that batches calls. The behavior changes invisibly, and the expansion revenue is lost without anyone noticing.
3. **Quiet attrition** — they evaluate alternatives, the conversation never gets to your sales team, and the renewal that should have been an expansion turns into a flat or churned account.
4. **Upgrade** — they raise the limit because someone reached out at exactly the right time.

The fourth outcome is the one that compounds. The first three are the default if no one is paying attention.

The reason it's so easy to miss is that the relevant data lives in PostHog, the relevant action lives in the CRM, and the two systems don't talk to each other natively. A CS rep doesn't open PostHog dashboards every morning. A growth analyst sees the usage trend, but doesn't have a path to act on it. By the time the usage report makes it to a QBR, the moment has passed.

Beton was built for this gap.

## What Beton routes, and when

Beton watches the PostHog event stream for the patterns that indicate an upsell window is opening. The signals fall into a few categories:

- **Approaching limits.** A customer has consumed 70%, 80%, 90% of their plan allocation in the current billing period — for API calls, data volume, active seats, storage, or whatever the metered axis is. Beton routes a CRM update to the account owner with the metric and the trajectory, so the outreach is contextual: *"Looks like you'll hit your seat ceiling in the next 8 days at the current pace."*
- **Overage events.** The customer crossed a hard limit and hit a rate-limit response, or paid an overage charge, or got blocked from a feature. These are the moments customers are most likely to consider workarounds, and the moments where a fast outreach has the most leverage.
- **Sustained growth trajectory.** Some customers don't hit a single big milestone — they grow steadily, and the right time to expand the conversation is when the trajectory looks durable. Beton flags accelerating-but-not-yet-capped accounts so the rep can have a forward-looking conversation, not a reactive one.
- **Feature-tier lockouts.** A user attempts a feature that's gated to a higher plan. This is the cleanest expansion signal in PLG: the customer has just self-identified as ready for the next tier.
- **Billing or pricing page visits.** PostHog captures these, and they're an underused signal. A finance person visiting the pricing page two weeks before renewal is doing internal procurement work; that's an opening for proactive outreach.

The signal goes to whichever CRM the team uses — Attio, HubSpot, Zoho, Pipedrive — as a structured update on the account record, not a separate dashboard the rep has to remember to check.

## Why this works better than monthly usage reports

A lot of CS organizations run a monthly "accounts approaching plan limits" report from PostHog or the data warehouse, distribute it in a Slack channel, and call that their expansion motion. There are three problems with this pattern:

- **The cadence is wrong.** Once a month is too slow for a usage trend that becomes a customer decision in a week. The accounts that needed outreach two weeks ago aren't on the list anymore — they already decided.
- **The format is wrong.** A Slack list of accounts means a rep has to context-switch out of their CRM, find each account, look up its history, and remember to reach out. Half the list never gets touched.
- **The signal is wrong.** "Approaching plan limit" is one signal. Trajectory, lockout events, and pricing-page visits are different signals that often warrant different outreach. A monthly list flattens them all.

Beton fires the signal when it happens, in the system the rep already lives in, with enough metadata to make the outreach contextual. That's the whole product, applied to the upsell case.

## The handoff that usually breaks

The structural reason expansion motions stall, in our experience, is that the usage data and the relationship data are owned by different people. Engineering owns PostHog. Revenue owns the CRM. The bridge between them is usually a Looker dashboard or a Hex notebook that nobody outside the data team opens.

Beton's design makes the data-team layer optional. The signal flows directly from the event stream to the account owner. The data team can still introspect everything (Beton is open source; the heuristic is auditable), but they don't have to be in the loop for every account.

This matters most for organizations where the CS or AM team is small relative to the customer base. If a CSM owns 60 accounts, they can't keep an open PostHog dashboard for each one. They need the relevant accounts to surface themselves. That's the job Beton is doing.

## What "good" expansion outreach looks like with usage signals

The outreach that works isn't *"hi, you've hit 90% of your plan, want to upgrade?"* — that reads like a billing email. The outreach that works references the specific behavior the customer just exhibited and offers help, not a quote.

For example, with a Beton signal that says *"team grew from 3 active seats to 8 in the last 14 days; trajectory implies plan ceiling crossed by next billing period"*, a good outreach is:

> Hey [name], I noticed your team's been growing on [product] — five new active users in the last two weeks. Wanted to flag that you'll likely hit the seat cap on your current plan around [date] at the current pace. Happy to walk through the next tier or explore a custom plan if growth keeps up. No urgency from my side — just wanted to give you the runway.

That's an account-owner email, not a sales email. It works because the rep knows the specifics, the timing matches the customer's reality, and the offer is helpful before it's commercial. Beton's job is to surface the data that makes that email possible to write.

## Getting started

Beton is open source under AGPLv3, with self-hosted installs free if you bring your own LLM key. The cloud version is $0.50 per tracked user per month, with a free trial and no credit card to connect a PostHog instance.

If you have a usage-based pricing model and a customer base larger than your CSM team can manually monitor, you're in the population this is built for. The fastest demonstration is to connect Beton to your PostHog data, point it at your existing customer cohort, and watch the first round of "approaching plan ceiling" signals flow into your CRM. Most teams find at least one account in the first week that should have been an expansion conversation but wasn't.
