import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://getbeton.ai',
  output: 'static',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  redirects: {
    '/docs': 'https://docs.getbeton.ai',
    '/blog': 'https://blog.getbeton.ai',
    '/app': 'https://inspector.getbeton.ai',
  },
  build: { inlineStylesheets: 'auto' },
});
