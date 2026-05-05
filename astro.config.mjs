import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vkei-ensei-navi.example.com',
  output: 'static',
  integrations: [sitemap()],
});
