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
 *   1. Set CAMPAIGN, SUBJECT, BLOG_URL below for the current edition.
 *   2. Edit buildHtml() to drop in the actual investor-update copy.
 *   3. Run --dry-run first; verify recipient list + sample HTML.
 *   4. Live send.
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
const SEND_DELAY_MS = 200;

// ── Campaign ──────────────────────────────────────────────────────
// EDIT EACH EDITION:
const CAMPAIGN = 'beton-investor-2026-04';
const SUBJECT = 'beton — april 2026 investor update';
const BLOG_URL = 'https://www.getbeton.ai/blog/beton-april-2026-update';

// ── Tracking (same redirector as general newsletter) ──────────────
const TRACKER_BASE = 'https://www.getbeton.ai/api/track';
const UTM = `utm_source=newsletter&utm_medium=email&utm_campaign=${CAMPAIGN}`;

function clickUrl(target, label, email) {
  const u = encodeURIComponent(target + (target.includes('?') ? '&' : '?') + UTM);
  return `${TRACKER_BASE}/click?u=${u}&c=${CAMPAIGN}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}

function pixelUrl(email) {
  return `${TRACKER_BASE}/pixel.png?c=${CAMPAIGN}&e=${encodeURIComponent(email)}`;
}

// ── Email HTML — investor edition ─────────────────────────────────
// Investor letters are personal; keep typography clean, no dense lists.
function buildHtml(email) {
  const link = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb">${text}</a>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.65;color:#1a1a1a;max-width:620px;margin:0 auto;padding:24px">

<p>hi —</p>

<p>quick beton investor update for april. <em>(replace this paragraph with the actual update copy — keep it under ~400 words, lead with the most material thing first.)</em></p>

<p><b>highlights</b></p>
<ul style="padding-left:20px">
  <li>placeholder bullet</li>
  <li>placeholder bullet</li>
  <li>placeholder bullet</li>
</ul>

<p><b>asks</b></p>
<p>placeholder — specific introductions, hiring help, or feedback we'd value.</p>

<p>full deck/post: ${link(BLOG_URL, 'investor-deck', 'getbeton.ai/blog/beton-april-2026-update')}</p>

<p>as always — replies welcome.</p>

<p>— vlad<br>
${link('https://www.getbeton.ai', 'homepage', 'getbeton.ai')}</p>

<img src="${pixelUrl(email)}" width="1" height="1" alt="" style="display:none">
</body></html>`;
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
  console.log(`Dry run:   ${DRY_RUN}\n`);

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
