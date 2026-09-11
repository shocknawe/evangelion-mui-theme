## Why

The NERV/MAGI "Phosphor Console" theme is visually authoritative but has not
been hardened as a *distributable* Material UI library. A deep-research report
on what makes a good MUI library (22 sources, 7 confirmed findings, mid-2026)
surfaces concrete engineering-quality gaps: ad-hoc customization surfaces,
inconsistent component API conventions, no bundle budgets, only ad-hoc
accessibility coverage, no maturity signal, and weak agent-readiness. This
change closes those gaps so the library scores as a professional-grade product
without altering the Phosphor Console visual identity.

## What Changes

- Audit every `components/` component against MUI's slot strategy; add
  `slots`/`slotProps` only where an internal part is realistically replaced.
  Migrate any `*Component/*Props`-style API to slots (**BREAKING** for those
  components after a one-release deprecation).
- Enforce strict API conventions across the library: children-first
  composition, prop-spreading to root, forwarded `ref`, a `classes` prop with a
  `root` key, and single-class CSS specificity so overrides win without
  `!important`.
- Consolidate `theme/tokens.ts` as the single source of truth, export tokens
  and component overrides as separately importable modules, and document a
  shallow-spread (never deep-merge) extension contract.
- Add per-component gzip bundle budgets enforced in CI (size-limit /
  bundlesize), with a checked-in budget table and a stated shared-runtime
  accounting rule.
- Add axe-core audits in CI over rendered examples of every public component;
  map each to its WAI-ARIA pattern; publish known gaps in `docs/a11y.md`; verify
  `prefers-reduced-motion` final-state paths.
- Author a DSAF-style maturity scorecard (`docs/maturity-scorecard.md`, CMM
  L0–L5, 20 categories) with evidence weighting, refreshed per release.
- Raise per-component docs thoroughness (edge cases, performance, customization
  recipes) and ship agent-readiness signals: `llms.txt`, a build-time
  DTCG token export (`dist/tokens.dtcg.json`), and a component `registry.json`.

Non-goals: no change to the visual identity, token values, or custom variants;
no per-file style splitting for tree-shaking; no assumed bundle growth without
CI evidence; no MCP server or Figma Code Connect this phase (roadmap).

## Capabilities

### New Capabilities

- `component-slot-api`: Slot-based (`slots`/`slotProps`) customization surface
  for components with realistically-replaceable internal parts, with variant
  preservation and a deprecation path off any `*Component/*Props` pairing.
- `component-api-conventions`: Uniform component contract — children-first
  composition, prop spreading to root, forwarded refs, `classes` prop with a
  `root` key, and single-class specificity.
- `theme-extension-contract`: `theme/tokens.ts` as single source of truth,
  separately importable tokens vs. overrides, and a documented shallow-spread
  (deep-merge-rejecting) extension path.
- `bundle-budgets`: CI-enforced per-export gzip byte budgets with a
  version-controlled budget table and a stated shared-runtime accounting rule.
- `accessibility-audit`: CI axe-core audits per public component, WAI-ARIA
  pattern mapping, a stated ≥10/11 pass rate, published gap list, and
  reduced-motion verification.
- `maturity-scorecard`: A DSAF-style CMM L0–L5 scorecard across 20 categories
  with evidence weighting, refreshed each release.
- `docs-agent-readiness`: Per-component docs thoroughness plus agent-readiness
  artifacts (`llms.txt`, DTCG token export, component registry manifest) meeting
  a ≥4/5 rubric target.

### Modified Capabilities

<!-- None. No existing specs under openspec/specs/. -->

## Impact

- **Code**: `components/*` (slot/API refactors, ref forwarding, `classes`
  props), `theme/tokens.ts` and `theme/` overrides (module split, flattened
  selectors), `app/` (axe-core test tooling, live-example audits),
  `doc-site/` (expanded docs, `llms.txt`).
- **Build/dist**: new DTCG token codegen (`dist/tokens.dtcg.json`),
  `registry.json` generation, size-limit config + budget table.
- **CI**: new bundle-budget and axe-core gates.
- **Docs**: `theme/README.md` (extension contract), `docs/a11y.md`,
  `docs/maturity-scorecard.md`, `docs/bundle-budgets.json`.
- **Consumers**: `app/` and `doc-site/` must keep working; slot migrations are
  the only breaking surface and are deprecation-gated for one release.
- **Constraints preserved**: single dark scheme, `cssVariables`,
  `defaultMode="dark"`, WCAG 2.1 AA + reduced-motion floor, all token values.
