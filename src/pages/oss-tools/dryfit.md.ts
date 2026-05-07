import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { markdownResponse, pageHeader, bulletList } from '../../lib/markdown-export';

export const GET: APIRoute = async () => {
  const scenarios = await getCollection('dryfit-scenarios');

  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: 'Dryfit — Synthetic PostHog Data with Ground Truth',
      subtitle:
        'Open-source benchmarking tool for signal-detection and analytics agents',
      canonical: '/oss-tools/dryfit/',
      description:
        'Dryfit generates synthetic PostHog event datasets with hidden ground truth so you can deterministically grade any signal-detection agent. MIT licensed, Python.',
    })
  );

  parts.push('## What dryfit does');
  parts.push('');
  parts.push(
    bulletList([
      'Generates synthetic PostHog event tables in Postgres for any business model',
      'Ships ground_truth.json mapping every positive/negative signal back to event_ids',
      '14 prebuilt scenarios — seat-based, usage-based, transaction, freemium, marketplace, etc.',
      'Configurable noise (missing events, dupes, out-of-order, null props, anonymous actors) — never touches ground-truth rows',
      'docker compose up brings Postgres + Grafana with a provisioned event-inspection dashboard',
      'MIT licensed, Python 3.12 with uv/typer/pydantic/psycopg',
    ])
  );
  parts.push('');

  parts.push('## Scenarios');
  parts.push('');
  scenarios.forEach((s) => {
    parts.push(
      `- [${s.data.name}](https://www.getbeton.ai/oss-tools/dryfit/scenarios/${s.data.slug}/) — ${s.data.description}`
    );
  });
  parts.push('');

  parts.push('## Links');
  parts.push('');
  parts.push(
    bulletList([
      'GitHub: https://github.com/getbeton/dryfit',
      'Announcement: https://www.getbeton.ai/blog/we-open-sourced-our-agent-testing-tool/',
    ])
  );

  return markdownResponse(parts.join('\n').trimEnd() + '\n');
};
