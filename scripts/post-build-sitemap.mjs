/**
 * Post-build script: generates a flat sitemap.xml from Astro's sitemap-0.xml
 * Ensures /sitemap.xml exists as a real file (no redirects or rewrites).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const DIST = resolve('dist');
const DIST_CLIENT = resolve(DIST, 'client');
const VERCEL_STATIC = resolve('.vercel/output/static');

// Astro 5 + Vercel adapter outputs static files to dist/client/
const source = existsSync(resolve(DIST_CLIENT, 'sitemap-0.xml'))
  ? resolve(DIST_CLIENT, 'sitemap-0.xml')
  : resolve(DIST, 'sitemap-0.xml');

if (!existsSync(source)) {
  console.log('[sitemap] No sitemap-0.xml found — skipping.');
  process.exit(0);
}

const xml = readFileSync(source, 'utf-8');

// Write to dist/client/ (where Astro 5 + Vercel adapter puts static files)
if (existsSync(DIST_CLIENT)) {
  writeFileSync(resolve(DIST_CLIENT, 'sitemap.xml'), xml);
  console.log('[sitemap] Created dist/client/sitemap.xml');
}

// Write to dist/ as fallback
writeFileSync(resolve(DIST, 'sitemap.xml'), xml);
console.log('[sitemap] Created dist/sitemap.xml');

// Write to Vercel output if it exists
if (existsSync(VERCEL_STATIC)) {
  writeFileSync(resolve(VERCEL_STATIC, 'sitemap.xml'), xml);
  console.log('[sitemap] Created .vercel/output/static/sitemap.xml');
}
