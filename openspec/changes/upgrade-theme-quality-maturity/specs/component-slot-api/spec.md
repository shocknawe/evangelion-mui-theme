## ADDED Requirements

### Requirement: Slot-based customization for replaceable internal parts

WHEN a component in `components/` has an internal part that consumers
realistically replace (e.g., a gauge track/needle, a card header, a row's
leading/trailing affordance), THEN the library SHALL expose that part via
`slots` and `slotProps` following MUI Core conventions.

#### Scenario: Component with a replaceable internal part exposes a slot
- **WHEN** a consumer needs to replace an internal part of a component that has one
- **THEN** the component accepts `slots={{ <part>: Custom }}` and `slotProps={{ <part>: {...} }}`
- **AND** the default rendering is unchanged when no slot is provided

#### Scenario: Simple-prop or composition components do not get slots
- **WHEN** a component's customization need is satisfied by simple props or children composition
- **THEN** the library does NOT introduce slots for that component

### Requirement: Migration off `*Component/*Props` APIs

IF a component previously exposed internal parts through a `*Component/*Props`-style
API, THEN the upgrade SHALL migrate it to `slots`/`slotProps` and mark the old
API deprecated for one release before removal.

#### Scenario: Legacy pairing is migrated with a deprecation window
- **WHEN** a component exposed an internal part via `*Component`/`*Props`
- **THEN** it is migrated to `slots`/`slotProps`
- **AND** the old props still function but emit a deprecation notice for one release before removal

### Requirement: Variant preservation under slot APIs

WHEN slot APIs are added, THEN the library SHALL preserve all existing custom
variants (Button `ghost`/`alt`/`stamp`, Chip `stamp`, Paper `chamfer`/`frame`,
Typography variants) with no visual regression in `app/` demo routes.

#### Scenario: No visual regression after slot work
- **WHEN** slot APIs have been added across `components/`
- **THEN** every existing custom variant renders identically in the `app/` routes as before the change
