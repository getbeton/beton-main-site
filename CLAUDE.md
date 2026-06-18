# CLAUDE.md

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (prebuild runs `gen-lastmod.mjs` first; then `astro build && post-build-sitemap.mjs && seo-meta-check.mjs && seo-link-check.mjs && indexnow.mjs --only-prod`)
- `npm run preview` — Preview production build locally
- `npm run check` — TypeScript/Astro diagnostics
- `npm run lastmod` — Regenerate `src/data/lastmod.json` (git mtime manifest; commit after running)
- `npm run seo:check` — Run SEO meta + link checks against built dist
- `npm run seo:report` — Same with verbose report output
- `npm run heroes` — Regenerate `src/data/blog-heroes.json` (blog hero images)

No test suite or linter — validation happens via `npm run build`.

## Tech Stack

- **Astro 5** static site, **Tailwind CSS v4** (`@tailwindcss/vite` plugin), **Vercel** adapter
- No React or client-side frameworks — pure Astro components with `is:inline` scripts only
- Content collections with Zod validation in `src/content.config.ts`

## Architecture

### Layouts (nested)

`BaseLayout` → `PageLayout` → `ContentLayout` / `LegalLayout`

- `BaseLayout` handles `<head>` (meta, OG, Twitter cards, JSON-LD, Google Fonts), GTM snippet, cookie consent
- `Head.astro` orchestrates all SEO meta tags and structured data schemas

### Pages

Routes live in `src/pages/`. Active dynamic routes: `integrations/[id]`, `blog/[id]`, `alternatives/[id]`, `vs/[id]`, `compare/[slug]`, `for/[slug]`, `industries/[id]`, `use-cases/[id]`.

Other active pages: `/oss-tools/` (dryfit, seqd, openclaw-gtm-skills), `/search`, `/team`, `/blog/tags/`, `/blog/teardowns/`, `/blog/feed.xml`.

### Content (all editable data)

All content lives in `src/data/` as Markdown, JSON, or TypeScript:

- `pages/` — home.md, about.md, pricing.md, terms.md, privacy.md
- `blog/` — Markdown blog posts (draft: true to hide)
- `pricing/` — tiers.json, addons.json, faq.json
- `integrations/integrations.json` — 10 integrations (6 active, 4 comingSoon: hubspot, zoho, pipedrive, n8n)
- `competitors/competitors.json`, `agents/agents.json`
- `dryfit-scenarios/scenarios.json` — Dryfit scenario pages
- `blog-heroes.json` — Generated blog hero image map (regenerate with `npm run heroes`)
- `lastmod.json` — Git mtime manifest for sitemap freshness (regenerate with `npm run lastmod`)
- `built-for-tools.ts`, `how-it-works.ts` — Typed data for homepage sections
- `team/`, `testimonials/`, `social-proof/companies.json`, `features/`, `use-cases/`, `industries/`

Loaders: `glob()` for Markdown collections, `file()` for JSON collections. JSON files need an `id` field in each object for Astro's `file()` loader.

## Key Patterns

- **Tailwind v4**: Design tokens via `@theme` directive in `src/styles/global.css` — no `tailwind.config.js`
- **CSS variables**: `--color-surface`, `--color-text`, etc. for light/dark mode surface tokens
- **Dark mode**: `[data-theme='dark']` selector + `prefers-color-scheme` media query fallback
- **SEO**: `Head.astro` orchestrates meta tags, OG, Twitter cards, and JSON-LD schemas
- **Analytics**: GTM conditional on `PUBLIC_GTM_ID` env var; cookie consent integrates with GTM consent mode
- **Blog**: Local at `/blog/` (content collection in `src/data/blog/`). `blog.getbeton.ai` 301-redirects to `www.getbeton.ai` (same Vercel deployment). `/blog/teardowns/` sub-route for pricing teardown series.
- **comingSoon integrations**: flagged in `integrations.json` → auto-noindexed at build time + excluded from sitemap
- **Sitemap lastmod**: driven by committed `src/data/lastmod.json` (not live `git log` calls — Vercel shallow clones can't do that). Refresh with `npm run lastmod` and commit.
- **Astro v5**: `render()` is imported from `astro:content`, not called on collection entries directly
- **Build guard**: `vercel-ignore-build.sh` for Vercel ignore-build step (skip unchanged deployments)

## Deployment

- **Git remote**: `getbeton/beton-marketing-site`
- **Vercel project**: auto-deploys on push to master
- **IndexNow**: build script auto-submits URLs via `scripts/indexnow.mjs` (only fires in prod via `--only-prod`)
- **Domains**: www.getbeton.ai (primary), getbeton.ai → www (301), blog.getbeton.ai → www (301)

## Redirects (`vercel.json`)

123 total redirects including:

- `getbeton.ai/*` → `www.getbeton.ai/*` (bare domain canonical)
- `blog.getbeton.ai/*` → `www.getbeton.ai/*` (host-based, eliminates duplicate content)
- `/tools/dryfit*` → `/oss-tools/dryfit*` (legacy URL migration)
- `/seqd` → `/oss-tools/seqd/`
- `/app` → `https://inspector.getbeton.ai/login` (in `astro.config.mjs`)
- 80+ legacy integration slug redirects → `/integrations/`
- All `:slug` patterns have trailing-slash variants
