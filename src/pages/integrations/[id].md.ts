import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, integrationToMarkdown } from '../../lib/markdown-export';

export async function getStaticPaths() {
  const integrations = await getCollection('integrations');
  return integrations.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<
    ReturnType<typeof getCollection<'integrations'>>
  >[number];
  return markdownResponse(integrationToMarkdown(entry));
};
