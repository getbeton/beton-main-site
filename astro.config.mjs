import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

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
        item.lastmod = new Date().toISOString().split('T')[0];
        return item;
      },
    }),
  ],
  redirects: {
    '/app': 'https://inspector.getbeton.ai/login',
  },
  build: { inlineStylesheets: 'auto' },
});
