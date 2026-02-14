#!/usr/bin/env node

/**
 * SEO Readiness Checker
 *
 * Validates SEO fundamentals against a running site (local dev or production).
 *
 * Usage:
 *   node scripts/seo-check.mjs                          # checks localhost:4321
 *   node scripts/seo-check.mjs https://www.getbeton.ai  # checks production
 */

const BASE = process.argv[2] || 'http://localhost:4321';
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const CANONICAL_DOMAIN = 'https://www.getbeton.ai';

const PAGES = [
  '/',
  '/about/',
  '/pricing/',
  '/terms/',
  '/privacy/',
  '/team/',
  '/integrations/',
  '/integrations/posthog/',
  '/integrations/attio/',
  '/use-cases/plg-conversion/',
  '/use-cases/churn-prevention/',
  '/industries/saas/',
  '/alternatives/pocus/',
  '/vs/pocus/',
];

let totalChecks = 0;
let passed = 0;
let failed = 0;
const failures = [];

function check(page, label, condition, detail) {
  totalChecks++;
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push({ page, label, detail });
  }
}

async function fetchPage(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) return null;
  return res.text();
}

function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function extractAll(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]);
}

async function checkPage(path) {
  const html = await fetchPage(path);
  if (!html) {
    check(path, 'Page loads', false, `Failed to fetch ${BASE}${path}`);
    return;
  }

  // Title
  const title = extract(html, /<title>([^<]*)<\/title>/);
  check(path, 'Title exists', !!title, 'Missing <title> tag');
  if (title) {
    check(path, 'Title length', title.length >= 15 && title.length <= 70, `Title is ${title.length} chars: "${title}"`);
    check(path, 'No double brand suffix', !title.includes('| Beton | Beton'), `Double suffix: "${title}"`);
  }

  // Meta description
  const desc = extract(html, /<meta name="description" content="([^"]*)"/);
  check(path, 'Meta description exists', !!desc, 'Missing meta description');
  if (desc) {
    check(path, 'Description length', desc.length >= 70 && desc.length <= 160, `Description is ${desc.length} chars`);
  }

  // Canonical
  const canonical = extract(html, /<link rel="canonical" href="([^"]*)"/);
  check(path, 'Canonical exists', !!canonical, 'Missing canonical tag');
  if (canonical) {
    check(path, 'Canonical uses correct domain', canonical.startsWith(CANONICAL_DOMAIN), `Canonical: ${canonical}`);
    check(path, 'Canonical matches path', canonical.endsWith(path), `Expected path ${path}, got ${canonical}`);
  }

  // OG tags
  const ogUrl = extract(html, /<meta property="og:url" content="([^"]*)"/);
  check(path, 'og:url exists', !!ogUrl, 'Missing og:url');
  if (ogUrl && canonical) {
    check(path, 'og:url matches canonical', ogUrl === canonical, `og:url=${ogUrl} != canonical=${canonical}`);
  }

  const ogImage = extract(html, /<meta property="og:image" content="([^"]*)"/);
  check(path, 'og:image exists', !!ogImage, 'Missing og:image');

  const ogTitle = extract(html, /<meta property="og:title" content="([^"]*)"/);
  check(path, 'og:title exists', !!ogTitle, 'Missing og:title');

  const twitterCard = extract(html, /<meta name="twitter:card" content="([^"]*)"/);
  check(path, 'twitter:card exists', !!twitterCard, 'Missing twitter:card');

  // H1
  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
  check(path, 'Exactly one H1', h1s.length === 1, `Found ${h1s.length} H1 tags`);

  // Robots meta
  const robots = extract(html, /<meta name="robots" content="([^"]*)"/);
  if (path === '/404/') {
    check(path, 'Robots noindex on 404', robots && robots.includes('noindex'), 'Missing noindex on 404');
  } else {
    check(path, 'No accidental noindex', !robots || !robots.includes('noindex'), `Robots: ${robots}`);
  }

  // JSON-LD
  const jsonLdMatch = extract(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  check(path, 'JSON-LD exists', !!jsonLdMatch, 'Missing JSON-LD structured data');
  if (jsonLdMatch) {
    try {
      const schema = JSON.parse(jsonLdMatch);
      check(path, 'JSON-LD valid JSON', true, '');
      const graph = schema['@graph'] || [];

      // Check @id fields
      const org = graph.find((e) => e['@type'] === 'Organization');
      check(path, 'Organization has @id', org && org['@id'], 'Missing @id on Organization');

      const website = graph.find((e) => e['@type'] === 'WebSite');
      check(path, 'WebSite has @id', website && website['@id'], 'Missing @id on WebSite');

      const webpage = graph.find((e) => e['@type'] === 'WebPage');
      check(path, 'WebPage has @id', webpage && webpage['@id'], 'Missing @id on WebPage');

      // Check for double slash in @id
      if (webpage && webpage['@id']) {
        check(path, 'WebPage @id no double slash', !webpage['@id'].includes('//#'), `Double slash in @id: ${webpage['@id']}`);
      }

      // Check publisher uses @id reference
      if (website && website.publisher) {
        check(path, 'WebSite publisher uses @id ref', !!website.publisher['@id'], 'WebSite publisher is inline object, should use @id reference');
      }

      // SoftwareApplication checks
      const software = graph.find((e) => e['@type'] === 'SoftwareApplication');
      if (software && software.offers) {
        for (const offer of software.offers) {
          check(path, `Offer "${offer.name}" has price`, !!offer.price, `Missing price on offer ${offer.name}`);
          check(path, `Offer "${offer.name}" has priceCurrency`, !!offer.priceCurrency, `Missing priceCurrency on offer ${offer.name}`);
        }
      }

      // FAQPage checks
      const faq = graph.find((e) => e['@type'] === 'FAQPage');
      if (faq) {
        check(path, 'FAQPage has questions', faq.mainEntity && faq.mainEntity.length > 0, 'FAQPage has no questions');
      }
    } catch {
      check(path, 'JSON-LD valid JSON', false, 'Invalid JSON in JSON-LD');
    }
  }

  // Bad patterns
  check(path, 'No cdn-cgi links', !html.includes('cdn-cgi'), 'Found cdn-cgi link (Cloudflare email obfuscation)');
  check(path, 'No bare undefined in links', !html.includes('href="undefined"'), 'Found href="undefined"');

  // Email checks for legal pages
  if (path === '/terms/' || path === '/privacy/') {
    const bareEmails = html.match(/[^"\/][\w.-]+@getbeton\.ai(?!")/g);
    const hasMailto = html.includes('mailto:');
    check(path, 'Emails wrapped in mailto: links', hasMailto, 'No mailto: links found');
  }
}

