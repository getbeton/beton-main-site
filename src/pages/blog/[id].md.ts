import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../../lib/markdown-export';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<ReturnType<typeof getCollection<'blog'>>>[number];
  const body = entry.body?.trim() ?? '';

  const meta: string[] = [];
  meta.push(`**Published:** ${entry.data.publishedAt}`);
  if (entry.data.updatedAt) meta.push(`**Updated:** ${entry.data.updatedAt}`);
  meta.push(`**Author:** ${entry.data.author}`);
  if (entry.data.tags?.length) meta.push(`**Tags:** ${entry.data.tags.join(', ')}`);

  const md =
    pageHeader({
      title: entry.data.title,
      canonical: `/blog/${entry.id}/`,
      description: entry.data.description,
    }) +
    '\n' +
    meta.join('  \n') +
    '\n\n' +
    body +
    '\n';

  return markdownResponse(md);
};
