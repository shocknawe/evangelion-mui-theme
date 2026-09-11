import { defineConfig } from 'tsup';

// Builds the published entry points (`phosphor-console-theme`,
// `…/tokens`, `…/overrides`, `…/components`) from source, emitting ESM +
// `.d.ts` only — this repo's `app/` keeps consuming the raw `theme/` and
// `components/` sources directly (see app/vite.config.ts) for live HMR; this
// build is purely for the published npm artifact.
//
// `tokens` and `overrides` are deliberately separate, side-effect-free entries:
// importing one must never pull in the other (nor the full theme assembly).
export default defineConfig({
  entry: {
    theme: 'theme/index.ts',
    tokens: 'theme/tokens.ts',
    overrides: 'theme/overrides.ts',
    components: 'components/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  // Never bundle the host app's own copies of these — they must stay
  // singletons, and the DataGrid override module is written to compile
  // without the package present.
  external: [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    '@mui/x-data-grid',
    '@emotion/react',
    '@emotion/styled',
  ],
});
