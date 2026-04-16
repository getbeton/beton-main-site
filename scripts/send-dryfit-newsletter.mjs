#!/usr/bin/env node
/**
 * Send Dryfit launch newsletter to Resend audience with per-recipient tracking.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-dryfit-newsletter.mjs [--dry-run]
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
if (!API_KEY || !AUDIENCE_ID) {
  console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
const SEND_DELAY_MS = 150;

// ── Campaign ──────────────────────────────────────────────────────
const CAMPAIGN = 'we-open-sourced-our-agent-testing-tool';
const SUBJECT = 'we open-sourced our agent testing tool';
const FROM = 'Beton <newsletter@getbeton.info>';
const BLOG_URL = 'https://www.getbeton.ai/blog/we-open-sourced-our-agent-testing-tool';
const GITHUB_URL = 'https://github.com/getbeton/dryfit';

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
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb">${text}</a>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:monospace,monospace;font-size:14px;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px">

<p>we just released dryfit — the tool we use internally at beton to test whether our ai agents can actually find revenue signals in product data.</p>

<p>the problem we kept hitting: you build an agent that detects expansion signals, churn risk, upsell timing in product analytics. it works great on your demo. but how do you know it works on real, messy data?</p>

<p>production data has no ground truth. toy datasets are too clean. you need something in between.</p>

<p><b>what dryfit does</b></p>
<p>generates synthetic posthog-style event databases in postgres with hidden behavioral signals planted inside — expansion sequences, churn patterns, upsell indicators. alongside the data, it outputs a ground truth manifest that maps every signal to specific event IDs.</p>

<p>run your agent against the database. compare its findings to the manifest. get a precise benchmark score.</p>

<p><b>who this is for</b></p>
<p>— revops teams building signal detection pipelines<br>
— plg tools that score account health from usage data<br>
— data teams evaluating whether an ai vendor's claims hold up<br>
— anyone building agents that analyze product telemetry</p>

<p><b>what's included</b></p>
<p>12 saas business model configs out of the box (seat-based, usage-based, freemium, marketplace, credits, hybrid, and more). grafana inspection stack. postgresql backend. mit licensed.</p>

<p>github: ${link(GITHUB_URL, 'github-repo', 'github.com/getbeton/dryfit')}<br>
blog post: ${link(BLOG_URL, 'blog-post', 'getbeton.ai/blog/we-open-sourced-our-agent-testing-tool')}</p>

<p>if you're building or evaluating ai tools that touch product analytics, this might save you months. and if you want to see how we use it to power beton's signal detection — reply to this email.</p>

<p style="border-top:1px solid #e5e5e5;padding-top:16px;margin-top:32px;color:#666;font-size:12px">
<b style="color:#1a1a1a">get posts like this in your inbox</b><br>
revenue intelligence, behavioral signals, and product-led growth. no spam.<br>
${link('https://www.getbeton.ai/blog', 'subscribe', 'subscribe at getbeton.ai/blog')}
</p>

<p style="color:#666;font-size:12px">— vlad<br>
${link('https://www.getbeton.ai', 'homepage', 'getbeton.ai')}</p>

<img src="${pixelUrl(email)}" width="1" height="1" alt="" style="display:none">
</body></html>`;
}

// ── Resend API ────────────────────────────────────────────────────
async function fetchContacts() {
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
      to: [to],
      subject: SUBJECT,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Send to ${to} failed: ${res.status} ${err}`);
  }
  return res.json();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log(`Subject:  ${SUBJECT}`);
  console.log(`From:     ${FROM}`);
  console.log(`Dry run:  ${DRY_RUN}\n`);

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
      console.log(`✓ ${sent}/${contacts.length} ${contact.email}`);
    } catch (err) {
      failed++;
      console.error(`✗ ${contact.email}: ${err.message}`);
    }
    await sleep(SEND_DELAY_MS);
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
