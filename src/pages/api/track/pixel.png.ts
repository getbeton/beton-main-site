import type { APIRoute } from 'astro';

export const prerender = false;

const POSTHOG_KEY = import.meta.env.POSTHOG_API_KEY;
const POSTHOG_HOST = 'https://us.i.posthog.com';

// 1x1 transparent GIF
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export const GET: APIRoute = async ({ url }) => {
  const campaign = url.searchParams.get('c') || 'unknown';
  const email = url.searchParams.get('e') || 'anonymous';

  // Fire PostHog event non-blocking
  fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'newsletter_opened',
      distinct_id: email,
      properties: {
        campaign,
        source: 'email',
        $current_url: `https://www.getbeton.ai/blog/${campaign}`,
      },
    }),
  }).catch(() => {});

  return new Response(PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
};
