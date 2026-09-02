# Maturity Scorecard — NERV/MAGI MUI Theme

> DSAF-style CMM scorecard for the Phosphor Console library (`theme/`,
> `components/`, `app/`, `doc-site/`). Implements requirement FR-6 /
> capability `maturity-scorecard` from
> `openspec/changes/upgrade-theme-quality-maturity/`. See `design.md` D6 for
> rationale and `docs/upgrade.md` for the source research mapping.
>
> **This document defines the model only.** It does not assign current-state
> scores or a baseline total — that is done in change tasks 8.2 (apply
> evidence weighting, score current state) and 8.3 (record baseline, wire the
> per-release refresh). Every category below carries a `Score: —` placeholder
> until 8.2 fills it in.

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
verified system. Task 8.2 will define how this evidence total accompanies the
0–5 category score when it assesses the current state; this structure does not
invent an evidence-points-to-level conversion.

## 3. System categories (10)

Engineering/technical maturity — tokens, API, build, and CI.

### S1. Design Token Architecture
Score: —
- **L0** No dedicated token module; colors/sizes/timings are hardcoded ad hoc.
- **L1** A token file exists but is incomplete or duplicated; off-token values remain elsewhere.
- **L2** A single token module covers most values, but tokens and component overrides are not separately importable.
- **L3** `theme/tokens.ts` is the documented single source of truth; tokens and overrides ship as separately importable modules; an off-token-value audit has been run once.
- **L4** The off-token-value audit is a repeatable, CI-run check that fails the build on a stray value.
- **L5** Zero off-token violations across ≥2 consecutive refreshes.

### S2. Theming & Extension Contract
Score: —
- **L0** No documented way to extend the theme.
- **L1** An extension pattern is used informally in one place, undocumented.
- **L2** `theme/README.md` mentions extension but without a runnable example or a stance on deep-merge.
- **L3** A shallow-spread extension example is documented, a deep-merge anti-pattern is explicitly named, and no deep-merge helper is exported.
- **L4** The no-deep-merge rule is checked (grep/lint) before release, and `app/`/`doc-site/` demonstrate the pattern as a real consumer.
- **L5** The contract has shipped unchanged and violation-free across ≥2 refreshes.

### S3. Component API Conventions
Score: —
- **L0** Components mix arbitrary prop shapes; no shared convention for composition, refs, or prop-spreading.
- **L1** A few components follow children-first/prop-spread/ref-forwarding conventions; no `classes` prop anywhere.
- **L2** Conventions are followed on most components but inconsistently.
- **L3** Every public component uses children as the primary composition method wherever content order is permutable, spreads undeclared props to root, forwards `ref` to the outermost DOM node, and exposes a `classes` prop with a `root` key.
- **L4** Compliance is asserted by automated tests per component and runs in CI.
- **L5** Zero convention regressions across ≥2 refreshes; enforced as a merge gate.

### S4. Slot-Based Customization API
Score: —
- **L0** No slot API; internal parts can only be replaced by forking the component.
- **L1** One-off `*Component`/`*Props`-style overrides exist for a couple of components, undocumented.
- **L2** Slot candidates are identified/documented but `slots`/`slotProps` are not yet implemented.
- **L3** `slots`/`slotProps` (MUI Core convention) are implemented for every identified slot-candidate component; any legacy `*Component/*Props` pairing is deprecated with a working fallback.
- **L4** Slot coverage is verified against the slot-candidate inventory in tests/CI, and deprecated APIs carry an active warning with a removal date.
- **L5** Stable and warning-free across ≥2 refreshes; legacy props fully removed on schedule.

### S5. CSS Specificity & Override Safety
Score: —
- **L0** Overrides commonly require `!important`; selector nesting is deep and unpredictable.
- **L1** A few components use flat single-class selectors; most still nest.
- **L2** Flattening is in progress against a documented target convention, partial coverage.
- **L3** All component and theme override selectors are flattened to single-class specificity; consumer `sx`/`classes`/theme overrides win without `!important`.
- **L4** A visual-regression check confirms no regressions from flattening across every `app/` route, run before release.
- **L5** Zero `!important` overrides needed and zero visual regressions across ≥2 refreshes.

### S6. Accessibility Conformance
Score: —
- **L0** No accessibility testing; WCAG/ARIA conformance is unverified.
- **L1** Manual/spot-check accessibility review only; no mapped WAI-ARIA patterns.
- **L2** Some components are mapped to WAI-ARIA patterns and manually reviewed; no automated audit.
- **L3** axe-core audits run against every public component's live-example route; components are mapped to their WAI-ARIA pattern; known gaps are published in `docs/a11y.md`.
- **L4** Audits run in CI on every PR and gate merges; pass rate is ≥10/11 applicable WAI-ARIA patterns; reduced-motion final-state is verified per animated component.
- **L5** Pass rate held or improved with zero regressions across ≥2 refreshes; gap list is empty or fully time-boxed.

