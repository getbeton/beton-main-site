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
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // High-priority pages
        if (item.url === 'https://www.getbeton.ai/' || item.url === 'https://www.getbeton.ai') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/pricing')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/use-cases/') && !item.url.endsWith('/use-cases/')) {
          item.priority = 0.8;
        } else if (item.url.includes('/industries/') && !item.url.endsWith('/industries/')) {
          item.priority = 0.8;
        } else if (item.url.includes('/integrations/') && !item.url.endsWith('/integrations/')) {
          item.priority = 0.8;
        } else if (
          item.url.includes('/use-cases') ||
          item.url.includes('/industries') ||
          item.url.includes('/integrations') ||
          item.url.includes('/about')
        ) {
          item.priority = 0.7;
        } else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        item.lastmod = new Date().toISOString().split('T')[0];
        return item;
      },
    }),
  ],
  redirects: {
    '/blog': 'https://blog.getbeton.ai',
    '/app': 'https://inspector.getbeton.ai/login',
  },
  build: { inlineStylesheets: 'auto' },
});
