import type { CollectionEntry } from 'astro:content';

const SITE = 'https://www.getbeton.ai';

export function pageHeader({
  title,
  subtitle,
  canonical,
  description,
}: {
  title: string;
  subtitle?: string;
  canonical: string;
  description?: string;
}): string {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  if (description) {
    lines.push(`> ${description}`);
    lines.push('');
  } else if (subtitle) {
    lines.push(`> ${subtitle}`);
    lines.push('');
  }
  const url = canonical.startsWith('http') ? canonical : `${SITE}${canonical}`;
  lines.push(`*Source: [${url}](${url})*`);
  lines.push('');
  return lines.join('\n');
}

export function bulletList(items: string[]): string {
  return items.map((i) => `- ${i}`).join('\n');
}

export function markdownResponse(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export function plainTextResponse(body: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export function integrationToMarkdown(
  entry: CollectionEntry<'integrations'>
): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: `${d.name} Integration`,
      subtitle: d.tagline || d.description,
      canonical: `/integrations/${d.slug}/`,
      description: d.description,
    })
  );
  parts.push(`**Category:** ${d.category}`);
  parts.push(`**Vendor URL:** ${d.url}`);
  parts.push('');

  if (d.howItWorks?.length) {
    parts.push('## How it works');
    parts.push('');
    d.howItWorks.forEach((step, i) => {
      parts.push(`${i + 1}. **${step.step}** — ${step.description}`);
    });
    parts.push('');
  }

  if (d.features?.length) {
    parts.push('## Features');
    parts.push('');
    parts.push(bulletList(d.features));
    parts.push('');
  }

  if (d.useCases?.length) {
    parts.push('## Use cases');
    parts.push('');
    parts.push(bulletList(d.useCases));
    parts.push('');
  }

  if (d.codeSnippet?.content) {
    parts.push('## Setup snippet');
    parts.push('');
    if (d.codeSnippet.caption) {
      parts.push(`*${d.codeSnippet.caption}*`);
      parts.push('');
    }
    parts.push('```' + d.codeSnippet.language);
    parts.push(d.codeSnippet.content);
    parts.push('```');
    parts.push('');
  }

  if (d.samplePayload) {
    parts.push('## Sample payload');
    parts.push('');
    parts.push('```json');
    parts.push(d.samplePayload);
    parts.push('```');
    parts.push('');
  }

  if (d.faq?.length) {
    parts.push('## FAQ');
    parts.push('');
    d.faq.forEach((q) => {
      parts.push(`### ${q.question}`);
      parts.push('');
      parts.push(q.answer);
      parts.push('');
    });
  }

  return parts.join('\n').trimEnd() + '\n';
}

