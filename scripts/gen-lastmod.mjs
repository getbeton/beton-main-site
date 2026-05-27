// Pre-compute per-source git edit dates into src/data/lastmod.json so the
// sitemap can emit accurate <lastmod> values WITHOUT shelling out to `git log`
// once per URL at build time.
//
// Why: the old astro.config ran `git log -1 -- <file>` for every sitemap entry.
// That spawned ~one git process per page (slow) AND returned nothing on Vercel's
// default shallow clone (--depth=10), so older files silently fell back to the
// build timestamp — a fake freshness signal. This script reads git history
// locally (where it's complete), writes a committed manifest, and the build
// just reads the JSON. Fast + accurate on a shallow clone, zero git spawns at
// build time. Mirrors the pattern already used on selltoscientists.com and
// selltostate.com.
//
// Run locally before committing content changes:  npm run lastmod
// Also runs as `prebuild`; on a shallow clone (Vercel) it detects that and keeps
// the committed manifest instead of overwriting it with nulls.
import { execFileSync } from 'node:child_process';
import {
  readdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(projectRoot, 'src/data/lastmod.json');

function git(args) {
  return execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

function isShallow() {
  try {
    return git(['rev-parse', '--is-shallow-repository']) === 'true';
  } catch {
    return true; // no git / not a repo → treat as shallow, keep manifest
  }
}

function walk(dir, exts, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, acc);
    else if (exts.some((x) => e.name.endsWith(x))) acc.push(p);
  }
  return acc;
}

function gitDate(rel) {
  try {
    return git(['log', '-1', '--format=%cI', '--', rel]) || null;
  } catch {
    return null;
  }
}

const existing = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

if (isShallow()) {
  console.log(
    `[lastmod] shallow clone or no git history — keeping committed manifest (${Object.keys(existing).length} entries)`
  );
  process.exit(0);
}

// Source files whose git mtime drives a page's <lastmod>, matching the paths
// returned by urlToSourceFile() in astro.config.mjs: every page template under
// src/pages plus the shared JSON data files under src/data. Blog posts use
// their own frontmatter dates (blogDates) and are intentionally excluded.
const files = [
  ...walk(path.join(projectRoot, 'src/pages'), ['.astro']),
  ...walk(path.join(projectRoot, 'src/data'), ['.json']),
].filter((f) => path.basename(f) !== 'lastmod.json');

const manifest = { ...existing };
let changed = 0;
for (const abs of files) {
  const rel = path.relative(projectRoot, abs).split(path.sep).join('/');
  const d = gitDate(rel);
  if (d) {
    if (manifest[rel] !== d) changed++;
    manifest[rel] = d;
  }
  // brand-new uncommitted file → git returns nothing; keep any existing value
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((k) => [k, manifest[k]])
);
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(
  `[lastmod] wrote ${Object.keys(sorted).length} entries (${changed} changed) → src/data/lastmod.json`
);
