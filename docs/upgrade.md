# Upgrade Plan — NERV/MAGI MUI Theme: Quality & Maturity Upgrade

> Prompt for `openspec-propose`. Change-ID: `upgrade-theme-quality-maturity`
> Source: deep research report “What makes a good Material UI library”
> (22 sources, 7 confirmed findings, mid-2026), applied to this repository’s
> Phosphor Console theme (`theme/`), component library (`components/`), and
> docs surfaces (`doc-site/`, `theme/README.md`).

## Proposal

Upgrade the NERV/MAGI Material UI theme library from a visually-authoritative
design system into a **professionally-scorable library** aligned with the seven
confirmed quality findings from the research report:

1. **Findings 1–2 (customization + API conventions).** Audit every component
   in `components/` against MUI’s slot strategy and strict API conventions
   (children-first composition, prop spreading to root, forwarded refs, `classes`
   prop with `root` named `root`, low CSS specificity). Replace any ad-hoc
   `*Component/*Props`-style or non-composable patterns with slot-based APIs
   where replacement-without-rebuild is a real use case — without breaking the
   existing `app/` and `doc-site/` consumers.
2. **Finding 3 (single branded theme, extended by spread).** Consolidate
   `theme/tokens.ts` as the single source of truth, exported separately from
   component overrides, and document + enforce the extension contract: consumers
   extend the theme by **shallow object spread, never deep merge**.
3. **Finding 4 (bundle budgets).** Introduce per-component bundle-size budgets
   recorded in CI (MUI-style byte limits per export), so size growth is
   proportional to features and visible in review.
4. **Finding 5 (accessibility coverage).** Run an axe-core audit across the
   component library and demo screens against the WAI-ARIA patterns each
   component implements; close the gap from ad-hoc toward a stated
   production-grade pass rate, keeping the WCAG 2.1 AA + reduced-motion bar
   from PRODUCT.md as the floor.
5. **Finding 6 (maturity scoring).** Author a DSAF-aligned maturity scorecard
   for the library (CMM-style L0–L5 across system and UX criteria), weighting
   implementation evidence over documentation, and track the score over time.
6. **Finding 7 (docs & agent-readiness).** Raise documentation thoroughness
   (edge cases, performance, customization per component) and add
   agent-readiness signals: an `llms.txt`, a machine-readable token export
   (DTCG), and a component registry manifest.

The Phosphor Console identity (black-only surfaces, mechanical motion, stamps,
bilingual type) is not in scope for change — this upgrade hardens the
**engineering and distribution quality** of the library, not its visual
language. Refuted report claims are explicitly non-goals: we will not split
component styles per-file for tree-shaking, and we assume no unprovoked
bundle-growth problem without CI evidence.

---

## design

### D1. Slot-strategy component audit (Finding 1)

- Inventory every component in `components/` and classify its customization
  surface: `simple-props` (sufficient), `slots` (internal parts replaceable),
  `composition-only` (children layout is the API).
- For components where users plausibly replace an internal part (e.g., a
  gauge’s track/needle, a card’s header, a row’s leading/trailing affordance),
  introduce `slots` + `slotProps` following MUI Core conventions; **do not**
  reintroduce the deprecated `*Component/*Props` pairing.
- Slots are only added where replacement-without-rebuild is a demonstrated
  need — subcomponent division is kept minimal, since “the more freedom, the
  more bugs.”
- Custom variants already present (Button `ghost`/`alt`/`stamp`, Chip `stamp`,
  Paper `chamfer`/`frame`, Typography variants) are preserved and covered by
  the same classes/slots rules; no visual regressions in `app/` routes.

### D2. Strict API conventions (Finding 2)

- **Children-first composition** everywhere; explicit props only where child
  order cannot be permuted.
- Undocumented props spread to the root element; `ref` forwarded to the
  outermost DOM node of every component that renders one.
- Every component accepts a `classes` prop whose keys are stable; the root
  class key is always named `root`; class names use the existing `Nerv*`
  naming convention if present (or adopt MUI’s `MuiXyz-root` shape — decision
  recorded in the implementation spec).
- CSS specificity is kept to a single class where possible (no nested selectors
  in overrides) so consumer overrides win without `!important`.

### D3. Theme extension contract (Finding 3)

- `theme/tokens.ts` remains the single source of truth; tokens and component
  overrides are exported separately so consumers can import one without the
  other.
- The documented extension path is shallow spread:

  ```ts
  const brand = { ...theme, palette: { ...theme.palette, nerv: { ...palette.nerv, brand: '#…' } } };
  ```

  Deep-merge helpers are explicitly **not** offered (per MUI’s guidance:
  deep merge adds first-render performance overhead).
