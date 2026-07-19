import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app consumes the Phosphor Console theme from source (repo root `theme/`),
// so editing a token or override is instantly live here with HMR — no build step.
const themeSrc = (p: string) =>
  fileURLToPath(new URL(`../theme/${p}`, import.meta.url));
const appDep = (p: string) =>
  fileURLToPath(new URL(`./node_modules/${p}`, import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@theme': themeSrc('index.ts'),
      // The theme lives at the repo root with no adjacent node_modules, so its
      // one runtime bare import (`@mui/material/styles` in index.ts) can't be
      // resolved from there during the production build. Point the @mui/material
      // subtree at this app's install. (Dev/serve resolves it against the app
      // root already; this makes `vite build` agree.)
      '@mui/material': appDep('@mui/material'),
    },
  },
});
