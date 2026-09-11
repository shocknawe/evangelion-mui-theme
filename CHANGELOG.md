# Changelog

## 0.2.0 — 2026-09-09

### Breaking changes

- React 19, React DOM 19, and Material UI 9 are now required. Components use
  React 19's ref-as-prop support to forward refs to their root elements.

### Added

- Root DOM props, refs, stable classes, and replaceable slots across the
  component library.
- Accessibility/API contract tests and pull-request CI enforcement.
- DTCG token output, a generated component registry, and bundle-size budgets.

### Fixed

- Consumer click and keyboard handlers now compose with the built-in behavior
  of `HazardPrompt`, `AgentCard`, and `ModuleCard`.
- Meter and progress components now ship accessible roles, names, and values.
- The hard-snap motion token now uses the valid `steps(1, end)` timing function.
