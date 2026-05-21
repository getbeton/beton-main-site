---
title: "How we run our newsletter at Beton"
description: "We moved our newsletter off Substack onto our own Astro site to control every SEO factor, then built the reading UI we actually wanted. Here's the whole stack."
publishedAt: "2026-05-22"
author: "Vlad Nadymov"
tags: ["build in public", "newsletter", "seo", "astro"]
featured: false
draft: false
coverImage: "/images/blog/how-we-do-newsletter-at-beton/newsletter-cover.jpeg"
tldr: |
  We run our newsletter and blog on our own Astro site instead of Substack, send with Resend, and track opens and clicks in PostHog. The move was an SEO decision first: Substack doesn't let you control sitemaps, canonicals, or lastmod, and we were trying to eliminate every variable. Owning the stack also let us build reading features Substack can't, like margin sidenotes.

  - Same Astro + Tailwind setup as the rest of getbeton.ai, so the blog is not a separate system to maintain
  - Resend for sending, with the audience and DNS on our own domain
  - PostHog for opens and clicks -- a dedicated dashboard
  - Claude as editor and publisher who makes sure Vlad does not forget stuff (hey, *[TEST]* email subjects)
  - Custom reading UI (sidenotes, TL;DR, FAQ) just because we wanted to
faq:
  - question: "Why move off Substack?"
    answer: "SEO control. Substack doesn't expose sitemap, canonical, or lastmod control, and we were eliminating every variable while fixing indexation. Owning the site also lets us build reading features Substack can't."
  - question: "What do you send with?"
    answer: "Resend. The audience lives in a Resend audience, the sending domain is verified on getbeton.ai with SPF/DKIM/DMARC, and each campaign is a small Node script with per-recipient tracking."
  - question: "How do you track opens and clicks without a platform?"
    answer: "Two endpoints on our own site: a tracking pixel and a click redirector. Both fire PostHog events (newsletter_opened, newsletter_link_clicked) tagged with campaign and recipient, surfaced on a dedicated PostHog dashboard."
---

This is a post about plumbing. We send a newsletter, it goes out from our own site, and over the last few months that setup turned into something I actually like working on. Here is the whole thing.

## Why we left Substack

The newsletter used to live on Substack. We moved it for one reason: SEO control.

We were in the middle of fixing indexation on getbeton.ai, working through every factor that could be holding pages back. Substack is a black box for yours truly. You don't control the sitemap and canonical tags, you can't set a real lastmod, and the URL lives on a domain that isn't yours. 

When you're trying to eliminate variables, a platform you can't configure is usually my first choice.

So the newsletter and the blog became the same thing, on our own domain, where we own every header and every tag.

![Left: the old newsletter on Substack. Right: the same content now on getbeton.ai/blog, where we control every header and tag.](/images/blog/how-we-do-newsletter-at-beton/substack-vs-blog.jpeg)

## The setup: same Astro as the rest of the site

The blog is not a separate system. It's the same Astro build that runs the rest of getbeton.ai, the same Tailwind tokens, the same deploy to Vercel.

Posts are plain markdown files in a content collection. Each one has frontmatter for title, description, a TL;DR, and an FAQ. Astro renders the markdown to static HTML at build time; there is no CMS and no database in the path. The TL;DR and FAQ aren't just for readers, they compile into JSON-LD so the structured data is correct without hand-writing it.

Two details that only exist because we own the renderer:

- Every post has a raw-markdown twin at `/blog/<slug>.md`, so an LLM or a script can read the clean source instead of scraping HTML.
- The sitemap's lastmod comes from the file's git history, not the build time. Build-time lastmod is a lie that tells Google every page changed on every deploy. Reading git mtime ships the real date.

