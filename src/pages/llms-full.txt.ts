import type { APIRoute } from 'astro';
import { getEntry, getCollection } from 'astro:content';
import {
  plainTextResponse,
  pageHeader,
  bulletList,
  integrationToMarkdown,
  scenarioToMarkdown,
  betonNetwork,
} from '../lib/markdown-export';

const SITE = 'https://www.getbeton.ai';
const SEPARATOR = '\n\n---\n\n';

export const GET: APIRoute = async () => {
  const sections: string[] = [];

  sections.push(
    [
      '# Beton — Full Site Bundle',
      '',
      '> Concatenated Markdown for every page on www.getbeton.ai. Each page is also available individually by appending `.md` to its URL.',
      '',
      `Generated: ${new Date().toISOString()}`,
    ].join('\n')
  );

  // Homepage
  const home = await getEntry('pages', 'home');
  if (home) {
    const integrations = (await getCollection('integrations'))
      .filter((i) => !i.data.comingSoon)
      .sort((a, b) => (a.data.featured === b.data.featured ? 0 : a.data.featured ? -1 : 1));
    const lines: string[] = [];
    lines.push(
      pageHeader({
        title: home.data.title,
        subtitle: home.data.subtitle,
        canonical: '/',
        description: home.data.seo?.metaDescription,
      })
    );
    if (home.data.hero) {
      lines.push(`## ${home.data.hero.headline}`);
      lines.push('');
      if (home.data.hero.subheadline) {
        lines.push(home.data.hero.subheadline);
        lines.push('');
      }
    }
    lines.push('## Integrations');
    lines.push('');
    integrations.forEach((i) => {
      lines.push(`- **${i.data.name}** (${i.data.category}) — ${i.data.description}`);
    });
    sections.push(lines.join('\n').trimEnd());
  }

  // Static pages with markdown bodies
  for (const slug of ['about', 'pricing', 'privacy', 'terms']) {
    const entry = await getEntry('pages', slug);
    if (!entry) continue;
    const body = entry.body?.trim() ?? '';
    sections.push(
      pageHeader({
        title: entry.data.title,
        subtitle: entry.data.subtitle,
        canonical: `/${slug}/`,
        description: entry.data.seo?.metaDescription,
      }) +
        '\n' +
        body
    );
  }

  // Pricing detail (tiers + FAQ — pricing.md body is empty)
  const tiers = (await getCollection('pricing-tiers')).sort((a, b) => {
    const order = ['self-hosted', 'cloud', 'enterprise'];
    return order.indexOf(a.data.slug) - order.indexOf(b.data.slug);
  });
  const faq = (await getCollection('pricing-faq')).sort(
    (a, b) => a.data.order - b.data.order
  );
  if (tiers.length || faq.length) {
    const lines: string[] = [];
    lines.push('# Pricing details');
    lines.push('');
    lines.push(`*Source: [${SITE}/pricing/](${SITE}/pricing/)*`);
    lines.push('');
    tiers.forEach((t) => {
      lines.push(`## ${t.data.name} — ${t.data.price}`);
      lines.push('');
      lines.push(t.data.description);
      lines.push('');
      lines.push(bulletList(t.data.features));
      lines.push('');
    });
    if (faq.length) {
      lines.push('## FAQ');
      lines.push('');
      faq.forEach((q) => {
        lines.push(`### ${q.data.question}`);
        lines.push('');
        lines.push(q.data.answer);
        lines.push('');
      });
    }
    sections.push(lines.join('\n').trimEnd());
  }

  // Team
  const team = (await getCollection('team')).sort((a, b) => a.data.order - b.data.order);
  if (team.length) {
    const lines: string[] = [];
    lines.push(
      pageHeader({
        title: 'Team',
        subtitle: 'The people building Beton',
        canonical: '/team/',
      })
    );
    team.forEach((p) => {
      lines.push(`## ${p.data.name} — ${p.data.role}`);
      lines.push('');
      lines.push(p.data.bio);
      lines.push('');
    });
    sections.push(lines.join('\n').trimEnd());
  }

  // Integrations (full detail)
  const integrations = await getCollection('integrations');
  for (const i of integrations) {
    if (i.data.comingSoon) continue;
    sections.push(integrationToMarkdown(i).trimEnd());
  }

  // Dryfit scenarios
  const scenarios = await getCollection('dryfit-scenarios');
  for (const s of scenarios) {
    sections.push(scenarioToMarkdown(s).trimEnd());
  }

  // Blog posts
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) =>
      new Date(b.data.publishedAt).getTime() -
      new Date(a.data.publishedAt).getTime()
  );
  for (const p of posts) {
    const body = p.body?.trim() ?? '';
    const lines: string[] = [];
    lines.push(
      pageHeader({
        title: p.data.title,
        canonical: `/blog/${p.id}/`,
        description: p.data.description,
      })
    );
    lines.push(
      `**Published:** ${p.data.publishedAt}${
        p.data.updatedAt ? `  \n**Updated:** ${p.data.updatedAt}` : ''
      }  \n**Author:** ${p.data.author}`
    );
    lines.push('');
    lines.push(body);
    sections.push(lines.join('\n').trimEnd());
  }

  sections.push(betonNetwork());

  return plainTextResponse(sections.join(SEPARATOR) + '\n');
};
