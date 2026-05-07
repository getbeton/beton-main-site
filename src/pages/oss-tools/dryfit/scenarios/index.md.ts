import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader } from '../../../../lib/markdown-export';

export const GET: APIRoute = async () => {
  const scenarios = (await getCollection('dryfit-scenarios')).sort((a, b) => {
    const order = (s: typeof a) => {
      if (s.data.slug === 'posthog-web') return '00';
      if (s.data.slug === 'telegram-chat') return '01';
      if (s.data.slug === 'posthog-combined-coverage') return 'zz';
      return '10' + s.data.name.toLowerCase();
    };
    return order(a).localeCompare(order(b));
  });

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: 'Dryfit Scenarios',
      subtitle: 'Synthetic PostHog datasets for benchmarking signal-detection agents',
      canonical: '/oss-tools/dryfit/scenarios/',
      description:
        'Every dryfit scenario ships with hidden ground truth — deterministic grading for any signal-detection agent or analytics pipeline.',
    })
  );

  scenarios.forEach((s) => {
    parts.push(
      `- [${s.data.name}](https://www.getbeton.ai/oss-tools/dryfit/scenarios/${s.data.slug}/) ([markdown](https://www.getbeton.ai/oss-tools/dryfit/scenarios/${s.data.slug}.md)) — ${s.data.description}`
    );
  });

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
