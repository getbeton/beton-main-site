#!/usr/bin/env node
/**
 * Send Langfuse pricing teardown newsletter to Resend audience with per-recipient tracking.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-langfuse-newsletter.mjs [--dry-run]
 *   RESEND_API_KEY=re_... node scripts/send-langfuse-newsletter.mjs --test nadyyym@gmail.com
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
const TEST_IDX = process.argv.indexOf('--test');
const TEST_EMAIL = TEST_IDX !== -1 ? process.argv[TEST_IDX + 1] : null;
const SEND_DELAY_MS = 150;

// ── Campaign ──────────────────────────────────────────────────────
const CAMPAIGN = 'langfuse-pricing-teardown';
const SUBJECT = 'langfuse went fully MIT — what cloud pro is actually for';
const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const BLOG_URL = 'https://www.getbeton.ai/blog/langfuse-pricing-teardown';
const GITHUB_URL = 'https://github.com/langfuse/langfuse';
const PRICING_URL = 'https://langfuse.com/pricing';
const HERO_IMAGE = 'https://www.getbeton.ai/images/blog/langfuse-pricing-cover.jpeg';

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

  const cta = (url, label, text) =>
    `<a href="${clickUrl(url, label, email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px">${text}</a>`;

  const h2 = (t) => `<h2 style="font-size:20px;font-weight:700;line-height:1.3;margin:32px 0 12px 0;color:#111">${t}</h2>`;
  const h3 = (t) => `<h3 style="font-size:16px;font-weight:700;line-height:1.3;margin:24px 0 8px 0;color:#111">${t}</h3>`;
  const p = (t) => `<p style="margin:0 0 14px 0">${t}</p>`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;text-align:left">

<a href="${clickUrl(BLOG_URL, 'hero-image', email)}">
  <img src="${HERO_IMAGE}" alt="langfuse pricing teardown" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:12px" />
</a>

<p style="font-size:12px;color:#888;margin:0 0 20px 0">got this forwarded? ${link('https://www.getbeton.ai/blog', 'forward-subscribe', 'subscribe here')}</p>

<h1 style="font-size:24px;font-weight:700;line-height:1.3;margin:0 0 20px 0;color:#111">Langfuse Pricing Teardown</h1>

${p("Hey, it's Vlad, founder of Beton.")}

${p("Langfuse is one of those tools that every AI team ends up looking at eventually. You're shipping an LLM-powered feature, something goes wrong, and suddenly you realize you have zero visibility into what your model is actually doing. That's the gap Langfuse fills.")}

${p(`What makes it interesting from a pricing standpoint is the licensing move they made in mid-2025 — they open sourced nearly everything under MIT. The commercial gating is now razor-thin. Let's break it down.`)}

${p(`<em style="color:#666">This post is a part of a series on commercial open source software pricing.</em>`)}

${h2('What is Langfuse')}

${p('Langfuse is an open source LLM engineering platform. Tracing, prompt management, evaluations, datasets, playground — the full observability and iteration stack for AI applications.')}

${p('Think of it as Datadog for your LLM layer. You instrument your app with their SDK (Python, JS/TS, or OpenTelemetry), and Langfuse captures every trace — model calls, retrieval steps, agent actions, latency, tokens, cost. Then you use the dashboard to debug, evaluate, and improve.')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li>24,400+ GitHub stars</li>
  <li>Y Combinator W23</li>
  <li>Built with TypeScript, backed by ClickHouse</li>
  <li>5.5M+ monthly SDK installs, 8,000+ self-hosted instances</li>
  <li>Integrations with OpenAI, LangChain, LlamaIndex, LiteLLM, Vercel AI SDK, CrewAI, and dozens more</li>
</ul>

${p('The project has real momentum. It&apos;s become the default open source option in the LLM observability space, competing with Arize, Braintrust, and LangSmith.')}

${h2('The licensing play')}

${p('This is where Langfuse stands out — and where the June 2025 announcement changed everything.')}

${h3('The core platform is MIT')}

${p(`Not AGPL. Not BSL. Not "sustainable use." MIT. The most permissive license there is. You can fork it, embed it, sell it, build a competing product on top of it. No strings.`)}

${p('And it&apos;s not MIT for some stripped-down toy version. All the core product features — tracing, prompt management, LLM-as-a-judge evaluations, annotation queues, playground, prompt experiments, datasets — are MIT.')}

${p(`Before June 2025, features like LLM-as-a-judge, the playground, and annotation queues were commercially licensed. They moved all of it to MIT. Their own blog post says it clearly: "we are open sourcing all remaining Product Features in Langfuse."`)}

${h3('The enterprise edition is a thin shell')}

${p(`What's left in the commercial <code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:13px">ee/</code> directory? License checks and enterprise security features:`)}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li>SCIM API for automated user provisioning</li>
  <li>Audit logs</li>
  <li>Data retention policies</li>
  <li>Project-level RBAC (org-level RBAC is already MIT)</li>
  <li>UI customization for self-hosted deployments</li>
</ul>

${p('That&apos;s it. The EE license requires a commercial agreement with Langfuse GmbH. You can read and modify the code for dev/testing, but you can&apos;t run it in production without paying.')}

${p('The split is clean: product features are free, platform team / compliance features are paid. SSO (including Okta and AzureAD) is MIT and available in the open source version. That&apos;s notably generous — most COSS companies gate SSO behind enterprise pricing.')}

${h3('What this means in practice')}

${p('For a team that just needs LLM observability and evals: self-host the MIT version and you&apos;re done. Unlimited users, unlimited traces, unlimited retention, full feature set. No license gotchas.')}

${p('For a 500-person company that needs SCIM, audit logs, and data retention policies: you&apos;re buying the enterprise license. Fair enough.')}

${p('The bet Langfuse is making is that cloud convenience and enterprise compliance features are enough to build a business on, even when the core product is completely free. Given 8,000+ self-hosted instances, the top-of-funnel seems to be working.')}

${h2('Pricing structure')}

${p('Langfuse Cloud uses usage-based pricing on top of flat monthly tiers. The billable unit is anything you send to their tracing API — traces, observations (spans, events, generations), and scores. One LLM call might generate multiple units depending on your instrumentation depth.')}

${p('<b>Cloud plans:</b>')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Hobby (free)</b> — 50k units/month, 30-day data access, 2 users. No credit card required. Enough to evaluate the product on a side project.</li>
  <li><b>Core — $29/month</b> — 100k units included, unlimited users, 90-day data access. Overage at $8/100k units (graduated — drops to $7 at 1M, $6.50 at 10M, $6 at 50M+). In-app support with 48h response SLO.</li>
  <li><b>Pro — $199/month</b> — 100k units included (same as Core), unlimited users, 3-year data access, data retention management, unlimited annotation queues, high rate limits (20k ingestion req/min vs 4k on Core), SOC2 &amp; ISO27001 reports, BAA available for HIPAA.</li>
  <li><b>Pro + Teams add-on — $499/month</b> — Everything in Pro plus enterprise SSO (Okta), SSO enforcement, fine-grained RBAC, dedicated Slack/MS Teams support channel with 24h response SLO.</li>
  <li><b>Enterprise — $2,499/month</b> — Everything in Pro + Teams plus audit logs, SCIM API, custom rate limits, uptime SLA, support SLA, dedicated support engineer. Yearly commitment available with custom volume pricing and AWS Marketplace billing.</li>
</ul>

${p('<b>Self-hosted plans:</b>')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Open Source (free)</b> — MIT license. All core platform features. Unlimited everything. You manage your own ClickHouse instance.</li>
  <li><b>Enterprise (self-hosted)</b> — Custom pricing. Bundled with ClickHouse Cloud/BYOC/Private. Adds project-level RBAC, audit logs, data retention, SCIM, server-side data masking, UI customization, dedicated support engineer, solutions architect support.</li>
</ul>

${p('<b>The graduated usage pricing:</b>')}

<table style="border-collapse:collapse;margin:0 0 14px 0;font-size:14px" cellpadding="8">
  <tr style="background:#f3f4f6"><th align="left" style="border:1px solid #e5e5e5">Volume tier</th><th align="left" style="border:1px solid #e5e5e5">Rate per 100k units</th></tr>
  <tr><td style="border:1px solid #e5e5e5">0 - 100k</td><td style="border:1px solid #e5e5e5">Included in plan</td></tr>
  <tr><td style="border:1px solid #e5e5e5">100k - 1M</td><td style="border:1px solid #e5e5e5">$8</td></tr>
  <tr><td style="border:1px solid #e5e5e5">1M - 10M</td><td style="border:1px solid #e5e5e5">$7</td></tr>
  <tr><td style="border:1px solid #e5e5e5">10M - 50M</td><td style="border:1px solid #e5e5e5">$6.50</td></tr>
  <tr><td style="border:1px solid #e5e5e5">50M+</td><td style="border:1px solid #e5e5e5">$6</td></tr>
</table>

${p('So a team generating 5M units/month on Core pays: $29 base + $0 (first 100k) + $72 (next 900k at $8) + $280 (next 4M at $7) = $381/month. Not cheap, but predictable.')}

${h2('The pricing cliff')}

${p('The Core-to-Pro jump is the elephant in the room. $29 to $199 — a $170/month increase — for the exact same included usage (100k units).')}

${p('What do you actually get for that $170?')}

<ol style="margin:0 0 14px 0;padding-left:20px">
  <li><b>3 years data access vs 90 days.</b> This is the big one. If you&apos;re building LLM features in a B2B product and need to look at historical traces for debugging or compliance, 90 days is genuinely limiting. Three years is essentially "forever" for most teams.</li>
  <li><b>Data retention management.</b> The ability to set TTLs and auto-delete data. Required for GDPR-conscious teams.</li>
  <li><b>Unlimited annotation queues</b> (vs 3 on Core). If you&apos;re doing systematic human evals, this matters.</li>
  <li><b>SOC2 &amp; ISO27001 reports.</b> The compliance checkbox. If your customers are asking for these, you need Pro.</li>
  <li><b>Higher rate limits.</b> Ingestion jumps from 4k to 20k requests/minute. API from 100 to 1,000 requests/minute.</li>
</ol>

${p('For a solo developer or small startup without compliance requirements, Core is fine. For any B2B team whose customers will send a security questionnaire, Pro is effectively mandatory. That&apos;s intentional pricing design — compliance as the upgrade trigger.')}

${p(`Then there's the Teams add-on at $300/month on top of Pro. Enterprise SSO and RBAC. If your company's IT policy mandates Okta login for all tools, you're at $499/month before any usage charges. That's the real "enterprise tax."`)}

${p('And from $499 to Enterprise at $2,499 — a 5x jump — you&apos;re buying audit logs, SCIM provisioning, SLAs, and a dedicated human. This is pure enterprise sales territory. The product doesn&apos;t change much; the support and compliance wrapper does.')}

${h2('Does it make sense to pay?')}

${p('<b>Self-hosting is genuinely viable.</b> Unlike Firecrawl where the value is managed infrastructure (proxies, browser pools), Langfuse&apos;s value as a self-hosted tool is the product itself. Docker compose gets you running in minutes. Helm chart for production Kubernetes. Terraform templates for AWS, Azure, GCP. The MIT license means no restrictions whatsoever.')}

${p('The catch is ClickHouse. Langfuse uses ClickHouse as its analytics database, and operating ClickHouse at scale is non-trivial. For a small team doing a few million traces/month, a single ClickHouse instance is fine. For high-volume production use, you need to think about replication, backups, and schema migrations. That&apos;s real ops work.')}

${p(`<b>Cloud Core at $29/month is an easy yes</b> the moment you have a production LLM feature. The alternative — tailing logs, grepping for model outputs, manually checking responses — is absurd once you've seen proper tracing. $29/month is below the "think about it" threshold for any team with revenue.`)}

${p('<b>Pro at $199/month is the compliance trigger.</b> You&apos;ll know when you need it because a customer or your security team will tell you. Until then, Core is enough.')}

${p('<b>Teams add-on ($300/month) is SSO tax.</b> Skip it unless your IT department forces the issue.')}

${p('<b>Self-host if you can.</b> The MIT license is clean, the product is complete, and you dodge the unit-based billing entirely. If you&apos;re already running ClickHouse or comfortable adding it to your stack, self-hosting is the highest-value option. No usage limits, no retention limits, no seat caps. You trade monthly fees for infra management.')}

${p('The honest take: Langfuse&apos;s pricing is reasonable for what it is, but the real story is the licensing. An MIT-licensed platform this feature-complete, with this much community adoption, makes self-hosting an unusually strong play. The cloud pricing exists for teams who value convenience over ops overhead — and there&apos;s nothing wrong with that.')}

<div style="margin:32px 0;line-height:1.2">
  <a href="${clickUrl(BLOG_URL, 'cta-blog', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 16px 12px 0">read on the blog</a>
  <a href="${clickUrl(PRICING_URL, 'cta-pricing', email)}" style="display:inline-block;background:#ffffff;color:#2563eb;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;border:1px solid #2563eb;margin:0 0 12px 0">see their pricing page</a>
</div>

${p('Reply if you want to compare notes — always curious how teams are instrumenting their LLM stack.')}

${p('— Vlad')}

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

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log(`Subject:  ${SUBJECT}`);
  console.log(`From:     ${FROM}`);
  console.log(`Reply-To: ${REPLY_TO}`);
  console.log(`Dry run:  ${DRY_RUN}`);
  console.log(`Test:     ${TEST_EMAIL || 'none'}\n`);

  if (TEST_EMAIL) {
    const html = buildHtml(TEST_EMAIL);
    const result = await sendEmail(TEST_EMAIL, html);
    console.log(`Test sent to ${TEST_EMAIL}: ${result.id}`);
    return;
  }

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
