// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { CONFIG } from "./src/js/load-config.js";


import { remarkExtendImage, remarkExtendBlockquote } from "./src/js/plugins/remark-plugins";

// https://astro.build/config
export default defineConfig({
  site: CONFIG.URL,
  base: '/',

  devToolbar: {
      enabled: false
    },

  integrations: [sitemap(), mdx(
    {
      remarkPlugins: [remarkExtendImage, remarkExtendBlockquote]
    }
  )],
  vite: {
    resolve: {
      alias: {
        "@config": "src/js/load-config.js"
      }
    }
  }
});