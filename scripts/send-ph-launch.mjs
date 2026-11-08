#!/usr/bin/env node
/**
 * PH launch-day letters — plaintext-looking multipart, guarded.
 *
 *   STS  + Beton  → Resend native open/click (domain tracking)
 *   Investor      → track.getbeton.org pixel + click → PostHog 225773
 *
 * Overlap: investor wins; then STS; Beton gets the remainder.
 * Skip unsubscribed. Skip @getbeton.ai on the STS list.
 *
 *   node scripts/send-ph-launch.mjs --test nadyyym@gmail.com
 *   node scripts/send-ph-launch.mjs --dry-run
 *   node scripts/send-ph-launch.mjs
 *   node scripts/send-ph-launch.mjs --only sts|beton|investor
 *   node scripts/send-ph-launch.mjs --followup --dry-run
 *   node scripts/send-ph-launch.mjs --followup --test nadyyym@gmail.com
 *   node scripts/send-ph-launch.mjs --followup
 *   node scripts/send-ph-launch.mjs --followup --at 2026-09-21T16:00:00.000Z
 *
 * Vault (not project .env): ~/.claude/secrets/vm-integrations/{resend,supabase_gtm}.json
 * Do not run --force-unguarded.
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(homedir(), '.claude/secrets/vm-integrations');
const MD_ROOT = join(homedir(), 'repo-of-repos/vn-openclaw-personal/content/newsletters/sts');
const TRACKER = 'https://track.getbeton.org';
const PH_URL = 'https://www.producthunt.com/products/sell-to-state?launch=sell-to-state';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const SEND_DELAY_MS = 150;

function loadJson(name) {
  const p = join(VAULT, name);
  if (!existsSync(p)) throw new Error(`missing vault file ${name}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const resendVault = loadJson('resend.json');
const sbVault = loadJson('supabase_gtm.json');
const SB_URL = (sbVault.url || '').replace(/\/$/, '');
const SB_KEY = sbVault.service_role_key;

const API_KEY = resendVault.api_key;
const AUDIENCES = {
  sts: resendVault.sts_audience_id,
  beton: resendVault.audience_id,
  investor: 'da0c242d-7f52-4155-a4cf-b4fae84a82e3',
};

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : null;
};
const DRY_RUN = has('--dry-run');
const FOLLOWUP = has('--followup');
const ONLY = val('--only');
const TEST_TO = val('--test');
const AT = val('--at');
if (AT && Number.isNaN(Date.parse(AT))) {
  console.error(`bad --at ${AT}; use ISO 8601`);
  process.exit(1);
}
if (has('--force-unguarded')) {
  console.error('refusing --force-unguarded on a launch blast');
  process.exit(1);
}

const CAMPAIGNS = [
  {
    key: 'sts',
    md: join(MD_ROOT, 'sts-2026-09-ph-launch.md'),
    followupMd: join(MD_ROOT, 'sts-2026-09-ph-launch-bump.md'),
    previousSlug: 'sts-2026-09-ph-launch',
    from: 'Vlad from Sell to State <vlad@selltostate.com>',
    replyTo: 'vlad@selltostate.com',
    unsub: 'mailto:vlad@selltostate.com?subject=unsubscribe',
    tracking: 'resend',
    dropInternal: true,
  },
  {
    key: 'beton',
    md: join(MD_ROOT, 'beton-2026-09-sts-ph.md'),
    followupMd: join(MD_ROOT, 'beton-2026-09-sts-ph-bump.md'),
    previousSlug: 'beton-2026-09-sts-ph',
    from: 'Vlad Nadymov <v@getbeton.ai>',
    replyTo: 'v@getbeton.ai',
    unsub: 'mailto:newsletter+unsubscribe@getbeton.ai?subject=unsubscribe',
    tracking: 'resend',
    dropInternal: false,
  },
  {
    key: 'investor',
    md: join(MD_ROOT, 'investor-2026-09-sts-ph.md'),
    followupMd: join(MD_ROOT, 'investor-2026-09-sts-ph-bump.md'),
    previousSlug: 'investor-2026-09-sts-ph',
    from: 'Vlad Nadymov <v@getbeton.ai>',
    replyTo: 'v@getbeton.ai',
    unsub: 'mailto:v@getbeton.ai?subject=unsubscribe',
    tracking: 'posthog',
    dropInternal: false,
  },
];

function parseMd(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter in ${path}`);
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return { fm, body: m[2].trim() };
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function firstNameOf(contact) {
  const a = (contact.first_name || '').trim();
  if (a) return a;
  const n = (contact.name || '').trim();
  if (n) return n.split(/\s+/)[0];
  return '';
}

function personalize(body, firstName) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  return body.replace(/Hi \{\{first_name\}\},/g, hi).replace(/\{\{first_name\}\}/g, firstName || '');
}

function clickWrap(url, campaign, email, label) {
  const u = encodeURIComponent(url);
  return `${TRACKER}/click?u=${u}&c=${encodeURIComponent(campaign)}&l=${encodeURIComponent(label)}&e=${encodeURIComponent(email)}`;
}

function pixel(campaign, email) {
  return `${TRACKER}/pixel.png?c=${encodeURIComponent(campaign)}&e=${encodeURIComponent(email)}`;
}

function withPhUtm(campaign, content) {
  const u = new URL(PH_URL);
  u.searchParams.set('utm_source', 'email');
  u.searchParams.set('utm_medium', 'email');
  u.searchParams.set('utm_campaign', campaign);
  u.searchParams.set('utm_content', content);
  return u.toString();
}

function hrefFor(url, campaign, email, tracking, content) {
  if (tracking !== 'posthog') return url;
  const label = /producthunt\.com/i.test(url) ? content : 'link';
  return clickWrap(url, campaign, email, label);
}

function toHtml(plain, campaign, email, tracking, content) {
  const urlRe = /(https:\/\/[^\s<]+)/g;
  const paras = plain.split(/\n\n+/).map((block) => {
    let html = '';
    let last = 0;
    const s = block.replace(/\n/g, ' ');
    for (const m of s.matchAll(urlRe)) {
      html += esc(s.slice(last, m.index));
      const rawUrl = m[1];
      const dest = hrefFor(rawUrl, campaign, email, tracking, content);
      html += `<a href="${esc(dest)}" style="color:#000;text-decoration:underline">${esc(rawUrl)}</a>`;
      last = m.index + rawUrl.length;
    }
    html += esc(s.slice(last));
    return `<p style="margin:0 0 16px;color:#000;font-size:14px;line-height:1.5">${html}</p>`;
  });
  const img =
    tracking === 'posthog'
      ? `<img src="${esc(pixel(campaign, email))}" width="1" height="1" alt="" style="display:none;border:0;width:1px;height:1px">`
      : '';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#000;font-size:14px;line-height:1.5;margin:0;padding:16px;max-width:600px">
${paras.join('\n')}
${img}
</body></html>`;
}

async function resendJson(url, { method = 'GET', body } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'User-Agent': UA,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Resend ${method} ${url} ${res.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

async function fetchContacts(audienceId) {
  const out = [];
  let after;
  for (;;) {
    const u = new URL(`https://api.resend.com/audiences/${audienceId}/contacts`);
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
  if (query) {
    for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, {
    method,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: method === 'POST' ? 'return=representation,resolution=merge-duplicates' : 'return=representation',
      'User-Agent': 'send-ph-launch/1.0',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`supabase ${method} ${path} ${res.status} ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

const guard = {
  async upsertNewsletter({ slug, subject, blogUrl, audienceId }) {
    const rows = await sb('/rest/v1/newsletters', {
      method: 'POST',
      query: { on_conflict: 'slug' },
      body: {
        slug,
        subject,
        blog_url: blogUrl,
        audience_id: audienceId,
        updated_at: new Date().toISOString(),
      },
    });
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row?.id) throw new Error(`upsertNewsletter no row for ${slug}`);
    return row;
  },
  async claimRecipient(newsletterId, email) {
    const data = await sb('/rest/v1/rpc/claim_newsletter_recipient', {
      method: 'POST',
      body: { p_newsletter_id: newsletterId, p_email: email, p_scheduled_at: null },
    });
    return data === true;
  },
  async markSent(newsletterId, email, resendEmailId) {
    await sb('/rest/v1/newsletter_sends', {
      method: 'PATCH',
      query: {
        newsletter_id: `eq.${newsletterId}`,
        email_norm: `eq.${email.trim().toLowerCase()}`,
      },
      body: {
        status: 'sent',
        resend_email_id: resendEmailId,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  },
  async markFailed(newsletterId, email, errorMsg) {
    await sb('/rest/v1/newsletter_sends', {
      method: 'PATCH',
      query: {
        newsletter_id: `eq.${newsletterId}`,
        email_norm: `eq.${email.trim().toLowerCase()}`,
      },
      body: {
        status: 'failed',
        error: String(errorMsg).slice(0, 1000),
        updated_at: new Date().toISOString(),
      },
    });
  },
  async setNewsletterStatus(newsletterId, status, extra = {}) {
    await sb('/rest/v1/newsletters', {
      method: 'PATCH',
      query: { id: `eq.${newsletterId}` },
      body: {
        status,
        updated_at: new Date().toISOString(),
        ...(extra.sentAt ? { sent_at: extra.sentAt } : {}),
      },
    });
  },
  async sendStats(newsletterId) {
    const data =
      (await sb('/rest/v1/newsletter_sends', {
        query: { newsletter_id: `eq.${newsletterId}`, select: 'status' },
      })) || [];
    const out = { sending: 0, sent: 0, failed: 0, total: data.length };
    for (const r of data) out[r.status] = (out[r.status] || 0) + 1;
    return out;
  },
  async rollbackDryClaims(newsletterId) {
    await sb('/rest/v1/newsletter_sends', {
      method: 'DELETE',
      query: { newsletter_id: `eq.${newsletterId}`, status: 'eq.sending' },
    });
  },
};

async function sendOne(cfg, to, letter, campaign) {
  const payload = {
    from: cfg.from,
    reply_to: cfg.replyTo,
    to: [to],
    subject: letter.subject,
    text: letter.text,
    html: letter.html,
    tags: [{ name: 'campaign', value: campaign }],
    headers: {
      'List-Unsubscribe': `<${cfg.unsub}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
  if (AT) payload.scheduled_at = new Date(AT).toISOString();
  return resendJson('https://api.resend.com/emails', { method: 'POST', body: payload });
}

function buildLetter(cfg, contact) {
  const { fm, body } = parseMd(cfg.md);
  const campaign = fm.campaign;
  const first = firstNameOf(contact);
  const trackedPh = withPhUtm(campaign, cfg.key);
  const text = personalize(body, first).replaceAll(PH_URL, trackedPh);
  const html = toHtml(text, campaign, contact.email, cfg.tracking, cfg.key);
  return { subject: fm.subject, campaign, text, html };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (e) => String(e || '').trim().toLowerCase();

async function sentEmailSet(slug) {
  const rows = await sb('/rest/v1/newsletters', {
    query: { slug: `eq.${slug}`, select: 'id' },
  });
  const id = Array.isArray(rows) ? rows[0]?.id : rows?.id;
  if (!id) throw new Error(`no prior newsletter ${slug}`);
  const sends =
    (await sb('/rest/v1/newsletter_sends', {
      query: {
        newsletter_id: `eq.${id}`,
        status: 'eq.sent',
        select: 'email_norm',
      },
    })) || [];
  return new Set(sends.map((r) => r.email_norm).filter(Boolean));
}

async function main() {
  if (!API_KEY) throw new Error('no Resend api_key in vault');
  const wanted = CAMPAIGNS.filter((c) => !ONLY || c.key === ONLY);
  if (!wanted.length) throw new Error(`unknown --only ${ONLY}`);
  if (FOLLOWUP) {
    for (const cfg of wanted) {
      if (!cfg.followupMd) throw new Error(`no followupMd for ${cfg.key}`);
      cfg.md = cfg.followupMd;
    }
  }
  if (AT) console.log(`scheduled_at ${new Date(AT).toISOString()}`);

  if (TEST_TO) {
    for (const cfg of wanted) {
      const letter = buildLetter(cfg, { email: TEST_TO, first_name: 'Vlad' });
      const r = await sendOne(cfg, TEST_TO, letter, letter.campaign);
      console.log(`TEST ${cfg.key} → ${TEST_TO} id=${r.id} from=${cfg.from} track=${cfg.tracking}`);
      await sleep(SEND_DELAY_MS);
    }
    return;
  }

  if (!SB_KEY) {
    console.error('supabase service_role_key missing — refuse unguarded send');
    process.exit(1);
  }
  const db = guard;

  const lists = {};
  for (const cfg of CAMPAIGNS) {
    lists[cfg.key] = await fetchContacts(AUDIENCES[cfg.key]);
    console.log(`loaded ${cfg.key}: ${lists[cfg.key].length}`);
  }

  let recipients;
  if (FOLLOWUP) {
    recipients = {};
    for (const cfg of wanted) {
      const sent = await sentEmailSet(cfg.previousSlug);
      recipients[cfg.key] = lists[cfg.key].filter((c) => sent.has(norm(c.email)));
      console.log(
        `followup ${cfg.key}: ${recipients[cfg.key].length} previously sent, still subscribed (audience ${lists[cfg.key].length}, sent rows ${sent.size})`,
      );
    }
  } else {
    const investor = new Set(lists.investor.map((c) => norm(c.email)));
    const stsAll = lists.sts.filter((c) => {
      const e = norm(c.email);
      if (e.endsWith('@getbeton.ai')) return false;
      if (investor.has(e)) return false;
      return true;
    });
    const stsSet = new Set(stsAll.map((c) => norm(c.email)));
    const beton = lists.beton.filter((c) => {
      const e = norm(c.email);
      if (investor.has(e)) return false;
      if (stsSet.has(e)) return false;
      return true;
    });
    recipients = {
      investor: lists.investor,
      sts: stsAll,
      beton,
    };
  }

  for (const cfg of wanted) {
    const { fm } = parseMd(cfg.md);
    const people = recipients[cfg.key];
    console.log(`\n=== ${cfg.key} ${fm.campaign} n=${people.length} from=${cfg.from} track=${cfg.tracking}`);
    const newsletter = await db.upsertNewsletter({
      slug: fm.campaign,
      subject: fm.subject,
      blogUrl: PH_URL,
      audienceId: AUDIENCES[cfg.key],
    });
    const stats = await db.sendStats(newsletter.id);
    console.log(`claimed already sent=${stats.sent} failed=${stats.failed} sending=${stats.sending}`);

    if (DRY_RUN) {
      let fresh = 0;
      for (const c of people) {
        const would = await db.claimRecipient(newsletter.id, c.email);
        if (would) fresh++;
      }
      await db.rollbackDryClaims(newsletter.id);
      console.log(`DRY RUN ${cfg.key}: ${fresh} new / ${people.length} total. claims rolled back.`);
      continue;
    }

    await db.setNewsletterStatus(newsletter.id, 'sending');
    let sent = 0;
    let skipped = 0;
    let failed = 0;
    for (const c of people) {
      let claimed;
      try {
        claimed = await db.claimRecipient(newsletter.id, c.email);
      } catch (e) {
        failed++;
        console.error(`claim fail ${c.email}: ${e.message}`);
        continue;
      }
      if (!claimed) {
        skipped++;
        continue;
      }
      try {
        const letter = buildLetter(cfg, c);
        const r = await sendOne(cfg, c.email, letter, letter.campaign);
        await db.markSent(newsletter.id, c.email, r.id);
        sent++;
        if (sent % 25 === 0) console.log(`${cfg.key} sent ${sent}`);
      } catch (e) {
        failed++;
        await db.markFailed(newsletter.id, c.email, e.message);
        console.error(`fail ${c.email}: ${e.message}`);
      }
      await sleep(SEND_DELAY_MS);
    }
    await db.setNewsletterStatus(newsletter.id, 'sent', { sentAt: new Date().toISOString() });
    console.log(`${cfg.key} done sent=${sent} skipped=${skipped} failed=${failed}`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
