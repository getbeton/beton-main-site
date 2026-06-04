#!/usr/bin/env node
// SEO metadata guard + worklist generator.
//
//   node scripts/seo-meta-check.mjs            # CI guard: exit 1 on any violation
//   node scripts/seo-meta-check.mjs --report   # print full per-URL worklist, never fails
//
// Scans the built static HTML (dist/client) and checks every INDEXABLE page
// (robots without `noindex`) for:
//   - <title> length within [TITLE_MIN, TITLE_MAX]
//   - <meta name="description"> length within [DESC_MIN, DESC_MAX]
//   - no duplicate titles, no duplicate descriptions
//
// Noindex pages (404, comingSoon integrations, multi-tag combo pages, etc.)
// are skipped — they don't compete for impressions.

import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist/client';
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

const REPORT = process.argv.includes('--report');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function decode(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&middot;/g, '·');
}

if (!fs.existsSync(DIST)) {
  console.error(`✗ ${DIST} not found — run \`astro build\` first.`);
  process.exit(2);
}

const files = walk(DIST);
const pages = [];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf-8');
  const robots = attr(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) || '';
  if (/noindex/i.test(robots)) continue;
  const title = decode(attr(html, /<title>([\s\S]*?)<\/title>/i));
  const desc = decode(attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i));
  const url = '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  pages.push({ url, title, desc });
}

// Duplicate detection
const byTitle = new Map();
const byDesc = new Map();
for (const p of pages) {
  if (p.title) byTitle.set(p.title, [...(byTitle.get(p.title) || []), p.url]);
  if (p.desc) byDesc.set(p.desc, [...(byDesc.get(p.desc) || []), p.url]);
}
const dupTitles = [...byTitle.entries()].filter(([, u]) => u.length > 1);
const dupDescs = [...byDesc.entries()].filter(([, u]) => u.length > 1);

const violations = [];
for (const p of pages) {
  const tl = p.title ? p.title.length : 0;
  const dl = p.desc ? p.desc.length : 0;
  const issues = [];
  if (!p.title) issues.push('missing title');
  else if (tl < TITLE_MIN) issues.push(`title short (${tl})`);
  else if (tl > TITLE_MAX) issues.push(`title long (${tl})`);
  if (!p.desc) issues.push('missing description');
  else if (dl < DESC_MIN) issues.push(`desc short (${dl})`);
  else if (dl > DESC_MAX) issues.push(`desc long (${dl})`);
  if (issues.length) violations.push({ url: p.url, tl, dl, issues, title: p.title, desc: p.desc });
}

console.log(`Indexable pages scanned: ${pages.length}`);
console.log(`Length violations: ${violations.length} | duplicate titles: ${dupTitles.length} | duplicate descriptions: ${dupDescs.length}\n`);

if (REPORT) {
  for (const v of violations.sort((a, b) => a.url.localeCompare(b.url))) {
    console.log(`${v.url}\n  ${v.issues.join(', ')}\n  T(${v.tl}): ${v.title}\n  D(${v.dl}): ${v.desc}\n`);
  }
  if (dupTitles.length) {
    console.log('--- DUPLICATE TITLES ---');
    for (const [t, urls] of dupTitles) console.log(`  "${t}"\n    ${urls.join('\n    ')}`);
  }
  if (dupDescs.length) {
    console.log('--- DUPLICATE DESCRIPTIONS ---');
    for (const [d, urls] of dupDescs) console.log(`  "${d.slice(0, 80)}…"\n    ${urls.join('\n    ')}`);
  }
  process.exit(0);
}

const failed = violations.length || dupTitles.length || dupDescs.length;
if (failed) {
  console.error('✗ SEO metadata check failed. Run with --report for the full worklist.');
  for (const v of violations.slice(0, 50)) console.error(`  ${v.url} — ${v.issues.join(', ')}`);
  for (const [t, urls] of dupTitles) console.error(`  duplicate title "${t}" on ${urls.length} pages`);
  for (const [d, urls] of dupDescs) console.error(`  duplicate description on ${urls.length} pages: ${urls.join(', ')}`);
  process.exit(1);
}
console.log('✓ All indexable pages pass title/description length + uniqueness checks.');
