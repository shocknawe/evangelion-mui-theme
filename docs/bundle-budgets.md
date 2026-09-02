# Bundle budgets

Version-controlled per-export gzip byte budgets for the Phosphor Console
library. This table is the human-readable side of the budget contract; the
machine-checked side is the `limit` field on each entry in
[`.size-limit.js`](../.size-limit.js). **The numbers must be identical in both
places** — when you bump a budget, bump both (bumping the `limit` is the
"budget update" a PR must include to pass the CI size-check).

- **Metric:** gzip bytes (gzip level 9), minified, via `size-limit`
  (`@size-limit/esbuild` + `@size-limit/file`, v13.0.3). Run with `npm run size`.
- **Accounting:** library-authored bytes only — React, react-dom, `@mui/material`
  (including deep imports) and `@emotion/*` are peer runtime and are never
  bundled into any entry. The full accounting rule (shared modules such as
  `components/util` / `components/hooks` counted inside their dependents
  rather than as a separate chunk) is stated in `.size-limit.js` and, in prose
  form, in the shared-runtime accounting note (change
  `upgrade-theme-quality-maturity`, Task 5.3).
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
pull in (see accounting above).