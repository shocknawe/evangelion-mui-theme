import { defineConfig } from 'tsup';

// Builds the two published entry points (`phosphor-console-theme` /
// `phosphor-console-theme/components`) from source, emitting ESM + `.d.ts`
// only — this repo's `app/` keeps consuming the raw `theme/` and `components/`
// sources directly (see app/vite.config.ts) for live HMR; this build is purely
// for the published npm artifact.
export default defineConfig({
  entry: {
    theme: 'theme/index.ts',
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
