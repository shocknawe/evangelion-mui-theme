## ADDED Requirements

### Requirement: DSAF-style maturity scorecard

The library SHALL maintain a DSAF-style maturity scorecard in
`docs/maturity-scorecard.md` with CMM-style levels L0–L5 across 20 categories
(10 system, 10 UX), each criterion scored 0–5.

#### Scenario: Scorecard structure exists
- **WHEN** `docs/maturity-scorecard.md` is inspected
- **THEN** it defines L0–L5 levels and scores 20 categories (10 system, 10 UX), each 0–5

### Requirement: Evidence-weighted scoring

WHILE a criterion is supported only by prose claims, its evidence score SHALL be
capped at 40 points. WHILE a criterion is supported by structural artifacts
present in the repository, its evidence score SHALL be capped at 40 points. WHEN
verification signals (CI checks, measured audits, passing tests) exist for a
criterion, THEN up to 20 additional evidence points SHALL be awarded.

#### Scenario: Prose-only criterion is capped
- **WHEN** a criterion is backed only by prose
- **THEN** its evidence score is capped at 40 points and cannot reach "Built"

#### Scenario: Verified criterion earns the top band
- **WHEN** a criterion has CI checks, measured audits, or passing tests
- **THEN** it can earn up to 20 additional points above the structural cap

### Requirement: Refreshed per release

WHEN a release is cut, THEN the scorecard SHALL be refreshed in the same change
and score deltas recorded.

#### Scenario: Release refreshes the scorecard
- **WHEN** a release is cut
- **THEN** the same change updates `docs/maturity-scorecard.md` and records the score deltas
