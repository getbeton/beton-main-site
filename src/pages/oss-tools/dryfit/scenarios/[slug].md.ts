import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, scenarioToMarkdown } from '../../../../lib/markdown-export';

export async function getStaticPaths() {
  const scenarios = await getCollection('dryfit-scenarios');
  return scenarios.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const entry = props.entry as Awaited<
    ReturnType<typeof getCollection<'dryfit-scenarios'>>
  >[number];
  return markdownResponse(scenarioToMarkdown(entry));
};
