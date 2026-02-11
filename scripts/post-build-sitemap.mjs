/**
 * Post-build script: generates a flat sitemap.xml from Astro's sitemap-0.xml
 * Ensures /sitemap.xml exists as a real file (no redirects or rewrites).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const DIST = resolve('dist');
const VERCEL_STATIC = resolve('.vercel/output/static');

const source = resolve(DIST, 'sitemap-0.xml');

if (!existsSync(source)) {
  console.log('[sitemap] No sitemap-0.xml found — skipping.');
  process.exit(0);
}

const xml = readFileSync(source, 'utf-8');

// Write to dist/
writeFileSync(resolve(DIST, 'sitemap.xml'), xml);
console.log('[sitemap] Created dist/sitemap.xml');

// Write to Vercel output if it exists
if (existsSync(VERCEL_STATIC)) {
  writeFileSync(resolve(VERCEL_STATIC, 'sitemap.xml'), xml);
  console.log('[sitemap] Created .vercel/output/static/sitemap.xml');
}
