import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { prepareAssets } from './scripts/prepare-assets.mjs';

// Runs the image pipeline automatically at dev start and build start, so the
// site works no matter which command the host (e.g. Vercel) invokes.
function prepareAssetsIntegration() {
  return {
    name: 'nnd-prepare-assets',
    hooks: {
      'astro:config:setup': async () => {
        await prepareAssets();
      },
      'astro:build:start': async () => {
        await prepareAssets();
      },
    },
  };
}

// Update `site` if the production domain ever changes.
export default defineConfig({
  site: 'https://www.notnowdear.com',
  integrations: [prepareAssetsIntegration(), sitemap()],
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