async function checkRobotsTxt() {
  const txt = await fetchPage('/robots.txt');
  if (!txt) {
    check('/robots.txt', 'Loads', false, 'Failed to fetch robots.txt');
    return;
  }
  check('/robots.txt', 'Sitemap declared', txt.includes('Sitemap:'), 'No Sitemap directive');
  check('/robots.txt', 'Sitemap uses correct domain', txt.includes(`${CANONICAL_DOMAIN}/sitemap`), `Sitemap URL doesn't use ${CANONICAL_DOMAIN}`);
  check('/robots.txt', 'No blanket Disallow', !txt.includes('Disallow: /\n'), 'Blanket disallow found');
}

async function checkSitemap() {
  const xml = await fetchPage('/sitemap-index.xml');
  if (!xml) {
    // In dev mode, sitemaps aren't served — skip gracefully
    if (BASE.includes('localhost')) {
      console.log('  ⏭  Sitemap not available in dev mode (generated at build time)\n');
      return;
    }
    check('/sitemap-index.xml', 'Loads', false, 'Failed to fetch sitemap-index.xml');
    return;
  }
  check('/sitemap-index.xml', 'References sitemap-0.xml', xml.includes('sitemap-0.xml'), 'Missing sitemap-0.xml reference');

  const sitemap0 = await fetchPage('/sitemap-0.xml');
  if (sitemap0) {
    const urls = [...sitemap0.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    check('/sitemap-0.xml', 'Has URLs', urls.length > 0, 'No URLs in sitemap');

    const wrongDomain = urls.filter((u) => !u.startsWith(CANONICAL_DOMAIN));
    check('/sitemap-0.xml', 'All URLs use correct domain', wrongDomain.length === 0, `${wrongDomain.length} URLs with wrong domain: ${wrongDomain.slice(0, 3).join(', ')}`);
  }
}

async function checkRedirects() {
  // Only test redirects against production
  if (BASE.includes('localhost')) return;

  const redirectTests = [
    { from: '/app', expect: 'inspector.getbeton.ai/login' },
    { from: '/app/', expect: 'inspector.getbeton.ai/login' },
    { from: '/blog', expect: 'blog.getbeton.ai' },
    { from: '/blog/', expect: 'blog.getbeton.ai' },
  ];

  for (const { from, expect } of redirectTests) {
    try {
      const res = await fetch(`${BASE}${from}`, {
        headers: { 'User-Agent': UA },
        redirect: 'manual',
      });
      const location = res.headers.get('location') || '';
      check(from, `Redirects to ${expect}`, location.includes(expect), `Redirects to: ${location}`);
    } catch (e) {
      check(from, `Redirect check`, false, e.message);
    }
  }
}

// --- Run ---
console.log(`\n🔍 SEO Check — ${BASE}\n${'─'.repeat(50)}\n`);

console.log('📄 Checking pages...\n');
for (const path of PAGES) {
  process.stdout.write(`  ${path} `);
  await checkPage(path);
  process.stdout.write('✓\n');
}

console.log('\n🤖 Checking robots.txt...\n');
await checkRobotsTxt();

console.log('🗺  Checking sitemap...\n');
await checkSitemap();

console.log('↩️  Checking redirects...\n');
await checkRedirects();

// --- Report ---
console.log(`${'─'.repeat(50)}`);
console.log(`\n  Total: ${totalChecks}  ✅ Passed: ${passed}  ❌ Failed: ${failed}\n`);

if (failures.length > 0) {
  console.log('❌ FAILURES:\n');
  for (const f of failures) {
    console.log(`  ${f.page}`);
    console.log(`    ${f.label}: ${f.detail}\n`);
  }
  process.exit(1);
} else {
  console.log('✅ All SEO checks passed!\n');
  process.exit(0);
}
