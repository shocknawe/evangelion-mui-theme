## ADDED Requirements

### Requirement: Per-component documentation thoroughness

WHERE a public component exists, THEN its documentation SHALL cover edge cases,
performance notes, and at least one customization recipe.

#### Scenario: Component docs are thorough
- **WHEN** a public component's documentation is reviewed
- **THEN** it covers edge cases, performance notes, and at least one customization recipe

### Requirement: `llms.txt` index

The library SHALL publish an `llms.txt` at the docs-site root indexing curated
LLM-consumable documentation.

#### Scenario: llms.txt is published
- **WHEN** the docs-site root is served
- **THEN** an `llms.txt` file lists curated LLM-consumable documentation pages

### Requirement: DTCG token export

The library SHALL generate a DTCG-format token export from `theme/tokens.ts` at
build time, publishing it as `dist/tokens.dtcg.json`.

#### Scenario: DTCG tokens generated from source
- **WHEN** the build runs
- **THEN** `dist/tokens.dtcg.json` is generated from `theme/tokens.ts` in valid DTCG format, keeping tokens single-source

### Requirement: Component registry manifest

The library SHALL publish a component registry manifest (`registry.json`) listing
every public component's name, props summary, tokens consumed, and example route.

#### Scenario: Registry lists every component
- **WHEN** `registry.json` is inspected
- **THEN** each public component appears with its name, props summary, tokens consumed, and example route

### Requirement: Agent-readiness score target

The library SHALL achieve an agent-readiness score of at least 4 of 5 on the
report's rubric, with `llms.txt`, DTCG tokens, and the registry required (MCP
server and Figma Code Connect optional this phase).

#### Scenario: Rubric target met
- **WHEN** the agent-readiness rubric is scored
- **THEN** the library scores at least 4 of 5 with llms.txt, DTCG tokens, and registry present
