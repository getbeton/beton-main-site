#!/usr/bin/env node
/**
 * Send the Dify pricing teardown newsletter to Resend audience with per-recipient tracking.
 * Full-article format.
 *
 * Usage:
 *   RESEND_API_KEY=re_... node scripts/send-dify-newsletter.mjs --test nadyyym@gmail.com
 *   RESEND_API_KEY=re_... node scripts/send-dify-newsletter.mjs --dry-run
 *   RESEND_API_KEY=re_... node scripts/send-dify-newsletter.mjs
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
const CAMPAIGN = 'dify-pricing-teardown';
const SUBJECT = 'dify pricing teardown';
const FROM = 'Vlad from Beton <newsletter@getbeton.ai>';
const REPLY_TO = 'v@getbeton.ai';
const BLOG_URL = 'https://www.getbeton.ai/blog/dify-pricing-teardown';
const PRICING_URL = 'https://dify.ai/pricing';
const GITHUB_URL = 'https://github.com/langgenius/dify';
const HERO_IMAGE = 'https://www.getbeton.ai/images/blog/dify-pricing-cover.jpeg';
const SERIES_URL = 'https://learninglate.substack.com/p/pricing-the-commercial-open-source-software';
const LANGFUSE_URL = 'https://www.getbeton.ai/blog/langfuse-pricing-teardown';
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
  <img src="${HERO_IMAGE}" alt="dify pricing teardown" style="width:100%;max-width:600px;height:auto;border-radius:8px;margin-bottom:12px" />
</a>

<p style="font-size:12px;color:#888;margin:0 0 20px 0">got this forwarded? ${link('https://www.getbeton.ai/blog', 'forward-subscribe', 'subscribe here')}</p>

<h1 style="font-size:24px;font-weight:700;line-height:1.3;margin:0 0 20px 0;color:#111">Dify Pricing Teardown</h1>

${p(`Hey, it's ${link(LI_URL, 'vlad-li', 'Vlad')}, founder of Beton.`)}

${p(`Dify is the most-starred AI agent platform on GitHub. 139k stars, growing fast, basically every team building an LLM-powered product has at least clicked through their docs. They sit somewhere between a no-code workflow builder and a full agentic backend — RAG pipelines, prompt management, tool calls, MCP integrations, chat UIs, the whole stack in one Docker compose.`)}

${p(`What's interesting from a pricing standpoint isn't the cloud tiers. It's the license. Dify ships under "modified Apache 2.0" — which sounds friendly, until you read the modification.`)}

${p(`<em style="color:#666">This post is a part of a ${link(SERIES_URL, 'series-index', 'series on commercial open source software pricing')}.</em>`)}

${h2('What is Dify')}

${p('Open source platform for building production-ready AI applications. You drag nodes together to wire up agents, connect knowledge bases, plug in models, expose the result as a chatbot or an API, and ship.')}

${p(`The pitch is "Vercel for AI agents" — one platform that handles the boring parts (model routing, RAG pipelines, observability, multi-LLM support, deployment) so you can focus on prompts and tools. Supports OpenAI, Anthropic, Llama, Azure OpenAI, Hugging Face, Replicate, plus local models via Ollama.`)}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li>Website: ${link('https://dify.ai', 'dify-home', 'dify.ai')}</li>
  <li>Pricing: ${link(PRICING_URL, 'dify-pricing', 'dify.ai/pricing')}</li>
  <li>GitHub: ${link(GITHUB_URL, 'dify-gh', 'github.com/langgenius/dify')} — <b>139,400+ stars</b>, 21,800+ forks</li>
  <li>License: modified Apache 2.0 (the modification matters — see below)</li>
</ul>

${p(`For context: 139k stars puts Dify well ahead of Langfuse (~24k) and Flowise (~30k). It's the de-facto leader in the "open source AI agent platform" category by raw popularity.`)}

${h2('The licensing play')}

${p(`This is where Dify gets genuinely interesting — and where most readers stop reading the license.`)}

${p(`The repo says <b>"Apache 2.0"</b> at the top, and most engineers see that and assume permissive paradise. It's not. It's Apache 2.0 with two extra clauses bolted on, and one of them is the entire game.`)}

${p(`<b>Clause 1 — no multi-tenant use without permission:</b> you can self-host Dify for your own company. You cannot stand up a Dify instance and let multiple paying customers share it as a service. If you wanted to wrap Dify in a SaaS skin and resell agentic workflows to your customers — the business Dify itself is in — you need a commercial license from LangGenius.`)}

${p(`This is functionally a "Sustainable Use" clause stapled onto Apache 2.0. Same intent as Elastic's SSPL or Sentry's BSL: the upstream vendor reserves the right to be the only one making money from operating the software at scale.`)}

${p(`<b>Clause 2 — you can't remove the Dify logo.</b> If you self-host and want to white-label the UI for your team, you're technically violating the license. For internal use this is nuisance-level. For anyone embedding Dify in a product, this is a deal-breaker without a commercial agreement.`)}

${p(`This isn't bad faith — it's the standard COSS playbook. But calling it "Apache 2.0" is borderline misleading. It's Apache 2.0 in the same way the Sustainable Use License is "MIT-flavored." The name on the tin doesn't tell you the rules.`)}

${h2('Pricing structure')}

${p('Dify Cloud is priced per workspace per month. The billable unit is <b>message credits</b>, which roughly correspond to one round-trip LLM call.')}

${p('<b>Cloud plans:</b>')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Sandbox (free)</b> — 200 message credits <em>total</em> (not per month — total to try the product), 1 workspace, 5 apps, 50 knowledge documents, 50MB knowledge storage. No credit card. A glorified demo.</li>
  <li><b>Professional — $59/month</b> ($590/year, 17% off) — 5,000 credits/month, 3 team members, 50 apps, 500 knowledge documents, 5GB storage, 20,000 trigger events/month, unlimited log history, priority email support.</li>
  <li><b>Team — $159/month</b> ($1,590/year) — 10,000 credits/month, 50 team members, 200 apps, 1,000 knowledge documents, 20GB storage, unlimited triggers, top-priority document processing, advanced analytics integrations.</li>
  <li><b>Enterprise — talk to sales.</b> Self-hosted or dedicated cloud, SOC2 Type II, role management, WebApp branding customization (i.e. the only way to legally remove the logo).</li>
</ul>

${p('<b>Self-hosted:</b>')}

<ul style="margin:0 0 14px 0;padding-left:20px">
  <li><b>Community Edition (free, modified Apache 2.0).</b> Self-host on your infra. All core features for internal use. Ungated except for the multi-tenant restriction.</li>
  <li><b>Enterprise (self-hosted)</b> — custom pricing. Commercial license, audit logs, RBAC, SSO/SCIM, branding removal, SLA, dedicated support.</li>
</ul>

${h2('The message credit math')}

${p(`The credit system is where the real cost story lives. Dify defines a "message credit" as roughly one LLM completion — a chatbot reply, an agent step, a workflow execution that calls a model. That's intentionally vague because the actual consumption depends on which model you wired in.`)}

${p(`5,000 credits/month on Pro sounds like a lot until you realize what an agent actually does. A single user conversation with a multi-step agent might burn 5–15 credits — one for the planner, several for tool calls, one for the synthesizer. A RAG-backed support bot answering 100 customer questions a day at 5 credits each = 15,000 credits/month. You're already off Pro and into Team territory.`)}

${p(`This is the standard agent-pricing trap. Per-message billing looks cheap on the surface because the user thinks in "messages I send" but the platform meters "model calls under the hood." The two numbers diverge by 3–10x for any non-trivial agent.`)}

${p(`Team at $159/month with 10k credits works out to ~<b>$0.016 per credit</b>. At 5 credits per user interaction, you're paying ~$0.08 per interaction in platform fees, on top of whatever you pay OpenAI or Anthropic for the actual model.`)}

${h2('The pricing cliff')}

${p(`Sandbox to Pro isn't really a cliff, it's the on-ramp. Pro ($59) to Team ($159) is a 2.7x price jump for a 2x credit bump. What you're really buying with that extra $100/month:`)}

<ol style="margin:0 0 14px 0;padding-left:20px">
  <li><b>47 more team members</b> (3 → 50). For most early teams, the seat cap on Pro is the actual binding constraint.</li>
  <li><b>4x knowledge storage</b> (5GB → 20GB) and 2x documents. Matters for RAG-heavy use cases. Doesn't matter for pure agent/workflow use cases.</li>
  <li><b>Unlimited triggers</b> (vs. 20k/month). If you're running scheduled workflows or webhook-triggered agents, this matters fast.</li>
  <li><b>Top-priority document processing.</b> 30 seconds vs. 5 minutes when you upload a knowledge base.</li>
  <li><b>Advanced analytics integrations</b> with Langsmith/Langfuse. If you're already running Langfuse (which you should be — see ${link(LANGFUSE_URL, 'langfuse-teardown', 'my Langfuse teardown')}), this pipes Dify trace data into your real observability stack.</li>
</ol>

${p(`The bigger cliff is Team to Enterprise. The page doesn't show a price. From public discussions, Dify Enterprise self-hosted licenses start at five figures annually, scaling with usage. That's the SaaS license you're buying when you actually want to wrap Dify in your own product.`)}

${h2('Self-hosted vs. cloud')}

${p(`The self-hosted option is genuinely viable for internal use. Docker compose gets you running in 5 minutes. Helm chart for production Kubernetes. Community edition has functionally all the features.`)}

${p(`The catch is operating it. Dify's stack includes PostgreSQL, Redis, a vector database (Weaviate/Qdrant/Milvus depending on config), a worker queue, the API, the web frontend. Six containers minimum, and at production scale you're managing all of them. The vector DB is the painful one.`)}

${p(`For a single team with a few internal AI tools, self-hosting saves you $59–$159/month and gives full control of your data. For anyone building customer-facing AI features, the operational overhead probably exceeds the cloud cost — and you can't legally use the self-hosted version commercially as a multi-tenant product anyway.`)}

${h2('Worth paying for?')}

${p(`<b>Sandbox</b> is a demo. Don't plan to do real work on it.`)}

${p(`<b>Pro at $59/month</b> is the right starting point for any solo dev or 2-3 person team who wants to ship an LLM feature without operating their own agent infrastructure. The credits will run out fast if you're doing anything ambitious, but the price-to-time-saved ratio is excellent. Easy yes.`)}

${p(`<b>Team at $159/month</b> is the standard play for any growing AI-native startup. The Langfuse integration alone is worth $40 of the markup if you're serious about observability. The 50-seat cap removes the noise, unlimited triggers remove the second-biggest gotcha. Past the prototype stage, this is where you live.`)}

${p(`<b>Enterprise</b> is real money for real companies. If you're building a product on top of Dify, you don't have a choice — the multi-tenant license clause makes Enterprise mandatory.`)}

${p(`<b>Self-host</b> if you have ops capacity and you're deploying internal-only AI tools. The community edition is feature-complete for that case. The licensing trap only triggers when you start serving external customers.`)}

${p(`The honest take: Dify's pricing is reasonable for what it is, but the message-credit metering will bite anyone who underestimates how many model calls a real agent makes. Budget for 3–5x the credits you'd naively expect, and pick your tier based on team-size and trigger limits, not the headline credit allocation. And if you ever plan to wrap Dify in a product you sell to others, read the license modification carefully before you build anything — the word "Apache" is doing a lot of work in that filename.`)}

<div style="margin:32px 0;line-height:1.2">
  <a href="${clickUrl(BLOG_URL, 'cta-blog', email)}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;margin:0 16px 12px 0">read on the blog</a>
  <a href="${clickUrl(PRICING_URL, 'cta-pricing', email)}" style="display:inline-block;background:#ffffff;color:#2563eb;padding:12px 24px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px;border:1px solid #2563eb;margin:0 0 12px 0">see their pricing page</a>
</div>

${p(`Reply if you want to compare notes — always curious how teams are pricing their AI features when the underlying credit ceiling moves faster than the budget.`)}

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
