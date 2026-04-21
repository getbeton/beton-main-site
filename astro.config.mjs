import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import fs from 'node:fs';
import path from 'node:path';

// Build blog date map from frontmatter at config load time
const blogDir = 'src/data/blog';
const blogDates = {};
for (const file of fs.readdirSync(blogDir)) {
  if (!file.endsWith('.md')) continue;
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const updated = content.match(/updatedAt:\s*"?([^"\n]+)"?/);
  const published = content.match(/publishedAt:\s*"?([^"\n]+)"?/);
  const slug = file.replace('.md', '');
  blogDates[slug] = (updated?.[1] || published?.[1] || '').trim();
}

export default defineConfig({
  site: 'https://www.getbeton.ai',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const blogMatch = item.url.match(/\/blog\/([^/]+)\/?$/);
        if (blogMatch && blogDates[blogMatch[1]]) {
          item.lastmod = blogDates[blogMatch[1]];
        } else {
          item.lastmod = new Date().toISOString();
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/app': 'https://inspector.getbeton.ai/login',
  },
  build: { inlineStylesheets: 'auto' },
});
