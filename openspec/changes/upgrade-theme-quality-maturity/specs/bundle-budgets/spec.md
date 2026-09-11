## ADDED Requirements

### Requirement: Per-export gzip size measurement

The library SHALL measure the gzip byte size of every public export (the theme
and each component entry) via a CI size-check (bundlesize or size-limit).

#### Scenario: Every public export is measured
- **WHEN** the size-check runs in CI
- **THEN** it reports a gzip byte figure for the theme and for each public component entry

### Requirement: Version-controlled budget table

The library SHALL store per-export byte budgets in a version-controlled budget
table committed in the repository.

#### Scenario: Budgets are checked in
- **WHEN** the repository is inspected
- **THEN** a committed budget table lists a byte limit for each public export

### Requirement: CI fails on unbudgeted growth

WHEN a pull request changes an export's measured size beyond its budget, THEN CI
SHALL fail unless the same pull request also updates the budget entry.

#### Scenario: Over-budget PR without a budget bump fails
- **WHEN** a PR pushes an export above its budget and does not update that budget entry
- **THEN** the CI size-check fails

#### Scenario: Over-budget PR with a budget bump passes
- **WHEN** a PR pushes an export above its old budget and updates that budget entry in the same PR
- **THEN** the CI size-check passes

### Requirement: Stated shared-runtime accounting

WHILE shared runtime code (theme singleton, Emotion cache setup) is counted in
component measurements, the accounting method SHALL be stated in the budget
config so shared code is not double-counted.

#### Scenario: Accounting rule is documented
- **WHEN** a reviewer reads the budget config
- **THEN** it states how shared runtime code is accounted for and confirms it is not double-counted across per-component numbers
