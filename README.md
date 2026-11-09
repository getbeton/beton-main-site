# Beton website

> [!NOTE]
> Beton is not in active development. The code stays public under its license. The team does not review new issues or pull requests.
> The team now builds [Sell to State](https://www.selltostate.com/?utm_source=github&utm_medium=referral&utm_campaign=beton-repos&utm_content=beton-main-site): government tenders and contract awards from official sources in 70+ countries.

Source of the Beton website (getbeton.ai): pages, blog posts and the open-source pricing teardowns. Astro 5 static site, Tailwind CSS 4.

## Read the content here

The site is offline. All content is Markdown and JSON in this repo:

| Content | Path |
|---|---|
| Blog posts, with 20 open-source pricing teardowns | [`src/data/blog/`](src/data/blog/) |
| Pricing the open-source software, Vol 2 (2023 vs 2026) | [`src/data/blog/commercial-open-source-pricing-2026.md`](src/data/blog/commercial-open-source-pricing-2026.md) |
| Pages: home, about, pricing, terms, privacy | [`src/data/pages/`](src/data/pages/) |
| Integrations | [`src/data/integrations/integrations.json`](src/data/integrations/integrations.json) |

The dataset behind the teardowns is in [getbeton/oss-pricing-data](https://github.com/getbeton/oss-pricing-data).

## Run it

```bash
npm install
npm run dev      # dev server
npm run build    # static build
```

## Related

- [getbeton/inspector](https://github.com/getbeton/inspector): Beton Inspector, open-source revenue intelligence.
- [getbeton/dryfit](https://github.com/getbeton/dryfit): synthetic analytics data for agent benchmarks.
- [getbeton/oss-pricing-data](https://github.com/getbeton/oss-pricing-data): open-source pricing dataset, CC BY 4.0.

## License

[MIT](LICENSE).