### S7. Performance & Bundle Budgets
Score: —
- **L0** No bundle-size measurement; sizes unknown.
- **L1** Bundle size is checked manually/occasionally, not recorded.
- **L2** A size-check tool is configured but budgets are not codified per export.
- **L3** `size-limit` measures gzip bytes for the theme and every component export; a version-controlled budget table exists with a stated shared-runtime accounting rule.
- **L4** CI fails PRs that exceed budget unless the same PR bumps the entry; both fail and pass paths are verified.
- **L5** Budgets held (or deliberately, reviewably raised) with no unexplained regressions across ≥2 refreshes.

### S8. Automated Test Coverage
Score: —
- **L0** No automated tests beyond manual QA.
- **L1** A handful of ad-hoc tests exist for select components.
- **L2** Tests cover some components' rendering but not API-convention behavior (props, refs, classes).
- **L3** Tests assert prop-spread, ref-forwarding, and `classes` application per component, alongside a11y/pattern tests.
- **L4** The suite runs in CI on every PR and blocks merges on failure; coverage spans every public component.
- **L5** Suite has run green across ≥2 refreshes with coverage maintained as components are added.

### S9. CI Quality Gates & Versioning Discipline
Score: —
- **L0** No CI; releases are manual and undocumented.
- **L1** CI runs build/lint only; no quality gates beyond compilation.
- **L2** Some CI gates exist (e.g. typecheck) but bundle/a11y/test gates are missing or non-blocking.
- **L3** CI includes build, typecheck, tests, accessibility (S6), and bundle-budget (S7) gates; versioning follows a stated scheme with a changelog.
- **L4** All gates are blocking on the default branch; releases are cut only when every gate is green.
- **L5** Zero bypassed gates across ≥2 refreshes.

### S10. Agent-Readiness & Machine-Readable Artifacts
Score: —
- **L0** No machine-readable artifacts describing the library; docs are prose-only.
- **L1** One artifact exists informally (e.g. a hand-written token list) and is not generated from source.
- **L2** `llms.txt` or a token export exists but is incomplete or hand-maintained (drift risk).
- **L3** `llms.txt` indexes curated docs, `dist/tokens.dtcg.json` is generated at build time from `theme/tokens.ts`, and `registry.json` lists every component's name, props summary, tokens used, and example route.
- **L4** All three artifacts are generated in CI on every build and verified against source (no drift); rubric score ≥4/5.
- **L5** Artifacts shipped drift-free across ≥2 refreshes and are consumed by at least one downstream tool/agent workflow.

## 4. UX categories (10)

Consumer-facing maturity — docs, onboarding, motion, identity.

### U1. Documentation Coverage & API Reference
Score: —
- **L0** No per-component documentation beyond source code.
- **L1** A handful of components have a short description; most are undocumented.
- **L2** Most components have basic prop documentation; edge cases and performance notes are largely absent.
- **L3** Every public component's docs cover edge cases, performance notes, and at least one customization recipe.
- **L4** Docs are reviewed for accuracy on every release and cross-linked from `registry.json`/`llms.txt`.
- **L5** Docs stayed complete and accurate (no reported gaps) across ≥2 refreshes.

### U2. Onboarding & Getting-Started Experience
Score: —
- **L0** No install/quick-start instructions.
- **L1** A minimal install snippet exists; no working end-to-end example.
- **L2** `theme/README.md` Install/Use sections exist but assume prior MUI knowledge.
- **L3** A first-run path (install → `ThemeProvider` → first component) is documented and runnable within minutes.
- **L4** Onboarding is verified by a fresh-clone smoke test (`app/` `npm install && npm run dev`) run before each release.
- **L5** Onboarding stayed friction-free (no reported blocker) across ≥2 refreshes.

### U3. Live Examples & Interactive Demos
Score: —
- **L0** No runnable examples; only static screenshots or prose.
- **L1** A single demo page shows a few components out of context.
- **L2** `app/` renders most components but coverage is inconsistent, some are demo-only stubs.
- **L3** Every public component has a live usage-example route in `app/`, doubling as an audit fixture (S6) and a consumer reference.
- **L4** Example routes are exercised in CI (render + a11y + visual check) on every PR.
- **L5** Example coverage stayed complete with zero missing components across ≥2 refreshes.

### U4. Edge-Case & Error-State Guidance
Score: —
- **L0** No documentation of failure modes, empty states, or invalid input handling.
- **L1** A few components mention edge cases informally in comments.
- **L2** Some components document edge cases in their docs entry; coverage is inconsistent.
- **L3** Every public component's docs explicitly cover its edge cases (empty/overflow/error states), per the U1 documentation bar.
- **L4** Edge-case docs are cross-checked against actual component behavior (e.g. via tests) before release.
- **L5** Stayed accurate and complete across ≥2 refreshes with no reported surprises.

