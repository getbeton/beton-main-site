import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

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
  'about', 'team', 'pricing', 'privacy', 'terms', 'seqd',
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

  // Integrations live in a single shared JSON file — every detail page
  // gets the same lastmod, which is accurate (they're all built from one source).
  if (/^\/integrations\/[^/]+$/.test(p)) {
    const json = 'src/data/integrations/integrations.json';
    if (fs.existsSync(json)) return json;
  }

  if (p.startsWith('/tools/dryfit/scenarios/')) {
    const json = 'src/data/dryfit-scenarios/scenarios.json';
    if (fs.existsSync(json)) return json;
    return 'src/pages/tools/dryfit/scenarios/[slug].astro';
  }

  return null;
}

const gitMtimeCache = new Map();
function gitMtime(file) {
  if (gitMtimeCache.has(file)) return gitMtimeCache.get(file);
  let result = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf-8',
    }).trim();
    if (out) result = out;
  } catch {
    // git not available or file untracked — fall through
  }
  gitMtimeCache.set(file, result);
  return result;
}

export default defineConfig({
  site: 'https://www.getbeton.ai',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      // /404 is non-content; /seqd/ is deprecated (noindex,follow) — drop
      // both from the sitemap so we don't dilute the property's quality signal.
      // comingSoon integrations are placeholder pages — also drop.
      filter: (page) => {
        if (page.includes('/404') || page.includes('/seqd/')) return false;
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
        const mtime = source && gitMtime(source);
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
