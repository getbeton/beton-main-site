# CLAUDE.md

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (runs `astro build && node scripts/indexnow.mjs`)
- `npm run preview` — Preview production build locally
- `npm run check` — TypeScript/Astro diagnostics

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

Routes live in `src/pages/`. Active dynamic routes: `integrations/[id]`, `blog/[id]`.

Disabled routes (underscore-prefixed, not built): `_industries/`, `_use-cases/`, `_for/`, `_alternatives/`, `_compare/`, `_vs/`. These have 301 redirects in `vercel.json`.

### Content (all editable data)

All content lives in `src/data/` as Markdown or JSON:

- `pages/` — home.md, about.md, pricing.md, terms.md, privacy.md
- `blog/` — Markdown blog posts (draft: true to hide)
- `pricing/` — tiers.json, addons.json, faq.json
- `integrations/integrations.json` — 7 active integrations
- `competitors/competitors.json`, `agents/agents.json` — data for disabled pages
- `team/`, `testimonials/`, `social-proof/companies.json`, `features/`, `use-cases/`, `industries/`

Loaders: `glob()` for Markdown collections, `file()` for JSON collections. JSON files need an `id` field in each object for Astro's `file()` loader.

## Key Patterns

- **Tailwind v4**: Design tokens via `@theme` directive in `src/styles/global.css` — no `tailwind.config.js`
- **CSS variables**: `--color-surface`, `--color-text`, etc. for light/dark mode surface tokens
- **Dark mode**: `[data-theme='dark']` selector + `prefers-color-scheme` media query fallback
- **SEO**: `Head.astro` orchestrates meta tags, OG, Twitter cards, and JSON-LD schemas
- **Analytics**: GTM conditional on `PUBLIC_GTM_ID` env var; cookie consent integrates with GTM consent mode
- **Blog**: Local at `/blog/` (content collection in `src/data/blog/`). blog.getbeton.ai 301-redirects to www.getbeton.ai (same Vercel deployment).
- **Astro v5**: `render()` is imported from `astro:content`, not called on collection entries directly

## Deployment

- **Git remote**: `getbeton/beton-marketing-site`
- **Vercel project**: auto-deploys on push to master
- **IndexNow**: build script auto-submits URLs via `scripts/indexnow.mjs`
- **Domains**: www.getbeton.ai (primary), getbeton.ai → www (301), blog.getbeton.ai → www (301)

## Redirects (`vercel.json`)

- blog.getbeton.ai/* → www.getbeton.ai/* (host-based, eliminates duplicate content)
- getbeton.ai/* → www.getbeton.ai/* (bare domain canonical)
- /industries/*, /use-cases/*, /for/*, /alternatives/*, /compare/*, /vs/* → / or /integrations/ (disabled pages)
- /integrations/old-slug → /integrations/ (80+ legacy integration URLs)
- All `:slug` patterns have trailing-slash variants (Vercel `:slug` doesn't match trailing slashes)
