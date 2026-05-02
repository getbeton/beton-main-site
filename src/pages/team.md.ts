import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../lib/markdown-export';

export const GET: APIRoute = async () => {
  const team = (await getCollection('team')).sort(
    (a, b) => a.data.order - b.data.order
  );

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: 'Team',
      subtitle: 'The people building Beton',
      canonical: '/team/',
      description:
        'Repeat founders and published ML researchers building open-source revenue intelligence for product-led growth companies.',
    })
  );

  team.forEach((p) => {
    parts.push(`## ${p.data.name} — ${p.data.role}`);
    parts.push('');
    parts.push(p.data.bio);
    parts.push('');
    if (p.data.social) {
      const links: string[] = [];
      if (p.data.social.twitter) links.push(`[Twitter](${p.data.social.twitter})`);
      if (p.data.social.linkedin) links.push(`[LinkedIn](${p.data.social.linkedin})`);
      if (p.data.social.github) links.push(`[GitHub](${p.data.social.github})`);
      if (p.data.social.website) links.push(`[Website](${p.data.social.website})`);
      if (links.length) {
        parts.push(links.join(' · '));
        parts.push('');
      }
    }
  });

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
