import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Like `app/`, the doc site consumes the theme + component library from source
// (repo root `theme/` and `components/`) so a token or override edit is live
// here under HMR — no package build in between. All *code* imports still say
// '@theme' / '@components'; the alias is a build detail.
const themeSrc = (p: string) => fileURLToPath(new URL(`../theme/${p}`, import.meta.url));
const componentsSrc = (p: string) => fileURLToPath(new URL(`../components/${p}`, import.meta.url));

// Static hosts (GitHub Pages et al.) serve project sites under /<repo>/, so the
// base is configurable: CI sets DOCS_BASE. Dev and the default build stay at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.DOCS_BASE ?? '/') : '/',
  plugins: [react()],
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
  resolve: {
    alias: {
      '@theme': themeSrc('index.ts'),
      '@components': componentsSrc('index.ts'),
    },
    // The theme + components live at the repo root with no adjacent
    // node_modules. `dedupe` resolves their bare peer imports to this site's
    // single install AND guarantees one copy of each — path-aliasing React
    // instead creates a second copy that breaks hooks ("Invalid hook call")
    // as soon as a portal component (Dialog) mounts.
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
}));
