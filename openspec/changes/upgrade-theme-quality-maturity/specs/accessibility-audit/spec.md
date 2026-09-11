## ADDED Requirements

### Requirement: axe-core audits per public component

The library SHALL run axe-core audits in CI against rendered examples of every
public component in `app/`.

#### Scenario: Every component has an audited example
- **WHEN** the CI accessibility job runs
- **THEN** each public component is rendered in at least one `app/` example and audited by axe-core

### Requirement: WAI-ARIA pattern mapping

WHEN a component implements a recognized WAI-ARIA pattern, THEN the library SHALL
map that component to the pattern and audit against the pattern's required roles,
states, and keyboard behavior.

#### Scenario: Component mapped to its pattern
- **WHEN** a component implements a recognized pattern (e.g., meter, `progressbar`, `feed`, `switch`/radio, modal focus management)
- **THEN** a documented mapping exists and the audit checks the pattern's required roles, states, and keyboard behavior

### Requirement: Stated pattern pass rate

The library SHALL meet a stated WAI-ARIA pattern pass rate of at least 10 of 11
applicable patterns, in addition to the existing WCAG 2.1 AA bar.

#### Scenario: Pass rate met
- **WHEN** the accessibility audit completes
- **THEN** at least 10 of 11 applicable WAI-ARIA patterns pass and the WCAG 2.1 AA bar holds

### Requirement: Published gap list

WHERE a known accessibility gap remains, THEN the library SHALL publish it in
`docs/a11y.md` with severity and planned remediation.

#### Scenario: Gaps are published, not implicit
- **WHEN** an accessibility gap is known
- **THEN** `docs/a11y.md` lists it with a severity and a planned remediation

### Requirement: Reduced-motion final-state verification

WHEN `prefers-reduced-motion` is active, THEN every animated state SHALL render
its final state, and the audit SHALL verify at least one such path per animated
component.

#### Scenario: Reduced-motion path is verified
- **WHEN** `prefers-reduced-motion` is active and an animated component renders
- **THEN** it shows its final state, and the audit verifies at least one such path for that component
