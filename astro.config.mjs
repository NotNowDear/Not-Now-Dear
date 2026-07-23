import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` if the production domain ever changes.
export default defineConfig({
  site: 'https://www.notnowdear.com',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
