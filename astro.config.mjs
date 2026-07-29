import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Required so canonical + Open Graph tags can be built as absolute URLs.
  site: 'https://hack13.me',
  integrations: [tailwind()]
});