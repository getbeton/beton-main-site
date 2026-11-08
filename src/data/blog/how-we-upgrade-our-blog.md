---
title: "Our blog is a product — here's how we keep shipping to it"
description: "We treat the Beton blog like a product with a release cadence: one-click copy, TL;DR and FAQ from frontmatter, gutter sidenotes, a multi-type JSON-LD graph on every post, git-accurate lastmod, IndexNow pings, and a Googlebot-UA auditor that runs on every build. Here's the machinery."
publishedAt: "2026-05-28"
author: "Vlad Nadymov"
tags: ["beton", "content", "build in public"]
featured: false
draft: false
coverImage: "/images/blog/blog-features-hero.jpg"
tldr: |
  Most company blogs are a CMS and a vibe. We treat ours like a product — it has features, a build pipeline, and a release cadence. This post is the changelog of the blog itself.

  - **Authoring:** plain Markdown, but with one-click copy on code, a TL;DR callout and FAQ accordion straight from frontmatter, gutter sidenotes, and inline CTA cards.
  - **SEO is built into the build:** every post emits a multi-type JSON-LD `@graph` (Article, FAQ, Breadcrumb, Person, and more), lastmod comes from git so it's never a lie, and a Googlebot-UA auditor runs on every build.
  - **Distribution is wired in:** IndexNow pings on deploy, a sitemap rebuilt post-build, and a guarded newsletter sender so a post becomes an email without a copy-paste.
  - **We measure both engines:** we read Google Search Console *and* Bing Webmaster every day, because they disagree — and the disagreement tells us what to fix.
faq:
  - question: "What's the blog built on?"
    answer: "Astro 5 with Tailwind v4, deployed on Vercel. Posts are Markdown content collections with a typed schema, so frontmatter like tldr and faq is validated at build time and rendered into real components — no MDX required."
  - question: "Why read both Google Search Console and Bing?"
    answer: "Because they index differently. Bing tends to accept and rank new content faster, so it's an early read on whether a page is good; Google is slower and pickier. When Bing ranks a page that Google hasn't indexed, that's a signal the content is fine and the problem is Google acceptance — a different fix than 'write better content'."
  - question: "Do you really run an SEO check on every build?"
    answer: "Yes. A script fetches key pages with a Googlebot user-agent and validates the fundamentals — canonical tags, titles, meta descriptions, structured data, no accidental noindex. It's the same idea as a test suite, pointed at SEO instead of logic."
seo:
  metaTitle: "How we keep upgrading the Beton blog"
  metaDescription: "The Beton blog as a product: one-click copy, TL;DR/FAQ from frontmatter, a multi-type JSON-LD graph, git-accurate lastmod, and a build-time SEO auditor."
---

hey, it's [Vlad](https://www.linkedin.com/in/vlad-nadymov/), founder of Beton.

most company blogs are a CMS and a vibe. you write a post, hit publish, and hope. we don't run ours that way. the blog is a product — it has features, a build pipeline, and a release cadence — and we ship upgrades to it the same way we ship the app.

this post is the changelog of the blog itself. here's what's actually in it and why.

## authoring: Markdown that does more

every post is plain Markdown in a typed content collection, so frontmatter is validated at build time and rendered into real components. you write text; the build adds the surface area:

- **one-click copy** on every code block — added once in the layout, so no post has to think about it.
- **a TL;DR callout** generated from a `tldr:` field in frontmatter. it's the first thing on the page and the thing most readers actually read.
- **an FAQ accordion** generated from a `faq:` array — which doubles as structured data (more on that below).
- **gutter sidenotes** that float into the margin on wide screens and collapse inline on mobile and in email.
- **inline CTA cards** at natural conversion moments, and a "related posts" grid by tag overlap at the bottom.

the rule we hold ourselves to: an author writes Markdown, and the *system* adds conversion surface and structure. nobody hand-rolls a CTA or a schema block per post.

## SEO is part of the build, not an afterthought

this is the part most blogs skip, and it's where the leverage is. three things run automatically:

**a multi-type JSON-LD `@graph` on every post.** not a token `Article` blob — a connected graph that can include `Article`, `FAQPage`, `BreadcrumbList`, `Person`, `Organization`, `ItemList`, `HowTo`, and `Dataset` depending on what the page declares. it's one component fed by frontmatter, so the structured data is always consistent with what's actually on the page.

**git-accurate `lastmod`.** a prebuild step derives each page's last-modified date from git history and writes it into the sitemap. most sitemaps lie — they stamp "today" on everything every deploy, which trains crawlers to ignore the field. ours is true, so it means something.

**a Googlebot-UA auditor on every build.** a script fetches the key pages with a Googlebot user-agent and checks the fundamentals — canonical tags, unique titles and meta descriptions, valid structured data, no accidental `noindex`. it's a test suite pointed at SEO. a regression fails loudly instead of silently tanking a page.

## distribution is wired in too

publishing isn't the finish line — it's the handoff to distribution, and that's automated:

- **IndexNow** pings on production deploy, so Bing and Yandex hear about new and changed URLs immediately instead of waiting for a crawl.
- the **sitemap is rebuilt post-build** and submitted, every time.
- a **guarded newsletter sender** turns a post into an email without a copy-paste — it claims recipients before sending so a post can never get double-blasted. (we wrote that whole system up separately, in [how we run our newsletter](https://www.getbeton.ai/blog/how-we-do-newsletter-at-beton/).)

## we measure both search engines, because they disagree

here's the habit that actually changes decisions: we read **Google Search Console and Bing Webmaster Tools every day**, side by side.

they don't agree, and the disagreement is the useful part. Bing tends to accept and rank new content faster — so when Bing is ranking a page on its target query but Google hasn't picked it up, that's not a "write better content" problem. the content is demonstrably fine; Bing proved it. it's a Google *acceptance* problem, which is a completely different fix.

reading one engine in isolation would have sent us chasing the wrong work. reading both tells us when the bottleneck is the writing versus the indexing — and we spend our time accordingly.

## why bother

because content compounds only if the machine around it is good. a great post with a broken canonical, a lying sitemap, and no structured data is a great post nobody finds. we'd rather the boring infrastructure be excellent and let the writing carry the rest.

the blog ships like the product does: small upgrades, often, measured. this post is just the latest entry in its changelog.

— [Vlad](https://www.linkedin.com/in/vlad-nadymov/)
