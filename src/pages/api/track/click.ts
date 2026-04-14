import type { APIRoute } from 'astro';

export const prerender = false;

const POSTHOG_KEY = import.meta.env.POSTHOG_API_KEY;
const POSTHOG_HOST = 'https://us.i.posthog.com';

const ALLOWED_HOSTS = ['getbeton.ai', 'www.getbeton.ai', 'inspector.getbeton.ai', 'github.com'];

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('u') || 'https://www.getbeton.ai';
  const campaign = url.searchParams.get('c') || 'unknown';
  const label = url.searchParams.get('l') || 'unknown';
  const email = url.searchParams.get('e') || 'anonymous';

  // Validate target URL
  try {
    const parsed = new URL(target);
    if (!ALLOWED_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))) {
      return Response.redirect('https://www.getbeton.ai', 302);
    }
  } catch {
    return Response.redirect('https://www.getbeton.ai', 302);
  }

  await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'newsletter_link_clicked',
      distinct_id: email,
      properties: {
        campaign,
        link_label: label,
        target_url: target,
        source: 'email',
      },
    }),
  }).catch(() => {});

  return Response.redirect(target, 302);
};
