import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Builds the sandbox runtime as a classic (IIFE) script. The preview iframe is
// sandboxed (opaque origin) and loads it via <script src> — classic scripts are
// not CORS-gated, so the opaque-origin document can execute it. Everything
// (React, MUI, the component library) is bundled in: the iframe has no other
// source of modules.
export default defineConfig({
  // Some bundled deps (React/MUI) read `process.env.NODE_ENV`; the browser has
  // no `process`, so pin it to production like the main build does.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/playground/sandbox-runtime.tsx', import.meta.url)),
      name: 'PhosphorSandbox',
      formats: ['iife'],
      fileName: () => 'sandbox-runtime.js',
    },
    outDir: 'dist',
    emptyOutDir: false, // keep the main app build; we only add the runtime
    sourcemap: false,
    minify: true,
  },
  resolve: {
    alias: {
      '@theme': fileURLToPath(new URL('../theme/index.ts', import.meta.url)),
      '@components': fileURLToPath(new URL('../components/index.ts', import.meta.url)),
    },
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
});
