# Maturity Scorecard — NERV/MAGI MUI Theme

> DSAF-style CMM scorecard for the Phosphor Console library (`theme/`,
> `components/`, `app/`, `doc-site/`). Implements requirement FR-6 /
> capability `maturity-scorecard` from
> `openspec/changes/upgrade-theme-quality-maturity/`. See `design.md` D6 for
> rationale and `docs/upgrade.md` for the source research mapping.
>
> The model (§1–§2) was authored in task 8.1; **task 8.2 scored the current
> state** — every category below carries a `Score:` line with its evidence mix
> (prose + structural + verification) and the level that mix supports, and §6
> holds the current-state summary and the verification runs behind it.
> **Task 8.3 recorded that scoring as the baseline and wired the per-release
> refresh** (§8): the baseline lives in `docs/maturity-history.md` with the
> delta log, and each release refreshes §5 and appends its deltas there.
> Scoring date: **2026-09-02**, branch `feat/upgrate-ui-library` @
> `cd3e373` (first refresh — no prior baseline exists).

## 1. The L0–L5 model

Six CMM-style levels, scored 0–5 (score number == level number). Levels are
generic across all 20 categories; each category's per-level criteria (§3–§4)
say what "reaching" that level concretely means for that category.

| Level | Name | Meaning |
| --- | --- | --- |
| L0 | Absent | Not addressed. No artifact, no documentation, no evidence. |
| L1 | Ad-hoc | Exists inconsistently, informally, or in one place only; no stated convention. |
| L2 | Emerging | A stated convention or partial coverage exists but is incomplete or unverified. |
| L3 | Defined | A documented, structurally complete implementation exists across the library. |
| L4 | Managed | Defined-level work is enforced and verified (CI checks, tests, measured audits) in the current review cycle. |
| L5 | Optimising | Managed-level evidence has held — or improved — across multiple consecutive scorecard refreshes, with no regressions. |

## 2. Scoring methodology (evidence weighting)

Per FR-6 (`specs/maturity-scorecard/spec.md`), each category's evidence is
weighted, not self-reported, so a well-written paragraph can't outscore a
working implementation:

1. **Prose evidence (0–40 points)** — documented intent, requirements, usage,
   and ownership. Prose contributes no more than **40 points**.
2. **Structural evidence (0–40 points)** — repository artifacts such as
   source files, generated manifests, checked-in configuration, and
   implemented behavior. Structural artifacts contribute no more than **40
   points**.
3. **Verification evidence (0–20 points)** — CI checks, measured audits, or
   passing tests that demonstrate the structural artifacts work as claimed.
   Verification contributes **up to 20 additional points**.

The three evidence dimensions are additive: `prose + structural +
verification`, for a maximum of 100 points per category. Award points only for
evidence that is present and relevant; do not award the same evidence item
twice within a dimension. Prose alone therefore remains capped at 40, while a
fully documented, implemented, and verified category can reach 100. This is
the D6 guardrail that prevents a document from standing in for a built and
verified system.

### 2.1 Evidence points → level (defined in task 8.2)

§2 above fixes the *caps*; this section fixes the **conversion** so a score is
reproducible. It has two steps, applied uniformly to all 20 categories.

**Step 1 — evidence total selects a band:**

| Evidence total (P + S + V) | Band |
| --- | --- |
| 0–9 | L0 |
| 10–29 | L1 |
| 30–49 | L2 |
| 50–69 | L3 |
| 70–89 | L4 |
| 90–100 | L5 |

**Step 2 — guards constrain the band.** The score is the band level *unless* a
guard demotes it. Four guards, all mechanical:

- **G1 — prose-only cap (from the spec).** With `structural == 0` and
  `verification == 0`, the total is ≤ 40, which already lands in the L0–L2
  bands: a prose-only category can never be scored above **L2**. (Vocabulary
  note: the spec's scenario says a prose-only criterion "cannot reach
  'Built'"; 'Built' corresponds to this scorecard's **Emerging (L2)** —
  prose alone can define, never manage.)
- **G2 — verification gates.** A category in the L4 band (70–89) must have
  `verification ≥ 10` and `structural ≥ 30` to keep L4; otherwise it drops to
  L3. L5 additionally requires `verification ≥ 15`.
- **G3 — longevity gate (L5 unreachable today).** L5's own meaning (§1) is
  evidence held across ≥ 2 consecutive refreshes. This scorecard has been
  scored exactly once, so **no category can score L5 in this refresh** —
  90–100 totals are recorded, but the level is capped at L4 until a second
  refresh confirms it.
- **G4 — criteria floor (the honesty clause).** Points buy the band, but the
  band level is only awarded if the category's own written criterion for that
  level (§3–§4) is also satisfied. If it is not, the score is the *highest
  level whose criteria are fully satisfied* — never the band. This is what
  keeps a strong 85-point category that lacks CI enforcement at L3 instead of
  an inflated L4.

So each category records: `prose + structural + verification = total (band;
guard that demotes it, if any) → level`.

**Worked example (S3 Component API Conventions):** prose 30 (conventions
documented in `components/README.md` + notes 3.1–3.4) + structural 40 (all 59
public components children-first / prop-spread / ref-forwarding / `classes`
with a `root` key, verified in `registry.json`) + verification 15 (61
per-component assertions in `app/src/api/api-conventions.test.tsx`, green) =
**85 → band L4**. G2 passes (15 ≥ 10, 40 ≥ 30), but G4 demotes: the L4
criterion requires those tests to *run in CI*, and no CI workflow runs them →
**L3**.

## 3. System categories (10)

Engineering/technical maturity — tokens, API, build, and CI.

### S1. Design Token Architecture
**Score: 3** — prose 30 + structural 35 + verification 10 = **75** (band L4;
G4 demotes) → **L3**.
- *Prose 30:* `theme/README.md` documents tokens as the single source; `DESIGN.md`
  token spec; `docs/upgrade.md` mapping.
