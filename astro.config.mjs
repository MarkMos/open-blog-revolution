// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { CONFIG as rawConfig } from "./src/js/load-config.js";

/** @type {any} */
const CONFIG = rawConfig;

import { remarkExtendImage, remarkExtendBlockquote } from "./src/js/plugins/remark-plugins";

// https://astro.build/config
export default defineConfig({
  site: CONFIG.URL,
  base: `/${CONFIG.BASE}`,

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