import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

export const GET: APIRoute = async () => {
  const entry = await getEntry('pages', 'privacy');
  if (!entry) return new Response('Not found', { status: 404 });

  const body = entry.body?.trim() ?? '';
  const md = pageHeader({
    title: entry.data.title,
    subtitle: entry.data.subtitle,
    canonical: '/privacy/',
    description: entry.data.seo?.metaDescription,
  }) + '\n' + body + '\n';

  return markdownResponse(md);
};