- *Structural 35:* `theme/tokens.ts` (75 tokens / 13 groups) is the single
  source; tokens, overrides and theme ship as separately importable modules
  (`./tokens`, `./overrides`, `.`); `theme/augmentation.ts` types every token.
- *Verification 10:* the Task 1.2 off-token audit ran once (~140 findings
  reviewed, 17 violations fixed, post-fix grep clean) — a measured audit, but
  manual and one-shot.
- *Why not L4:* the audit is not a repeatable CI check that fails the build on a
  stray value — it is a note and a grep a human must re-run. Raise: CI-ify the
  1.2 grep (fail on hex/`rgba`/ms outside `tokens.ts`).
- **L0** No dedicated token module; colors/sizes/timings are hardcoded ad hoc.
- **L1** A token file exists but is incomplete or duplicated; off-token values remain elsewhere.
- **L2** A single token module covers most values, but tokens and component overrides are not separately importable.
- **L3** `theme/tokens.ts` is the documented single source of truth; tokens and overrides ship as separately importable modules; an off-token-value audit has been run once.
- **L4** The off-token-value audit is a repeatable, CI-run check that fails the build on a stray value.
- **L5** Zero off-token violations across ≥2 consecutive refreshes.

### S2. Theming & Extension Contract
**Score: 3** — prose 35 + structural 30 + verification 5 = **70** (band L4;
G4 demotes) → **L3**.
- *Prose 35:* `theme/README.md` §"Extending the theme" gives a runnable
  shallow-spread example and names the deep-merge anti-pattern with the MUI
  `createTheme(base, patch)`-is-deepmerge caveat.
- *Structural 30:* no deep-merge helper is exported (grep-verified, note 1.4);
  `theme` is a plain object; `app/` and `doc-site/` consume the pattern for real
  (the doc-site component-page recipe uses `GlobalStyles` specifically because a
  spread would drop the built-in cssBaseline override).
- *Verification 5:* typecheck/build green across `theme/` + `app/` +
  `doc-site/`; the doc-site recipe's deepmerge claim was verified against
  `@mui/utils/deepmerge`. No automated check for the rule itself.
- *Why not L4:* no grep/lint check enforces the no-deep-merge rule before
  release. Raise: a lint rule (or CI grep) banning `deepmerge`/spread-merge of
  the theme object.
- **L0** No documented way to extend the theme.
- **L1** An extension pattern is used informally in one place, undocumented.
- **L2** `theme/README.md` mentions extension but without a runnable example or a stance on deep-merge.
- **L3** A shallow-spread extension example is documented, a deep-merge anti-pattern is explicitly named, and no deep-merge helper is exported.
- **L4** The no-deep-merge rule is checked (grep/lint) before release, and `app/`/`doc-site/` demonstrate the pattern as a real consumer.
- **L5** The contract has shipped unchanged and violation-free across ≥2 refreshes.

### S3. Component API Conventions
**Score: 3** — prose 30 + structural 40 + verification 15 = **85** (band L4;
G4 demotes) → **L3**. Worked example in §2.1.
- *Prose 30:* conventions documented in `components/README.md`, the 2.3 naming
  decision, and notes 3.1–3.4.
- *Structural 40:* all 59 public components carry children-first composition,
  root prop spread, ref forwarding, and a `classes` prop with a `root` key —
  59/59 in `registry.json` (`classes` key list, `WithRef` extends, root key).
- *Verification 15:* 61 per-component assertions in
  `app/src/api/api-conventions.test.tsx` with a fail-closed fixture map (a new
  export without a fixture fails to compile); green at scoring time.
- *Why not L4:* the suite does not run in CI — only the bundle-budget workflow
  exists. Raise: run `src/api` + `src/a11y` in CI on every PR.
- **L0** Components mix arbitrary prop shapes; no shared convention for composition, refs, or prop-spreading.
- **L1** A few components follow children-first/prop-spread/ref-forwarding conventions; no `classes` prop anywhere.
- **L2** Conventions are followed on most components but inconsistently.
- **L3** Every public component uses children as the primary composition method wherever content order is permutable, spreads undeclared props to root, forwards `ref` to the outermost DOM node, and exposes a `classes` prop with a `root` key.
- **L4** Compliance is asserted by automated tests per component and runs in CI.
- **L5** Zero convention regressions across ≥2 refreshes; enforced as a merge gate.

### S4. Slot-Based Customization API
**Score: 3** — prose 30 + structural 35 + verification 5 = **70** (band L4;
G4 demotes) → **L3**.
- *Prose 30:* note 2.2 is the adjudication record (6 candidates kept, 6 dropped
  with the reason each was dropped); the doc-site CUSTOMIZE section documents
  the slot point per component.
- *Structural 35:* `slots`/`slotProps` implemented via `resolveSlot`/`SlotsOf`
  (`components/util.ts`) on exactly the 6 kept candidates (GateRow, RoutineRow,
  TagInput, FilterRail, SiteHeader, RadialGauge); no legacy `*Component/*Props`
  pairing ever existed, so the migration requirement is met vacuously.
- *Verification 5:* the registry generator (build-time) confirms the slot
  surface matches source, and typecheck holds — but no test exercises a slot
  *replacement* end to end.
- *Why not L4:* slot coverage is not asserted against the candidate inventory in
  tests/CI, and there is no deprecated API to warn on (nothing to verify there).
  Raise: a per-candidate test that swaps each slot and asserts the swap landed.
- **L0** No slot API; internal parts can only be replaced by forking the component.
- **L1** One-off `*Component`/`*Props`-style overrides exist for a couple of components, undocumented.
- **L2** Slot candidates are identified/documented but `slots`/`slotProps` are not yet implemented.
- **L3** `slots`/`slotProps` (MUI Core convention) are implemented for every identified slot-candidate component; any legacy `*Component/*Props` pairing is deprecated with a working fallback.
- **L4** Slot coverage is verified against the slot-candidate inventory in tests/CI, and deprecated APIs carry an active warning with a removal date.
- **L5** Stable and warning-free across ≥2 refreshes; legacy props fully removed on schedule.

