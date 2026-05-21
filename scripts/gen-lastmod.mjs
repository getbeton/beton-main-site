// Pre-compute per-source git edit dates into src/data/lastmod.json so the
// sitemap can emit accurate <lastmod> values WITHOUT relying on `git log` at
// build time. Vercel's default shallow clone (--depth=10) lacks the history
// `git log` needs, so non-blog pages would otherwise fall back to build time.
// We read git history locally (complete) and commit the map; the build reads
// the committed JSON. (Blog pages use frontmatter dates and are unaffected.)
//
// Run before committing source changes:  npm run lastmod
// Also runs as `prebuild`; on a shallow clone (Vercel) it keeps the committed
// manifest instead of overwriting it.
//
// Keyed by repo-relative POSIX path → ISO commit date, matching the paths
// urlToSourceFile() resolves in astro.config.mjs.
import { execFileSync } from 'node:child_process';
import {
  readdirSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(projectRoot, 'src/data/lastmod.json');
const WALK = [
  ['src/pages', ['.astro']],
  ['src/data', ['.json', '.ts']],
];

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
    return true;
  }
}

function walk(dir, exts, acc = []) {
  const abs = path.join(projectRoot, dir);
  if (!existsSync(abs)) return acc;
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(rel, exts, acc);
    else if (exts.some((x) => e.name.endsWith(x))) acc.push(rel);
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
    `[lastmod] shallow clone or no git — keeping committed manifest (${Object.keys(existing).length} entries)`,
  );
  process.exit(0);
}

const files = WALK.flatMap(([dir, exts]) => walk(dir, exts));
const manifest = { ...existing };
let changed = 0;
for (const rel of files) {
  const d = gitDate(rel);
  if (d) {
    if (manifest[rel] !== d) changed++;
    manifest[rel] = d;
  }
}

const sorted = Object.fromEntries(
  Object.keys(manifest)
    .sort()
    .map((k) => [k, manifest[k]]),
);
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');
console.log(
  `[lastmod] wrote ${Object.keys(sorted).length} entries (${changed} changed) → src/data/lastmod.json`,
);
