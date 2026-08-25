// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/config';

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: {
    // Local images only. No remote patterns — nothing on this site loads from a third party
    // except the Luma embed, which is an iframe, not an image.
    responsiveStyles: true,
  },
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
  devToolbar: { enabled: false },
});
