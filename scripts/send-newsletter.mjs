#!/usr/bin/env node
/**
 * Send newsletter to Resend audience with per-recipient tracking.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-newsletter.mjs [--dry-run]
 *
 * Env (reads from .env automatically):
 *   RESEND_API_KEY       — Resend API key
 *   RESEND_AUDIENCE_ID   — Audience to send to
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────
// Load .env manually (no dotenv dependency)
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
const CAMPAIGN = 'beton-april-2026-update';
const SUBJECT = 'beton april 2026 — slack, mcp oauth, open source';
const FROM = 'Beton <newsletter@getbeton.info>';
const BLOG_URL = 'https://www.getbeton.ai/blog/beton-april-2026-update';

const TRACKER_BASE = 'https://www.getbeton.ai/api/track';
const UTM = 'utm_source=substack&utm_medium=email&utm_campaign=' + CAMPAIGN;

// ── Already sent (Apr 14 batch, hit Resend quota at 100) ─────────
const ALREADY_SENT = new Set([
  'back1ply@gmail.com','bizhov@gmail.com','vad.smirnof@gmail.com','den@wiseops.team',
  'katuninamr@gmail.com','harsh121102@gmail.com','will@posthog.com','rapha@robo.tech',
  'sir681@gmail.com','intelligistx@gmail.com','yariv@ellipsis-venture.com',
  'dhananjaybiraris@dpcoepune.edu.in','nextzucker@gmail.com','mccrae.brandon2@gmail.com',
  'om.jain@predictivdata.com','rinat.khatipov@gmail.com','jurkemik@significa.sk',
  'mattias@n8n.com','harsh@formbricks.com','gleb@goodtake.co','y7kotld@gmail.com',
  'eduards.zolotuhins@gmail.com','anmol.kumar@hono.ai','backstageofme@gmail.com',
  'kimberly.irina@yahoo.co.uk','srglosev@gmail.com','giorgio.pontillo@keboola.com',
  'hadi@groundley.com','easyascake12@gmail.com','austin.r.cain.mi@gmail.com',
  'sashmark97@gmail.com','am@getbeton.ai','s@getbeton.ai','max@commit.fund',
  'bala@fullcast.com','invest@kvinogradov.com','mohammed.wajee@gmail.com','tim@ikels.org',
  'flasks.goatees3k@icloud.com','dhruv@fusegtm.com','alexandrklimovskikh@gmail.com',
  'aredfern@growthandbrains.com','paolo@coreform.ai','edsmktg100@gmail.com',
  'kloosee1992@gmail.com','qelphybox@gmail.com','ashkaushik0007@gmail.com',
  'maxim25062001@gmail.com','speedygetaways21@gmail.com','closeym@gmail.com',
  'isliuxian@163.com','nayan.kumar@couchbase.com','karim@slicey.ai','asrafakhri@gmail.com',
  'andrey@illumi.one','tayoolakunle77@gmail.com','kitmanov27@gmail.com',
  'kowybusiness@gmail.com','geektheory26@gmail.com','antonoff.box@gmail.com',
  'info@j-filipiak.pl','serge@themoat.agency','gilbert@spider.cloud','dosada@gmail.com',
  'pablosantiagoolive@gmail.com','rockyrush7@gmail.com','cboegelund@gmail.com',
  'moveflux@gmail.com','kuzel1@rambler.ru','office@thefor.xyz','andre.gorianov@gmail.com',
  'evtyukhovaksenia@gmail.com','dharm@azureinfra.email','nizhge@gmail.com',
  'mahsle7@gmail.com','roman.polyak@gmail.com','mark.dragunov@gmail.com',
  'ruslan.lobachev@gmail.com','k@contentloop.ai','ayan.barua+nl@gmail.com',
  'romahakov@gmail.com','pskiselev97@gmail.com','mzolotova616@gmail.com',
  'aopankin@gmail.com','eat@me.com','svetoslav.bc@gmail.com','theweras@gmail.com',
  'grigorevadari@gmail.com','aupismo@gmail.com','diana.gevorkyan999@gmail.com',
  'pigalevegor@icloud.com','vmshatkovskiy@gmail.com','vladimir@gusev.work',
  'daniel.chepenko@yahoo.com','imail4ernyshov@gmail.com','pavel.mityukhin@gmail.com',
  'mashamalugina@gmail.com','egtaranov@gmail.com','alexeymilechin@gmail.com',
  'mat.xenia@mail.ru',
]);

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

<p>two months since the last update. here's what shipped and what's coming.</p>

<p><b>slack integration</b></p>
<p>when a signal fires, beton now pushes block kit notifications to your slack channel — account name, signal type, confidence score, direct link back to inspector. full oauth v2 flow, channel picker in settings, one-click setup.</p>

<p><b>mcp server: now with oauth</b></p>
<p>we upgraded the embedded mcp server from api key auth to interactive oauth login following rfc 9728. streamable http transport, dual-auth support. if you're wiring ai agents into your revops stack, this is probably the cleanest integration point out there.</p>

<p><b>security audit</b></p>
<p>we ran a penetration test and remediated 32 vulnerabilities — cross-tenant data leaks, xss vectors, error message sanitization, ssrf surface area. the boring kind of work that matters most.</p>

<p><b>blog moved to our own platform</b></p>
<p>migrated from substack to getbeton.ai. every post now lives on our domain — seo value compounds for us instead of for substack.</p>

<p><b>marketing site updates</b></p>
<p>real company logos as social proof. fixed a pile of gsc 404s. added an open source tools section and structured data improvements. also launched a separate site to a/b test our seo approach — it pulls 1,500 views/day with the same playbook. the beton site doesn't see that yet, which means the problem is site-specific. we're digging in.</p>

<p><b>coming up</b></p>
<p><b>postgres as a data source</b> — same pattern as posthog (schema analysis, hypothesis generation, statistical testing) but against raw postgres databases.</p>
<p><b>hubspot integration</b> — full bidirectional sync with oauth, polling engine, mcp tools, native signal detectors.</p>
<p><b>multi-user workspaces</b> — invitations and role-based access so your team shares one signal pipeline.</p>
<p>and the big one: <b>we're open-sourcing the beton agent this week.</b></p>

<p>full post: ${link(BLOG_URL, 'read-full-post', 'getbeton.ai/blog/beton-april-2026-update')}</p>

<p style="color:#666;font-size:12px;margin-top:40px">— vlad<br>
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

  const allContacts = await fetchContacts();
  const contacts = allContacts.filter(c => !ALREADY_SENT.has(c.email.toLowerCase()));
  const skipped = allContacts.length - contacts.length;
  console.log(`Audience:  ${allContacts.length} subscribed`);
  console.log(`Skipping:  ${skipped} (already received Apr 14 batch)`);
  console.log(`To send:   ${contacts.length}\n`);

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
