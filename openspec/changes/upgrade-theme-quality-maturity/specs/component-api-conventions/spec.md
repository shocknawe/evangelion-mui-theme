## ADDED Requirements

### Requirement: Children-first composition

The library SHALL use children as the primary composition method for every
component in `components/`, using explicit props only where child order cannot
be permuted.

#### Scenario: Composition via children
- **WHEN** a component renders consumer-provided content whose order is not fixed
- **THEN** that content is provided via `children` rather than named content props

### Requirement: Undeclared props spread to the root element

WHEN a component receives a prop it does not declare, THEN the component SHALL
spread that prop to its root element.

#### Scenario: Passing a native attribute
- **WHEN** a consumer passes an undeclared prop (e.g., `data-testid`, `aria-*`, `onClick`) to a component
- **THEN** that prop is forwarded to the component's root DOM element

### Requirement: Forwarded refs

The library SHALL forward `ref` to the outermost rendered DOM element on every
component that renders a DOM element.

#### Scenario: Ref reaches the root node
- **WHEN** a consumer attaches a `ref` to a public component that renders a DOM element
- **THEN** the ref resolves to that component's outermost DOM node

### Requirement: `classes` prop with a `root` key

The library SHALL accept a `classes` prop on every public component, with the
root class key always named `root`.

#### Scenario: Overriding via classes
- **WHEN** a consumer supplies `classes={{ root: 'x' }}` (and any other documented keys)
- **THEN** those class names are applied to the corresponding parts, with `root` applied to the outermost element

### Requirement: Single-class CSS specificity

WHILE component or theme styles use selector nesting deeper than a single class,
the upgrade SHALL flatten them so consumer overrides do not require `!important`.

#### Scenario: Consumer override wins without `!important`
- **WHEN** a consumer overrides a component's style through the `sx` prop, `classes`, or theme overrides
- **THEN** the override takes effect without needing `!important`