### U5. Motion & Reduced-Motion Guidance
Score: —
- **L0** Motion behavior is undocumented; `prefers-reduced-motion` handling is unverified.
- **L1** Reduced-motion is implemented for some components informally, not documented.
- **L2** Motion principles are documented (`DESIGN.md` mechanical-motion rules) but reduced-motion final states are not verified per component.
- **L3** Every animated component has a documented, audited reduced-motion final-state path.
- **L4** Reduced-motion checks run in CI for every animated component and block merges on regression.
- **L5** Coverage stayed complete and regression-free across ≥2 refreshes.

### U6. Customization Recipes & Extension Guidance
Score: —
- **L0** No guidance on how to customize components beyond raw props.
- **L1** Customization is discoverable only by reading source.
- **L2** Some components have an ad-hoc customization example; no consistent recipe format.
- **L3** Every public component ships at least one customization recipe (slot override, `sx`, or theme-level override) as part of its docs.
- **L4** Recipes are runnable (e.g. `doc-site/` live code blocks) and reviewed each release.
- **L5** Recipe coverage stayed complete and runnable across ≥2 refreshes.

### U7. Bilingual (EN/JP) Content Quality
Score: —
- **L0** No bilingual pairing; UI/docs are English-only despite the bilingual design principle.
- **L1** Bilingual pairing appears in a few places, inconsistently applied.
- **L2** Bilingual pairing is used across most components (`BilingualLabel`, JP Mincho typography) but docs don't explain the convention.
- **L3** The bilingual pairing convention (large kanji + small English caption, `DESIGN.md` rule 6) is documented and consistently applied across components and reference screens.
- **L4** Bilingual content is reviewed for correctness/consistency each release (e.g. against `REFERENCE-ANALYSIS.md` sourcing).
- **L5** Coverage and accuracy held across ≥2 refreshes with no reported errors.

### U8. Visual Identity Consistency Across Surfaces
Score: —
- **L0** Visual identity diverges across `app/`, `doc-site/`, and standalone HTML references.
- **L1** Core identity (black surface, phosphor mint/orange/red) holds in one surface only.
- **L2** Identity mostly holds across surfaces; some drift (elevation shadows, off-token color) is present.
- **L3** All non-negotiable rules (`CLAUDE.md` rules 1–9: black-only surface, color-as-state, filled-means-active, boxed elements, bimodal type, bilingual pairing, mechanical motion, CRT pass, numbering discipline) hold across every surface.
- **L4** Identity consistency is checked (screenshot diff or token audit) before every release.
- **L5** Zero visual-identity drift across ≥2 refreshes.

### U9. Cross-Viewport & Responsive Behavior
Score: —
- **L0** Components/screens are unverified outside a single desktop viewport.
- **L1** Responsive behavior is implemented ad hoc for a few screens.
- **L2** Most reference screens (`dashboard-0*`, `landing-0*`) are responsive but untested at multiple breakpoints.
- **L3** Every reference screen and public component is verified at defined breakpoints (mobile/tablet/desktop) with no broken layouts.
- **L4** Responsive checks run as part of the pre-release verification pass (screenshot or automated viewport tests).
- **L5** Zero regressions across ≥2 refreshes.

### U10. Feedback, Support & Community Loop
Score: —
- **L0** No channel for reporting issues or gaps (a11y, docs, bugs) against the library.
- **L1** Issues are reported informally with no tracked backlog.
- **L2** Gaps are tracked in some form (e.g. `docs/a11y.md`'s known-gap list) but not consistently across categories.
- **L3** Known gaps across accessibility, docs, and API surfaces are published with severity and remediation plans, feeding the roadmap backlog.
- **L4** The gap backlog is reviewed and triaged every release; this scorecard's low-scoring categories directly seed the roadmap (per D6).
- **L5** The loop has demonstrably closed gaps across ≥2 refreshes (score deltas trend upward on previously low categories).

## 5. Usage

**Scoring a category (does not apply here — see tasks 8.2/8.3):**

1. Read the six criteria for the category from L0 through L5.
2. Treat the levels as cumulative and select the highest criterion whose
   requirements, including the lower-level requirements, are satisfied.
3. In task 8.2, support the assessment with the evidence dimensions in §2 and
   record the current-state score. Task 8.3 separately defines baseline totals,
   release-refresh wiring, and delta logging.

**Totals:** sum the 10 System scores and the 10 UX scores separately (each
out of 50), plus a combined total out of 100. Totals are computed once
current-state scores exist (task 8.3), not in this document.
