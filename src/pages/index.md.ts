import type { APIRoute } from 'astro';
import { getEntry, getCollection } from 'astro:content';
import { markdownResponse, pageHeader, bulletList } from '../lib/markdown-export';

export const GET: APIRoute = async () => {
  const home = await getEntry('pages', 'home');
  const integrations = (await getCollection('integrations'))
    .filter((i) => !i.data.comingSoon)
    .sort((a, b) => (a.data.featured === b.data.featured ? 0 : a.data.featured ? -1 : 1));

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: home?.data.title ?? 'Beton',
      subtitle: home?.data.subtitle,
      canonical: '/',
      description:
        home?.data.seo?.metaDescription ??
        "Beton's agent finds buying signals in your data warehouse, backtests them, and routes the revenue-driving ones to your CRM.",
    })
  );

  if (home?.data.hero) {
    parts.push(`## ${home.data.hero.headline}`);
    parts.push('');
    if (home.data.hero.subheadline) {
      parts.push(home.data.hero.subheadline);
      parts.push('');
    }
    const ctas = [home.data.hero.primaryCta, home.data.hero.secondaryCta].filter(Boolean) as Array<{
      label: string;
      href: string;
    }>;
    if (ctas.length) {
      parts.push(bulletList(ctas.map((c) => `[${c.label}](${c.href})`)));
      parts.push('');
    }
  }

  parts.push('## What Beton does');
  parts.push('');
  parts.push(
    'Beton is open-source revenue intelligence for product-led growth companies. Connect a data source (PostHog, Postgres, Stripe), and the agent proposes behavioral hypotheses tailored to your schema, backtests them on your historical data, and routes the ones that beat your bar to your CRM, webhooks, or n8n.'
  );
  parts.push('');
  parts.push(
    bulletList([
      'Open source (AGPLv3) — self-host or use Cloud',
      'Behavioral signals from real product usage, not lead-scoring heuristics',
      'Backtest before promotion — precision, recall, and lift on your last 90 days',
      'Multi-destination routing: one signal to many tools',
      'No data hoarding — read events, route signals, store only the signal output',
    ])
  );
  parts.push('');

  parts.push('## Integrations');
  parts.push('');
  integrations.forEach((i) => {
    parts.push(
      `- [${i.data.name}](https://www.getbeton.ai/integrations/${i.data.slug}/) (${i.data.category}) — ${i.data.description}`
    );
  });
  parts.push('');

  parts.push('## Pricing');
  parts.push('');
  parts.push(
    bulletList([
      '**Self-Hosted** — Free (bring your own LLM key)',
      '**Cloud** — $0.50 per tracked user / month',
      '**Enterprise** — Custom pricing (air-gapped, RBAC, white-glove onboarding)',
    ])
  );
  parts.push('');
  parts.push('See [pricing](https://www.getbeton.ai/pricing/) for details.');
  parts.push('');

  parts.push('## Links');
  parts.push('');
  parts.push(
    bulletList([
      'App: https://inspector.getbeton.ai',
      'GitHub: https://github.com/getbeton/inspector',
      'Blog: https://www.getbeton.ai/blog/',
      'MCP server docs: https://www.getbeton.ai/mcp.md',
      'Markdown index for AI agents: https://www.getbeton.ai/llms.txt',
    ])
  );

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
