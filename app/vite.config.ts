import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app consumes the Phosphor Console theme from source (repo root `theme/`),
// so editing a token or override is instantly live here with HMR — no build step.
const themeSrc = (p: string) =>
  fileURLToPath(new URL(`../theme/${p}`, import.meta.url));
const componentsSrc = (p: string) =>
  fileURLToPath(new URL(`../components/${p}`, import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Honor a PORT assigned by the environment (e.g. a preview harness) so the
  // server binds where callers expect it; fall back to Vite's default locally.
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
  resolve: {
    alias: {
      '@theme': themeSrc('index.ts'),
      // The reusable component library, also consumed from source (repo root
      // `components/`) so token/override edits stay live with HMR.
      '@components': componentsSrc('index.ts'),
    },
    // The theme + component library live at the repo root with no adjacent
    // node_modules. `dedupe` resolves their bare peer imports to this app's
    // single install (dev and `vite build` alike) AND guarantees one copy of
    // each — path-aliasing React instead creates a second copy that breaks
    // hooks ("Invalid hook call") once a portal component (Modal/Dialog) mounts.
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
});
