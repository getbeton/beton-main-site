#!/usr/bin/env node
/**
 * Send the Beton investor newsletter.
 *
 * Sends to a SEPARATE Resend audience seeded from Attio's "Investor newsletter"
 * list, FROM v@getbeton.ai so replies land directly in Vlad's work inbox.
 *
 * Usage:
 *   node scripts/send-investor-newsletter.mjs --dry-run
 *   node scripts/send-investor-newsletter.mjs
 *
 * Required env (in .env):
 *   RESEND_API_KEY                  — same Resend key
 *   RESEND_INVESTOR_AUDIENCE_ID     — the investor audience id
 *   INVESTOR_FROM                   — display name + sender, e.g. 'Vlad Nadymov <v@getbeton.ai>'
 *
 * Before running:
 *   1. Set CAMPAIGN, SUBJECT below for the current edition.
 *   2. Edit buildHtml() to drop in the actual investor-update copy.
 *   3. Tracker is https://track.getbeton.org (NOT www.getbeton.ai — that host is 402).
 *   4. Run --dry-run first; verify recipient list + sample HTML.
 *   5. --test nadyyym@gmail.com, then live send once.
 *      This script has no claim-guard. A second live run re-sends everyone.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from repo root
try {
  const envPath = path.join(__dirname, '..', '.env');
  const envText = fs.readFileSync(envPath, 'utf8');
  for (const line of envText.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
    }
  }
} catch {}

const API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_INVESTOR_AUDIENCE_ID;
const FROM = process.env.INVESTOR_FROM || 'Vlad Nadymov <v@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';

if (!API_KEY || !AUDIENCE_ID) {
  console.error('Missing RESEND_API_KEY or RESEND_INVESTOR_AUDIENCE_ID');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
const testIdx = process.argv.indexOf('--test');
const TEST_TO = testIdx !== -1 ? process.argv[testIdx + 1] : null;
const SEND_DELAY_MS = 200;

// ── Campaign ──────────────────────────────────────────────────────
// EDIT EACH EDITION:
const CAMPAIGN = 'beton-investor-2026-08';
const SUBJECT = 'beton august investor newsletter';
const UTM = `utm_source=newsletter&utm_medium=email&utm_campaign=${CAMPAIGN}`;
const withUtm = (url) => url + (url.includes('?') ? '&' : '?') + UTM;

// First-party tracker on Cloudflare (www.getbeton.ai is 402).
const TRACKER_BASE = process.env.NEWSLETTER_TRACKER_BASE || 'https://track.getbeton.org';
const POSTHOG_KEY = process.env.POSTHOG_API_KEY || process.env.POSTHOG_PROJECT_TOKEN || '';
const POSTHOG_HOST = (process.env.POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '');

function clickUrl(target, label, email) {
  const dest = withUtm(target);
  const u = encodeURIComponent(dest);
  return `${TRACKER_BASE}/click?u=${u}&c=${encodeURIComponent(CAMPAIGN)}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}
function pixelUrl(email) {
  return `${TRACKER_BASE}/pixel.png?c=${encodeURIComponent(CAMPAIGN)}&e=${encodeURIComponent(email)}`;
}

const STS_DEST = 'https://selltostate.com/';
const VOBO_DEST = 'https://vobo.dev/';
const VOBO_APP_DEST = 'https://app.vobo.dev/auth';
const CAL_DEST = 'https://cal.com/beton/programmatic-seo-discovery-call';

// ── Email HTML — investor edition ─────────────────────────────────
// Copy from Google Doc "beton august investor newsletter"
// https://docs.google.com/document/d/1R-JI_5aZv_e01In96MohTxFfG-o_tskAiUZV_OeAUPQ/edit
function buildHtml(email) {
  const h1 = 'margin:30px 0 8px;font-size:17px;font-weight:700;line-height:1.35';
  const ul = 'padding-left:20px;margin:8px 0';
  const a = 'color:#2563eb';
  const STS_LINK = clickUrl(STS_DEST, 'sts', email);
  const CAL_LINK = clickUrl(CAL_DEST, 'cal', email);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.65;color:#1a1a1a;max-width:620px;margin:0 auto;padding:24px">

<p>hey,</p>

<p>it's Vlad. august update on Beton, <a href="${STS_LINK}" style="${a}">Sell to State</a>, and a new product.</p>

<p>tl;dr: grew traffic and got first 3 subscriptions at $49. 2 consulting customers pay the bills. we got into AltaLab</p>

<p style="${h1}">traffic</p>

<p>totals:</p>
<ul style="${ul}">
  <li>visitors 1.5x (4.6K → 7.0K), ~233 a day vs 155 in july</li>
  <li>signups 106, down from 118</li>
  <li>75 people searched (466 searches, ~6 per user), up from 61</li>
  <li>50% signups check pricing, 12% signups proceed to check out</li>
</ul>

<p>google organic dipped due to bugs, but rebounded:</p>
<ul style="${ul}">
  <li>impressions 0.86x (361K → 312K)</li>
  <li>clicks 0.87x (3,169 → 2,748)</li>
  <li>CTR flat at 0.9%</li>
</ul>

<p>tested google ads for $100: ~$10 per signup, no revenue. will repeat once we have more cash in the bank</p>

<p>LLMs: went from 174 to 313 visitors signup rate 2.2x higher than google organic (4.7% vs 2.1%).</p>

<p>google organic is still the useful engine: 2.5K first-touch, 51 signups. crawl budget is still the ceiling there. the extra humans are LLMs + that direct bucket, not more google clicks.</p>

<p style="${h1}">money</p>

<p><a href="${STS_LINK}" style="${a}">selltostate.com</a> got 3 subs at $49/mo each. broke the ice, not repeatable revenue yet</p>

<p>programmatic SEO consulting keeps us afloat – two customers, $6K/mo total</p>

<p style="${h1}">investments</p>

<p>we got into AltaLab by AltaIR Capital program starts 7 sep. we don't get any funding or give up any equity</p>

<p style="${h1}">september plans</p>
<ul style="${ul}">
  <li><a href="${STS_LINK}" style="${a}">selltostate.com</a>: get more backlinks</li>
  <li>agency: deliver the two accounts + get 2 more customers so we have money for marketing the product</li>
  <li>AltaLab: absorb as much as we can, get into stage 2</li>
</ul>

<p style="${h1}">the ask</p>

<p>same as july: intros to portco CMOs who need programmatic SEO. the machine is built. happy to point it at someone else's business.</p>

<p>forward this to one of them — they can book here:</p>

<p style="margin:18px 0 24px">
  <a href="${CAL_LINK}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:6px">boost SEO traffic</a>
</p>

<p>have a good september,</p>

<p>Vlad</p>

<img src="${pixelUrl(email)}" width="1" height="1" alt="" style="display:none">
</body></html>`;
}

async function captureSent(email) {
  if (!POSTHOG_KEY) return;
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event: 'newsletter_sent',
        distinct_id: email.toLowerCase(),
        properties: {
          campaign: CAMPAIGN,
          source: 'send-script',
          $set: {
            email: email.toLowerCase(),
            newsletter_subscriber: true,
            last_newsletter_campaign: CAMPAIGN,
          },
        },
      }),
    });
  } catch { /* never block the send */ }
}

