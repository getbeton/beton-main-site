/**
 * IndexNow submission script
 * Runs after every build to notify search engines of all URLs.
 * Works with Bing, Yandex, Seznam, and Naver via IndexNow protocol.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://www.getbeton.ai';
const INDEXNOW_KEY = '1301c50ed3d8186d4e6d44152327634c';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function submitUrls() {
  // Read the generated sitemap — Astro 5 + Vercel adapter outputs to dist/client/
  const candidates = [resolve('dist/client/sitemap.xml'), resolve('dist/sitemap.xml')];
  let sitemapXml;

  for (const path of candidates) {
    try {
      sitemapXml = readFileSync(path, 'utf-8');
      console.log(`[IndexNow] Reading sitemap from ${path}`);
      break;
    } catch {}
  }

  if (!sitemapXml) {
    console.log('[IndexNow] No sitemap found, skipping.');
    return;
  }

  // Extract URLs from sitemap XML
  const urlMatches = sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g);
  const urls = [...urlMatches].map((m) => m[1]);

  if (urls.length === 0) {
    console.log('[IndexNow] No URLs found in sitemap.');
    return;
  }

  console.log(`[IndexNow] Submitting ${urls.length} URLs...`);

  const payload = {
    host: 'www.getbeton.ai',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] Success (${response.status}). ${urls.length} URLs submitted.`);
    } else {
      const text = await response.text();
      console.log(`[IndexNow] Response ${response.status}: ${text}`);
    }
  } catch (err) {
    // Non-blocking — don't fail the build if IndexNow is unreachable
    console.log(`[IndexNow] Network error (non-blocking): ${err.message}`);
  }
}

submitUrls();
