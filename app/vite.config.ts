import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The app consumes the Phosphor Console theme from source (repo root `theme/`),
// so editing a token or override is instantly live here with HMR — no build step.
const themeSrc = (p: string) =>
  fileURLToPath(new URL(`../theme/${p}`, import.meta.url));
const componentsSrc = (p: string) =>
  fileURLToPath(new URL(`../components/${p}`, import.meta.url));
const appDep = (p: string) =>
  fileURLToPath(new URL(`./node_modules/${p}`, import.meta.url));

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
      // The theme and component library live at the repo root with no adjacent
      // node_modules, so their bare imports (`@mui/material/*`, `react`,
      // `react-dom`) can't be resolved from there during the production build.
      // Point those subtrees at this app's install. (Dev/serve resolves them
      // against the app root already; this makes `vite build` agree.)
      '@mui/material': appDep('@mui/material'),
      react: appDep('react'),
      'react-dom': appDep('react-dom'),
    },
  },
});
