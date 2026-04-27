#!/usr/bin/env node
/**
 * Send Beton Late April 2026 update newsletter to Resend audience with per-recipient tracking.
 * Full-article format (not a teardown summary).
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-late-april-newsletter.mjs [--dry-run]
 *   RESEND_API_KEY=re_... node scripts/send-late-april-newsletter.mjs --test v@getbeton.ai
 *   RESEND_API_KEY=re_... node scripts/send-late-april-newsletter.mjs --test v@getbeton.ai --test nadyyym@gmail.com
 *
 * Multiple --test flags: pass each address as its own --test flag, sequentially.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '..', '.env');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
} catch {}

const API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
if (!API_KEY) {
  console.error('Missing RESEND_API_KEY');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
// Collect ALL --test flags into an array (allows repeated --test)
const TEST_EMAILS = [];
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--test' && process.argv[i + 1]) {
    TEST_EMAILS.push(process.argv[i + 1]);
  }
}
const SEND_DELAY_MS = 150;

// ── Campaign ──────────────────────────────────────────────────────
const CAMPAIGN = 'beton-late-april-2026-update';
const SUBJECT = 'beton late april — postgres, workspaces, agent rewire';
const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const BLOG_URL = 'https://www.getbeton.ai/blog/beton-late-april-2026-update';
const POSTGRES_INTEGRATION_URL = 'https://www.getbeton.ai/integrations/postgres';
const FIRECRAWL_INTEGRATION_URL = 'https://www.getbeton.ai/integrations/firecrawl';
const AGENT_REPO_URL = 'https://github.com/getbeton/inspector-ml-backend';
const APP_URL = 'https://inspector.getbeton.ai';
const HERO_IMAGE = 'https://www.getbeton.ai/images/blog/late-april-2026-hero.png';

const TRACKER_BASE = 'https://www.getbeton.ai/api/track';
const UTM = 'utm_source=substack&utm_medium=email&utm_campaign=' + CAMPAIGN;

// ── Helpers ───────────────────────────────────────────────────────
function clickUrl(target, label, email) {
  const u = encodeURIComponent(target + (target.includes('?') ? '&' : '?') + UTM);
  return `${TRACKER_BASE}/click?u=${u}&c=${CAMPAIGN}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}

function pixelUrl(email) {
  return `${TRACKER_BASE}/pixel.png?c=${CAMPAIGN}&e=${encodeURIComponent(email)}`;
}

// ── Email HTML builder ────────────────────────────────────────────
function buildHtml(email) {
  const link = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb;text-decoration:underline">${text}</a>`;

  const h2 = (t) => `<h2 style="font-size:20px;font-weight:700;line-height:1.3;margin:32px 0 12px 0;color:#111">${t}</h2>`;
  const h3 = (t) => `<h3 style="font-size:16px;font-weight:700;line-height:1.3;margin:24px 0 8px 0;color:#111">${t}</h3>`;
  const p = (t) => `<p style="margin:0 0 14px 0">${t}</p>`;
  const li = (items) =>
    `<ul style="margin:0 0 14px 0;padding-left:20px">${items.map(x => `<li style="margin:0 0 8px 0">${x}</li>`).join('')}</ul>`;

  const ctaPrimary = (url, lbl, txt) =>
    `<a href="${clickUrl(url, lbl, email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px">${txt}</a>`;

  const ctaSecondary = (url, lbl, txt) =>
    `<a href="${clickUrl(url, lbl, email)}" style="display:inline-block;background:#ffffff;color:#2563eb;padding:10px 20px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:13px;border:1px solid #2563eb">${txt}</a>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;text-align:left">

<a href="${clickUrl(BLOG_URL, 'hero-image', email)}">
  <img src="${HERO_IMAGE}" alt="beton late april 2026 update" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:12px" />
</a>

<p style="font-size:12px;color:#888;margin:0 0 20px 0">got this forwarded? ${link('https://www.getbeton.ai/blog', 'forward-subscribe', 'subscribe here')}</p>

<h1 style="font-size:24px;font-weight:700;line-height:1.3;margin:0 0 20px 0;color:#111">beton late april 2026 update</h1>

${p("hey, it&apos;s <a href=\"https://www.linkedin.com/in/vlad-nadymov/\" style=\"color:#2563eb;text-decoration:underline\">Vlad</a>, founder of Beton.")}

${p("ten days since the last update. a big release went out to main, more is staged for later this week, and the GTM side has had a lot of motion — both with customers in the pipeline and on our own outbound learning.")}

${h2('what just shipped')}

${h3('Postgres as a data source')}

${p('Beton can now read directly from any Postgres warehouse, not just PostHog.')}

${p('same pattern as PostHog — schema analysis, behavioral hypothesis generation, statistical testing — but now against your raw warehouse. a Postgres replica from your production DB, a Supabase project, a self-hosted Postgres, or a separately maintained analytics warehouse all work.')}

${p(`this is the use case we kept hearing: "PostHog is great, but our real behavioral data lives in Postgres." for teams that already use it as DWH — through Segment, Fivetran, RudderStack or custom ETL pipelines — Beton can now sit on top of the warehouse without forcing a migration to another product.`)}

${p('we start by reading the schema, surfacing tables that look like behavioral fact tables (events, actions, transactions), and proposing hypotheses to test. the statistical validation layer is identical to the PostHog flow.')}

${p(`${link(POSTGRES_INTEGRATION_URL, 'postgres-integration-page', 'see the Postgres integration page →')}`)}

${h3('multi-user workspaces')}

${p('workspaces support multiple people now. invite teammates, assign roles (owner, admin, member), share signal pipelines without stepping on each other&apos;s field mappings. per-workspace integration credentials, per-workspace audit logs, and the foundation for proper team workflows.')}

${p('practically — when a signal fires, you can see who configured the pipeline that produced it, who&apos;s responsible for routing, and who&apos;s been alerted. that&apos;s table-stakes for any RevOps tool used by more than one person, and it&apos;s now in.')}

${h3('Firecrawl integration')}

${p('you can now add your Firecrawl API key in settings, and the agent will pick up context about your business directly from your own site. pricing pages, feature pages, blog posts, integration directories — anything we crawl gets ingested as context for hypothesis generation.')}

${p('this matters because most behavioral signals don&apos;t make sense in isolation. "user X clicked Y three times" is meaningless without knowing what Y is and what role it plays in your funnel. the agent reads your site, builds a working model of what the product does and how it monetizes, then uses that model to interpret the events it sees.')}

${p('next step: extending so the agent also scrapes context on your customers&apos; companies during analysis. for B2B, the customer&apos;s industry and stack often change how a signal should be interpreted — a transaction-volume drop means something different at a fintech versus an e-commerce store, and the agent should adjust accordingly.')}

${p(`${link(FIRECRAWL_INTEGRATION_URL, 'firecrawl-integration-page', 'see the Firecrawl integration page →')}`)}

${h3('refreshed design + more agent memory')}

${p('the Inspector UI moved from near-total black-and-white to a refreshed design system with blue as an accent — still a color-blind safe palette, just less stark. cleaner navigation, sharper signal table, semantic badges for signal state. less visual noise.')}

${p('the agent also remembers more between runs now — its query history, the hypotheses it tested last time, schema notes it built up — so the next session doesn&apos;t redo work the previous one already finished. consecutive runs converge on what matters faster.')}

${h2(`what's coming next week`)}

${p('these are in final review now and shipping to main this week.')}

${h3('field mapping')}

${p('the biggest UX shift in the queue. right now, mapping a signal output to an Attio CRM field is done only once during workspace setup. after next release you&apos;ll be able to change it on the fly.')}

${p('onboarding will guide you through field mapping in-line. integrations split cleanly into sources (where signals come from — PostHog, Postgres) and destinations (where they go — Attio, soon HubSpot).')}

${p('each destination has a visual mapper with three picker tabs:')}

${li([
  '<b>source</b> — pick a property directly off the signal payload',
  '<b>property</b> — pick a static value or a workspace setting',
  '<b>formula</b> — write a small expression with autocomplete (member email lookups, default fallbacks, conditionals)',
])}

${p('more than that, you&apos;ll be able to set up different behaviour for each signal. one signal can trigger multiple different actions in multiple destinations — so you can create a new CRM deal and send a Slack notif on one signal, while another updates the deal and adds the user to a PostHog cohort.')}

${h3('entity linking')}

${p('field mapping by itself just sets attribute values. entity linking is the harder part — when a signal fires, who is this about, and what records need to exist in the CRM for the action to land.')}

${p('the new release handles this without you writing any resolution code:')}

${li([
  '<b>people resolved by email.</b> when a signal carries a person&apos;s email, the system upserts an Attio person record by email — creating it if missing, updating it if found.',
  '<b>companies resolved by domain.</b> same idea. the system asserts a company by domain. if a freshly-asserted person has no company link, it auto-links them to the matching company.',
  '<b>account owner resolved by workspace member.</b> a <code style="background:#f3f4f6;padding:2px 4px;border-radius:3px">member(email)</code> formula in a mapping returns the matching Attio workspace member — so you can route deals to the AE who owns the account in one expression.',
  '<b>specific records via search picker.</b> when you need to link to a particular record (a fixed campaign, a specific Slack channel as Attio object), the picker queries Attio&apos;s search endpoint live as you type.',
])}

${p('so a "high-intent visit on the pricing page" signal can simultaneously create a deal, attach the person who triggered it, attach their company by domain, and route the deal to the AE who owns that company — all from one signal definition, all from one UI, with the system doing the upsert plumbing.')}

${h3('agent updates')}

${p('this release is mostly a wiring change, not a feature change.')}

${p('the discovery agent now runs as a sequence of four subagents instead of one monolithic prompt:')}

${li([
  '<b>site discovery + summary</b> — crawl the customer&apos;s site, extract product and positioning context, condense into a working brief that the rest of the pipeline reads',
  '<b>DWH analysis</b> — connect to the warehouse, build a schema map, identify behavioral fact tables',
  '<b>signal-hunting agent</b> — runs in a loop: generate a hypothesis, query the warehouse, evaluate, iterate. this is the only step that loops; the rest run once',
  '<b>finalizer</b> — package the strongest hypotheses with their evidence into a structured handoff',
])}

${p('cleaner trace logs at every step, so you can inspect what each subagent did and why. we were running everything as one prompt before, which meant a failure anywhere blew up the whole run and made debugging painful. splitting it into named subagents makes failures localized and traces useful.')}

<div style="margin:18px 0">
  ${ctaSecondary(AGENT_REPO_URL, 'agent-repo-cta', '→ inspector-ml-backend on GitHub')}
</div>

${p('after this release, we&apos;re wiring in our open-source statistical-methods toolkit as agent tools — Fisher exact, two-proportion z, Newcombe intervals, multiple-comparison correction. validation will run as a first-class step inside the loop instead of through a separate post-processing pass. that work is in flight; expect it in the next release.')}

${h3('HubSpot integration')}

${p('every Beton user with HubSpot will be one OAuth click away from getting signal data right where their pipeline lives.')}

${h2('GTM updates')}

${p('we&apos;re slowly progressing with early adopter pilots.')}

${h3('a late-stage pilot with a marketplace platform')}

${p('our furthest-along pilot right now is with a marketplace serving SMB B2Bs — their sellers are small business operators who use the platform to run their core operations.')}

${p('the platform has thousands of these seller accounts. each one is small in revenue terms, but the long tail adds up to most of the company&apos;s volume. the problem they brought us: they have no behavioral way to know which sellers are slipping toward churn before renewal time. account managers can&apos;t watch thousands of accounts manually. renewal-time interventions are too late.')}

${p('we&apos;re running a backtested signal hunt on their warehouse — hypotheses like "when a seller goes A → B → C, does that predict churn over the next 30 days?" — discovered from historical event data and validated statistically across three layers:')}

${li([
  '<b>per-hypothesis stats</b> — Fisher exact, two-proportion z, Newcombe intervals',
  '<b>holdout testing</b> — confirm the pattern holds on data the hypothesis wasn&apos;t generated from',
  '<b>multiple-comparison correction</b> — so we don&apos;t fool ourselves with false positives at scale',
])}

${p('the signals that pass all three layers flow into their destination CRM with the relevant context attached. the CS team gets a prioritized worklist instead of spending time on customers not worth pursuing.')}

${h3('other shapes in the pipeline')}

${p('three other live conversations, three different industries, similar problem shape:')}

${li([
  '<b>LTV defense for a delivery marketplace.</b> commodity-pricing competition is collapsing repeat-buy rates. they want cohorts whose repeat frequency is degrading inside the renewal window, before the customer tells them they&apos;re leaving.',
  '<b>post-signup activation depth for a PLG marketing platform.</b> which first-week behaviors predict 14-day retention, which predict expansion, which predict no-show. signals routed to a tiered onboarding response.',
  '<b>account stagnation detection for a security vendor.</b> big accounts that are technically still paying but have stopped using the product are leading indicators of non-renewal. find them earlier, intervene with product changes or success.',
])}

${p('different verticals, but the underlying ask is the same: a company has behavioral data in a warehouse, knows there&apos;s signal in there, doesn&apos;t have the team-time to hunt for it manually. Beton is the agent that does the hunting.')}

${p("you&apos;re an hour away from new retention drivers – just sign up, set up your account and wait for the agent to go through your data.")}

<div style="margin:32px 0;text-align:center">
  ${ctaPrimary(APP_URL, 'cta-try-beton', 'try Beton free →')}
</div>

${h2('ask')}

${p("forward this to a CMO/Head of Sales friends of yours. happy to pay a finder&apos;s fee if we do a deal with them")}

${p('— <a href="https://www.linkedin.com/in/vlad-nadymov/" style="color:#2563eb;text-decoration:underline">Vlad</a>')}

<p style="border-top:1px solid #e5e5e5;padding-top:16px;margin-top:32px;color:#666;font-size:13px">
<b style="color:#1a1a1a">get posts like this in your inbox</b><br>
revenue intelligence, behavioral signals, product-led growth. no spam.<br>
${link('https://www.getbeton.ai/blog', 'subscribe', 'subscribe at getbeton.ai/blog')}
</p>

<p style="color:#666;font-size:13px">
${link('https://www.getbeton.ai', 'homepage', 'getbeton.ai')}</p>

<img src="${pixelUrl(email)}" width="1" height="1" alt="" style="display:none">
</body></html>`;
}

// ── Resend API ────────────────────────────────────────────────────
async function fetchContacts() {
  if (!AUDIENCE_ID) throw new Error('Missing RESEND_AUDIENCE_ID');
  const res = await fetch(
    `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  if (!res.ok) throw new Error(`Fetch contacts failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return body.data.filter(c => !c.unsubscribed);
}

async function sendEmail(to, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      reply_to: REPLY_TO,
      to: [to],
      subject: SUBJECT,
      html,
      headers: {
        'List-Unsubscribe': '<mailto:newsletter+unsubscribe@getbeton.ai>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Send to ${to} failed: ${res.status} ${err}`);
  }
  return res.json();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log(`Subject:  ${SUBJECT}`);
  console.log(`From:     ${FROM}`);
  console.log(`Reply-To: ${REPLY_TO}`);
  console.log(`Dry run:  ${DRY_RUN}`);
  console.log(`Test:     ${TEST_EMAILS.length ? TEST_EMAILS.join(', ') : 'none'}\n`);

  if (TEST_EMAILS.length) {
    for (const addr of TEST_EMAILS) {
      const html = buildHtml(addr);
      try {
        const result = await sendEmail(addr, html);
        console.log(`Test sent to ${addr}: ${result.id}`);
      } catch (err) {
        console.error(`Test send to ${addr} failed: ${err.message}`);
      }
      await sleep(SEND_DELAY_MS);
    }
    return;
  }

  const contacts = await fetchContacts();
  console.log(`Audience:  ${contacts.length} subscribed\n`);

  if (DRY_RUN) {
    console.log('Dry run — all recipients:');
    contacts.forEach(c => console.log(`  ${c.email}`));
    console.log(`\nSample HTML for first contact:\n`);
    console.log(buildHtml(contacts[0]?.email || 'test@example.com'));
    return;
  }

  let sent = 0, failed = 0;
  for (const contact of contacts) {
    try {
      const html = buildHtml(contact.email);
      await sendEmail(contact.email, html);
      sent++;
      console.log(`sent ${sent}/${contacts.length} ${contact.email}`);
    } catch (err) {
      failed++;
      console.error(`fail ${contact.email}: ${err.message}`);
    }
    await sleep(SEND_DELAY_MS);
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
