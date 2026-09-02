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
 * Budgets (Task 5.2): every entry carries a byte-precise `limit`, seeded from
 * the first measurement on this branch (`feat/upgrate-ui-library` @ 460674a,
 * 2026-09-02) — the same numbers live in the committed human-readable table
 * `docs/bundle-budgets.md`; keep the two identical when bumping a budget.
 * Seeding rule: measured gzip bytes rounded up to the next 50-byte step with
 * ≥5% headroom (≥10% for entries under 500 B, where a few bytes of drift
 * matter). Bumping a `limit` here is the "budget bump" a CI size-check (Task
 * 5.4) requires from an over-budget PR.
 *
 * Entries mirror the published export map in `package.json` (`.`/`theme`,
 * `tokens`, `overrides`, `components`) plus every per-component module file in
 * `components/`, so each public surface has its own stable, named number.
 */

// Peer runtime is never counted. Root `peerDependencies` are auto-appended to
// `ignore` by size-limit; these wildcards additionally cover deep imports
// (`@mui/material/Box`, `@mui/material/styles`, `@emotion/styled/…`).
const PEER_RUNTIME = ['@mui/material/*', '@emotion/*', 'react/*', 'react-dom/*', 'scheduler/*']

const entry = (name, path, limit) => ({ name, path, gzip: true, limit, ignore: PEER_RUNTIME })

export default [
  // ---- Theme entries (the Task 1.1 module split) ---------------------------
  entry('theme', 'theme/index.ts', '6500 B'),
  entry('theme/tokens', 'theme/tokens.ts', '1050 B'),
  entry('theme/overrides', 'theme/overrides.ts', '4200 B'),

  // ---- Component library ----------------------------------------------------
  // The published barrel (`phosphor-console-theme/components`).
  entry('components', 'components/index.ts', '21500 B'),

  // Per-component module files — the individually importable units behind the
  // barrel, named `components/<file>`.
  entry('components/chips', 'components/chips.tsx', '1400 B'),
  entry('components/charts', 'components/charts.tsx', '2950 B'),
  entry('components/clock', 'components/clock.tsx', '2400 B'),
  entry('components/feedback', 'components/feedback.tsx', '3500 B'),
  entry('components/flow', 'components/flow.tsx', '2750 B'),
  entry('components/hooks', 'components/hooks.ts', '400 B'),
  entry('components/inputs', 'components/inputs.tsx', '2750 B'),
  entry('components/layout', 'components/layout.tsx', '2850 B'),
  entry('components/marquee', 'components/marquee.tsx', '1350 B'),
  entry('components/meters', 'components/meters.tsx', '4400 B'),
  entry('components/navigation', 'components/navigation.tsx', '3350 B'),
  entry('components/status', 'components/status.tsx', '5100 B'),
  entry('components/terminal', 'components/terminal.tsx', '2950 B'),
  entry('components/text', 'components/text.tsx', '2400 B'),
  entry('components/util', 'components/util.ts', '450 B')
]