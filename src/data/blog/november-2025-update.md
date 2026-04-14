---
title: "November 2025 Update"
description: "Experiment with AI-assisted weekly updates. SEO work with 100+ integration pages, GitHub scraper development, and strategy thinking."
publishedAt: "2025-11-25"
author: "Vlad Nadymov"
tags: ["company update", "beton"]
featured: false
draft: false
---

The weekly updates start to become a chore. I didn't keep up with the pace I set — and I constantly think "oh, I'd better write one more email instead of a new issue newsletter."

So, I'll experiment with writing them with GPT. It checks my emails and calendar and summarizes whatever I did last week, then I rewrite it and send to you.

## SEO chores

This week I mostly did free manual labor for Google.

I added 100 integration pages to Beton's site, repeating Zapier's old trick of "one page per integration" to hoover up low-volume but unreasonably warm search traffic.

Webflow CMS let me spit out 150 template-based pages from CSV, so ChatGPT wrote the HTML/CSS and templates, Claude rewrote the copy, and I just played the role of slightly confused content ops.

On the technical SEO side I wired in ostr.io prerenders, so Googlebot now gets pre-cooked HTML from data centers sitting next to it — basically *Flash Boys*, but for indexing instead of HFT.

I also sprinkled internal links everywhere via Webflow Collection lists, added PostHog tracking on the new pages, poked at Cloudflare Workers, and fought with sitemaps + robots.txt across the nice little Frankenstein of Webflow + Substack + Cloudflare.

## GitHub scraper

In parallel I sketched a separate GitHub "scraper as a product" idea.

A Streamlit app that eats a repo URL, respects rate limits, and slowly harvests contributors/issues into enrichment flows instead of me crying over 5k calls/day.

The temptation is to distribute it via AGPLv3 so nobody uses it as part of their product. At the same time, this will spoil our codebase if the scraper becomes an integral part of Beton which I'd love to avoid.

## Wrapping up

There was also some thinking about salestech market size, Clay + Apollo pricing gymnastics, and how Beton's lead form enrichment should sit between random web forms and CRMs without everyone hating it.

Now I wait a week to see if any of this actually moves traffic, or if I just built a very expensive shrine to long-tail SEO.