// ── Resend API ────────────────────────────────────────────────────
async function fetchContacts() {
  const res = await fetch(
    `https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'User-Agent': 'beton-newsletter/1.0',
      },
    }
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
      'User-Agent': 'beton-newsletter/1.0',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: REPLY_TO,
      subject: SUBJECT,
      html,
      tags: [{ name: 'campaign', value: CAMPAIGN }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Send to ${to} failed: ${res.status} ${err}`);
  }
  return res.json();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Campaign:  ${CAMPAIGN}`);
  console.log(`Subject:   ${SUBJECT}`);
  console.log(`From:      ${FROM}`);
  console.log(`Reply-to:  ${REPLY_TO}`);
  console.log(`Audience:  ${AUDIENCE_ID}`);
  console.log(`Tracker:   ${TRACKER_BASE}`);
  console.log(`Dry run:   ${DRY_RUN}`);
  console.log(`Test to:   ${TEST_TO || '(none)'}\n`);

  // ── Test mode: one copy to a single address, skip audience + guard ──
  if (TEST_TO) {
    console.log(`Sending TEST copy to ${TEST_TO} ...`);
    const res = await sendEmail(TEST_TO, buildHtml(TEST_TO));
    await captureSent(TEST_TO);
    console.log(`✓ sent — Resend id: ${res.id}`);
    return;
  }

  const contacts = await fetchContacts();
  console.log(`Subscribed contacts: ${contacts.length}\n`);

  if (DRY_RUN) {
    console.log('Recipients:');
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
      await captureSent(contact.email);
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
