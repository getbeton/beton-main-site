#!/usr/bin/env node
/**
 * Send the Documenso pricing teardown newsletter to Resend audience with per-recipient tracking.
 * Full-article format.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-documenso-newsletter.mjs [--dry-run]
 *   RESEND_API_KEY=re_... node scripts/send-documenso-newsletter.mjs --test nadyyym@gmail.com
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
const CAMPAIGN = 'documenso-pricing-teardown';
const SUBJECT = 'documenso pricing teardown';
const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const BLOG_URL = 'https://www.getbeton.ai/blog/documenso-pricing-teardown';
const PRICING_URL = 'https://documenso.com/pricing';
const HERO_IMAGE = 'https://www.getbeton.ai/images/blog/documenso-pricing-cover.png';
const SERIES_URL = 'https://learninglate.substack.com/p/pricing-the-commercial-open-source-software';
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
function buildHtml(email) {
  const link = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="color:#2563eb;text-decoration:underline">${text}</a>`;

  const h2 = (t) => `<h2 style="font-size:20px;font-weight:700;line-height:1.3;margin:32px 0 12px 0;color:#111">${t}</h2>`;
  const p = (t) => `<p style="margin:0 0 14px 0">${t}</p>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;text-align:left">

<a href="${clickUrl(BLOG_URL, 'hero-image', email)}">
  <img src="${HERO_IMAGE}" alt="documenso pricing teardown" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:12px" />
</a>

<p style="font-size:12px;color:#888;margin:0 0 20px 0">got this forwarded? ${link('https://www.getbeton.ai/blog', 'forward-subscribe', 'subscribe here')}</p>

<h1 style="font-size:24px;font-weight:700;line-height:1.3;margin:0 0 20px 0;color:#111">Documenso Pricing Teardown</h1>

${p(`Hey, it's ${link(LI_URL, 'vlad-li', 'Vlad')}, founder of Beton.`)}

${p(`Documenso bills itself as "the open source DocuSign alternative." 12.7k stars on GitHub, AGPL-3.0 licensed, hosted product from $0 to $250/month across four tiers. The most interesting thing about it isn't the prices — it's what AGPL-3.0 does to the buying decision.`)}

${p(`<em style="color:#666">This post is a part of a ${link(SERIES_URL, 'series-index', 'series on commercial open source software pricing')}.</em>`)}

${h2('What is Documenso')}

${p('Open source e-signature. You upload a PDF, drag signature fields onto it, send it, recipients sign, you get a sealed PDF with an audit trail. Same loop as DocuSign, Dropbox Sign, Adobe Sign, PandaDoc — but the source is on GitHub.')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li>Website: ${link('https://documenso.com', 'documenso-home', 'documenso.com')}</li>
  <li>Pricing: ${link(PRICING_URL, 'documenso-pricing', 'documenso.com/pricing')}</li>
  <li>GitHub: ${link('https://github.com/documenso/documenso', 'documenso-gh', 'github.com/documenso/documenso')} — <b>12.7k stars</b></li>
  <li>License: AGPL-3.0 (this matters — see below)</li>
</ul>

${p(`For context: DocuSign does ~$3B/year at a $15B+ market cap. Dropbox Sign and Adobe Sign carve up most of the rest. Documenso is the open source insurgent — not at scale yet, but the only credible "we run the source ourselves" option in the category. Even Google Docs has launched their own e-sign in a "make your complements free" defensive move.`)}

${h2('The AGPL-3.0 gate')}

${p('The license does most of the work the sales team would otherwise have to do.')}

${p(`AGPL-3.0 is the most aggressive permissive-adjacent OSS license in widespread use. It's GPL with one extra clause: if you run AGPL software over a network and let users interact with it, you must release your modified source to those users. Fork Documenso, host it, let your customers sign through your product, and <b>you have to release whatever you built around it under AGPL too</b>.`)}

${p(`Self-hosting an internal company instance? Fine — your "users" are employees, and the source is already public. Embedding Documenso into a SaaS you sell to others? Not fine — your product becomes a "derivative work" the moment it links to Documenso's, and most commercial codebases cannot ship AGPL-derived code without becoming legally encumbered.`)}

${p(`This is why the <b>Platform plan exists at $250/month</b>. It's not a feature tier — it's the AGPL escape hatch. White-labeling, embedded signing, unlimited API are real features, but the actual thing you're paying $250/month for is permission.`)}

${p('DocuSign and Dropbox Sign extract revenue through per-envelope pricing. Documenso extracts it through licensing. Same destination, different road.')}

${h2('Pricing structure')}

${p('<b>Hosted plans:</b>')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Free — $0/month.</b> 5 documents/month, up to 10 recipients per doc, no credit card. Free forever, not a trial.</li>
  <li><b>Individual — $30/month</b> ($300/year, effectively $25/mo annual). Unlimited documents, API access for personal use, email support.</li>
  <li><b>Teams — $48/month</b> ($480/year, effectively $40/mo annual). 5 included users + $8/mo per additional user. Unlimited documents, embedded signing, API access for automation.</li>
  <li><b>Platform — $300/month</b> ($3,000/year, effectively $250/mo annual). Unlimited users, documents, API. Embedded signing with white-label, Slack support. <b>This is the AGPL commercial license tier.</b></li>
  <li><b>Enterprise — talk to sales.</b> Cloud or self-hosted, advanced compliance, tailored support.</li>
</ul>

${p('<b>Self-hosted:</b>')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Community Edition (free, AGPL-3.0).</b> Unlimited signatures, no envelope cap, full feature parity for internal use. The catch is you take on AGPL's obligations.</li>
  <li><b>Enterprise (self-hosted).</b> Custom commercial license for orgs that want self-hosting <em>and</em> commercial-product embedding.</li>
</ul>

${h2('The Free tier is unusually generous')}

${p(`Most signing tools give you a "free trial" — 3 signs, then the wall. Documenso's Free is 5 documents per month, indefinitely, no credit card, no watermark, 10 recipients per doc. DocuSign's free is a 30-day trial. Dropbox Sign's free is 3 docs/month with watermarks. Adobe Sign has none.`)}

${p(`That's enough to handle a freelancer's contract flow or an indie founder's NDAs without ever paying. Hit the cap, and the upgrade to Individual at $25 is right there. Product-led growth with the brakes off.`)}

${h2('The pricing cliff')}

${p(`Individual ($25) → Teams ($40) → Platform ($250). The first jump is fine. The second is dramatic: $210/month more for "unlimited everything."`)}

${p(`In practice, you don't pay Platform because you ran out of seats — Teams scales linearly at $8/extra user and most growing companies could ride it indefinitely. You pay $250 because you crossed a specific Rubicon: <b>you want to embed Documenso into a product you sell.</b>`)}

${p(`The marketing copy calls Platform "perfect for builders." That understates it. White-label and unlimited API are window dressing on a license sale. For internal-use companies — even very large ones — Teams is the right answer through hundreds of employees.`)}

${h2('Vs. DocuSign: the math depends on volume')}

${p('DocuSign API plans start around $20/month for 10 envelopes, then scale to $0.50–$2.00 per envelope at enterprise volume. Dropbox Sign runs similar: $99/month base for 200 requests + overage. Documenso Platform is $250/month flat, unlimited.')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>500 signs/month</b> on DocuSign at ~$1/envelope = $500/mo. Documenso = $250/mo flat.</li>
  <li><b>5,000 signs/month</b> at $0.50/envelope = $2,500/mo. Documenso = $250/mo flat.</li>
  <li><b>50,000 signs/month</b> = $25k+/mo on DocuSign. Documenso = still $250.</li>
</ul>

${p(`For any product team building signing into their own SaaS, the comparison isn't "Documenso vs. DocuSign as e-sig tools." It's "$250/month flat vs. a tax that scales with your customer adoption."`)}

${p(`The trade-off: DocuSign's brand, audit certifications stack, and integration surface (Salesforce, Workday, every legal tool ships a connector) are real assets — especially for a SaaS selling into Fortune 500 procurement. For technical buyers with high signature volume, Documenso Platform is the rational choice anyway.`)}

${h2('Self-hosting the AGPL way')}

${p('The repo ships Docker compose and a Helm chart. The stack is PostgreSQL, Redis, the server, and SMTP — smaller than most COSS deployments. Operationally you take on TLS, backups, SMTP, security review, and AGPL obligations if you ever expose it externally.')}

${p(`For internal-use deployments at a single company, self-hosting is right once you're past Teams' break-even or have hard data-residency requirements. For embedding into a commercial product, self-hosting is <em>not</em> a way around Platform — AGPL still applies, and most proprietary codebases can't accept that.`)}

${h2('Worth paying for?')}

${p(`<b>Free</b> is genuinely usable for low-volume individuals. 5 docs/month with no watermark is more than most people's actual contract flow.`)}

${p(`<b>Individual at $25/month</b> is a clean upgrade if you hit Free's cap and sign more than 5 things a month.`)}

${p(`<b>Teams at $40/month</b> is the SMB sweet spot. A 20-person company at $160/mo lands well under DocuSign's equivalent.`)}

${p(`<b>Platform at $250/month</b> is the right answer if and only if you're embedding Documenso into a product. The features are valuable; the AGPL escape hatch is the actual line item. If you're not embedding, you're overpaying.`)}

${p(`<b>Self-host</b> if you have ops capacity and you only need internal use. Don't self-host as a way to dodge Platform if you intend to embed — AGPL doesn't permit that.`)}

${p(`The honest take: Documenso's pricing is built around one strategic bet — that DocuSign's per-envelope billing is the category's biggest weakness for technical buyers, and that AGPL is a clean enough fence to monetize the people who want to escape it. For internal-use customers, Teams is the obvious win. For builders, Platform's $250/month against unlimited envelopes is one of the better deals in dev tools — as long as you understand the actual product you're buying is a license, not a feature set.`)}

<div style="margin:32px 0;line-height:1.2">
  <a href="${clickUrl(BLOG_URL, 'cta-blog', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 16px 12px 0">read on the blog</a>
  <a href="${clickUrl(PRICING_URL, 'cta-pricing', email)}" style="display:inline-block;background:#ffffff;color:#2563eb;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;border:1px solid #2563eb;margin:0 0 12px 0">see their pricing page</a>
</div>

${p('Reply if you want to compare notes — always curious how teams handle the build-vs-buy decision when AGPL-licensed components are in the mix.')}

${p(`— ${link(LI_URL, 'vlad-signoff-li', 'Vlad')}`)}

<p style="border-top:1px solid #e5e5e5;padding-top:16px;margin-top:32px;color:#666;font-size:13px">
<b style="color:#1a1a1a">get posts like this in your inbox</b><br>
revenue intelligence, open-source pricing teardowns, product-led growth. no spam.<br>
${link('https://www.getbeton.ai/blog', 'subscribe', 'subscribe at getbeton.ai/blog')}
</p>

<p style="color:#666;font-size:13px">
${link('https://www.getbeton.ai', 'homepage', 'getbeton.ai')}</p>

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

async function sendEmail(to, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      reply_to: REPLY_TO,
      to: [to],
      subject: SUBJECT,
      html,
      headers: {
        'List-Unsubscribe': '<mailto:newsletter+unsubscribe@getbeton.ai>',
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
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
    for (const addr of TEST_EMAILS) {
      const html = buildHtml(addr);
      try {
        const result = await sendEmail(addr, html);
        console.log(`Test sent to ${addr}: ${result.id}`);
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
