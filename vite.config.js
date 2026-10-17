import { defineConfig } from 'vite';

/**
 * Vite configuration.
 * `base: './'` keeps the production build portable (works from a subfolder
 * or a static host without extra configuration).
 */
export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
  },
});