![A blog post's markdown source on the left, the rendered page on the right: same file, frontmatter and all, becomes the live post.](/images/blog/how-we-do-newsletter-at-beton/markdown-split.jpeg)

## The reading UI we actually wanted

This is the part that made it fun. Once you own the renderer (and have Claude at your side), you can ship small things quickly

The one I use most is sidenotes.<sup class="sidenote-ref" data-n="1">[1]</sup> On a wide screen, a footnote floats out into the left margin next to the line it belongs to, the way a good print book does it. On mobile it collapses to a tappable reference. 

They're plain HTML in the markdown, styled once in our prose stylesheet, and they double as quiet contextual CTAs where they fit.

<aside class="sidenote" data-n="1">
  <span class="sidenote-text">Like this one. On a wide screen it lives out here in the margin; on a narrow one it collapses to a tap. It's a plain aside element in the markdown, styled once.</span>
  <a class="sidenote-link" href="https://github.com/getbeton/beton-main-site">See how it's built</a>
</aside>

We also render a TL;DR block at the top and an FAQ at the bottom of every post, both pulled from the same frontmatter that feeds the structured data.

Owning the renderer pays off in small typographic things too. `Monospace text` renders the way we want it to, not the way a platform theme decided. 

```md
Code snippets look however we choose, with the syntax styling we pick, instead of whatever a generic editor pastes in. 
```
Imo for a blog that talks about tooling, that matters more than it sounds.


It also makes the structured data trivial. The TL;DR and FAQ already live in frontmatter, so embedding them in JSON-LD is a few lines at render time, not a plugin and not hand-written markup. Cleaner structured data, written once, and the same source feeds both the page and the rich result.

None of this is baseline. A platform gives you a title, a body, and a subscribe box. Owning the stack means the reading experience is yours to shape, and that is reason enough to build a small thing now and then.

## Sending: Resend

Sending runs on Resend.

The audience is a Resend audience. New subscribers come in through a form on the site that posts to a small API route and adds them to that audience. The sending domain is verified on getbeton.ai with SPF, DKIM, and DMARC, so mail authenticates as us and lands in the inbox instead of spam.

Each campaign is a small Node script. It builds the email HTML per recipient, pulls the subscribed contacts, and sends with a delay between messages to stay polite. Every send carries a List-Unsubscribe header and an unsubscribe link, and the script skips anyone already unsubscribed.


## Analytics: PostHog, on its own dashboard

We didn't want to lose open and click tracking by leaving a platform, so we rebuilt it with -– surprise-surprise -- with Posthog.

Two endpoints do the work. A 1x1 tracking pixel records opens. A click redirector wraps every link, records the click, then 302s the reader to the real destination with UTM tags attached. 

Both fire PostHog events, `newsletter_opened` and `newsletter_link_clicked`, tagged with the campaign and the recipient. They're small enough to read in full.

The open pixel is an Astro endpoint that returns a 1x1 gif and captures an event on the way out. The PostHog call is fire-and-forget, so a slow capture never blocks the image:

```ts
// src/pages/api/track/pixel.png.ts
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'); // 1x1 gif

export const GET: APIRoute = async ({ url }) => {
  const campaign = url.searchParams.get('c') || 'unknown';
  const email = url.searchParams.get('e') || 'anonymous';

  await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'newsletter_opened',
      distinct_id: email,
      properties: { campaign, source: 'email' },
    }),
  }).catch(() => {});

  return new Response(PIXEL, {
    headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'no-store' },
  });
};
```

The click redirector does the same, plus one thing that matters: it only redirects to hosts we trust. A naive redirector that forwards anywhere is a phishing tool with your domain on it.

```ts
// src/pages/api/track/click.ts
const ALLOWED_HOSTS = ['getbeton.ai', 'www.getbeton.ai', 'inspector.getbeton.ai', 'github.com'];

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('u') || 'https://www.getbeton.ai';
  const campaign = url.searchParams.get('c') || 'unknown';
  const label = url.searchParams.get('l') || 'unknown';
  const email = url.searchParams.get('e') || 'anonymous';

  const parsed = new URL(target);
  if (!ALLOWED_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))) {
    return Response.redirect('https://www.getbeton.ai', 302); // refuse untrusted targets
  }

  await fetch(`${POSTHOG_HOST}/capture/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'newsletter_link_clicked',
      distinct_id: email,
      properties: { campaign, link_label: label, target_url: target },
    }),
  }).catch(() => {});

  return Response.redirect(target, 302);
};
```

That's the whole tracking layer. Two endpoints, no SDK in the email, and the data lands in the same PostHog project as everything else.

All of it rolls up to a dedicated PostHog dashboard, separate from product analytics, so newsletter performance reads cleanly without digging through everything else.

![Newsletter analytics in PostHog: a dedicated dashboard with opens per blog post, opens per recipient, and weekly and daily total-vs-unique open trends.](/images/blog/how-we-do-newsletter-at-beton/posthog-dashboard.jpeg)

## Where Claude fits

Claude doesn't run this pipeline. It orchestrates it.

The goal is to post every day, and a daily cadence is more than one person wants to hand-crank. So Claude does the research, drafts to the voice guide, and moves a piece through the steps. For the rest of the team, it handles the parts that are easy to forget:

- clean, ready-to-paste links dropped into Slack when something ships, so amplifying it is a copy-paste
- cover and hero images generated on request
- every frontmatter attribute populated, so nothing goes out half-tagged: the TL;DR, the FAQ, the description, the dates

The voice guide it drafts against is a real file in the repo. It encodes the rules we care about: short declarative sentences, no AI-slop adverbs, name the real tool and the real number, recommend a competitor when it actually fits, and a hard cap on em-dashes. A separate concision pass tightens social drafts, so posts get drafted to our voice, not a generic blog voice.

The work is organized as a content skillset. A teardown skill handles the OSS pricing series end to end, from picking a tool to drafting the analysis to generating the hero image. A newsletter skill handles the send: blog verification, image optimization, the tracked HTML, a test send, then the full send behind a preflight checklist. Each piece of content gets its own folder with the blog draft, the LinkedIn post, the Twitter thread, and the infographic, so distribution is part of the same artifact, not an afterthought.

## The posting process, start to finish

1. Draft the post to the voice guide, in its own content folder.
2. Open a PR to the marketing site, get a green build, merge, deploy.
3. On deploy, CI pings IndexNow with the URLs from the sitemap, and the sitemap is submitted to Google Search Console. Bing and Yandex recrawl in minutes; Google gets the nudge to come back on its own schedule.
4. Run the newsletter preflight: confirm the post is live, the hero loads, the tracking pixel and click redirector both work.
5. Send a test to myself, check the render, the from-name, the links.
6. Send to the full audience with per-recipient tracking.
7. Amplify: company post first, then a personal repost, then ask the team.
8. Watch opens and clicks on the PostHog dashboard.

## What's next

The stack is the point of leverage, so the backlog is mostly things a platform would never let us add:

- More embed types. Live Metabase and PostHog charts, YouTube and Loom videos, image galleries, all rendered inline instead of linked out.
- AMP versions for faster loads on mobile and in-feed.
- Tags, and SEO-indexable pages for tag combinations, so related posts cluster into their own crawlable surfaces.
- Testing different page layouts to see what actually reads better, not what a theme picked for us.

## See the source

The whole site is open in our GitHub org: [github.com/getbeton/beton-main-site](https://github.com/getbeton/beton-main-site). The tracking endpoints, the sidenote styles, the sitemap-lastmod trick, all of it. Clone it and you have the same technical implementation we run, no platform required.

## The actual point

Doing a blog gets more fun when you can build the non-baseline parts yourself. Sidenotes didn't move a metric. They made the posts nicer to read, they took an afternoon, and they only exist because the newsletter lives on our own stack instead of someone else's. That trade, a bit more plumbing for full control, has paid for itself in SEO and in the small things we get to build along the way.

Spread the word and share this one with your marketing friend. 

— Vlad
