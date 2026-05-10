import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://oshikatsu-ensei-navi.pages.dev',
  output: 'static',
  build: {
    assets: 'assets',
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
});
