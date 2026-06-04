#!/usr/bin/env node
// Internal link guard. Scans built HTML (dist/client) and verifies every
// same-site <a href> resolves to a built page/asset. Catches the class of
// regression the crawl flagged (/features, /tools, /404 dangling links).
//
//   node scripts/seo-link-check.mjs            # exit 1 on any broken internal link
//   node scripts/seo-link-check.mjs --report   # list every broken link + sources
//
// Skips external URLs, mailto:/tel:, in-page #anchors, and the .md alternates.

import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist/client';
const REPORT = process.argv.includes('--report');

if (!fs.existsSync(DIST)) {
  console.error(`✗ ${DIST} not found — run \`astro build\` first.`);
  process.exit(2);
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Does an internal path exist as a built file? Trailing-slash routes map to
// <path>/index.html; extensionless paths try that then a literal file.
function resolves(p) {
  let rel = p.replace(/[?#].*$/, '');
  if (rel === '/') return true;
  rel = rel.replace(/^\//, '');
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel, 'index.html'),
    path.join(DIST, rel.replace(/\/$/, '') + '.html'),
  ];
  return candidates.some((c) => fs.existsSync(c));
}

const files = walk(DIST);
const broken = new Map(); // url -> Set(sourcePages)

for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  const sourceUrl = '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const hrefs = [...html.matchAll(/<a\b[^>]*?\shref="([^"]+)"/gi)].map((m) => m[1]);
  for (const raw of hrefs) {
    const href = raw.trim();
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('data:') ||
      href.endsWith('.md') // markdown mirror alternates are generated per-route, not navigation
    ) continue;
    if (!href.startsWith('/')) continue; // only check root-relative internal links
    if (!resolves(href)) {
      if (!broken.has(href)) broken.set(href, new Set());
      broken.get(href).add(sourceUrl);
    }
  }
}

console.log(`HTML pages scanned: ${files.length}`);
console.log(`Broken internal links: ${broken.size}\n`);

if (broken.size === 0) {
  console.log('✓ All same-site <a href> links resolve to built pages.');
  process.exit(0);
}

for (const [url, sources] of [...broken.entries()].sort()) {
  console.error(`✗ ${url}  (linked from ${sources.size} page${sources.size > 1 ? 's' : ''})`);
  if (REPORT) for (const s of [...sources].slice(0, 10)) console.error(`    ${s}`);
}
process.exit(1);