### S5. CSS Specificity & Override Safety
**Score: 3** — prose 30 + structural 35 + verification 12 = **77** (band L4;
G4 demotes) → **L3**.
- *Prose 30:* note 3.5 records the flattening convention; `DESIGN.md`
  elevation=none; the doc-site recipe states the one-class-override contract.
- *Structural 35:* theme and component override selectors are flattened to
  single-class specificity; the only `!important` in the library is the
  sanctioned global reduced-motion reset in `theme/components/cssBaseline.ts`
  (grep-verified at scoring time); zero `Nerv*` descendant selectors.
- *Verification 12:* the Task 4.3 screenshot + computed-style sweep across all
  6 `app/` routes (plus a /tmp harness for the 6 variants no route renders
  directly — see §6 defect 6 for the direct-vs-indirect split)
  confirmed consumer overrides win and caught one real defect (the unparsable
  `steps(1, jump-none)` shorthand, since fixed). One-time and manual, not a
  repeatable gate.
- *Why not L4:* the L4 criterion wants a *pre-release* visual-regression check
  across every `app/` route; what exists is one manual pass recorded in a note.
  Raise: an automated per-route screenshot diff in CI.
- **L0** Overrides commonly require `!important`; selector nesting is deep and unpredictable.
- **L1** A few components use flat single-class selectors; most still nest.
- **L2** Flattening is in progress against a documented target convention, partial coverage.
- **L3** All component and theme override selectors are flattened to single-class specificity; consumer `sx`/`classes`/theme overrides win without `!important`.
- **L4** A visual-regression check confirms no regressions from flattening across every `app/` route, run before release.
- **L5** Zero `!important` overrides needed and zero visual regressions across ≥2 refreshes.

### S6. Accessibility Conformance
**Score: 3** — prose 30 + structural 40 + verification 15 = **85** (band L4;
G4 demotes) → **L3**.
- *Prose 30:* `docs/a11y.md` (regenerated numbers, severity registry,
  remediation plans) + `DESIGN.md`/`PRODUCT.md` WCAG 2.1 AA bar.
- *Structural 40:* `app/src/a11y/` — `aria-patterns.ts` maps all 59 components
  to 11 APG patterns with declared gaps that must currently fail;
  `coverage.ts` enforces 59/59 audited examples at test time; `axe-config.ts`
  gates on critical/serious; the reduced-motion inventory is fail-closed.
- *Verification 15:* 4 files / 99 tests green at scoring time (axe route
  audits, 10/11 WAI-ARIA patterns ≥ the 10/11 bar, reduced-motion 26/26).
- *Why not L4:* nothing runs in CI (the "fails CI" gate in `docs/a11y.md` is
  enforced only if a human or future workflow runs the suite); axe
  `color-contrast` is disabled for jsdom reasons, so contrast is unmeasured;
  16 moderate findings are open. Raise: wire the a11y suite into CI, add a
  real-browser contrast pass (Playwright).
- **L0** No accessibility testing; WCAG/ARIA conformance is unverified.
- **L1** Manual/spot-check accessibility review only; no mapped WAI-ARIA patterns.
- **L2** Some components are mapped to WAI-ARIA patterns and manually reviewed; no automated audit.
- **L3** axe-core audits run against every public component's live-example route; components are mapped to their WAI-ARIA pattern; known gaps are published in `docs/a11y.md`.
- **L4** Audits run in CI on every PR and gate merges; pass rate is ≥10/11 applicable WAI-ARIA patterns; reduced-motion final-state is verified per animated component.
- **L5** Pass rate held or improved with zero regressions across ≥2 refreshes; gap list is empty or fully time-boxed.

### S7. Performance & Bundle Budgets
**Score: 4** — prose 30 + structural 40 + verification 18 = **88** (band L4;
no guard trips) → **L4**. The only L4 today.
- *Prose 30:* `docs/bundle-budgets.md` states the metric (gzip L9), the seeding
  rule, and restates the accounting rule without drifting from it.
- *Structural 40:* `.size-limit.js` measures 19 per-export gzip entries with a
  byte-precise `limit` on each; the budget table is version-controlled and
  mirror-checked against the config; the shared-runtime accounting rule is
  normative in the config header.
- *Verification 18:* `.github/workflows/size-limit.yml` runs `npm run size` on
  every PR (blocking) — the one CI gate that exists; Task 5.4 verified both the
  fail and pass paths; `npm run size` green at scoring time (all 19 entries
  under budget, 6–20% headroom).
- *Why not L5:* G3 — first refresh, no multi-refresh history. Raise: hold the
  budgets across the next refresh (then L5 needs only the history).
- **L0** No bundle-size measurement; sizes unknown.
- **L1** Bundle size is checked manually/occasionally, not recorded.
- **L2** A size-check tool is configured but budgets are not codified per export.
- **L3** `size-limit` measures gzip bytes for the theme and every component export; a version-controlled budget table exists with a stated shared-runtime accounting rule.
- **L4** CI fails PRs that exceed budget unless the same PR bumps the entry; both fail and pass paths are verified.
- **L5** Budgets held (or deliberately, reviewably raised) with no unexplained regressions across ≥2 refreshes.

### S8. Automated Test Coverage
**Score: 3** — prose 25 + structural 35 + verification 12 = **72** (band L4;
G4 demotes) → **L3**.
- *Prose 25:* notes 3.6 / 6.1–6.3 document what each suite asserts and why the
  fixtures are fail-closed; `docs/a11y.md` ties numbers to runs.
- *Structural 35:* 4 files / 99 tests — 61 API-convention, 16 aria-pattern,
  7 axe, 15 reduced-motion — all driven by fail-closed coverage/fixture maps
  that fail when a component is added without coverage.
- *Verification 12:* green at scoring time (`npx vitest run src/a11y src/api`,
  99/99); coverage spans every public component.
- *Why not L4:* the suite runs only when someone runs it — no CI workflow, so
  it cannot block a merge. Raise: a `test.yml` workflow (typecheck + vitest)
  on PRs.