export function competitorToMarkdown(
  entry: CollectionEntry<'competitors'>
): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: `${d.name} vs Beton`,
      canonical: `/competitors/${d.slug}/`,
      description: d.description,
    })
  );
  parts.push(`**Tagline:** ${d.tagline}`);
  parts.push(`**Category:** ${d.category}`);
  parts.push(`**Pricing:** ${d.pricing.model} (starts at ${d.pricing.startingPrice})`);
  parts.push('');

  if (d.keyFeatures?.length) {
    parts.push('## Key features');
    parts.push('');
    parts.push(bulletList(d.keyFeatures));
    parts.push('');
  }
  if (d.limitations?.length) {
    parts.push('## Limitations');
    parts.push('');
    parts.push(bulletList(d.limitations));
    parts.push('');
  }
  if (d.idealFor?.length) {
    parts.push('## Ideal for');
    parts.push('');
    parts.push(bulletList(d.idealFor));
    parts.push('');
  }
  if (d.whySwitch?.length) {
    parts.push('## Why switch to Beton');
    parts.push('');
    d.whySwitch.forEach((w) => {
      parts.push(`### ${w.title}`);
      parts.push('');
      parts.push(w.description);
      parts.push('');
    });
  }
  if (d.faq?.length) {
    parts.push('## FAQ');
    parts.push('');
    d.faq.forEach((q) => {
      parts.push(`### ${q.question}`);
      parts.push('');
      parts.push(q.answer);
      parts.push('');
    });
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function agentToMarkdown(entry: CollectionEntry<'agents'>): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: `Beton MCP for ${d.name}`,
      canonical: `/agents/${d.slug}/`,
      description: d.description,
    })
  );
  parts.push(`**Vendor:** ${d.vendor}`);
  parts.push(`**Category:** ${d.category}`);
  parts.push('');

  if (d.capabilities?.length) {
    parts.push('## Capabilities');
    parts.push('');
    parts.push(bulletList(d.capabilities));
    parts.push('');
  }

  if (d.workflows?.length) {
    parts.push('## Workflows');
    parts.push('');
    d.workflows.forEach((w) => {
      parts.push(`### ${w.title}`);
      parts.push('');
      parts.push(w.description);
      parts.push('');
    });
  }

  if (d.mcpSetup) {
    parts.push('## MCP setup');
    parts.push('');
    parts.push(`Config file: \`${d.mcpSetup.configFile}\``);
    parts.push('');
    parts.push('```json');
    parts.push(d.mcpSetup.configSnippet);
    parts.push('```');
    parts.push('');
    if (d.mcpSetup.steps?.length) {
      parts.push('Steps:');
      parts.push('');
      d.mcpSetup.steps.forEach((s, i) => parts.push(`${i + 1}. ${s}`));
      parts.push('');
    }
  }

  if (d.examplePrompts?.length) {
    parts.push('## Example prompts');
    parts.push('');
    d.examplePrompts.forEach((p) => {
      parts.push(`- *${p.prompt}* — ${p.description}`);
    });
    parts.push('');
  }

  if (d.faq?.length) {
    parts.push('## FAQ');
    parts.push('');
    d.faq.forEach((q) => {
      parts.push(`### ${q.question}`);
      parts.push('');
      parts.push(q.answer);
      parts.push('');
    });
  }
  return parts.join('\n').trimEnd() + '\n';
}

export function scenarioToMarkdown(
  entry: CollectionEntry<'dryfit-scenarios'>
): string {
  const d = entry.data;
  const parts: string[] = [];
  parts.push(
    pageHeader({
      title: `Dryfit Scenario: ${d.name}`,
      canonical: `/oss-tools/dryfit/scenarios/${d.slug}/`,
      description: d.description,
    })
  );
  parts.push(`**Scenario kind:** ${d.scenarioKind}`);
  parts.push(`**Use-case kind:** ${d.useCaseKind}`);
  parts.push(`**Value metric:** ${d.valueMetric}`);
  parts.push(`**Config file:** \`${d.configFile}\``);
  parts.push(`**Dataset id:** \`${d.datasetId}\``);
  parts.push('');

  parts.push('## Scale');
  parts.push('');
  parts.push(`- Accounts: ${d.scale.accounts}`);
  parts.push(`- Users per account (mean): ${d.scale.usersPerAccountMean}`);
  parts.push(`- Sessions per user (mean): ${d.scale.sessionsPerUserMean}`);
  parts.push(`- Duration: ${d.scale.durationDays} days`);
  parts.push('');

  parts.push(`**Success event:** \`${d.successEvent}\` (${d.successEntityType})`);
  parts.push('');

  if (d.researchMetrics?.length) {
    parts.push('## Research metrics');
    parts.push('');
    parts.push(bulletList(d.researchMetrics));
    parts.push('');
  }

  if (d.positiveSignals?.length) {
    parts.push('## Positive signals (ground truth)');
    parts.push('');
    d.positiveSignals.forEach((s) => {
      parts.push(`- **${s.id}** (count ${s.count}): \`${s.path.join(' → ')}\``);
    });
    parts.push('');
  }
  if (d.negativeSignals?.length) {
    parts.push('## Negative signals (ground truth)');
    parts.push('');
    d.negativeSignals.forEach((s) => {
      parts.push(`- **${s.id}** (count ${s.count}): \`${s.path.join(' → ')}\``);
    });
    parts.push('');
  }
  return parts.join('\n').trimEnd() + '\n';
}
