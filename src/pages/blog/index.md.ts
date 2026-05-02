import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../../lib/markdown-export';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) =>
      new Date(b.data.publishedAt).getTime() -
      new Date(a.data.publishedAt).getTime()
  );

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: 'Beton Blog',
      subtitle: 'Product updates, OSS pricing teardowns, behind-the-scenes',
      canonical: '/blog/',
      description:
        'Beton blog: product updates, open-source pricing teardowns, and engineering writeups from the team building open-source revenue intelligence.',
    })
  );

  parts.push('## Posts');
  parts.push('');
  posts.forEach((p) => {
    const date = p.data.publishedAt;
    parts.push(
      `- ${date} — [${p.data.title}](https://www.getbeton.ai/blog/${p.id}/) ([markdown](https://www.getbeton.ai/blog/${p.id}.md))`
    );
    if (p.data.description) parts.push(`  - ${p.data.description}`);
  });

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
