#!/usr/bin/env node
/**
 * Send the Grafana pricing teardown newsletter to Resend audience with per-recipient tracking.
 * Full-article format.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-grafana-newsletter.mjs --test nadyyym@gmail.com
 *   RESEND_API_KEY=re_... node scripts/send-grafana-newsletter.mjs --dry-run
 *   RESEND_API_KEY=re_... node scripts/send-grafana-newsletter.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Inline the hero as a cid: attachment for test sends so it renders before
// the asset is live on production. Production sends use the public URL.
const HERO_LOCAL_PATH = resolve(__dirname, '..', 'public', 'images', 'blog', 'grafana-pricing-cover.jpeg');
const HERO_CID = 'grafana-hero';

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
const TEST_EMAILS = [];
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--test' && process.argv[i + 1]) {
    TEST_EMAILS.push(process.argv[i + 1]);
  }
}
const SEND_DELAY_MS = 150;

// ── Campaign ──────────────────────────────────────────────────────
const CAMPAIGN = 'grafana-pricing-teardown';
const SUBJECT = 'grafana pricing teardown';
const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const BLOG_URL = 'https://www.getbeton.ai/blog/grafana-pricing-teardown/';
const PRICING_URL = 'https://grafana.com/pricing';
const GITHUB_URL = 'https://github.com/grafana/grafana';
const HERO_IMAGE = 'https://www.getbeton.ai/images/blog/grafana-pricing-cover.jpeg';
const SERIES_URL = 'https://www.getbeton.ai/blog/';
const LI_URL = 'https://www.linkedin.com/in/vlad-nadymov/';

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
function buildHtml(email, heroSrc = HERO_IMAGE) {
  const link = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb;text-decoration:underline">${text}</a>`;

  const h2 = (t) => `<h2 style="font-size:20px;font-weight:700;line-height:1.3;margin:32px 0 12px 0;color:#111">${t}</h2>`;
  const p = (t) => `<p style="margin:0 0 14px 0">${t}</p>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;text-align:left">

<a href="${clickUrl(BLOG_URL, 'hero-image', email)}">
  <img src="${heroSrc}" alt="grafana pricing teardown" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:12px" />
</a>

<p style="font-size:12px;color:#888;margin:0 0 20px 0">got this forwarded? ${link('https://www.getbeton.ai/blog', 'forward-subscribe', 'subscribe here')}</p>

<h1 style="font-size:24px;font-weight:700;line-height:1.3;margin:0 0 20px 0;color:#111">grafana pricing teardown</h1>

${p(`Hey, it's ${link(LI_URL, 'vlad-li', 'Vlad')}, founder of Beton.`)}

${p(`Grafana is the observability platform most engineers have used without realizing it — metrics dashboards, log aggregation, distributed tracing, all in one place. ~66k GitHub stars, which puts it in the "foundational infrastructure" category alongside Kubernetes and Prometheus.`)}

${p(`What makes the pricing interesting isn't a sneaky license clause this time. It's the meter count — Grafana charges on five separate usage dimensions — and a $25,000/year wall with nothing in between self-serve and enterprise.`)}

${p(`<em style="color:#666">This post is a part of a ${link(SERIES_URL, 'series-index', 'series on commercial open source software pricing')}.</em>`)}

<div style="margin:0 0 24px 0;line-height:1.2">
  <a href="${clickUrl(BLOG_URL, 'cta-blog-top', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 16px 12px 0">read on the blog</a>
  <a href="${clickUrl(PRICING_URL, 'cta-pricing-top', email)}" style="display:inline-block;background:#ffffff;color:#2563eb;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;border:1px solid #2563eb;margin:0 0 12px 0">see their pricing page</a>
</div>

${h2('What is Grafana')}

${p('Grafana Labs has built a full cloud observability stack — Loki for logs, Tempo for traces, Mimir for metrics — to compete directly with Datadog, New Relic, and Dynatrace. The open-source core is the visualization layer everyone already knows; the cloud business wraps storage, retention, and managed backends around it.')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li>Website: ${link('https://grafana.com', 'grafana-home', 'grafana.com')}</li>
  <li>Pricing: ${link(PRICING_URL, 'grafana-pricing', 'grafana.com/pricing')}</li>
  <li>GitHub: ${link(GITHUB_URL, 'grafana-gh', 'github.com/grafana/grafana')} — <b>~66k stars</b></li>
  <li>License: AGPL on core Grafana; Apache 2.0 on Agent/Alloy</li>
</ul>

${h2('Plans')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Free</b> — always free, all services, limited monthly usage. 14-day metric retention, 3-day log retention.</li>
  <li><b>Pro — from $19/month + usage</b> — pay-as-you-go above the free limits. 13 months metric retention, 30 days logs. $19/month minimum.</li>
  <li><b>Enterprise — starts at a $25,000/year spend commit</b> — full enterprise features, SLA, dedicated support, advanced RBAC, data source permissions.</li>
</ul>

${h2('Five meters, not one')}

${p('Most observability tools pick one or two dimensions to charge on. Grafana has five active meters:')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Metrics</b> — per active series</li>
  <li><b>Logs</b> — per GB ingested</li>
  <li><b>Traces</b> — per GB ingested</li>
  <li><b>Profiles</b> — per GB ingested</li>
  <li><b>k6 load tests</b> — per virtual user hour</li>
</ul>

${p(`This is the "bring your own complexity" model. A simple stack with a handful of services bills low. A large distributed system emitting high-cardinality metrics + verbose logs + distributed traces runs every meter at once.`)}

${p(`The upside vs Datadog: each meter is individually transparent and relatively cheap, and you can tune each one — reduce cardinality, adjust sampling, filter noisy logs. Datadog's pricing is notoriously opaque; Grafana publishes per-unit rates so you can actually model your costs.`)}

${h2('The "Datadog bill shock" positioning')}

${p(`Grafana explicitly markets against Datadog's infamous overage bills. Their adaptive-metrics feature auto-drops series that aren't being queried — cutting your active-series count and bill without manual intervention.`)}

${p(`Smart positioning. The Datadog horror stories (teams hit with $300k/month surprise bills) spread virally in engineering circles, and Grafana is the "we know that rep, here's how we're different" pitch. Whether it holds at scale still depends on your instrumentation — high-cardinality labels like user IDs and request IDs are expensive on any platform. Grafana's tooling helps, but it won't save you from undisciplined instrumentation.`)}

${h2('The free tier is genuinely generous')}

${p(`14-day metric retention and 3-day log retention on a free tier beats most comparable tools. For a developer testing instrumentation or a small project, it's usable — not just a demo.`)}

${p(`The catch is retention, not volume. 3-day log retention makes production debugging painful. "We had an incident 5 days ago and need the logs" is a totally normal request the free tier can't serve.`)}

${h2('The $25,000 enterprise cliff')}

${p(`There's no upper-mid-market tier between Pro (pay-as-you-go) and Enterprise ($25k/year). Need enterprise SSO, advanced RBAC, data source permissions, or an SLA? The minimum spend is $25,000/year.`)}

${p(`That's a hard wall. A 50-person company that's outgrown Pro's self-service but doesn't need everything in Enterprise is stuck choosing between overpaying or building workarounds. The Pro-to-Enterprise gap is one of the steepest in this series.`)}

${h2('Worth paying for?')}

${p(`<b>Free</b> is a good starting point and genuinely usable for small/medium projects — just don't expect to debug last week's incident on it.`)}

${p(`<b>Pro</b>'s pay-as-you-go is the right model for most growing companies: you pay for what you use and the per-unit rates are transparent. Budget for all five meters if you run a real distributed system.`)}

${p(`<b>Self-hosting</b> is a real option for cost control and data sovereignty — the AGPL core is feature-complete for internal use.`)}

${p(`<b>Enterprise</b> at $25k/year is justified for large engineering orgs with compliance needs, but it's a significant commitment with nothing in between. If you're in the gap, that's the number that'll shape the decision.`)}

<div style="margin:32px 0;line-height:1.2">
  <a href="${clickUrl(BLOG_URL, 'cta-blog', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 16px 12px 0">read on the blog</a>
  <a href="${clickUrl(PRICING_URL, 'cta-pricing', email)}" style="display:inline-block;background:#ffffff;color:#2563eb;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;border:1px solid #2563eb;margin:0 0 12px 0">see their pricing page</a>
</div>

${p(`Reply if you want to compare notes -- curious how teams plan future software spend when five meters are running at once`)}

${p(`— ${link(LI_URL, 'vlad-signoff-li', 'Vlad')}`)}

<p style="border-top:1px solid #e5e5e5;padding-top:16px;margin-top:32px;color:#666;font-size:13px">
${link('https://www.getbeton.ai/blog', 'subscribe', 'subscribe')} for articles on sales and revenue tooling
</p>

<p style="color:#666;font-size:13px">
written by team behind ${link('https://www.getbeton.ai/', 'beton-home', 'Beton')} — agent that finds new revenue drivers for B2B sales &amp; marketing teams in their own DWH
</p>

<p style="color:#666;font-size:13px">
we're open source, check out our ${link('https://github.com/getbeton/inspector', 'github', 'github')}
</p>

<p style="margin:24px 0 0 0;color:#999;font-size:12px">
  <a href="mailto:newsletter+unsubscribe@getbeton.ai?subject=${encodeURIComponent('unsubscribe')}&body=${encodeURIComponent('please unsubscribe ' + email)}" style="color:#999;text-decoration:underline">unsubscribe</a>
</p>

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

async function sendEmail(to, html, attachments) {
  const payload = {
    from: FROM,
    reply_to: REPLY_TO,
    to: [to],
    subject: SUBJECT,
    html,
    headers: {
      'List-Unsubscribe': '<mailto:newsletter+unsubscribe@getbeton.ai>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
  if (attachments) payload.attachments = attachments;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
    // Embed the hero inline (cid:) so it renders before the asset is on production.
    const heroB64 = readFileSync(HERO_LOCAL_PATH).toString('base64');
    const attachments = [{ filename: 'grafana-pricing-cover.jpeg', content: heroB64, content_id: HERO_CID }];
    for (const addr of TEST_EMAILS) {
      const html = buildHtml(addr, `cid:${HERO_CID}`);
      try {
        const result = await sendEmail(addr, html, attachments);
        console.log(`Test sent to ${addr} (inline hero): ${result.id}`);
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
