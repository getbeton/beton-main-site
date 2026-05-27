#!/usr/bin/env node
/**
 * newsletter-send.mjs — the ONE newsletter sender. URL-driven, guarded, logged.
 *
 * Give it a getbeton.ai blog URL (or a bare slug). It:
 *   1. resolves the article (local Astro content collection, else the published .md)
 *   2. renders the full-article email with all the house guidelines (hero, tl;dr,
 *      tracked links + pixel, standard footer, sans-serif, left-aligned)
 *   3. auto-creates/updates the newsletter row in the beton-gtm Supabase
 *   4. CLAIMS each recipient before sending (atomic insert) so a re-run / overlapping
 *      run can NEVER double-send — the failure mode that doubled the 2026-05-21 blast
 *   5. logs every send (sent/failed) back to Supabase
 *
 * Replaces the per-campaign send-<slug>-newsletter.mjs scripts.
 *
 * Usage:
 *   node scripts/newsletter-send.mjs https://www.getbeton.ai/blog/grafana-pricing-teardown/ --preview
 *   node scripts/newsletter-send.mjs grafana-pricing-teardown --test nadyyym@gmail.com
 *   node scripts/newsletter-send.mjs grafana-pricing-teardown --dry-run
 *   node scripts/newsletter-send.mjs grafana-pricing-teardown --schedule 2026-05-23T07:00:00Z
 *   node scripts/newsletter-send.mjs grafana-pricing-teardown            # full audience (guarded)
 *
 * Flags:
 *   --test <email>      send one copy to <email> (repeatable); no Supabase, no audience
 *   --dry-run           list audience + how many are NEW vs already-sent; send nothing
 *   --preview           write rendered HTML to /tmp and exit
 *   --schedule <iso>    hand Resend a scheduled_at so it queues + fires at that time
 *   --subject "<text>"  override the subject (default: lowercased article title)
 *   --campaign <slug>   override the campaign slug (default: blog slug)
 *   --md <path>         force a local markdown source instead of resolving by slug
 *   --force-unguarded   send WITHOUT the Supabase guard (refused unless explicitly set)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import yaml from 'js-yaml';
import { makeNewsletterDb } from './lib/newsletter-db.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://www.getbeton.ai';

// ── Env (.env in repo root) ───────────────────────────────────────
(() => {
  try {
    const envFile = readFileSync(resolve(__dirname, '..', '.env'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
})();

const API_KEY = process.env.RESEND_API_KEY;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

// ── Args ──────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

// first bare token that isn't the value of a value-taking flag
const TARGET = argv.find((a) => !a.startsWith('--') &&
  !['--test', '--schedule', '--subject', '--campaign', '--md'].includes(argv[argv.indexOf(a) - 1]));
const DRY_RUN = has('--dry-run');
const PREVIEW = has('--preview');
const FORCE_UNGUARDED = has('--force-unguarded');
const SCHEDULE_AT = val('--schedule');
const SUBJECT_OVERRIDE = val('--subject');
const CAMPAIGN_OVERRIDE = val('--campaign');
const MD_OVERRIDE = val('--md');
const TEST_EMAILS = argv.reduce((acc, a, i) => (a === '--test' && argv[i + 1] ? [...acc, argv[i + 1]] : acc), []);
const SEND_DELAY_MS = 150;

if (!TARGET) {
  console.error('Need a blog URL or slug. e.g. node scripts/newsletter-send.mjs grafana-pricing-teardown --preview');
  process.exit(1);
}

// ── Resolve slug + blog url from the target ───────────────────────
function resolveSlug(target) {
  if (/^https?:\/\//.test(target)) {
    const m = target.match(/\/blog\/([^/?#]+)/);
    if (!m) throw new Error(`Could not extract slug from URL: ${target}`);
    return m[1];
  }
  return target.replace(/^\/+|\/+$/g, '');
}
const SLUG = resolveSlug(TARGET);
const CAMPAIGN = CAMPAIGN_OVERRIDE || SLUG;
const BLOG_URL = `${SITE}/blog/${SLUG}/`;
const UTM = `utm_source=newsletter&utm_medium=email&utm_campaign=${CAMPAIGN}`;
const TRACKER_BASE = `${SITE}/api/track`;

const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';

// ── Tracking helpers ──────────────────────────────────────────────
const clickUrl = (target, label, email) => {
  const u = encodeURIComponent(target + (target.includes('?') ? '&' : '?') + UTM);
  return `${TRACKER_BASE}/click?u=${u}&c=${CAMPAIGN}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
};
const pixelUrl = (email) => `${TRACKER_BASE}/pixel.png?c=${CAMPAIGN}&e=${encodeURIComponent(email)}`;

// ── Load the article (local content collection preferred) ─────────
async function loadArticle() {
  const localPath = MD_OVERRIDE || resolve(__dirname, '..', 'src', 'data', 'blog', `${SLUG}.md`);
  if (existsSync(localPath)) {
    const raw = readFileSync(localPath, 'utf-8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) throw new Error(`No frontmatter in ${localPath}`);
    const fm = yaml.load(m[1]);
    if (fm.draft) throw new Error(`${SLUG} is marked draft: true — refusing to send`);
    return { fm, body: m[2].trim(), source: localPath };
  }
  // Remote fallback: published .md (body) + OG tags (hero/title) from the HTML page.
  const mdRes = await fetch(`${SITE}/blog/${SLUG}.md`);
  if (!mdRes.ok) throw new Error(`No local file and ${SITE}/blog/${SLUG}.md returned ${mdRes.status}`);
  let md = await mdRes.text();
  const titleM = md.match(/^#\s+(.+)$/m);
  const title = titleM ? titleM[1].trim() : SLUG;
  if (titleM) md = md.replace(titleM[0], '').trim();
  const htmlRes = await fetch(BLOG_URL);
  const html = htmlRes.ok ? await htmlRes.text() : '';
  const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
  const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
  return {
    fm: { title, coverImage: og ? og[1] : null, description: desc ? desc[1] : '', tldr: null, faq: null },
    body: md,
    source: `${SITE}/blog/${SLUG}.md (remote)`,
  };
}

// ── Markdown body -> email-safe HTML ──────────────────────────────
function renderBody(bodyMd, email) {
  let html = micromark(bodyMd, {
    allowDangerousHtml: true,
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });
  // The inline signup form is web-only (dead in email + recipients already
  // subscribed). Strip it; the email is framed as a personal note with the
  // CTA buttons + signoff at the end (see buildHtml).
  html = html.replace(
    /<div class="not-prose"[\s\S]*?data-inline-subscribe[\s\S]*?data-sub-err[\s\S]*?<\/p>\s*<\/div>/g,
    ''
  );
  // Charts ship as inline SVG on the web (email clients strip SVG); swap each
  // tagged <figure data-email-img="..."> for a hosted PNG + its caption.
  html = html.replace(
    /<figure[^>]*data-email-img="([^"]+)"[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g,
    (_m, src, caption) =>
      `<img src="${SITE}${src}" alt="${caption.replace(/"/g, '&quot;')}" style="width:100%;max-width:600px;height:auto;display:block;margin:24px 0 6px" />` +
      `<div style="font-size:12px;color:#888;margin:0 0 24px;line-height:1.5">${caption}</div>`
  );
  html = html.replace(
    /<img src="(\/images\/[^"]+)" alt="([^"]*)"[^>]*\/?>/g,
    (_m, src, alt) =>
      `<img src="${SITE}${src}" alt="${alt}" style="width:100%;max-width:600px;height:auto;border:1px solid #e5e5e5;border-radius:8px;display:block;margin:20px 0 6px" />` +
      (alt ? `<div style="font-size:12px;color:#888;margin:0 0 22px;line-height:1.5">${alt}</div>` : '')
  );
  html = html.replace(/<pre>/g,
    '<pre style="background:#1a1a1a;color:#e8e8e8;padding:16px 18px;border-radius:6px;overflow-x:auto;font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.6;margin:22px 0">');
  html = html.replace(/<code class="language-[^"]*">/g,
    '<code style="font-family:Menlo,Consolas,monospace;background:transparent;color:inherit;padding:0">');
  html = html.replace(/<code>/g,
    '<code style="font-family:Menlo,Consolas,monospace;color:#c92a2a;background:#f4f4f4;padding:2px 5px;border-radius:3px;font-size:0.9em">');
  html = html.replace(/<h2>/g, '<h2 style="font-size:21px;font-weight:700;line-height:1.3;margin:34px 0 12px;color:#111">');
  html = html.replace(/<h3>/g, '<h3 style="font-size:17px;font-weight:700;line-height:1.3;margin:26px 0 10px;color:#111">');
  html = html.replace(/<p>/g, '<p style="margin:0 0 16px">');
  html = html.replace(/<ul>/g, '<ul style="margin:0 0 16px;padding-left:22px">');
  html = html.replace(/<ol>/g, '<ol style="margin:0 0 16px;padding-left:22px">');
  html = html.replace(/<li>/g, '<li style="margin:0 0 7px">');
  // GFM tables — style for email (no external CSS).
  html = html.replace(/<table>/g, '<table role="presentation" style="width:100%;border-collapse:collapse;margin:18px 0;font-size:13px;line-height:1.45">');
  html = html.replace(/<th>/g, '<th style="text-align:left;border:1px solid #e2e2e2;padding:7px 9px;background:#f4f6fb;font-weight:700;color:#111">');
  html = html.replace(/<th align="(left|right|center)">/g, '<th style="text-align:$1;border:1px solid #e2e2e2;padding:7px 9px;background:#f4f6fb;font-weight:700;color:#111">');
  html = html.replace(/<td>/g, '<td style="border:1px solid #e2e2e2;padding:7px 9px;color:#333;vertical-align:top">');
  html = html.replace(/<td align="(left|right|center)">/g, '<td style="text-align:$1;border:1px solid #e2e2e2;padding:7px 9px;color:#333;vertical-align:top">');
  html = html.replace(/<aside class="sidenote"[^>]*>/g,
    '<div style="border-left:3px solid #2563eb;background:#f8f9fa;padding:12px 16px;margin:22px 0;font-size:14px;color:#555;line-height:1.6">');
  html = html.replace(/<\/aside>/g, '</div>');
  html = html.replace(/<sup class="sidenote-ref"[^>]*>/g, '<sup style="color:#2563eb;font-weight:700">');
  // Email clients can't resolve root-relative links — make them absolute first.
  html = html.replace(/href="\/([^"]*)"/g, `href="${SITE}/$1"`);
  html = html.replace(/<a\s+([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/g,
    (_m, before, url, after) =>
      `<a ${before}href="${clickUrl(url, 'body-link', email)}"${after} style="color:#2563eb;text-decoration:underline">`);
  // Email-only: append the "links at the bottom" sentence to the intro paragraph.
  html = html.replace(/(public on GitHub<\/a>\.)<\/p>/,
    '$1 Links to all 20 teardowns are at the bottom of this email.</p>');
  return html;
}

function renderTldr(tldr, email) {
  if (!tldr) return '';
  return `<div style="background:#f4f6fb;border:1px solid #dbe3f4;border-radius:8px;padding:16px 18px;margin:0 0 28px">
    <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;margin:0 0 8px">tl;dr</div>
    ${renderBody(tldr, email)}
  </div>`;
}

function renderFaq(faq, email) {
  if (!Array.isArray(faq) || !faq.length) return '';
  const items = faq.map(({ question, answer }) =>
    `<div style="margin:0 0 16px"><div style="font-weight:700;color:#111;margin:0 0 4px">${question}</div><div style="color:#444">${answer}</div></div>`).join('');
  return `<h2 style="font-size:21px;font-weight:700;line-height:1.3;margin:40px 0 14px;color:#111">FAQ</h2>${items}`;
}

function buildHtml(article, email) {
  const { fm, body } = article;
  const heroSrc = fm.coverImage ? (/^https?:\/\//.test(fm.coverImage) ? fm.coverImage : `${SITE}${fm.coverImage}`) : null;
  const link = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb;text-decoration:underline">${text}</a>`;
  const hero = heroSrc
    ? `<a href="${clickUrl(BLOG_URL, 'hero-image', email)}"><img src="${heroSrc}" alt="${fm.title}" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:14px" /></a>`
    : '';
  // Render body, then place the TL;DR right above the signup block if present
  // (Vlad's layout); otherwise fall back to the top, under the title.
  let bodyHtml = renderBody(body, email);
  const tldrHtml = renderTldr(fm.tldr, email);
  // Place the TL;DR after the intro and right before the first section, so the
  // email opens with the intro text. Fall back to the top if there's no <h2>.
  let topTldr = '';
  if (tldrHtml && /<h2/.test(bodyHtml)) {
    bodyHtml = bodyHtml.replace(/<h2/, `${tldrHtml}<h2`);
  } else {
    topTldr = tldrHtml;
  }
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;text-align:left">
${hero}
<h1 style="font-size:26px;font-weight:700;line-height:1.25;margin:0 0 22px;color:#111">${fm.title}</h1>
<p style="margin:0 0 16px">Hi, it's Vlad, founder of Beton,</p>
${topTldr}
${bodyHtml}
${renderFaq(fm.faq, email)}
<div style="margin:34px 0 10px;line-height:1.3">
  <a href="${clickUrl(BLOG_URL, 'cta-blog', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 10px 10px 0">Read on the blog →</a>
  <a href="${clickUrl('https://github.com/getbeton/oss-pricing-data', 'cta-github', email)}" style="display:inline-block;background:#111;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 10px 10px 0">See data on GitHub</a>
</div>
<p style="margin:18px 0 0">– Vlad</p>
<p style="font-size:12px;color:#888;margin:24px 0 0">got this forwarded? ${link(`${SITE}/blog`, 'forward-subscribe', 'subscribe here')}</p>
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
  return (await res.json()).data.filter((c) => !c.unsubscribed);
}

async function sendEmail(to, html, subject) {
  const payload = {
    from: FROM, reply_to: REPLY_TO, to: [to], subject, html,
    headers: {
      'List-Unsubscribe': '<mailto:newsletter+unsubscribe@getbeton.ai>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
  if (SCHEDULE_AT) payload.scheduled_at = SCHEDULE_AT;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Send to ${to} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  const article = await loadArticle();
  const SUBJECT = SUBJECT_OVERRIDE || String(article.fm.title || SLUG).toLowerCase();

  console.log(`Slug:     ${SLUG}`);
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log(`Subject:  ${SUBJECT}`);
  console.log(`Blog URL: ${BLOG_URL}`);
  console.log(`Source:   ${article.source}`);
  console.log(`Hero:     ${article.fm.coverImage || '(none)'}`);
  console.log(`Schedule: ${SCHEDULE_AT || 'send immediately'}\n`);

  // ── preview ──
  if (PREVIEW) {
    const out = `/tmp/newsletter-${SLUG}.html`;
    writeFileSync(out, buildHtml(article, 'preview@getbeton.ai'));
    const kb = (readFileSync(out).length / 1024).toFixed(1);
    console.log(`Wrote ${out} (${kb} KB${kb > 102 ? ' — WARNING: Gmail clips >102KB' : ', under Gmail clip limit'})`);
    return;
  }

  if (!API_KEY) { console.error('Missing RESEND_API_KEY'); process.exit(1); }

  // ── test (no audience, no Supabase) ──
  if (TEST_EMAILS.length) {
    for (const addr of TEST_EMAILS) {
      try {
        const r = await sendEmail(addr, buildHtml(article, addr), SUBJECT);
        console.log(`Test sent to ${addr}: ${r.id}`);
      } catch (e) { console.error(`Test send to ${addr} failed: ${e.message}`); }
      await sleep(SEND_DELAY_MS);
    }
    return;
  }

  // pre-flight: blog post must be live
  const live = await fetch(BLOG_URL, { method: 'HEAD' });
  if (!live.ok) { console.error(`Pre-flight FAILED: ${BLOG_URL} returned ${live.status}. Publish the post first.`); process.exit(1); }
  console.log(`Pre-flight: ${BLOG_URL} is live (${live.status})`);

  // ── the guard ──
  const db = makeNewsletterDb();
  if (!db && !FORCE_UNGUARDED) {
    console.error('\nSUPABASE_GTM_SERVICE_ROLE_KEY not set — refusing to send unguarded.');
    console.error('An unguarded run is exactly what double-sent the 2026-05-21 blast.');
    console.error('Set the key (see scripts/lib/newsletter-db.mjs), or pass --force-unguarded if you accept the risk.');
    process.exit(1);
  }

  const contacts = await fetchContacts();
  console.log(`Audience: ${contacts.length} subscribed\n`);

  let newsletter = null;
  if (db) {
    newsletter = await db.upsertNewsletter({
      slug: CAMPAIGN, subject: SUBJECT, blogUrl: BLOG_URL,
      audienceId: AUDIENCE_ID, scheduledAt: SCHEDULE_AT,
    });
    const stats = await db.sendStats(newsletter.id);
    console.log(`Already logged for this campaign: sent=${stats.sent} failed=${stats.failed} (these will be SKIPPED)\n`);
  }

  if (DRY_RUN) {
    let fresh = 0;
    if (db) {
      for (const c of contacts) {
        const wouldSend = await db.claimRecipient(newsletter.id, c.email, SCHEDULE_AT);
        if (wouldSend) { fresh++; console.log(`  NEW   ${c.email}`); }
        else console.log(`  skip  ${c.email} (already claimed)`);
      }
      // dry-run claims would pollute; roll them back to keep it a true preview
      await db.client.from('newsletter_sends')
        .delete().eq('newsletter_id', newsletter.id).eq('status', 'sending');
      console.log(`\nDRY RUN: ${fresh} new, ${contacts.length - fresh} already sent. (claims rolled back) Nothing sent.`);
    } else {
      contacts.forEach((c) => console.log(`  ${c.email}`));
      console.log(`\nDRY RUN (unguarded): ${contacts.length} recipients. Nothing sent.`);
    }
    return;
  }

  if (db) await db.setNewsletterStatus(newsletter.id, 'sending');

  let sent = 0, skipped = 0, failed = 0;
  for (const c of contacts) {
    // CLAIM before send. If we don't get the claim, someone already sent → skip.
    if (db) {
      let claimed;
      try { claimed = await db.claimRecipient(newsletter.id, c.email, SCHEDULE_AT); }
      catch (e) { failed++; console.error(`claim fail ${c.email}: ${e.message}`); continue; }
      if (!claimed) { skipped++; console.log(`skip ${c.email} (already sent)`); continue; }
    }
    try {
      const r = await sendEmail(c.email, buildHtml(article, c.email), SUBJECT);
      if (db) await db.markSent(newsletter.id, c.email, r.id);
      sent++; console.log(`sent ${sent} ${c.email}`);
    } catch (e) {
      failed++;
      if (db) await db.markFailed(newsletter.id, c.email, e.message);
      console.error(`fail ${c.email}: ${e.message}`);
    }
    await sleep(SEND_DELAY_MS);
  }

  if (db) await db.setNewsletterStatus(newsletter.id, 'sent', { sentAt: new Date().toISOString() });
  console.log(`\nDone. Sent: ${sent}, Skipped (already sent): ${skipped}, Failed: ${failed}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
