## Context

The Phosphor Console lives across three surfaces: the MUI v7 theme (`theme/`,
with `theme/tokens.ts` as the token authority), the ~60-component library
(`components/`, imported as `@components`, all reading `theme.nerv.*`), and the
docs/demo surfaces (`app/` Vite demo, `doc-site/` published to GitHub Pages,
`theme/README.md`). Today the visual language is strong but the library is not
packaged or verified to the standard a distributable MUI library is judged by.

A deep-research report (22 sources, mid-2026) produced 7 confirmed findings on
MUI library quality: slot strategy, strict API conventions, single branded
theme extended by spread, bundle budgets, accessibility coverage, maturity
scoring, and docs/agent-readiness. This change is a quality-and-distribution
hardening pass mapped 1:1 onto those findings. It is cross-cutting (touches
theme, components, build, CI, and docs) and introduces new tooling (size-limit,
axe-core, DTCG codegen), which is why it warrants a design doc.

Hard constraints that do not move: single dark scheme, `cssVariables`,
`defaultMode="dark"`, WCAG 2.1 AA + reduced-motion floor, all token values, and
the Phosphor Console visual identity. `app/` and `doc-site/` must keep building.

## Goals / Non-Goals

**Goals:**
- A uniform, MUI-conventional component API (slots where warranted, children,
  prop-spread, forwarded refs, `classes` with a `root` key, flat specificity).
- A single-source-of-truth token module extended only by shallow spread.
- CI gates that make size growth and accessibility regressions visible.
- A repeatable maturity signal and agent-readiness artifacts generated from the
  existing single source of truth.

**Non-Goals:**
- Any change to visual identity, token *values*, or custom variants.
- Per-file component style splitting for tree-shaking (irrelevant with modern
  bundlers).
- Assuming bundle growth without CI evidence.
- Headless restructuring for size (CSS-in-JS overhead treated as negligible).
- MCP server and Figma Code Connect (roadmap, out of scope this phase).

## Decisions

### D1 — Slots only where replacement is a demonstrated need
Add `slots`/`slotProps` (MUI Core convention) only to components with an
internal part a consumer realistically swaps (gauge track/needle, card header,
row leading/trailing). Everything else stays simple-props or composition.
*Why:* "the more freedom, the more bugs" — minimal subcomponent division. We
reject reintroducing `*Component/*Props`; any such pairing is migrated and
deprecation-gated for one release. Alternative (slot-everything) rejected as
bug-surface and DX cost.

### D2 — Classes/specificity: adopt the existing `Nerv*` naming, flatten selectors
Every public component gets a `classes` prop whose root key is `root`; class
shape follows the repo's existing `Nerv*` convention (recorded in the
implementation, not MUI's `MuiXyz-root`, to avoid collisions with real MUI
slots). Override selectors are flattened to a single class so consumer `sx` /
`classes` / theme overrides win without `!important`. Alternative (`MuiXyz-root`
shape) rejected to avoid ambiguity with stock MUI components.

### D3 — Token module split, spread-only extension
`theme/tokens.ts` stays the single source of truth. Export tokens and component
overrides as two separately importable modules so a consumer can pull tokens
without overrides. Document extension as shallow object spread; explicitly ship
*no* deep-merge helper and name deep-merge as an anti-pattern in
`theme/README.md`. *Why:* deep merge adds first-render overhead (MUI guidance).

### D4 — size-limit for bundle budgets, with a stated accounting rule
Use `size-limit` (per-export gzip, byte-precise, CI-friendly) over bundlesize.
Budgets live in a checked-in config/table; CI fails on over-budget unless the
same PR bumps the entry. Shared runtime (theme singleton, Emotion cache) is
counted once under a documented accounting note so per-component numbers aren't
double-counted (resolves report open question #3).

### D5 — axe-core in the `app/` test tooling, driven by live-example routes
Reuse the existing `app/` "live usage example" routes as audit fixtures: each
public component already renders there, so axe-core runs per component in CI.
Map each component to its WAI-ARIA pattern (meter, `progressbar`, `feed`,
`switch`/radio, modal focus) and assert roles/states/keyboard. Target ≥10/11
patterns; publish gaps in `docs/a11y.md`; assert reduced-motion final-state for
at least one path per animated component. *Why:* no new fixture surface to
maintain; audits track real usage.

### D6 — DSAF scorecard with evidence weighting
`docs/maturity-scorecard.md`: CMM L0–L5 across 20 categories (10 system, 10 UX),
each 0–5. Evidence weighting — prose caps at 40, structural artifacts cap at 40,
verification signals add up to 20 — so "a document can read as Defined but never
fake Built." Refreshed each release with deltas. Drives the roadmap backlog.

### D7 — Agent-readiness artifacts generated from source, not hand-authored
- `llms.txt` at the docs-site root indexing curated pages.
- `dist/tokens.dtcg.json` generated at build time from `theme/tokens.ts` (DTCG
  codegen — tokens stay single-source; no parallel hand-maintained copy).
- `registry.json` (name, props summary, tokens used, example route) generated
  from component metadata where feasible.
Target ≥4/5 on the rubric. *Why:* codegen keeps single-source guarantees intact.

## Risks / Trade-offs

- **Slot APIs degrade TypeScript DX (verbose types)** → mirror MUI Core utility
  types rather than raw slot generics; measure DX in `app/`/`doc-site/`; back
  out slots that don't earn their complexity (D1 keeps the set small).
- **Slot migrations are breaking for affected components** → one-release
  deprecation window with functioning old props + notice before removal;
  `app/`/`doc-site/` updated in the same change.
- **ARIA weighting for complex patterns (combobox, menu focus)** → the 10/11
  target may need per-pattern weighting; treat as an open risk, not a blocker.
- **Selector flattening could cause visual regressions** → gate on no-visual-
  regression across `app/` routes (D1/FR-1 scenario) via screenshot check.
- **Agent-readiness is fast-moving (table stakes by 2027)** → track it as a
  scorecard category so the rubric can evolve without re-planning.
- **New CI gates add friction / flakiness** → budgets bump in-PR by design;
  axe-core scoped to deterministic live-example routes to limit flake.

## Migration Plan

1. Land D3 (token module split, README extension contract) — non-breaking,
   unblocks everything downstream.
2. Land D2 (classes prop + flat specificity) and D1 (slots) per component,
   preserving variants; deprecate any `*Component/*Props` pairing.
3. Add D4 (size-limit + budget table) and D5 (axe-core) CI gates once APIs are
   stable, seeding budgets from first measured numbers.
4. Add D7 codegen (DTCG export, `registry.json`, `llms.txt`) and D6 scorecard.
5. Update `app/` and `doc-site/` consumers alongside each step; keep both green.

Rollback: each step is independently revertible; CI gates can be set
non-blocking first, then enforcing, so a bad gate is downgraded without
reverting code.

## Open Questions

- Exact per-pattern ARIA weighting if the flat 10/11 target proves too coarse.
- Whether `registry.json` props summaries can be fully derived from types or
  need a light manual annotation per component.
- Final `size-limit` accounting boundary for the theme singleton vs. per
  component (documented rule to be pinned during D4).
