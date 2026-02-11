# CLAUDE.md

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (runs `astro build && node scripts/indexnow.mjs`)
- `npm run preview` — Preview production build locally
- `npm run check` — TypeScript/Astro diagnostics

## Tech Stack

- **Astro 5** static site, **Tailwind CSS v4** (`@tailwindcss/vite` plugin), **Vercel** adapter
- No React or client-side frameworks — pure Astro components with `is:inline` scripts only
- Content collections with Zod validation in `src/content.config.ts`

## Architecture

### Layouts (nested)

`BaseLayout` → `PageLayout` → `ContentLayout` / `LegalLayout`

### Pages

Routes live in `src/pages/`. Dynamic routes: `industries/[slug]`, `use-cases/[slug]`, `integrations/[slug]`.

### Content (all editable data)

All content lives in `src/data/` as Markdown or JSON:

- `pages/` — home.md, about.md, pricing.md, terms.md, privacy.md
- `use-cases/`, `industries/`, `features/` — Markdown with frontmatter
- `pricing/` — tiers.json, addons.json, faq.json
- `team/`, `testimonials/` — Markdown
- `integrations/integrations.json`, `social-proof/companies.json`

Loaders: `glob()` for Markdown collections, `file()` for JSON collections. JSON files need an `id` field in each object for Astro's `file()` loader.

## Key Patterns

- **Tailwind v4**: Design tokens via `@theme` directive in `src/styles/global.css` — no `tailwind.config.js`
- **CSS variables**: `--color-surface`, `--color-text`, etc. for light/dark mode surface tokens
- **Dark mode**: `[data-theme='dark']` selector + `prefers-color-scheme` media query fallback
- **SEO**: `Head.astro` orchestrates meta tags, OG, Twitter cards, and JSON-LD schemas
- **Analytics**: GTM conditional on `PUBLIC_GTM_ID` env var; cookie consent integrates with GTM consent mode
- **Blog**: External at blog.getbeton.ai; `/blog` redirects there. RSS fetched with graceful fallback.
- **Astro v5**: `render()` is imported from `astro:content`, not called on collection entries directly
