export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  iconType: 'posthog' | 'path';
  icon?: string;
}

// Shared by the HowItWorks homepage section and the HowTo JSON-LD in index.astro.
export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: '1',
    title: 'Connect Your Data Warehouse',
    description:
      'Link PostHog or point Beton at any Postgres warehouse with a read-only role. Optionally add Stripe billing events for revenue-grade signals.',
    iconType: 'posthog',
  },
  {
    number: '2',
    title: 'Beton Finds Patterns',
    description:
      'The agent reads your schema and discovers patterns that predict revenue. Each candidate is backtested on your data; you approve the ones that beat your bar.',
    iconType: 'path',
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  },
  {
    number: '3',
    title: 'Your Pipeline Gets Filled',
    description:
      'Approved signals fire on every match and route to Attio, Apollo, or any HTTPS endpoint via Webhooks. No rep clicks anything.',
    iconType: 'path',
    icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  },
  {
    number: '4',
    title: 'Your Reps Go After the Best Deals',
    description:
      'Reps see signal context on every Attio record they open. Marketing targets the highest-fit accounts. CS catches churn risk before it shows up in MRR.',
    iconType: 'path',
    icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75',
  },
];
