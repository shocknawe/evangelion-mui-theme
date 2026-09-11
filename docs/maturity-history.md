# Maturity Score History — Delta Log

> The per-release delta log for the DSAF-style maturity scorecard
> (`docs/maturity-scorecard.md`), capability `maturity-scorecard`:
> *"WHEN a release is cut, THEN the same change updates
> `docs/maturity-scorecard.md` and records the score deltas."*
>
> **How this file is updated:** re-score the 20 categories in the scorecard
> (procedure: `docs/maturity-scorecard.md` §7 + §8), then run
> `npm run maturity:refresh -- --write --release <version> --date <YYYY-MM-DD>`
> from the repo root. The script diffs the refreshed §5 table against the
> latest entry below, prints the deltas, and — with `--write` — appends the
> entry and its summary row. Judgment stays human; only the delta arithmetic
> is automated.

## Summary

| Release | Date | Commit | System /50 | UX /50 | Total /100 | Δ Total |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 0.1.0 (baseline) | 2026-09-02 | cd3e373 | 30 | 27 | 57 | — (baseline) |

## 0.1.0 — baseline (2026-09-02, cd3e373)

Recorded by task 8.3 from the task 8.2 scoring of
`docs/maturity-scorecard.md` §5 (scored 2026-09-02 on branch
`feat/upgrate-ui-library` @ `cd3e373`; scorecard committed @ `cbf7577`;
package version `0.1.0`). First entry — no prior baseline exists, so every
delta is **—** (n/a). This is the reference all future refreshes are diffed
against, and refresh #1 of the ≥ 2 consecutive refreshes G3 requires before
any category can reach L5.

Verification runs behind these scores: scorecard §6.

| Category | Level | Evidence (P + S + V = total) | Δ level | Δ pts |
| --- | ---: | --- | ---: | ---: |
| S1 Design Token Architecture | 3 | 30 + 35 + 10 = 75 | — | — |
| S2 Theming & Extension Contract | 3 | 35 + 30 + 5 = 70 | — | — |
| S3 Component API Conventions | 3 | 30 + 40 + 15 = 85 | — | — |
| S4 Slot-Based Customization API | 3 | 30 + 35 + 5 = 70 | — | — |
| S5 CSS Specificity & Override Safety | 3 | 30 + 35 + 12 = 77 | — | — |
| S6 Accessibility Conformance | 3 | 30 + 40 + 15 = 85 | — | — |
| S7 Performance & Bundle Budgets | 4 | 30 + 40 + 18 = 88 | — | — |
| S8 Automated Test Coverage | 3 | 25 + 35 + 12 = 72 | — | — |
| S9 CI Quality Gates & Versioning | 2 | 15 + 15 + 10 = 40 | — | — |
| S10 Agent-Readiness | 3 | 25 + 40 + 12 = 77 | — | — |
| U1 Documentation Coverage | 3 | 35 + 30 + 8 = 73 | — | — |
| U2 Onboarding | 3 | 35 + 25 + 8 = 68 | — | — |
| U3 Live Examples & Demos | 2 | 25 + 30 + 12 = 67 | — | — |
| U4 Edge-Case Guidance | 3 | 35 + 25 + 3 = 63 | — | — |
| U5 Motion & Reduced-Motion | 3 | 30 + 40 + 15 = 85 | — | — |
| U6 Customization Recipes | 3 | 35 + 30 + 8 = 73 | — | — |
| U7 Bilingual Content Quality | 3 | 35 + 35 + 5 = 75 | — | — |
| U8 Visual Identity Consistency | 3 | 35 + 35 + 12 = 82 | — | — |
| U9 Cross-Viewport & Responsive | 2 | 10 + 25 + 0 = 35 | — | — |
| U10 Feedback & Gap Loop | 2 | 30 + 25 + 10 = 65 | — | — |

**Totals:** System 30/50, UX 27/50, combined **57/100**.