- **L0** No automated tests beyond manual QA.
- **L1** A handful of ad-hoc tests exist for select components.
- **L2** Tests cover some components' rendering but not API-convention behavior (props, refs, classes).
- **L3** Tests assert prop-spread, ref-forwarding, and `classes` application per component, alongside a11y/pattern tests.
- **L4** The suite runs in CI on every PR and blocks merges on failure; coverage spans every public component.
- **L5** Suite has run green across ≥2 refreshes with coverage maintained as components are added.

### S9. CI Quality Gates & Versioning Discipline
**Score: 2** — prose 15 + structural 15 + verification 10 = **40** (band L2;
no guard trips) → **L2**. Lowest system category.
- *Prose 15:* the budget and a11y docs state gate *intent*, but there is no
  release/versioning policy anywhere (no CHANGELOG, no versioning section in
  any README).
- *Structural 15:* exactly two workflows — `size-limit.yml` (PR gate) and
  `deploy-doc-site.yml` (publish). No typecheck, test, a11y, or build gate;
  no CHANGELOG; versioning is a single `0.1.0` field with `prepublishOnly:
  npm run build`.
- *Verification 10:* the size gate is real and Task 5.4 verified both paths;
  the deploy workflow exists. That is the whole verified surface.
- *Why not L3:* the L3 criterion wants build + typecheck + tests + a11y +
  bundle gates and a stated versioning scheme with a changelog — one gate out
  of five exists and there is no changelog. Raise: add a CI workflow chaining
  typecheck → vitest → size; add a CHANGELOG and a stated versioning scheme.
- **L0** No CI; releases are manual and undocumented.
- **L1** CI runs build/lint only; no quality gates beyond compilation.
- **L2** Some CI gates exist, but the full set does not (bundle/a11y/test coverage is incomplete).
- **L3** CI includes build, typecheck, tests, accessibility (S6), and bundle-budget (S7) gates; versioning follows a stated scheme with a changelog.
- **L4** All gates are blocking on the default branch; releases are cut only when every gate is green.
- **L5** Zero bypassed gates across ≥2 refreshes.

### S10. Agent-Readiness & Machine-Readable Artifacts
**Score: 3** — prose 25 + structural 40 + verification 12 = **77** (band L4;
G4 demotes) → **L3**. (Matches the 4/5 rubric in
`notes/7.5-agent-readiness-rubric.md`.)
- *Prose 25:* `theme/README.md` documents the three artifacts and how to
  regenerate them; the 7.5 note is the rubric evidence record.
- *Structural 40:* all three exist and are generated from source —
  `doc-site/public/llms.txt` (83 links / 16 sections, every component page),
  `dist/tokens.dtcg.json` (75 tokens, DTCG `$type`/`$value` from
  `theme/tokens.ts` only), `registry.json` (59/59 components with props,
  classes keys, tokens, example route).
- *Verification 12:* the 7.5 freshness check regenerated both tracked artifacts
  byte-identically; `npm run build` (codegen chain) green at scoring time.
- *Why not L4:* generation happens in the npm `build` script, not in CI — no
  workflow builds the package or verifies drift. Known caveat scored inside the
  structural number: `StepFlow` has `exampleRoute: null` (58/59) and
  `app/src/a11y/coverage.ts` is stale about it. Raise: run codegen + drift check
  in CI.
- **L0** No machine-readable artifacts describing the library; docs are prose-only.
- **L1** One artifact exists informally (e.g. a hand-written token list) and is not generated from source.
- **L2** `llms.txt` or a token export exists but is incomplete or hand-maintained (drift risk).
- **L3** `llms.txt` indexes curated docs, `dist/tokens.dtcg.json` is generated at build time from `theme/tokens.ts`, and `registry.json` lists every component's name, props summary, tokens used, and example route.
- **L4** All three artifacts are generated in CI on every build and verified against source (no drift); rubric score ≥4/5.
- **L5** Artifacts shipped drift-free across ≥2 refreshes and are consumed by at least one downstream tool/agent workflow.

## 4. UX categories (10)

Consumer-facing maturity — docs, onboarding, motion, identity.

### U1. Documentation Coverage & API Reference
**Score: 3** — prose 35 + structural 30 + verification 8 = **73** (band L4;
G4 demotes) → **L3**.
- *Prose 35:* every one of the 59 component pages carries intro, WHEN TO USE IT
  (59), EDGE CASES (62/62 entries incl. helpers), PERFORMANCE (62/62) and a
  CUSTOMIZE recipe (Task 7.4).
- *Structural 30:* the API table, class keys and recipe are generated from
  source (`doc-site/src/generated/site-data.json` + `registry.tsx` meta), so the
  prop surface cannot drift; `llms.txt` indexes all 59 pages.
- *Verification 8:* doc-site build green at scoring time; llms.txt link
  generation checked. No accuracy review has ever run against a release
  (there have been none), and `registry.json` does not link the doc pages.
- *Why not L4:* no per-release accuracy review, and the docs are cross-linked
  from `llms.txt` but not from `registry.json`. Raise: add a docs link to each
  registry entry and review doc accuracy on the first release.
- **L0** No per-component documentation beyond source code.
- **L1** A handful of components have a short description; most are undocumented.
- **L2** Most components have basic prop documentation; edge cases and performance notes are largely absent.
- **L3** Every public component's docs cover edge cases, performance notes, and at least one customization recipe.
- **L4** Docs are reviewed for accuracy on every release and cross-linked from `registry.json`/`llms.txt`.
- **L5** Docs stayed complete and accurate (no reported gaps) across ≥2 refreshes.

### U2. Onboarding & Getting-Started Experience
**Score: 3** — prose 35 + structural 25 + verification 8 = **68** (band L3;
no guard trips) → **L3**.
- *Prose 35:* `theme/README.md` install → `ThemeProvider`/`defaultMode` →
  first component, plus the extension section; `doc-site` GettingStarted page;
  `app/README.md` dev/build instructions.
