## ADDED Requirements

### Requirement: Single source of truth for tokens

The library SHALL keep `theme/tokens.ts` as the single source of truth for every
color, size, and timing value, with no hardcoded off-token values elsewhere.

#### Scenario: No off-token values
- **WHEN** a hex, size, or timing value appears in `theme/` or `components/`
- **THEN** it is traceable to a token defined in `theme/tokens.ts`

### Requirement: Separately importable tokens and overrides

The library SHALL export tokens and component overrides as separately importable
modules, so a consumer can import one without the other.

#### Scenario: Importing tokens alone
- **WHEN** a consumer imports the token module
- **THEN** it resolves without pulling in the component-override module

### Requirement: Shallow-spread extension path

WHEN a consumer creates an app theme, THEN the documented extension path SHALL be
shallow object spread of the base theme.

#### Scenario: Documented spread example is runnable
- **WHEN** a consumer follows the documented extension example
- **THEN** it extends the theme via shallow object spread and produces a valid theme

### Requirement: Deep-merge rejected as anti-pattern

IF a proposed change introduces a deep-merge function for theme extension, THEN
the change SHALL be rejected and documented as an anti-pattern in
`theme/README.md`.

#### Scenario: Deep-merge is named as an anti-pattern
- **WHEN** a reader consults `theme/README.md`
- **THEN** it contains a named "do not deep-merge" anti-pattern with rationale

### Requirement: Documented extension examples

WHERE theme documentation exists, THEN it SHALL include at least one runnable
spread-extension example and one named deep-merge anti-pattern.

#### Scenario: Docs carry both example and anti-pattern
- **WHEN** the theme documentation is reviewed
- **THEN** it contains at least one runnable spread example and one named deep-merge anti-pattern
