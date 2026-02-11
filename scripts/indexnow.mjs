/**
 * IndexNow submission script
 * Runs after every build to notify search engines of all URLs.
 * Works with Bing, Yandex, Seznam, and Naver via IndexNow protocol.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://www.getbeton.ai';
const INDEXNOW_KEY = 'a1b2c3d4e5f6g7h8i9j0';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

async function submitUrls() {
  // Read the generated sitemap to get all URLs
  const sitemapPath = resolve('dist/sitemap.xml');
  let sitemapXml;

  try {
    sitemapXml = readFileSync(sitemapPath, 'utf-8');
  } catch {
    console.log('[IndexNow] No sitemap found at dist/sitemap.xml, skipping.');
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