- `theme/README.md` gains a “Extending the theme” section with spread examples
  and a named anti-pattern (“do not deep-merge”).
- Keep `defaultMode="dark"` and `cssVariables` as-is — the single dark schemes
  is a product constraint, not a gap.

### D4. Per-component bundle budgets (Finding 4)

- Add a size-check script (bundlesize / size-limit) that measures each public
  export (`theme`, each `components/*` entry) as gzip bytes.
- Budgets are recorded in a checked-in table (e.g., `docs/bundle-budgets.json`
  or a `size-limit` config) with per-entry limits, mirroring MUI’s CI approach
  (byte-precise, e.g. `31165 B` measured vs `31050 B` limit).
- CI fails when a PR exceeds a budget without an explicit budget bump in the
  same PR, making growth “proportional to new features” and reviewable.
- Shared runtime code (the theme singleton, Emotion cache setup) is accounted
  for once in a stated methodology note, so per-component numbers aren’t
  double-counted (research open question #3 — resolved by documenting the
  accounting rule).

### D5. Accessibility audit & pass rate (Finding 5)

- Add axe-core to the demo app (`app/`) test tooling; every public component
  gets at least one rendered audit in its “live usage example” route.
- Map each component to the WAI-ARIA pattern it implements (meter, gauge-like
  `progressbar`, `feed` for log consoles, `switch`/radio patterns for toggles,
  focus management for `HazardPrompt`/`GateDecisionDialog` modals).
- Target pass rate: state explicitly (recommend ≥ 10/11 of the Radix/React-Aria
  pattern suite where applicable), keeping the existing WCAG 2.1 AA +
  reduced-motion floor. Known-gap list is published in `docs/a11y.md` rather
  than left implicit.
- Reduced-motion paths (`prefers-reduced-motion` final-state rendering) are
  checked as part of the audit, not just documented.

### D6. Maturity scorecard (Finding 6)

- Author `docs/maturity-scorecard.md` using a DSAF-style rubric: CMM L0–L5
  levels (Ad-hoc → Optimising) across ~20 categories (10 system: tokens,
  component API, theming, a11y, perf, CI budgets, versioning, tests…; 10 UX:
  docs coverage, edge cases, examples, onboarding, motion guidance…).
- Each criterion scored 0–5 with **evidence weighting**: prose mentions cap at
  40, structural artifacts (files/CI configs that exist) cap at 40,
  verification signals (tests, audits, measured numbers) cap at 20 — “a
  document can read as Defined but never fake Built.”
- The scorecard is refreshed per release and drives the roadmap backlog.

### D7. Docs thoroughness & agent-readiness (Finding 7)

- `doc-site/` and `theme/README.md` expanded to cover edge cases, performance
  notes, and customization recipes per component (the “unusually thorough”
  bar).
- Agent-readiness signals (0–5 rubric from the report):
  - `llms.txt` at the docs-site root listing curated, LLM-consumable pages.
  - A DTCG-format token export generated from `theme/tokens.ts`
    (`dist/tokens.dtcg.json`, build-time codegen — tokens stay single-source).
  - A component registry manifest (`registry.json`: name, props summary,
    tokens used, example route) suitable for tooling/agents.
  - MCP server and Figma Code Connect are recorded as out-of-scope for this
    proposal (tracked on the roadmap).
- Target: score 4/5 on the agent-readiness rubric (report scores MUI itself
  at 2/5).

### Non-goals (from refuted claims & caveats)

- No per-file component style splitting for bundle size (tree-shaking makes it
  irrelevant).
- No assumption of unprovoked bundle growth from dependency updates; growth
  claims require CI evidence (D4 numbers).
- No claim that headless restructuring is needed for size; CSS-in-JS overhead
  is treated as negligible.
- Visual identity, token values, and component variants are unchanged.
- The deep-research open questions (ARIA weighting for complex patterns,
  slots TypeScript-DX quantification) are noted as open risks, not blocked on.

---

## requirements

### Requirement: Slot-based customization API (FR-1)

WHEN a component in `components/` has an internal part that consumers
realistically replace (track, header, leading/trailing affordance), THEN the
library SHALL expose that part via `slots` and `slotProps` following MUI Core
conventions.

WHEN a component’s customization need is satisfied by simple props or children
composition, THEN the library SHALL NOT introduce slots for that component.

IF a component previously exposed internal parts through a
`*Component/*Props`-style API, THEN the upgrade SHALL migrate it to
`slots`/`slotProps` and mark the old API deprecated for one release before
removal.

