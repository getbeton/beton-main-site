import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../../lib/markdown-export';

export const GET: APIRoute = async () => {
  const integrations = (await getCollection('integrations'))
    .filter((i) => !i.data.comingSoon)
    .sort((a, b) =>
      a.data.featured === b.data.featured
        ? a.data.name.localeCompare(b.data.name)
        : a.data.featured
        ? -1
        : 1
    );

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: 'Integrations',
      subtitle: 'Connect Beton to your data sources, CRMs, and automation tools',
      canonical: '/integrations/',
      description:
        'Beton integrates with PostHog, Postgres, Stripe, HubSpot, Attio, Pipedrive, Zoho CRM, n8n, and webhooks. Backtest hypotheses on your warehouse, route signals to your stack.',
    })
  );

  const byCategory = new Map<string, typeof integrations>();
  for (const i of integrations) {
    const arr = byCategory.get(i.data.category) ?? [];
    arr.push(i);
    byCategory.set(i.data.category, arr);
  }

  for (const [cat, items] of byCategory) {
    parts.push(`## ${cat[0].toUpperCase() + cat.slice(1)}`);
    parts.push('');
    items.forEach((i) => {
      parts.push(
        `- [${i.data.name}](https://www.getbeton.ai/integrations/${i.data.slug}/) — ${i.data.description}`
      );
    });
    parts.push('');
  }

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
