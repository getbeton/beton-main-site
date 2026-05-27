#!/usr/bin/env node
/**
 * Send the first-party-vs-third-party newsletter to the full Resend audience.
 *
 * Usage:
 *   node scripts/send-first-party-vs-third-party-newsletter.mjs [--dry-run]
 *
 * Reads RESEND_API_KEY + RESEND_AUDIENCE_ID from .env.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── env ────────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '..', '.env');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {}

const API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
if (!API_KEY || !AUDIENCE_ID) {
  console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID in .env');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
const SEND_DELAY_MS = 150;

// ── Campaign ──────────────────────────────────────────────────────
const CAMPAIGN = 'first-party-vs-third-party-signals';
const SUBJECT = 'first-party vs third-party signals — and how to actually use them';
const FROM = 'Beton <newsletter@getbeton.info>';
const BLOG_URL = 'https://www.getbeton.ai/blog/first-party-vs-third-party-signals';
const COVER_URL = 'https://www.getbeton.ai/images/blog/first-party-vs-third-party/slide-1-comparison.png';
const REPO_URL = 'https://github.com/getbeton/inspector';

const TRACKER_BASE = 'https://www.getbeton.ai/api/track';
const UTM = `utm_source=substack&utm_medium=email&utm_campaign=${CAMPAIGN}`;

// ── DNC — never send to these emails or domains ──────────────────
const DNC_EMAILS = new Set([
  'kira.v.tut@gmail.com', // Voloshin — explicit unsubscribe
]);
const DNC_DOMAINS = new Set([
  'najar.ai',     // Clement Peyrard hard-no, May 2026
  'leadinfo.com', // Mike Van Beaumond hard-no, May 2026
]);

// ── Helpers ───────────────────────────────────────────────────────
function clickUrl(target, label, email) {
  const u = encodeURIComponent(target + (target.includes('?') ? '&' : '?') + UTM);
  return `${TRACKER_BASE}/click?u=${u}&c=${CAMPAIGN}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}

function pixelUrl(email) {
  return `${TRACKER_BASE}/pixel.png?c=${CAMPAIGN}&e=${encodeURIComponent(email)}`;
}

function link(url, label, text, email) {
  return `<a href="${clickUrl(url, label, email)}" style="color:#2563eb">${text}</a>`;
}

// ── Email body (Craigslist style: lowercase, <b> headers, inline links) ─
function buildHtml(email) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:monospace,monospace;font-size:14px;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px">

<p>hey, it's vlad.</p>

<p>new long post out today. ~1,800 words. open-source rev-intel piece on what we're building at beton.</p>

<p><a href="${clickUrl(BLOG_URL, 'cover', email)}"><img src="${COVER_URL}" alt="First-party vs third-party signals" width="540" style="display:block;max-width:100%;height:auto;border:0;margin:0 0 16px"></a></p>

<p><b>first-party vs third-party signals — and how to actually use them</b></p>

<p>we spent the last two weeks reading every signal-based selling vendor's marketing site we could find. roughly half of the category sells third-party intent feeds. the other half sells first-party scoring. almost every vendor pitch assumes you already know the difference and have a strong opinion about which one you want.</p>

<p>you probably don't. the category does not make the difference easy to see, partly because some of the loudest vendors sell both and would prefer the question stay blurry.</p>

<p>short version:</p>

<p><b>third-party signals</b> are what other people's data says about a company. hiring activity, anonymous ip visits, g2 reads, public filings. vendors: 6sense, demandbase, zoominfo, bombora, common room, salesmotion, marketbetter, warmly.</p>

<p><b>first-party signals</b> are what people did inside your product. clicks, billing events, api calls, paywall hits. vendors: pocus, correlated, usermotion, toplyne, madkudu, reo.dev, and beton.</p>

<p>if you sell to enterprise marketing on 18-month deal cycles, the third-party layer has spent a decade building for that shape of sale. the math is good.</p>

<p>if you sell to people who use your product before they buy — plg, dev tools, modern saas, anything with a free trial — first-party signals win on three things: quality (product-level statements beat category-level guesses), freshness (events fire in seconds, intent feeds run on weekly batch), and feedback (when the deal closes, you can audit which event mattered).</p>

<p>the full post has the postgres schema you can ship in a weekend, the scoring model, and the false-positive math the rest of the category goes quiet on.</p>

<p>read it here: ${link(BLOG_URL, 'read-full-post', 'getbeton.ai/blog/first-party-vs-third-party-signals', email)}</p>

<p>open-source backend at ${link(REPO_URL, 'github', 'github.com/getbeton/inspector', email)}. agplv3.</p>

<p style="color:#666;font-size:12px;margin-top:40px">— vlad<br>
${link('https://www.getbeton.ai', 'homepage', 'getbeton.ai', email)}</p>

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
    body: JSON.stringify({ from: FROM, to: [to], subject: SUBJECT, html }),
  });
  if (!res.ok) {
    throw new Error(`Send to ${to} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log(`Subject:  ${SUBJECT}`);
  console.log(`From:     ${FROM}`);
  console.log(`Dry run:  ${DRY_RUN}\n`);

  const all = await fetchContacts();
  const recipients = all.filter((c) => {
    const e = c.email.toLowerCase();
    if (DNC_EMAILS.has(e)) return false;
    const domain = e.split('@')[1] || '';
    if (DNC_DOMAINS.has(domain)) return false;
    return true;
  });
  const skipped = all.length - recipients.length;

  console.log(`Audience:  ${all.length} subscribed`);
  console.log(`DNC skip:  ${skipped}`);
  console.log(`To send:   ${recipients.length}\n`);

  if (DRY_RUN) {
    console.log('Dry run — recipients:');
    recipients.forEach((c) => console.log(`  ${c.email}`));
    console.log(`\nSample HTML for ${recipients[0]?.email || 'test@example.com'}:\n`);
    console.log(buildHtml(recipients[0]?.email || 'test@example.com').slice(0, 1200) + '\n…');
    return;
  }

  let sent = 0, failed = 0;
  for (const contact of recipients) {
    try {
      const html = buildHtml(contact.email);
      const res = await sendEmail(contact.email, html);
      sent++;
      console.log(`✓ ${sent}/${recipients.length} ${contact.email} (${res.id})`);
    } catch (err) {
      failed++;
      console.error(`✗ ${contact.email}: ${err.message}`);
    }
    await sleep(SEND_DELAY_MS);
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
