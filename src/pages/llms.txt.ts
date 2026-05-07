import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { plainTextResponse } from '../lib/markdown-export';

const SITE = 'https://www.getbeton.ai';

export const GET: APIRoute = async () => {
  const blogPosts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) =>
      new Date(b.data.publishedAt).getTime() -
      new Date(a.data.publishedAt).getTime()
  );
  const integrations = (await getCollection('integrations'))
    .filter((i) => !i.data.comingSoon)
    .sort((a, b) =>
      a.data.featured === b.data.featured
        ? a.data.name.localeCompare(b.data.name)
        : a.data.featured
        ? -1
        : 1
    );
  const scenarios = await getCollection('dryfit-scenarios');

  const parts: string[] = [];
  parts.push('# Beton');
  parts.push('');
  parts.push(
    '> Open-source revenue intelligence for product-led growth companies. Beton detects behavioral signals in product usage data and routes them to CRM and sales tools.'
  );
  parts.push('');
  parts.push('Every page on this site is available as raw Markdown by appending `.md` to the URL.');
  parts.push(
    `For a single concatenated bundle of every page, see [${SITE}/llms-full.txt](${SITE}/llms-full.txt).`
  );
  parts.push('');

  parts.push('## What Beton does');
  parts.push('');
  parts.push(
    'Beton connects a data source (PostHog, Postgres, Stripe) to your CRM or webhooks. The agent proposes behavioral hypotheses tailored to your schema, backtests them on your historical data, and routes the ones that beat your bar to revenue tools (HubSpot, Attio, Pipedrive, Zoho, n8n, custom webhooks).'
  );
  parts.push('');
  parts.push('Key differentiators:');
  parts.push('- Open source (AGPLv3), self-hostable');
  parts.push('- Behavioral signals from actual product usage, not arbitrary lead scores');
  parts.push('- Backtest before promotion: precision, recall, and lift on your last 90 days');
  parts.push('- Multi-destination routing: one signal to many tools');
  parts.push('- No data hoarding: reads events, routes signals, stores only signal output');
  parts.push('');

  parts.push('## Pages');
  parts.push('');
  parts.push(`- [Home](${SITE}/index.md): The Beton homepage — what we do, integrations, pricing`);
  parts.push(`- [About](${SITE}/about.md): Mission, problem we solve, our approach`);
  parts.push(`- [Pricing](${SITE}/pricing.md): Self-hosted (free), Cloud ($0.50/user/mo), Enterprise`);
  parts.push(`- [Team](${SITE}/team.md): The people building Beton`);
  parts.push(`- [Privacy](${SITE}/privacy.md): Privacy policy`);
  parts.push(`- [Terms](${SITE}/terms.md): Terms of service`);
  parts.push('');

  parts.push('## Integrations');
  parts.push('');
  integrations.forEach((i) => {
    parts.push(
      `- [${i.data.name}](${SITE}/integrations/${i.data.slug}.md) (${i.data.category}): ${i.data.description}`
    );
  });
  parts.push('');

  parts.push('## Tools');
  parts.push('');
  parts.push(
    `- [Dryfit](${SITE}/oss-tools/dryfit.md): Open-source synthetic PostHog data generator with ground truth for benchmarking signal-detection agents`
  );
  scenarios.forEach((s) => {
    parts.push(
      `  - [${s.data.name}](${SITE}/oss-tools/dryfit/scenarios/${s.data.slug}.md): ${s.data.description}`
    );
  });
  parts.push('');

  parts.push('## MCP server');
  parts.push('');
  parts.push(
    `Beton exposes itself as an MCP tool server. AI coding agents can call Beton to handle revenue ops tasks. Full documentation: [${SITE}/mcp.md](${SITE}/mcp.md)`
  );
  parts.push('');

  parts.push('## Blog');
  parts.push('');
  parts.push(`- [Blog index](${SITE}/blog/index.md)`);
  blogPosts.forEach((p) => {
    parts.push(
      `- [${p.data.title}](${SITE}/blog/${p.id}.md) (${p.data.publishedAt}): ${p.data.description}`
    );
  });
  parts.push('');

  parts.push('## Links');
  parts.push('');
  parts.push('- App: https://inspector.getbeton.ai');
  parts.push('- GitHub: https://github.com/getbeton/inspector');
  parts.push(`- Sitemap: ${SITE}/sitemap-index.xml`);

  return plainTextResponse(parts.join('\n').trimEnd() + '\n');
};
