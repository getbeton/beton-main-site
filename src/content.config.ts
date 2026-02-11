import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const seoSchema = z.object({
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().default(false),
});

const useCases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/data/use-cases' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    problem: z.string(),
    solution: z.string(),
    benefits: z.array(z.string()),
    integrations: z.array(z.string()).default([]),
    seo: seoSchema.optional(),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/data/industries' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    icon: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    challenges: z.array(z.string()),
    signals: z.array(z.string()),
    outcomes: z.array(z.string()),
    relatedUseCases: z.array(z.string()).default([]),
    seo: seoSchema.optional(),
  }),
});

const features = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/data/features' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    category: z.enum(['detection', 'routing', 'integration', 'platform']),
    order: z.number(),
    featured: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/data/testimonials' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    avatar: z.string().optional(),
    quote: z.string(),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/data/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    photo: z.string().optional(),
    order: z.number(),
    social: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

const pricingTiers = defineCollection({
  loader: file('src/data/pricing/tiers.json'),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    price: z.string(),
    priceNote: z.string().optional(),
    description: z.string(),
    highlighted: z.boolean().default(false),
    cta: z.object({
      label: z.string(),
      href: z.string(),
    }),
    features: z.array(z.string()),
  }),
});

const pricingAddons = defineCollection({
  loader: file('src/data/pricing/addons.json'),
  schema: z.object({
    name: z.string(),
    price: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  }),
});

const pricingFaq = defineCollection({
  loader: file('src/data/pricing/faq.json'),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/data/pages' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    seo: seoSchema.optional(),
    hero: z
      .object({
        headline: z.string(),
        subheadline: z.string().optional(),
        primaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
        secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
      })
      .optional(),
    schemaType: z.string().optional(),
  }),
});

const integrations = defineCollection({
  loader: file('src/data/integrations/integrations.json'),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    logo: z.string(),
    url: z.string(),
    category: z.string(),
    description: z.string(),
    featured: z.boolean().default(false),
    tagline: z.string().optional(),
    howItWorks: z.array(z.object({
      step: z.string(),
      description: z.string(),
    })).optional(),
    features: z.array(z.string()).optional(),
    useCases: z.array(z.string()).optional(),
    seo: seoSchema.optional(),
  }),
});

const socialProof = defineCollection({
  loader: file('src/data/social-proof/companies.json'),
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = {
  'use-cases': useCases,
  industries,
  features,
  testimonials,
  team,
  'pricing-tiers': pricingTiers,
  'pricing-addons': pricingAddons,
  'pricing-faq': pricingFaq,
  pages,
  integrations,
  'social-proof': socialProof,
};