- *Structural 25:* the runnable path exists in-repo — a published export map
  (`./theme`, `./tokens`, `./overrides`, `./components`), a demo app that
  mounts the theme from source, and a docs site.
- *Verification 8:* root + doc-site builds and all three typechecks green at
  scoring time. No fresh-clone smoke test has been performed (Task 9.1 is
  open), so "install works from a clean checkout" is unverified.
- *Raise to L4:* run the fresh-clone smoke (`npm install && npm run dev` in
  `app/`) as part of a release checklist.
- **L0** No install/quick-start instructions.
- **L1** A minimal install snippet exists; no working end-to-end example.
- **L2** `theme/README.md` Install/Use sections exist but assume prior MUI knowledge.
- **L3** A first-run path (install → `ThemeProvider` → first component) is documented and runnable within minutes.
- **L4** Onboarding is verified by a fresh-clone smoke test (`app/` `npm install && npm run dev`) run before each release.
- **L5** Onboarding stayed friction-free (no reported blocker) across ≥2 refreshes.

### U3. Live Examples & Interactive Demos
**Score: 2** — prose 25 + structural 30 + verification 12 = **67** (band L3;
G4 demotes) → **L2**.
- *Prose 25:* `app/` is the live design-system gallery; the doc-site adds a
  live playground per component page.
- *Structural 30:* 58/59 public components have a live `app/` example route
  (`registry.json`); `StepFlow` has `exampleRoute: null` — no `app/` page
  renders it, and `app/src/a11y/coverage.ts` wrongly claims `/dashboard-02`.
- *Verification 12:* axe audits + pattern fixtures run against the 6 example
  routes (99 tests green), and the 4.3 screenshot pass exercised 4 of the
  routes' variants.
- *Why not L3:* the criterion is "every public component" — 58/59 misses it, and
  the one miss is recorded honestly rather than papered over. Raise: render
  `StepFlow` on a route (or correct the stale COVERAGE claim) — a one-component
  fix.
- **L0** No runnable examples; only static screenshots or prose.
- **L1** A single demo page shows a few components out of context.
- **L2** `app/` renders most components but coverage is inconsistent, some are demo-only stubs.
- **L3** Every public component has a live usage-example route in `app/`, doubling as an audit fixture (S6) and a consumer reference.
- **L4** Example routes are exercised in CI (render + a11y + visual check) on every PR.
- **L5** Example coverage stayed complete with zero missing components across ≥2 refreshes.

### U4. Edge-Case & Error-State Guidance
**Score: 3** — prose 35 + structural 25 + verification 3 = **63** (band L3;
no guard trips) → **L3**.
- *Prose 35:* EDGE CASES sections on all 62 doc entries (59 components + 3
  helpers), written per component in Task 7.4 — empty/overflow/invalid-input
  guidance included.
- *Structural 25:* the edge meta lives in checked-in source
  (`doc-site/src/registry.tsx`) next to the generated API data.
- *Verification 3:* only the doc-site build. Nothing cross-checks the written
  edge cases against actual component behaviour — no test asserts a documented
  edge case behaves as written.
- *Raise to L4:* convert a sample of edge-case claims into assertions (or add a
  doc-behaviour review to the release checklist).
- **L0** No documentation of failure modes, empty states, or invalid input handling.
- **L1** A few components mention edge cases informally in comments.
- **L2** Some components document edge cases in their docs entry; coverage is inconsistent.
- **L3** Every public component's docs explicitly cover its edge cases (empty/overflow/error states), per the U1 documentation bar.
- **L4** Edge-case docs are cross-checked against actual component behavior (e.g. via tests) before release.
- **L5** Stayed accurate and complete across ≥2 refreshes with no reported surprises.

### U5. Motion & Reduced-Motion Guidance
**Score: 3** — prose 30 + structural 40 + verification 15 = **85** (band L4;
G4 demotes) → **L3**.
- *Prose 30:* `DESIGN.md` mechanical-motion rules (steps()/linear only,
  reduced-motion renders final state); `components/README.md`; the doc-site
  Motion page.
- *Structural 40:* every animated component has a reduced-motion path —
  `useReducedMotion` hook, the global CssBaseline guard, and per-component
  final/static states across all 26 animated public components.
- *Verification 15:* `reduced-motion.test.tsx` (15 tests, green) with an
  exhaustive fail-closed inventory — a new motion path without a named
  reduced path fails the suite; the suite also asserts the shipped CssBaseline
  guard itself.
- *Why not L4:* not run in CI, and two motion defects are still live —
  `theme/index.ts:68` maps `transitions.easing.sharp` to the raw
  `steps(1, jump-none)` token (unparsable as a transition timing function), and
  the doc-site Motion page still advises `steps(1, jump-none)`. Raise: CI wiring
  plus fixing both (reported, not fixed — see §6).
- **L0** Motion behavior is undocumented; `prefers-reduced-motion` handling is unverified.
- **L1** Reduced-motion is implemented for some components informally, not documented.
- **L2** Motion principles are documented (`DESIGN.md` mechanical-motion rules) but reduced-motion final states are not verified per component.
- **L3** Every animated component has a documented, audited reduced-motion final-state path.
- **L4** Reduced-motion checks run in CI for every animated component and block merges on regression.
- **L5** Coverage stayed complete and regression-free across ≥2 refreshes.

### U6. Customization Recipes & Extension Guidance
**Score: 3** — prose 35 + structural 30 + verification 8 = **73** (band L4;
G4 demotes) → **L3**.
- *Prose 35:* every component page ships a CUSTOMIZE recipe — the generated
  per-instance hooks (`sx`, `classes` keys, slots where present) plus the
  theme-wide single-class `GlobalStyles` pattern, with the deep-merge trap
  named.
- *Structural 30:* the recipe is derived from the generated props surface
  (`classKeys`/`slotKeys`), so it cannot name a class or slot that does not
  exist; `components/README.md` carries the same conventions.
- *Verification 8:* recipes are runnable — `LivePlayground` executes the seed
  example per page and the doc-site build is green. 20 entries carry extra
  hand-written recipe notes; the rest use the generated default.
