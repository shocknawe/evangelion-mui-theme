import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
//
// The CSP is injected at build time only — dev HMR needs inline scripts and a
// websocket, which a strict policy would break. `script-src 'self'` keeps the
// playground's compiled snippets (which run in a sandboxed iframe, a separate
// document) from ever loading external scripts into the doc-site itself.
//
// The sandboxed preview iframe inherits this CSP, and its opaque origin means
// 'self' matches nothing there — so the sandbox runtime (a classic script from
// the parent origin) is allowlisted by its SHA-256 hash instead. The runtime is
// built by `npm run sandbox` in prebuild, before this build runs.
const runtimePath = fileURLToPath(new URL('./public/sandbox-runtime.js', import.meta.url));
let runtimeHash = '';
try {
  const content = readFileSync(runtimePath);
  runtimeHash = `'sha256-${createHash('sha256').update(content).digest('base64')}'`;
} catch {
  // Runtime not built yet — the CSP simply won't allow it; prebuild always builds it.
}
const CSP = [
  "default-src 'self'",
  `script-src 'self' ${runtimeHash}`.trim(),
  "style-src 'self' 'unsafe-inline'", // MUI/emotion inject <style> tags
  "img-src 'self' data:",
  "connect-src 'self'",
  "font-src 'self'",
  "frame-src 'self'", // the sandboxed preview iframe (same-origin sandbox.html)
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.DOCS_BASE ?? '/') : '/',
  plugins: [
    react(),
    {
      name: 'inject-csp',
      transformIndexHtml(html, ctx) {
        if (ctx.server) return html; // dev: no CSP (HMR)
        return {
          html,
          tags: [
            {
              tag: 'meta',
              attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
  ],
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
