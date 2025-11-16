// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { remarkExtendImage, remarkExtendBlockquote } from "./src/js/plugins/remark-plugins";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mywebsite.com',
  base: '/',

  devToolbar: {
      enabled: false
    },

  integrations: [sitemap(), mdx(
    {
      remarkPlugins: [remarkExtendImage, remarkExtendBlockquote]
    }
  )],
});