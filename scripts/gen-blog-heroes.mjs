// Generate wide social hero images (1200x630) for blog posts from their square
// LinkedIn infographic, with an overlaid header band (post title) and footer
// band (BETON brand + getbeton.ai). The infographic is center-cropped to fill;
// the bands keep the post legible in social previews.
//
// Run locally (fonts must be available — don't run in Vercel CI):
//   node scripts/gen-blog-heroes.mjs            # all posts that have an infographic
//   node scripts/gen-blog-heroes.mjs <slug>     # one image dir
//
// Outputs public/images/blog/<dir>/hero.png and a manifest
// src/data/blog-heroes.json (post slug -> hero path) so the layout can pick it
// up as og:image. Commit both the PNGs and the manifest.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DATA = path.join(ROOT, "src/data/blog");
const IMG_BLOG = path.join(ROOT, "public/images/blog");
const MANIFEST = path.join(ROOT, "src/data/blog-heroes.json");

const W = 1200;
const H = 630;
const PAD = 56;

// Resolve an image-dir slug to its blog post .md file. The image dir name
// doesn't always equal the post slug (e.g. images/blog/first-party-vs-third-party
// belongs to first-party-vs-third-party-signals.md), so fall back to (2) a post
// whose body references this image dir, then (3) a filename prefix match.
function resolvePostFile(slug) {
  const exact = path.join(BLOG_DATA, `${slug}.md`);
  if (fs.existsSync(exact)) return exact;
  const files = fs.readdirSync(BLOG_DATA).filter((f) => f.endsWith(".md"));
  const ref = files.find((f) =>
    fs.readFileSync(path.join(BLOG_DATA, f), "utf8").includes(`/images/blog/${slug}/`),
  );
  if (ref) return path.join(BLOG_DATA, ref);
  const prefix = files.find((f) => f.startsWith(slug));
  return prefix ? path.join(BLOG_DATA, prefix) : null;
}

// ---- tiny frontmatter reader (title + first tag) -------------------------
function readFrontmatter(slug) {
  const file = resolvePostFile(slug);
  if (!file) return null;
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = m[1];
  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const tagsMatch = fm.match(/^tags:\s*\[(.*?)\]/m);
  const tags = tagsMatch
    ? tagsMatch[1].split(",").map((t) => t.replace(/["'\s]/g, "")).filter(Boolean)
    : [];
  return {
    title: titleMatch ? titleMatch[1].trim() : slug,
    kicker: (tags[0] || "Beton").toUpperCase(),
  };
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]),
  );
}

// Word-wrap to a max char budget per line (approx; no font metrics needed).
function wrap(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  let i = 0;
  for (; i < words.length; i++) {
    const w = words[i];
    if ((line + " " + w).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = w;
      if (lines.length === maxLines - 1) {
        i++;
        break;
      }
    } else {
      line = (line + " " + w).trim();
    }
  }
  const remaining = words.slice(i);
  let last = [line, ...remaining].join(" ").trim();
  if (lines.length < maxLines && remaining.length) {
    // truncated: keep what fits on the last line + ellipsis
    last = line.trim();
    if (remaining.length) last = last.replace(/[.,;:]?$/, "") + "…";
  }
  if (last) lines.push(last);
  return lines.filter(Boolean).slice(0, maxLines);
}

function overlaySvg(title, kicker) {
  const titleLines = wrap(title, 30, 2);
  const fontSize = titleLines.length > 1 ? 50 : 58;
  const lineHeight = fontSize * 1.12;
  const titleTop = PAD + 64;
  const titleTspans = titleLines
    .map((ln, i) => `<tspan x="${PAD}" y="${titleTop + i * lineHeight}">${escapeXml(ln)}</tspan>`)
    .join("");

  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a0a" stop-opacity="0.82"/>
      <stop offset="0.6" stop-color="#0a0a0a" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0a0a0a" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${W}" height="260" fill="url(#top)"/>
  <text x="${PAD}" y="${PAD + 18}" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="3" fill="#ffd166">${escapeXml(kicker)}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff">${titleTspans}</text>
  <rect x="0" y="${H - 78}" width="${W}" height="78" fill="#0a0a0a" fill-opacity="0.9"/>
  <rect x="0" y="${H - 78}" width="${W}" height="4" fill="#ffd166"/>
  <text x="${PAD}" y="${H - 30}" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="800" letter-spacing="2" fill="#ffffff">BETON</text>
  <text x="${W - PAD}" y="${H - 31}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500" fill="#cfcfcf">getbeton.ai</text>
</svg>`);
}

async function buildHero(slug) {
  const src = path.join(IMG_BLOG, slug, "infographic.png");
  if (!fs.existsSync(src)) return null;
  const postFile = resolvePostFile(slug);
  const fm = readFrontmatter(slug);
  if (!fm || !postFile) {
    console.warn(`  [skip] ${slug}: no matching blog post`);
    return null;
  }
  const base = await sharp(src).resize(W, H, { fit: "cover", position: "attention" }).toBuffer();
  const out = path.join(IMG_BLOG, slug, "hero.png");
  await sharp(base)
    .composite([{ input: overlaySvg(fm.title, fm.kicker), top: 0, left: 0 }])
    .png()
    .toFile(out);
  const postSlug = path.basename(postFile, ".md");
  console.log(`  [hero] ${postSlug}  <-  "${fm.title}"`);
  return { postSlug, heroPath: `/images/blog/${slug}/hero.png` };
}

async function main() {
  const only = process.argv[2];
  const slugs = only
    ? [only]
    : fs
        .readdirSync(IMG_BLOG, { withFileTypes: true })
        .filter((d) => d.isDirectory() && fs.existsSync(path.join(IMG_BLOG, d.name, "infographic.png")))
        .map((d) => d.name);

  const built = [];
  for (const slug of slugs) {
    const r = await buildHero(slug);
    if (r) built.push(r);
  }

  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  for (const { postSlug, heroPath } of built) manifest[postSlug] = heroPath;
  const sorted = Object.fromEntries(Object.entries(manifest).sort());
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`\n[heroes] generated ${built.length}; manifest has ${Object.keys(sorted).length} entries -> ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
