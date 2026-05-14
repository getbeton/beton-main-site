export interface BuiltForTool {
  name: string;
  logo: string;
  href: string;
}

// Tools we have real, shipped integrations for. Shared by the BuiltFor homepage
// section and the ItemList JSON-LD in index.astro.
export const builtForTools: BuiltForTool[] = [
  { name: 'PostHog', logo: '/images/logos/posthog.svg', href: '/integrations/posthog/' },
  { name: 'Postgres', logo: '/images/logos/postgres.svg', href: '/integrations/postgres/' },
  { name: 'Stripe', logo: '/images/logos/stripe.svg', href: '/integrations/stripe/' },
  { name: 'Attio', logo: '/images/logos/attio.svg', href: '/integrations/attio/' },
  { name: 'Apollo', logo: '/images/logos/apollo.svg', href: '/integrations/apollo/' },
  { name: 'Firecrawl', logo: '/images/logos/firecrawl.svg', href: '/integrations/firecrawl/' },
];