- *Why not L4:* runnable yes, but "reviewed each release" has no mechanism
  (no releases, no review step). Raise: a recipe review in the release
  checklist; add per-component `customizeCode` where the default is thin.
- **L0** No guidance on how to customize components beyond raw props.
- **L1** Customization is discoverable only by reading source.
- **L2** Some components have an ad-hoc customization example; no consistent recipe format.
- **L3** Every public component ships at least one customization recipe (slot override, `sx`, or theme-level override) as part of its docs.
- **L4** Recipes are runnable (e.g. `doc-site/` live code blocks) and reviewed each release.
- **L5** Recipe coverage stayed complete and runnable across ≥2 refreshes.

### U7. Bilingual (EN/JP) Content Quality
**Score: 3** — prose 35 + structural 35 + verification 5 = **75** (band L4;
G4 demotes) → **L3**.
- *Prose 35:* `DESIGN.md` rule 6 (large kanji + small English caption), the
  bilingual register in `PRODUCT.md`, and `REFERENCE-ANALYSIS.md` as the JP
  sourcing record.
- *Structural 35:* the pairing is implemented across the library —
  `BilingualLabel`, `SectionHeading`, `ZoneTitle`, `MetadataBlock`, JP Mincho
  typography variant — and applied on the `app/` reference screens.
- *Verification 5:* typecheck and builds only. No JP correctness or
  register-consistency review has been performed; nothing catches a mistranslated
  caption.
- *Why not L4:* no per-release content review. Raise: a bilingual-content
  review pass (against `REFERENCE-ANALYSIS.md` sourcing) per release — human
  review is acceptable evidence here, it just has to happen and be recorded.
- **L0** No bilingual pairing; UI/docs are English-only despite the bilingual design principle.
- **L1** Bilingual pairing appears in a few places, inconsistently applied.
- **L2** Bilingual pairing is used across most components (`BilingualLabel`, JP Mincho typography) but docs don't explain the convention.
- **L3** The bilingual pairing convention (large kanji + small English caption, `DESIGN.md` rule 6) is documented and consistently applied across components and reference screens.
- **L4** Bilingual content is reviewed for correctness/consistency each release (e.g. against `REFERENCE-ANALYSIS.md` sourcing).
- **L5** Coverage and accuracy held across ≥2 refreshes with no reported errors.

### U8. Visual Identity Consistency Across Surfaces
**Score: 3** — prose 35 + structural 35 + verification 12 = **82** (band L4;
G4 demotes) → **L3**.
- *Prose 35:* the non-negotiable rules are written down twice (`CLAUDE.md`
  rules 1–9 and `DESIGN.md`), with absolute bans enumerated.
- *Structural 35:* every surface consumes the same tokens — `theme/tokens.ts`
  via `theme.nerv.*`/CSS vars in `theme/`, `components/`, `app/` and
  `doc-site/`; the 1.2 audit removed off-token literals.
- *Verification 12:* the Task 4.3 audit checked the grammar across all 6 `app/`
  routes with computed styles (black-only surface, filled-means-active, no
  elevation shadow, orange-as-chrome-only) and found one real identity defect,
  now fixed. One-time, `app/`-only — the standalone HTML references and
  `doc-site` were not re-swept.
- *Why not L4:* no recurring identity check, and not all surfaces were covered
  by the one that ran. Raise: extend the screenshot sweep to `doc-site` and the
  standalone references, and run it per release.
- **L0** Visual identity diverges across `app/`, `doc-site/`, and standalone HTML references.
- **L1** Core identity (black surface, phosphor mint/orange/red) holds in one surface only.
- **L2** Identity mostly holds across surfaces; some drift (elevation shadows, off-token color) is present.
- **L3** All non-negotiable rules (`CLAUDE.md` rules 1–9: black-only surface, color-as-state, filled-means-active, boxed elements, bimodal type, bilingual pairing, mechanical motion, CRT pass, numbering discipline) hold across every surface.
- **L4** Identity consistency is checked (screenshot diff or token audit) before every release.
- **L5** Zero visual-identity drift across ≥2 refreshes.

### U9. Cross-Viewport & Responsive Behavior
**Score: 2** — prose 10 + structural 25 + verification 0 = **35** (band L2;
no guard trips) → **L2**. Lowest UX category alongside U10.
- *Prose 10:* no responsive guidance anywhere — no breakpoint list, no
  "what collapses at mobile" documentation.
- *Structural 25:* theme breakpoints are defined (`xs 0 / sm 600 / md 1000 /
  lg 1280 / xl 1536`) and the `app/` reference screens implement responsive
  layouts (`xs`/`md` switches on rail collapse and frame height).
- *Verification 0:* nothing — no viewport tests, no screenshots at a second
  breakpoint, ever. The 4.3 sweep used a single 1440×1000 viewport.
- *Raise to L3/L4:* define the breakpoint contract in `DESIGN.md`, then run a
  multi-viewport screenshot pass (mobile/tablet/desktop) over the reference
  screens — that alone is enough to reach L3.
- **L0** Components/screens are unverified outside a single desktop viewport.
- **L1** Responsive behavior is implemented ad hoc for a few screens.
- **L2** Most reference screens (`dashboard-0*`, `landing-0*`) are responsive but untested at multiple breakpoints.
- **L3** Every reference screen and public component is verified at defined breakpoints (mobile/tablet/desktop) with no broken layouts.
- **L4** Responsive checks run as part of the pre-release verification pass (screenshot or automated viewport tests).
- **L5** Zero regressions across ≥2 refreshes.

### U10. Feedback, Support & Community Loop
**Score: 2** — prose 30 + structural 25 + verification 10 = **65** (band L3;
G4 demotes) → **L2**.
- *Prose 30:* `docs/a11y.md` publishes gaps with severity, finding, and
  remediation; D6 names this scorecard as the roadmap feeder.
