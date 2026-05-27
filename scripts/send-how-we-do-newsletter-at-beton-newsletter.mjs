#!/usr/bin/env node
/**
 * "How we run our newsletter at Beton" newsletter.
 *
 * FULL-ARTICLE format: renders the actual post markdown into the email body so
 * readers get the whole piece in their inbox (Substack-style) without leaving
 * their mail client. Source of truth is the canonical anchor markdown.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-how-we-do-newsletter-at-beton-newsletter.mjs --test nadyyym@gmail.com
 *   RESEND_API_KEY=re_... node scripts/send-how-we-do-newsletter-at-beton-newsletter.mjs --dry-run
 *   RESEND_API_KEY=re_... node scripts/send-how-we-do-newsletter-at-beton-newsletter.mjs        # full audience
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { micromark } from 'micromark';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Source markdown (canonical anchor) ────────────────────────────
const MD_PATH = '/Users/nadyyym/repo-of-repos/vn-openclaw-personal/content/anchors/2026-05-22-how-we-do-newsletter-at-beton/blog.md';

// ── Env ───────────────────────────────────────────────────────────
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
if (!API_KEY) { console.error('Missing RESEND_API_KEY'); process.exit(1); }

const DRY_RUN = process.argv.includes('--dry-run');
const PREVIEW = process.argv.includes('--preview'); // write rendered html to /tmp and exit
const TEST_EMAILS = [];
let SCHEDULE_AT = null; // ISO 8601 string -> Resend holds + sends at this time
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--test' && process.argv[i + 1]) TEST_EMAILS.push(process.argv[i + 1]);
  if (process.argv[i] === '--schedule' && process.argv[i + 1]) SCHEDULE_AT = process.argv[i + 1];
}
const SEND_DELAY_MS = 150;

// ── Campaign ──────────────────────────────────────────────────────
const CAMPAIGN = 'how-we-do-newsletter-at-beton';
const SUBJECT = 'how we run our newsletter at beton';
const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const SITE = 'https://www.getbeton.ai';
const BLOG_URL = `${SITE}/blog/how-we-do-newsletter-at-beton/`;

const TRACKER_BASE = `${SITE}/api/track`;
const UTM = 'utm_source=substack&utm_medium=email&utm_campaign=' + CAMPAIGN;

// ── Tracking helpers ──────────────────────────────────────────────
function clickUrl(target, label, email) {
  const u = encodeURIComponent(target + (target.includes('?') ? '&' : '?') + UTM);
  return `${TRACKER_BASE}/click?u=${u}&c=${CAMPAIGN}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}
function pixelUrl(email) {
  return `${TRACKER_BASE}/pixel.png?c=${CAMPAIGN}&e=${encodeURIComponent(email)}`;
}

// ── Parse the markdown ────────────────────────────────────────────
function loadArticle() {
  const raw = readFileSync(MD_PATH, 'utf-8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter found in ' + MD_PATH);
  const fm = yaml.load(m[1]);
  const body = m[2].trim();
  return { fm, body };
}

// ── Markdown body -> email-safe HTML ──────────────────────────────
function renderBody(bodyMd, email) {
  let html = micromark(bodyMd, { allowDangerousHtml: true });

  // images: relative -> absolute prod url, styled, with the alt as a caption
  html = html.replace(
    /<img src="(\/images\/[^"]+)" alt="([^"]*)"[^>]*\/?>/g,
    (_m, src, alt) =>
      `<img src="${SITE}${src}" alt="${alt}" style="width:100%;max-width:600px;height:auto;border:1px solid #e5e5e5;border-radius:8px;display:block;margin:20px 0 6px" />` +
      (alt ? `<div style="font-size:12px;color:#888;margin:0 0 22px;line-height:1.5">${alt}</div>` : '')
  );

  // code BLOCKS: <pre> shell + inner <code class="language-..."> inherits
  html = html.replace(/<pre>/g,
    '<pre style="background:#1a1a1a;color:#e8e8e8;padding:16px 18px;border-radius:6px;overflow-x:auto;font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.6;margin:22px 0">');
  html = html.replace(/<code class="language-[^"]*">/g,
    '<code style="font-family:Menlo,Consolas,monospace;background:transparent;color:inherit;padding:0">');

  // INLINE code (bare <code>, not inside a pre): contrast red on light grey
  html = html.replace(/<code>/g,
    '<code style="font-family:Menlo,Consolas,monospace;color:#c92a2a;background:#f4f4f4;padding:2px 5px;border-radius:3px;font-size:0.9em">');

  // headings
  html = html.replace(/<h2>/g, '<h2 style="font-size:21px;font-weight:700;line-height:1.3;margin:34px 0 12px;color:#111">');
  html = html.replace(/<h3>/g, '<h3 style="font-size:17px;font-weight:700;line-height:1.3;margin:26px 0 10px;color:#111">');

  // paragraphs + lists
  html = html.replace(/<p>/g, '<p style="margin:0 0 16px">');
  html = html.replace(/<ul>/g, '<ul style="margin:0 0 16px;padding-left:22px">');
  html = html.replace(/<ol>/g, '<ol style="margin:0 0 16px;padding-left:22px">');
  html = html.replace(/<li>/g, '<li style="margin:0 0 7px">');

  // sidenote <aside> -> inline note box; <sup> ref kept as small marker
  html = html.replace(/<aside class="sidenote"[^>]*>/g,
    '<div style="border-left:3px solid #2563eb;background:#f8f9fa;padding:12px 16px;margin:22px 0;font-size:14px;color:#555;line-height:1.6">');
  html = html.replace(/<\/aside>/g, '</div>');
  html = html.replace(/<sup class="sidenote-ref"[^>]*>/g, '<sup style="color:#2563eb;font-weight:700">');

  // links: route through the click redirector (tracked + UTM) and style blue.
  // matches href wherever it sits in the tag (handles class-before-href).
  html = html.replace(/<a\s+([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/g,
    (_m, before, url, after) =>
      `<a ${before}href="${clickUrl(url, 'body-link', email)}"${after} style="color:#2563eb;text-decoration:underline">`);

  return html;
}

// ── TL;DR + FAQ blocks (match the on-site experience) ─────────────
function renderTldr(tldr, email) {
  if (!tldr) return '';
  // tldr is a markdown block (lead paragraph + bullet list)
  let inner = renderBody(tldr, email);
  return `<div style="background:#f4f6fb;border:1px solid #dbe3f4;border-radius:8px;padding:16px 18px;margin:0 0 28px">
    <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;margin:0 0 8px">tl;dr</div>
    ${inner}
  </div>`;
}

function renderFaq(faq, email) {
  if (!Array.isArray(faq) || !faq.length) return '';
  const items = faq.map(({ question, answer }) =>
    `<div style="margin:0 0 16px">
       <div style="font-weight:700;color:#111;margin:0 0 4px">${question}</div>
       <div style="color:#444">${answer}</div>
     </div>`).join('');
  return `<h2 style="font-size:21px;font-weight:700;line-height:1.3;margin:40px 0 14px;color:#111">FAQ</h2>${items}`;
}

// ── Full email ────────────────────────────────────────────────────
function buildHtml(email) {
  const { fm, body } = loadArticle();
  const heroSrc = `${SITE}${fm.coverImage}`;
  const bodyHtml = renderBody(body, email);
  const tldrHtml = renderTldr(fm.tldr, email);
  const faqHtml = renderFaq(fm.faq, email);
  const link = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb;text-decoration:underline">${text}</a>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;text-align:left">

<a href="${clickUrl(BLOG_URL, 'hero-image', email)}">
  <img src="${heroSrc}" alt="${fm.title}" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:14px" />
</a>

<p style="font-size:12px;color:#888;margin:0 0 18px">got this forwarded? ${link(`${SITE}/blog`, 'forward-subscribe', 'subscribe here')}</p>

<h1 style="font-size:26px;font-weight:700;line-height:1.25;margin:0 0 22px;color:#111">${fm.title}</h1>

${tldrHtml}

${bodyHtml}

<div style="margin:34px 0 8px;line-height:1.2">
  <a href="${clickUrl(BLOG_URL, 'cta-blog', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px">read it on the blog</a>
</div>

${faqHtml}

<p style="border-top:1px solid #e5e5e5;padding-top:16px;margin-top:36px;color:#666;font-size:13px">
${link(`${SITE}/blog`, 'subscribe', 'subscribe')} for articles on sales and revenue tooling
</p>

<p style="color:#666;font-size:13px">
written by team behind ${link(`${SITE}/`, 'beton-home', 'Beton')} — agent that finds new revenue drivers for B2B sales &amp; marketing teams in their own DWH
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

// ── Resend ────────────────────────────────────────────────────────
async function fetchContacts() {
  if (!AUDIENCE_ID) throw new Error('Missing RESEND_AUDIENCE_ID');
  const res = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`,
    { headers: { Authorization: `Bearer ${API_KEY}` } });
  if (!res.ok) throw new Error(`Fetch contacts failed: ${res.status} ${await res.text()}`);
  return (await res.json()).data.filter(c => !c.unsubscribed);
}

async function sendEmail(to, html) {
  const payload = {
    from: FROM, reply_to: REPLY_TO, to: [to], subject: SUBJECT, html,
    headers: {
      'List-Unsubscribe': '<mailto:newsletter+unsubscribe@getbeton.ai>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
  if (SCHEDULE_AT) payload.scheduled_at = SCHEDULE_AT; // Resend queues + fires at this time
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Send to ${to} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log(`Subject:  ${SUBJECT}`);
  console.log(`From:     ${FROM}`);
  console.log(`Dry run:  ${DRY_RUN}   Preview: ${PREVIEW}`);
  console.log(`Test:     ${TEST_EMAILS.length ? TEST_EMAILS.join(', ') : 'none'}\n`);

  if (PREVIEW) {
    const out = '/tmp/newsletter-preview.html';
    writeFileSync(out, buildHtml('preview@getbeton.ai'));
    const kb = (readFileSync(out).length / 1024).toFixed(1);
    console.log(`Wrote ${out} (${kb} KB${kb > 102 ? ' — WARNING: Gmail clips >102KB' : ', under Gmail clip limit'})`);
    return;
  }

  if (TEST_EMAILS.length) {
    for (const addr of TEST_EMAILS) {
      try {
        const result = await sendEmail(addr, buildHtml(addr));
        console.log(`Test sent to ${addr}: ${result.id}`);
      } catch (err) { console.error(`Test send to ${addr} failed: ${err.message}`); }
      await sleep(SEND_DELAY_MS);
    }
    return;
  }

  const contacts = await fetchContacts();
  console.log(`Audience:  ${contacts.length} subscribed\n`);
  if (DRY_RUN) { contacts.forEach(c => console.log(`  ${c.email}`)); return; }

  let sent = 0, failed = 0;
  for (const contact of contacts) {
    try {
      await sendEmail(contact.email, buildHtml(contact.email));
      sent++; console.log(`sent ${sent}/${contacts.length} ${contact.email}`);
    } catch (err) { failed++; console.error(`fail ${contact.email}: ${err.message}`); }
    await sleep(SEND_DELAY_MS);
  }
  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
}

main().catch(err => { console.error(err); process.exit(1); });
