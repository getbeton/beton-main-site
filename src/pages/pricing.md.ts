import type { APIRoute } from 'astro';
import { getEntry, getCollection } from 'astro:content';
import { markdownResponse, pageHeader, bulletList } from '../lib/markdown-export';

export const GET: APIRoute = async () => {
  const page = await getEntry('pages', 'pricing');
  const tiers = (await getCollection('pricing-tiers')).sort((a, b) => {
    const order = ['self-hosted', 'cloud', 'enterprise'];
    return order.indexOf(a.data.slug) - order.indexOf(b.data.slug);
  });
  const addons = await getCollection('pricing-addons');
  const faq = (await getCollection('pricing-faq')).sort(
    (a, b) => a.data.order - b.data.order
  );

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: page?.data.title ?? 'Pricing',
      subtitle: page?.data.subtitle,
      canonical: '/pricing/',
      description: page?.data.seo?.metaDescription,
    })
  );

  parts.push('## Plans');
  parts.push('');
  tiers.forEach((t) => {
    const d = t.data;
    parts.push(`### ${d.name} — ${d.price}${d.priceNote ? ` (${d.priceNote})` : ''}`);
    parts.push('');
    parts.push(d.description);
    parts.push('');
    parts.push(bulletList(d.features));
    parts.push('');
    parts.push(`CTA: [${d.cta.label}](${d.cta.href})`);
    parts.push('');
  });

  if (addons.length) {
    parts.push('## Enterprise add-ons');
    parts.push('');
    addons.forEach((a) => {
      parts.push(`- **${a.data.name}** (${a.data.price}) — ${a.data.description}`);
    });
    parts.push('');
  }

  if (faq.length) {
    parts.push('## FAQ');
    parts.push('');
    faq.forEach((q) => {
      parts.push(`### ${q.data.question}`);
      parts.push('');
      parts.push(q.data.answer);
      parts.push('');
    });
  }

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
