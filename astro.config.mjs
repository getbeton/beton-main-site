import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import fs from 'node:fs';
import path from 'node:path';

// Build blog date map from frontmatter at config load time
const blogDir = 'src/data/blog';
const blogDates = {};
for (const file of fs.readdirSync(blogDir)) {
  if (!file.endsWith('.md')) continue;
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const updated = content.match(/updatedAt:\s*"?([^"\n]+)"?/);
  const published = content.match(/publishedAt:\s*"?([^"\n]+)"?/);
  const slug = file.replace('.md', '');
  blogDates[slug] = (updated?.[1] || published?.[1] || '').trim();
}

// Integrations that are flagged comingSoon get noindex'd at build time and
// excluded from the sitemap so we don't dilute the property's quality signal
// with placeholder pages for un-shipped integrations.
const integrationsJson = JSON.parse(
  fs.readFileSync('src/data/integrations/integrations.json', 'utf-8')
);
const comingSoonSlugs = new Set(
  integrationsJson.filter((i) => i.comingSoon).map((i) => `/integrations/${i.slug}/`)
);

// Map a sitemap URL pathname to the source file whose git mtime should drive
// its <lastmod>. Returns null when no obvious source file maps cleanly.
const STATIC_PAGES = new Set([
  'about', 'team', 'pricing', 'privacy', 'terms',
]);

const FLAT_OSS_TOOL_PAGES = new Set([
  '/oss-tools', '/oss-tools/dryfit', '/oss-tools/seqd', '/oss-tools/openclaw-gtm-skills',
]);

function urlToSourceFile(url) {
  let p;
  try {
    p = new URL(url).pathname;
  } catch {
    return null;
  }
  p = p.replace(/\/$/, '');

  if (p === '' || p === '/') return 'src/pages/index.astro';

  const stripped = p.replace(/^\//, '');
  if (STATIC_PAGES.has(stripped)) return `src/pages/${stripped}.astro`;

  const indexCandidate = `src/pages${p}/index.astro`;
  if (fs.existsSync(indexCandidate)) return indexCandidate;

  // /oss-tools/dryfit/ maps to src/pages/oss-tools/dryfit.astro (no index/ subdir).
  // Without this the sitemap falls back to build-time and ships a fake
  // freshness signal.
  const flatCandidate = `src/pages${p}.astro`;
  if (fs.existsSync(flatCandidate)) return flatCandidate;

  // Integrations live in a single shared JSON file — every detail page
  // gets the same lastmod, which is accurate (they're all built from one source).
  if (/^\/integrations\/[^/]+$/.test(p)) {
    const json = 'src/data/integrations/integrations.json';
    if (fs.existsSync(json)) return json;
  }

  if (p.startsWith('/oss-tools/dryfit/scenarios/')) {
    const json = 'src/data/dryfit-scenarios/scenarios.json';
    if (fs.existsSync(json)) return json;
    return 'src/pages/oss-tools/dryfit/scenarios/[slug].astro';
  }

  return null;
}

// Per-source git edit dates, precomputed by scripts/gen-lastmod.mjs into
// src/data/lastmod.json and committed. Read here instead of shelling out to
// `git log` per URL at build time — that spawned ~one git process per sitemap
// entry (slow) AND returned nothing on Vercel's shallow clone, so lastmod fell
// back to build time (a fake freshness signal). The committed manifest is fast
// and accurate on a shallow clone. Refresh with `npm run lastmod`.
const lastmodPath = 'src/data/lastmod.json';
const lastmodMap = fs.existsSync(lastmodPath)
  ? JSON.parse(fs.readFileSync(lastmodPath, 'utf-8'))
  : {};

export default defineConfig({
  site: 'https://www.getbeton.ai',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      // /404 is non-content; /oss-tools/seqd/ is deprecated (noindex,follow) — drop
      // both from the sitemap so we don't dilute the property's quality signal.
      // comingSoon integrations are placeholder pages — also drop.
      filter: (page) => {
        if (page.includes('/404') || page.includes('/oss-tools/seqd/')) return false;
        for (const slug of comingSoonSlugs) {
          if (page.endsWith(slug)) return false;
        }
        return true;
      },
      serialize(item) {
        const blogMatch = item.url.match(/\/blog\/([^/]+)\/?$/);
        if (blogMatch && blogDates[blogMatch[1]]) {
          item.lastmod = blogDates[blogMatch[1]];
          return item;
        }

        const source = urlToSourceFile(item.url);
        const mtime = source && lastmodMap[source];
        if (mtime) {
          item.lastmod = mtime;
        } else {
          // Last resort — keeps the field present rather than omitting it
          item.lastmod = new Date().toISOString();
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/app': 'https://inspector.getbeton.ai/login',
  },
  build: { inlineStylesheets: 'auto' },
});
