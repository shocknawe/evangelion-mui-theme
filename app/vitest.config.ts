import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Test config for the accessibility harness (Task 6.1).
 *
 * Mirrors vite.config.ts so the tests consume the theme + component library from
 * source exactly like the app does — `@theme` and `@components` resolve to the
 * repo-root sources, so an axe violation is always attributable to the same code
 * a consumer ships. Kept as a separate file (rather than a `test` block in
 * vite.config.ts) so the production build config stays free of test concerns.
 */

const themeSrc = (p: string) =>
  fileURLToPath(new URL(`../theme/${p}`, import.meta.url));
const componentsSrc = (p: string) =>
  fileURLToPath(new URL(`../components/${p}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@theme': themeSrc('index.ts'),
      '@components': componentsSrc('index.ts'),
    },
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/a11y/setup.ts'],
    globals: false,
    css: false,
    restoreMocks: true,
  },
});