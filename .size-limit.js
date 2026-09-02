/**
 * Size Limit config — per-entry gzip measurement for the Phosphor Console
 * library (`@size-limit/esbuild` + `@size-limit/file`).
 *
 * Metric contract: **gzip** (`gzip: true` on every check; gzip level 9). This
 * is the figure the budget table (Task 5.2) is seeded from — brotli is not the
 * contract here.
 *
 * Shared-runtime accounting (stated in full by Task 5.3): every entry measures
 * *library-authored* bytes only. React, react-dom, @mui/material (including
 * deep imports such as `@mui/material/Box`) and @emotion/* are peer runtime and
 * are marked `ignore` (esbuild `external`) so they are never bundled into any
 * entry. Each entry is bundled in isolation, so the numbers are additive only
 * at the leaf level: tiny shared modules (`components/util`, `components/hooks`)
 * are counted inside every dependent component file's number instead of being
 * reported as a separate shared chunk — use the `components` barrel and
 * `theme` entries as the canonical whole-surface figures, and per-file numbers
 * as per-export deltas against the shared code they pull in.
 *
 * `limit` is intentionally NOT set here: budgets are seeded from these first
 * measurements by Task 5.2 and enforced in CI by Task 5.4. Without a `limit`,
 * size-limit reports sizes and always exits 0.
 *
 * Entries mirror the published export map in `package.json` (`.`/`theme`,
 * `tokens`, `overrides`, `components`) plus every per-component module file in
 * `components/`, so each public surface has its own stable, named number.
 */

// Peer runtime is never counted. Root `peerDependencies` are auto-appended to
// `ignore` by size-limit; these wildcards additionally cover deep imports
// (`@mui/material/Box`, `@mui/material/styles`, `@emotion/styled/…`).
const PEER_RUNTIME = ['@mui/material/*', '@emotion/*', 'react/*', 'react-dom/*', 'scheduler/*']

const entry = (name, path) => ({ name, path, gzip: true, ignore: PEER_RUNTIME })

export default [
  // ---- Theme entries (the Task 1.1 module split) ---------------------------
  entry('theme', 'theme/index.ts'),
  entry('theme/tokens', 'theme/tokens.ts'),
  entry('theme/overrides', 'theme/overrides.ts'),

  // ---- Component library ----------------------------------------------------
  // The published barrel (`phosphor-console-theme/components`).
  entry('components', 'components/index.ts'),

  // Per-component module files — the individually importable units behind the
  // barrel, named `components/<file>`.
  entry('components/chips', 'components/chips.tsx'),
  entry('components/charts', 'components/charts.tsx'),
  entry('components/clock', 'components/clock.tsx'),
  entry('components/feedback', 'components/feedback.tsx'),
  entry('components/flow', 'components/flow.tsx'),
  entry('components/hooks', 'components/hooks.ts'),
  entry('components/inputs', 'components/inputs.tsx'),
  entry('components/layout', 'components/layout.tsx'),
  entry('components/marquee', 'components/marquee.tsx'),
  entry('components/meters', 'components/meters.tsx'),
  entry('components/navigation', 'components/navigation.tsx'),
  entry('components/status', 'components/status.tsx'),
  entry('components/terminal', 'components/terminal.tsx'),
  entry('components/text', 'components/text.tsx'),
  entry('components/util', 'components/util.ts')
]