WHEN slot APIs are added, THEN the library SHALL preserve all existing custom
variants (Button `ghost`/`alt`/`stamp`, Chip `stamp`, Paper `chamfer`/`frame`)
with no visual regression in `app/` demo routes.

### Requirement: Strict component API conventions (FR-2)

The library SHALL use children as the primary composition method for every
component in `components/`.

WHEN a component receives a prop it does not declare, THEN the component SHALL
spread that prop to its root element.

The library SHALL forward `ref` to the outermost rendered DOM element on every
component that renders a DOM element.

The library SHALL accept a `classes` prop on every public component, with the
root class key always named `root`.

WHILE component or theme styles use selector nesting deeper than a single
class, THEN the upgrade SHALL flatten them so consumer overrides do not
require `!important`.

### Requirement: Single branded theme with spread-only extension (FR-3)

The library SHALL keep `theme/tokens.ts` as the single source of truth for
every color, size, and timing value (no hardcoded off-token values).

The library SHALL export tokens and component overrides as separately
importable modules.

WHEN a consumer creates an app theme, THEN the documented extension path SHALL
be shallow object spread of the base theme.

IF a proposed change introduces a deep-merge function for theme extension,
THEN the change SHALL be rejected and documented as an anti-pattern in
`theme/README.md`.

WHERE theme documentation exists, THEN it SHALL include at least one runnable
spread-extension example and one named deep-merge anti-pattern.

### Requirement: Per-component bundle budgets in CI (FR-4)

The library SHALL measure the gzip byte size of every public export (theme and
each component entry) via a CI size-check (bundlesize or size-limit).

The library SHALL store per-export byte budgets in a version-controlled
budget table committed in the repository.

WHEN a pull request changes an export’s measured size beyond its budget,
THEN CI SHALL fail unless the same pull request also updates the budget entry.

WHILE shared runtime code is counted in component measurements, THEN the
accounting method SHALL be stated in the budget config so shared code is not
double-counted.

### Requirement: Accessibility audit with stated pass rate (FR-5)

The library SHALL run axe-core audits in CI against rendered examples of every
public component in `app/`.

WHEN a component implements a recognized WAI-ARIA pattern, THEN the library
SHALL map that component to the pattern and audit against the pattern’s
required roles, states, and keyboard behavior.

The library SHALL meet a stated WAI-ARIA pattern pass rate of at least 10 of
11 applicable patterns, in addition to the existing WCAG 2.1 AA bar.

WHERE a known accessibility gap remains, THEN the library SHALL publish it in
`docs/a11y.md` with severity and planned remediation.

WHEN `prefers-reduced-motion` is active, THEN every animated state SHALL
render its final state, and the audit SHALL verify at least one such path per
animated component.

### Requirement: Maturity scorecard (FR-6)

The library SHALL maintain a DSAF-style maturity scorecard in
`docs/maturity-scorecard.md` with CMM-style levels L0–L5 across 20 categories
(10 system, 10 UX), each criterion scored 0–5.

WHILE a criterion is supported only by prose claims, THEN its evidence score
SHALL be capped at 40 points.

WHILE a criterion is supported by structural artifacts present in the
repository, THEN its evidence score SHALL be capped at 40 points.

WHEN verification signals (CI checks, measured audits, passing tests) exist
for a criterion, THEN up to 20 additional evidence points SHALL be awarded.

WHEN a release is cut, THEN the scorecard SHALL be refreshed in the same
change and score deltas recorded.

### Requirement: Documentation and agent-readiness (FR-7)

WHERE a public component exists, THEN its documentation SHALL cover edge
cases, performance notes, and at least one customization recipe.

The library SHALL publish an `llms.txt` at the docs-site root indexing
curated LLM-consumable documentation.

The library SHALL generate a DTCG-format token export from `theme/tokens.ts`
at build time, publishing it as `dist/tokens.dtcg.json`.

The library SHALL publish a component registry manifest (`registry.json`)
listing every public component’s name, props summary, tokens consumed, and
example route.

The library SHALL achieve an agent-readiness score of at least 4 of 5 on the
report’s rubric (llms.txt + DTCG tokens + registry required; MCP server and
Figma Code Connect optional this phase).

---

## open risks / questions

- ARIA weighting for complex patterns (combobox, menu focus management) —
  report open question #1; the 10/11 target may need per-pattern weighting.
- TypeScript DX of new slot APIs (type verbosity) — if slot typing measurably
  degrades DX in `app/`/`doc-site/`, prefer utility types mirroring MUI Core
  rather than raw slot generics.
- Agent-readiness is a fast-moving dimension (by 2027 it may be table stakes) —
  the scorecard (FR-6) should track it as a category so the rubric can evolve.
