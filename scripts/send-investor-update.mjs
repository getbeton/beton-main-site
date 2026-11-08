#!/usr/bin/env node
/**
 * Investor update — minimal HTML, PostHog tracking, guarded. One-off sends (no threading).
 *
 *   node scripts/send-investor-update.mjs --md <file.md> --test v@getbeton.ai
 *   node scripts/send-investor-update.mjs --md <file.md> --dry-run
 *   node scripts/send-investor-update.mjs --md <file.md>
 *
 * - Every email CCs vlad@selltostate.com (warms the new domain's filters before we send from it).
 * - Tracking: track.getbeton.org pixel + click redirector -> PostHog 225773. Hosts outside the
 *   tracker allowlist stay unwrapped (the worker would refuse them).
 * - Full send refuses while "[VLAD:" notes remain in the body. --test strips them.
 *
 * Vault: ~/.claude/secrets/vm-integrations/{resend,supabase_gtm}.json
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const VAULT = join(homedir(), '.claude/secrets/vm-integrations');
const TRACKER = 'https://track.getbeton.org';
const TRACKED_HOSTS = [/(^|\.)selltostate\.com$/, /(^|\.)vobo\.dev$/, /(^|\.)cal\.com$/, /(^|\.)github\.com$/, /(^|\.)getbeton\.org$/, /(^|\.)x\.com$/, /^twitter\.com$/, /(^|\.)producthunt\.com$/];
const INVESTOR_AUDIENCE = 'da0c242d-7f52-4155-a4cf-b4fae84a82e3';
const FROM = 'Vlad Nadymov <v@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const CC = 'vlad@selltostate.com';
const UNSUB = 'mailto:v@getbeton.ai?subject=unsubscribe';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const SEND_DELAY_MS = 150;

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : null;
};
const MD = val('--md');
const TEST_TO = val('--test');
const DRY_RUN = has('--dry-run');
const NO_CC = has('--no-cc');
if (!MD) {
  console.error('--md <file> is required');
  process.exit(1);
}

function loadJson(name) {
  const p = join(VAULT, name);
  if (!existsSync(p)) throw new Error(`missing vault file ${name}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}
const API_KEY = loadJson('resend.json').api_key;
const sbVault = loadJson('supabase_gtm.json');
const SB_URL = (sbVault.url || '').replace(/\/$/, '');
const SB_KEY = sbVault.service_role_key;

function parseMd(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter in ${path}`);
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return { fm, body: m[2].trim() };
}

const stripNotes = (s) => s.replace(/\s*\[VLAD:[^\]]*\]/g, '');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const norm = (e) => String(e || '').trim().toLowerCase();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function tracked(url) {
  try {
    return TRACKED_HOSTS.some((re) => re.test(new URL(url).hostname));
  } catch {
    return false;
  }
}

function href(url, campaign, email, label) {
  if (!tracked(url)) return url;
  return `${TRACKER}/click?u=${encodeURIComponent(url)}&c=${encodeURIComponent(campaign)}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}

function inline(text, campaign, email) {
  // [label](url) and bare urls -> anchors; **bold** -> strong
  let out = '';
  let last = 0;
  let n = 0;
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s<)]+/g;
  for (const m of text.matchAll(re)) {
    out += esc(text.slice(last, m.index));
    const url = (m[2] || m[0]).replace(/[.,;:]$/, '');
    const label = m[1] || url;
    n += 1;
    out += `<a href="${esc(href(url, campaign, email, new URL(url).hostname.replace(/^www\./, '')))}" style="color:#000;text-decoration:underline">${esc(label)}</a>`;
    last = m.index + (m[2] ? m[0].length : url.length);
  }
  out += esc(text.slice(last));
  return out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function toHtml(body, campaign, email) {
  const P = 'margin:0 0 16px;color:#000;font-size:14px;line-height:1.5';
  const blocks = body.split(/\n\n+/).map((block) => {
    const lines = block.split('\n');
    if (lines.every((l) => /^\s*-\s+/.test(l))) {
      const items = lines.map((l) => `<li style="margin:0 0 6px">${inline(l.replace(/^\s*-\s+/, ''), campaign, email)}</li>`);
      return `<ul style="${P};padding-left:20px">${items.join('')}</ul>`;
    }
    return `<p style="${P}">${inline(lines.join(' '), campaign, email)}</p>`;
  });
  const pixel = `${TRACKER}/pixel.png?c=${encodeURIComponent(campaign)}&e=${encodeURIComponent(email)}`;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#000;font-size:14px;line-height:1.5;margin:0;padding:16px;max-width:600px">
${blocks.join('\n')}
<img src="${esc(pixel)}" width="1" height="1" alt="" style="display:none;border:0;width:1px;height:1px">
</body></html>`;
}

const toText = (body) => body.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)');

function firstName(contact) {
  const a = (contact.first_name || '').trim();
  return a || '';
}

function buildLetter(contact, { strip }) {
  const { fm, body: raw } = parseMd(MD);
  const campaign = fm.campaign;
  if (!campaign) throw new Error('frontmatter needs campaign');
  let body = strip ? stripNotes(raw) : raw;
  const fn = firstName(contact);
  body = body.replace(/^Hi,/m, fn ? `Hi ${fn},` : 'Hi,');
  return { subject: fm.subject, campaign, text: toText(body), html: toHtml(body, campaign, contact.email), hasNotes: /\[VLAD:/.test(raw) };
}

async function resendJson(url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${API_KEY}`, 'User-Agent': UA, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Resend ${method} ${url} ${res.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

async function sendOne(to, letter) {
  const headers = { 'List-Unsubscribe': `<${UNSUB}>` };
  return resendJson('https://api.resend.com/emails', {
    method: 'POST',
    body: {
      from: FROM,
      reply_to: REPLY_TO,
      to: [to],
      ...(NO_CC ? {} : { cc: [CC] }),
      subject: letter.subject,
      text: letter.text,
      html: letter.html,
      tags: [{ name: 'campaign', value: letter.campaign }],
      headers,
    },
  });
}

async function fetchContacts() {
  const out = [];
  let after;
  for (;;) {
    const u = new URL(`https://api.resend.com/audiences/${INVESTOR_AUDIENCE}/contacts`);
    u.searchParams.set('limit', '100');
    if (after) u.searchParams.set('after', after);
    const page = await resendJson(u);
    const rows = page.data || [];
    out.push(...rows);
    if (!page.has_more || !rows.length) break;
    after = rows[rows.length - 1].id;
  }
  return out.filter((c) => !c.unsubscribed && c.email);
}

async function sb(path, { method = 'GET', body, query } = {}) {
  const url = new URL(SB_URL + path);
  for (const [k, v] of Object.entries(query || {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: method === 'POST' ? 'return=representation,resolution=merge-duplicates' : 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`supabase ${method} ${path} ${res.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  if (TEST_TO) {
    const letter = buildLetter({ email: TEST_TO, first_name: 'Vlad' }, { strip: true });
    if (letter.hasNotes) console.log('note: [VLAD: …] notes stripped for the test; a full send refuses until they are resolved');
    const r = await sendOne(TEST_TO, letter);
    console.log(`TEST → ${TEST_TO} cc ${NO_CC ? 'none' : CC} id=${r.id}`);
    return;
  }
  const probe = buildLetter({ email: 'probe@example.com' }, { strip: false });
  if (probe.hasNotes) {
    console.error('refusing: [VLAD: …] notes are still in the body. Resolve them first.');
    process.exit(1);
  }
  if (!SB_KEY) {
    console.error('supabase key missing — refuse unguarded send');
    process.exit(1);
  }
  const contacts = await fetchContacts();
  const [nl] = await sb('/rest/v1/newsletters', {
    method: 'POST',
    query: { on_conflict: 'slug' },
    body: { slug: probe.campaign, subject: probe.subject, audience_id: INVESTOR_AUDIENCE, updated_at: new Date().toISOString() },
  });
  console.log(`audience ${contacts.length}; newsletter ${probe.campaign} id=${nl.id}`);
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const c of contacts) {
    const claimed = await sb('/rest/v1/rpc/claim_newsletter_recipient', { method: 'POST', body: { p_newsletter_id: nl.id, p_email: c.email, p_scheduled_at: null } });
    if (claimed !== true) {
      skipped += 1;
      continue;
    }
    if (DRY_RUN) {
      sent += 1;
      continue;
    }
    const q = { newsletter_id: `eq.${nl.id}`, email_norm: `eq.${norm(c.email)}` };
    try {
      const r = await sendOne(c.email, buildLetter(c, { strip: false }));
      await sb('/rest/v1/newsletter_sends', { method: 'PATCH', query: q, body: { status: 'sent', resend_email_id: r.id, sent_at: new Date().toISOString() } });
      sent += 1;
    } catch (e) {
      await sb('/rest/v1/newsletter_sends', { method: 'PATCH', query: q, body: { status: 'failed', error: String(e).slice(0, 1000) } });
      failed += 1;
      console.error(`fail ${c.email}: ${e}`);
    }
    await sleep(SEND_DELAY_MS);
  }
  if (DRY_RUN) await sb('/rest/v1/newsletter_sends', { method: 'DELETE', query: { newsletter_id: `eq.${nl.id}`, status: 'eq.sending' } });
  else if (sent > 0) {
    const now = new Date().toISOString();
    await sb('/rest/v1/newsletters', { method: 'PATCH', query: { id: `eq.${nl.id}` }, body: { status: 'sent', sent_at: now, updated_at: now } });
  }
  console.log(`${DRY_RUN ? 'DRY ' : ''}sent ${sent} · skipped (already claimed) ${skipped} · failed ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