- *Structural 25:* the severity registry is machine-readable
  (`DECORATION_GAPS`/`RECORDED_FINDINGS` in `aria-patterns.ts`), and the doc's
  numbers are regenerated by the suite.
- *Verification 10:* the gap list is fail-closed — a fixed component forces the
  declaration's deletion, a stale declaration is a hard failure.
- *Why not L3:* the L3 criterion wants gaps published "across accessibility,
  docs, and API surfaces" — only accessibility has a registry. Docs gaps (e.g.
  `StepFlow`'s missing route) and API gaps live in change notes that will be
  archived when this change merges. Raise: one gap registry (a `docs/` backlog
  or issue list) that carries a11y + docs + API gaps with severities.
- **L0** No channel for reporting issues or gaps (a11y, docs, bugs) against the library.
- **L1** Issues are reported informally with no tracked backlog.
- **L2** Gaps are tracked in some form (e.g. `docs/a11y.md`'s known-gap list) but not consistently across categories.
- **L3** Known gaps across accessibility, docs, and API surfaces are published with severity and remediation plans, feeding the roadmap backlog.
- **L4** The gap backlog is reviewed and triaged every release; this scorecard's low-scoring categories directly seed the roadmap (per D6).
- **L5** The loop has demonstrably closed gaps across ≥2 refreshes (score deltas trend upward on previously low categories).

## 5. Current-state score (task 8.2, 2026-09-02)

Scored on branch `feat/upgrate-ui-library` @ `cd3e373`, using the §2.1
conversion uniformly across all 20 categories.

| Category | Score | Evidence (P + S + V = total → guard) |
| --- | ---: | --- |
| S1 Design Token Architecture | 3 | 30 + 35 + 10 = 75 (band L4) → G4 |
| S2 Theming & Extension Contract | 3 | 35 + 30 + 5 = 70 (band L4) → G4 |
| S3 Component API Conventions | 3 | 30 + 40 + 15 = 85 (band L4) → G4 |
| S4 Slot-Based Customization API | 3 | 30 + 35 + 5 = 70 (band L4) → G4 |
| S5 CSS Specificity & Override Safety | 3 | 30 + 35 + 12 = 77 (band L4) → G4 |
| S6 Accessibility Conformance | 3 | 30 + 40 + 15 = 85 (band L4) → G4 |
| S7 Performance & Bundle Budgets | **4** | 30 + 40 + 18 = 88 (band L4) |
| S8 Automated Test Coverage | 3 | 25 + 35 + 12 = 72 (band L4) → G4 |
| S9 CI Quality Gates & Versioning | 2 | 15 + 15 + 10 = 40 (band L2) |
| S10 Agent-Readiness | 3 | 25 + 40 + 12 = 77 (band L4) → G4 |
| **System subtotal** | **30 / 50** | |
| U1 Documentation Coverage | 3 | 35 + 30 + 8 = 73 (band L4) → G4 |
| U2 Onboarding | 3 | 35 + 25 + 8 = 68 (band L3) |
| U3 Live Examples & Demos | 2 | 25 + 30 + 12 = 67 (band L3) → G4 |
| U4 Edge-Case Guidance | 3 | 35 + 25 + 3 = 63 (band L3) |
| U5 Motion & Reduced-Motion | 3 | 30 + 40 + 15 = 85 (band L4) → G4 |
| U6 Customization Recipes | 3 | 35 + 30 + 8 = 73 (band L4) → G4 |
| U7 Bilingual Content Quality | 3 | 35 + 35 + 5 = 75 (band L4) → G4 |
| U8 Visual Identity Consistency | 3 | 35 + 35 + 12 = 82 (band L4) → G4 |
| U9 Cross-Viewport & Responsive | 2 | 10 + 25 + 0 = 35 (band L2) |
| U10 Feedback & Gap Loop | 2 | 30 + 25 + 10 = 65 (band L3) → G4 |
| **UX subtotal** | **27 / 50** | |
| **Combined total** | **57 / 100** | |

**Reading the shape of this score.** No category reaches L5 (G3 — this is the
first refresh, so there is no multi-refresh history anywhere), and only S7
reaches L4, for one reason: it is the only category whose verification evidence
actually runs in CI. Thirteen other categories sit in the L4 *band*
(70–85 points) — the defined-level work genuinely exists — and every one of
them is demoted by the same missing ingredient: enforcement. Nothing runs the
tests, the a11y suite, the off-token grep, or the screenshot sweep on a PR.

**Lowest categories (the roadmap seed, per D6):**

- **S9 CI Quality Gates & Versioning (2, 40 pts)** — one real gate out of five;
  no typecheck/test/a11y CI, no CHANGELOG, no versioning scheme.
- **U9 Cross-Viewport & Responsive (2, 35 pts)** — the only category with zero
  verification evidence: responsive layouts exist and have never been seen at
  more than one viewport.
- **U10 Feedback & Gap Loop (2, 65 pts)** — a strong a11y gap registry, but no
  equivalent for docs/API gaps.
- **U3 Live Examples (2, 67 pts)** — 58/59; the single `StepFlow` miss plus a
  stale `coverage.ts` claim keep it out of L3. Cheapest win on the board.

This scoring is the **recorded baseline** (task 8.3): it is copied verbatim
into `docs/maturity-history.md` as entry `0.1.0 (baseline)`, and every future
refresh is diffed against it (§8).

## 6. Verification runs behind this scoring

All commands run at scoring time (2026-09-02), working tree = `cd3e373` plus
nothing (clean except this document):

```text
cd app && npx vitest run --config vitest.config.ts src/a11y src/api
  → Test Files 4 passed (4) · Tests 99 passed (99)
cd app && npm run typecheck          → exit 0 (tsc -b; type-checks theme/ + components/ in context)
npm run typecheck (root)             → exit 0
npm run build (root)                 → tsup + [generate-dtcg] 75 tokens
                                       + registry.json 59 components (58 with example route)
npm run size (root)                  → all 19 entries under budget (exit 0)
cd doc-site && npm run build         → built (note: regenerates llms.txt unpinned — see §6 defects)
```

**Defects and ambiguities found while scoring (reported, not fixed):**

1. **No CI runs the test suites.** `docs/a11y.md` says critical/serious axe
   violations "fail CI" and the pattern rate is a "gate" — accurate as suite
   behaviour, but no workflow invokes it. The L4 rows above are all demoted by
   this one gap.
2. **`theme/index.ts:68`** maps `transitions.easing.sharp` to the raw
   `motion.snap` token (`steps(1, jump-none)`), which Chromium rejects as a
   transition/animation timing function (n=1 `jump-none`; recorded in
   `notes/4.3-variant-rendering.md`). Still present at HEAD.
3. **`doc-site/src/pages/foundations/MotionPage.tsx`** advises
   `steps(1, jump-none)` — same unparsable value, propagating the defect into
   consumer guidance.
4. **Stale `app/src/a11y/coverage.ts`:** claims `StepFlow` renders on
   `/dashboard-02`; no `app/` page renders it. Consequence: `registry.json`
   records `exampleRoute: null` for StepFlow, the generator warns on every
   build, and U3/S6/S10 lose points for a one-line fix.
5. **`doc-site` `prebuild`/`predev` rewrite `public/llms.txt` unpinned** — any
   local `npm run build` flips the 83 links from `/evangelion-mui-theme/…` to
   `/…`, dirtying the file (reproduced during this scoring and reverted with
   `git checkout`). Recorded in `notes/7.5-agent-readiness-rubric.md`.
6. **6 of 10 custom variants have no *direct* route rendering** (Button
   `stamp`, Paper `frame`, Typography `jp`/`terminal`/`stamp`/`data` — the
   direct-vs-indirect rule: a variant counts as exercised only when the
   `variant="…"` prop is used on a route). Of those 6, three are still
   exercised *indirectly* through their type role — Typography `jp` via
   `BilingualLabel`/`SectionHeading` (`/dashboard-01`, `/landing-02`),
   Typography `terminal` via `Terminal`/`LogConsole`, Typography `data` via
   `MetadataBlock` — leaving 3 with no rendering on any surface (Button
   `stamp`, Paper `frame`, Typography `stamp`). All 6 were verified only
   through a throwaway harness (`notes/4.3`), which caps S5/U8 verification
   credit.
7. **`docs/a11y.md` headline row "axe violations — moderate: 16"** vs 22 at
   first run is self-consistent, but the a11y "CI gate" wording (defect 1)
   overstates what is wired. Also `color-contrast` is disabled in the axe run,
   so no WCAG contrast number exists anywhere — a real hole in S6 evidence.

## 7. Usage

**Scoring a category (applied for the first time in task 8.2 — see §5):**

1. Read the six criteria for the category from L0 through L5.
2. Treat the levels as cumulative and select the highest criterion whose
   requirements, including the lower-level requirements, are satisfied.
3. Weight the evidence per §2 (prose ≤ 40, structural ≤ 40, verification
   ≤ +20) and convert with §2.1 (band table + guards G1–G4).
4. Record the score in the category's `Score:` line with its evidence mix and
   the guard that demoted it, if any. The per-release refresh then logs the
   deltas against the previous entry in `docs/maturity-history.md` (§8).

**Totals:** sum the 10 System scores and the 10 UX scores separately (each
out of 50), plus a combined total out of 100. Current totals (task 8.2):
System 30/50, UX 27/50, combined **57/100** (§5).

## 8. Baseline & per-release refresh (task 8.3)

### 8.1 Recorded baseline

The task 8.2 scoring (§5, 2026-09-02) is the recorded baseline — the reference
every future refresh is diffed against:

- **Total: 57/100** (System 30/50, UX 27/50) — 20 category levels and their
  evidence mixes in `docs/maturity-history.md`, entry **`0.1.0 (baseline)`**.
- **Version:** `0.1.0` (`package.json`). **Scored at:** branch
  `feat/upgrate-ui-library` @ `cd3e373`; scorecard committed @ `cbf7577`.
- It is **refresh #1** of the ≥ 2 consecutive refreshes G3 (§2.1) requires
  before any category can hold L5 — so L5 stays unreachable until the next
  refresh confirms each category's level.

### 8.2 Per-release refresh procedure

The spec's scenario: *"WHEN a release is cut, THEN the same change updates
`docs/maturity-scorecard.md` and records the score deltas."* Run this inside
the release change, after the release's own work has landed:

1. **Re-score** all 20 categories per §7 (steps 1–4) against the current
   tree: fresh evidence for every `Score:` line, §2 caps, §2.1 band + guards
   G1–G4. Judgment stays human — nothing automates a score.
2. **Update §5**: new scoring date + commit in the heading, new `Score:` lines
   in §3/§4, new §5 table, and a refreshed §6 (re-run the verification
   commands, drop anything that no longer holds).
3. **Log the deltas** in `docs/maturity-history.md`:

   ```bash
   npm run maturity:refresh                 # dry run: prints the delta table
   npm run maturity:refresh -- --write \
     --release <version> --date <YYYY-MM-DD>
   ```

   `scripts/maturity-refresh.mjs` diffs the refreshed §5 table against the
   latest history entry — per-category Δ level / Δ pts, subtotals, total — and
   with `--write` appends the entry plus its `## Summary` row. It never scores
   anything; it fails loudly if §5 no longer has all 20 rows. Commit both
   files in the same change.
4. **Apply the G3 consequences** from the report: a category that *regressed*
   loses its L5 streak (streak restarts at 1); a category at ≥ 90 pts whose
   streak survived is eligible for L5 on the *next* refresh. Note the verdicts
   in the history entry if they change anything §5 says.

### 8.3 Where deltas live

`docs/maturity-history.md` is the single delta log: a `## Summary` table
(release, date, commit, System/UX/total, Δ total) with one detail entry per
refresh carrying the 20 category rows and their deltas. The scorecard keeps
only the current score; all history — including the baseline above — is in the
log, so §5 can be rewritten in place each release without losing the trend.
