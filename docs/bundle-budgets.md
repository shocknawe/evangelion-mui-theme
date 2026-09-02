# Bundle budgets

Version-controlled per-export gzip byte budgets for the Phosphor Console
library. This table is the human-readable side of the budget contract; the
machine-checked side is the `limit` field on each entry in
[`.size-limit.js`](../.size-limit.js). **The numbers must be identical in both
places** — when you bump a budget, bump both (bumping the `limit` is the
"budget update" a PR must include to pass the CI size-check).

- **Metric:** gzip bytes (gzip level 9), minified, via `size-limit`
  (`@size-limit/esbuild` + `@size-limit/file`, v13.0.3). Run with `npm run size`.
- **Accounting:** library-authored bytes only. The full accounting rule is
  stated in the `.size-limit.js` header (the normative home) and explained in
  prose in the [shared-runtime accounting](#shared-runtime-accounting) section
  below — that section, not this bullet, is the reference.
- **Enforcement:** CI fails on over-budget growth unless the same PR updates
  the budget entry here and in `.size-limit.js` (Task 5.4).

## Seeding

| Field | Value |
| --- | --- |
| Seeded from | First measurement on this branch (`feat/upgrate-ui-library` @ `460674a`) |
| Date | 2026-09-02 |
| Tool | size-limit 13.0.3, `gzip: true`, peer runtime `ignore`d |

**Seeding rule:** measured gzip bytes rounded up to the next 50-byte step with
at least 5% headroom (at least 10% for entries under 500 B, where a few bytes
of drift matter). Budgets are therefore at or slightly above the first measured
values, not aspirational targets — raise a budget only with a matching PR
explanation.

## Budget table

| Entry | Measured (B, gzip) | Budget (B) | Headroom |
| --- | ---: | ---: | ---: |
| theme | 6112 | 6500 | 6.4% |
| theme/tokens | 938 | 1050 | 12.0% |
| theme/overrides | 3880 | 4200 | 8.2% |
| components | 19972 | 21500 | 7.6% |
| components/chips | 1247 | 1400 | 12.3% |
| components/charts | 2657 | 2950 | 11.0% |
| components/clock | 2188 | 2400 | 9.7% |
| components/feedback | 3220 | 3500 | 8.7% |
| components/flow | 2520 | 2750 | 9.1% |
| components/hooks | 333 | 400 | 20.1% |
| components/inputs | 2507 | 2750 | 9.7% |
| components/layout | 2594 | 2850 | 9.9% |
| components/marquee | 1214 | 1350 | 11.2% |
| components/meters | 4014 | 4400 | 9.6% |
| components/navigation | 3057 | 3350 | 9.6% |
| components/status | 4672 | 5100 | 9.2% |
| components/terminal | 2658 | 2950 | 11.0% |
| components/text | 2179 | 2400 | 10.1% |
| components/util | 374 | 450 | 20.3% |

Entries mirror the published export map in `package.json` (`.`/`theme`,
`./tokens`, `./overrides`, `./components`) plus every per-component module file
in `components/`. `theme` and `components` are the canonical whole-surface
figures; per-file numbers are per-export deltas against the shared code they
pull in (see [shared-runtime accounting](#shared-runtime-accounting)).

## Shared-runtime accounting

The normative statement of this rule lives in the `.size-limit.js` header
comment — a reviewer auditing the budget contract reads it there. This section
is the human explanation and must not drift from it; if the rule changes, edit
the config header first and restate it here.

**The rule: every entry measures *library-authored* bytes only.** Shared
runtime is installed once per consuming app and counted once — in the app, not
in these figures — so no entry can double-count it:

1. **Peer runtime is excluded everywhere.** `react`, `react-dom`,
   `@mui/material` (including deep imports like `@mui/material/Box`),
   `@emotion/*`, and the Emotion cache setup that ships with it are listed in
   the `PEER_RUNTIME` `ignore` array (esbuild `external`, and root
   `peerDependencies` are auto-appended by size-limit). No entry bundles or
   owns a copy of them, so `ThemeProvider` + `CssBaseline` + the theme
   singleton are paid once per app no matter how many exports are used.
2. **The theme singleton is never folded into a component number.**
   `theme/index.ts` is measured as its own entry; no entry in `components/`
   imports it (components read `theme.nerv.*` off the theme object their
   consumer passes to MUI), so there is no hidden `theme` bytes inside a
   component figure.
3. **Per-file entries are standalone bundles, so library-internal shared code
   recurs.** `components/util` and `components/hooks` are bundled into every
   dependent per-file entry rather than being emitted once as a shared chunk.
   That is deliberate: each per-file number is a self-sufficient "what does
   importing only this file cost" figure. The consequence is that **per-file
   numbers are not additive** — summing them over-counts `util`/`hooks` once
   per dependent file.
4. **The JSX transform contributes no bytes.** JSX compiles to
   `react/jsx-runtime`, which matches the `react/*` wildcard and is therefore
   externalized like the rest of React.

**Canonical whole-surface figures:** `theme` (6112 B) and `components`
(19972 B). Read every per-file number as a *per-export delta* — its own code
plus its slice of the shared `util`/`hooks` code — never as a partition of the
barrel total.
