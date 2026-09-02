/**
 * Task 6.2 — the WAI-ARIA pattern map (design.md D5).
 *
 * Two halves:
 *
 *  1. `A11Y_PATTERNS` — the 11 recognized WAI-ARIA Authoring Practices (APG)
 *     patterns the library implements, each with the components that implement
 *     it, the required roles/states/keyboard, and what the audit asserts in
 *     jsdom. `aria-patterns.test.tsx` runs one check-set per pattern against the
 *     canonical live examples and reports the pass rate.
 *
 *  2. `COMPONENT_PATTERNS` — every public component (derived against
 *     `@components` in the test, same discipline as Task 6.1's coverage map)
 *     mapped to its pattern, or to `none` for plain text/decoration, with its
 *     current status. A component with `status: 'gap'` carries a severity and a
 *     planned remediation — this is the machine-readable half of the gap list
 *     Task 6.4 publishes in `docs/a11y.md`.
 *
 * Pass rule (stated so it can't be gamed): a pattern PASSES when every check in
 * its check-set holds. A check that fails may only stay failing if the failing
 * component is declared here as a `gap` — the test then asserts (a) the gap is
 * still exactly the declared one (each declared gap is written as a *positive*
 * requirement that must currently FAIL), and (b) nothing *new* failed. Fixing
 * the component therefore forces the declaration to be deleted, and any
 * regression shows up as an undeclared failure.
 *
 * A gap only counts against the D5 pass rate (`demotes: true`) when the pattern
 * is not demonstrated by any of its components in the audit. Where one component
 * cannot express the semantics while the others in its set do, the failure is
 * recorded (`demotes: false`) and published in `docs/a11y.md` without demoting
 * the pattern.
 *
 * What jsdom cannot assert (recorded here, upgrade path = Playwright):
 *   - real focus order / focus cycling inside the dialog trap (Tab behaviour);
 *   - arrow-key roving tabindex over a radiogroup / nav (jsdom fires the event,
 *     but the components implement no arrow-key handling — see the
 *     `radio-group` gap);
 *   - anything geometry-dependent (contrast, pointer-target size).
 */

export type PatternId =
  | 'meter'
  | 'progressbar'
  | 'radio-group'
  | 'toggle-button'
  | 'button'
  | 'dialog'
  | 'log'
  | 'spinbutton'
  | 'link'
  | 'navigation'
  | 'list';

/** A pattern check that does not currently hold, recorded rather than weakened. */
export interface PatternGap {
  /** Component the gap sits in (or `—` for a pattern-wide note). */
  component: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  /** What is missing, in terms of the pattern's required roles/states/keyboard. */
  finding: string;
  /** Planned remediation (Task 6.4 publishes this). */
  remediation: string;
  /**
   * `true` (default) = the gap means the pattern is not demonstrated at all, so
   * it counts against the pass rate. `false` = the pattern IS demonstrated by
   * the other components in its set; this component simply cannot express it
   * (yet), so the failure is recorded without demoting the pattern.
   */
  demotes?: boolean;
}

export interface PatternSpec {
  id: PatternId;
  /** WAI-ARIA Authoring Practices pattern name. */
  apg: string;
  /** Roles / states / properties the pattern requires. */
  requires: string[];
  /** Keyboard behaviour the pattern requires. */
  keyboard: string[];
  /** Which of those this jsdom audit asserts (the rest is listed as out of scope). */
  jsdomScope: string;
  /** Components implementing the pattern. */
  components: string[];
  /** Known, declared failures — never silently dropped. */
  gaps: PatternGap[];
}

export const A11Y_PATTERNS: PatternSpec[] = [
  {
    id: 'meter',
    apg: 'Meter (`role="meter"` + `aria-valuenow`/`-min`/`-max` + accessible name)',
    requires: ['role="meter"', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'accessible name'],
    keyboard: ['not focusable — a meter is a readout, not a control'],
    jsdomScope: 'role, accessible name and the three aria-value* attributes on the component root (passed through the root-attribute spread from the live example)',
    components: ['RadialGauge', 'LedColumn', 'MeterBar', 'SegmentedMeter', 'BarColumnGauge'],
    gaps: [
      {
        component: 'SegmentedMeter',
        severity: 'moderate',
        finding: 'Multi-column LED meter exposes no value semantics: the columns are bare divs, so AT reads nothing for a gauge that carries the most important number on the screen. No single `aria-valuenow` can be attached from outside because the component renders N columns.',
        remediation: 'Component change (6.4): render one `role="meter"` (or `role="img"` + sr-only summary) per column, or a `role="group"` with a `aria-valuetext` summary; sync from the internal level state.',
        demotes: false,
      },
      {
        component: 'BarColumnGauge',
        severity: 'moderate',
        finding: 'Self-driving bar + column histogram with no accessible value or name at all.',
        remediation: 'Same as SegmentedMeter: per-column meter role or an `aria-label` + `aria-valuetext` summary driven from `bar`/`columns`.',
        demotes: false,
      },
      {
        component: 'HealthColumns',
        severity: 'minor',
        finding: 'Already carries `role="img" aria-label="System health"`, which is a valid stopgap, but the lit/total summary the `onSummary` callback computes is not exposed to AT.',
        remediation: 'Accept an `aria-label`/summary prop and set `aria-valuetext` ("18/28 NOMINAL") on the existing `role="img"` root.',
        demotes: false,
      },
    ],
  },
  {
    id: 'progressbar',
    apg: 'Progressbar (`role="progressbar"` + `aria-valuenow`/`-min`/`-max`)',
    requires: ['role="progressbar"', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'accessible name'],
    keyboard: ['not focusable — a progressbar is a readout, not a control'],
    jsdomScope: 'role, name and the three aria-value* attributes on the component root; determinism (the animated fill is not asserted).',
    components: ['ProgressMeter', 'SegmentBar', 'TaskCard'],
    gaps: [
      {
        component: 'TaskCard',
        severity: 'minor',
        finding: 'The embedded `SegmentBar` renders inside `TaskCard`, so a consumer cannot attach `role="progressbar"`/`aria-valuenow` to it — the card announces "PROGRESS 62%" as plain text and the bar itself is silent.',
        remediation: 'Component change (6.4): pass the progress semantics onto the embedded SegmentBar (or render it with `role="progressbar" aria-valuenow={pct}`) inside TaskCard.',
        demotes: false,
      },
    ],
  },
  {
    id: 'radio-group',
    apg: 'Radio Group (`role="radiogroup"` > `role="radio"` + `aria-checked`)',
    requires: ['role="radiogroup" with accessible name', 'role="radio" per option', 'aria-checked on each option'],
    keyboard: ['Tab into the group; Enter/Space activates (native <button> here); APG also requires ←/→/↑/↓ roving tabindex'],
    jsdomScope: 'roles, group name, `aria-checked` state and that it moves on click; native `<button>` elements for Enter/Space. Arrow-key roving tabindex cannot be driven meaningfully in jsdom (see gap).',
    components: ['ChipRadioGroup', 'HazardRating'],
    gaps: [
      {
        component: 'ChipRadioGroup',
        severity: 'minor',
        finding: 'No arrow-key roving tabindex — every radio is in the tab order and ←/→/↑/↓ do nothing, which diverges from the APG keyboard contract (Enter/Space still works).',
        remediation: 'Component change (6.4): roving tabindex + `onKeyDown` arrow handling (or build on MUI ToggleButtonGroup, which the theme already styles).',
        demotes: false,
      },
      {
        component: 'HazardRating',
        severity: 'minor',
        finding: 'Same missing arrow-key roving tabindex as ChipRadioGroup; additionally the segment buttons have no visible text, only `aria-label={n}`.',
        remediation: 'Roving tabindex + arrow keys; give each segment `aria-valuetext` of the hazard word (NOMINAL…CRITICAL).',
        demotes: false,
      },
    ],
  },
  {
    id: 'toggle-button',
    apg: 'Button (toggle) — `aria-pressed`',
    requires: ['native <button> or role="button"', 'aria-pressed reflecting the on/off state', 'accessible name'],
    keyboard: ['Enter and Space activate (native <button>)'],
    jsdomScope: 'role, name, `aria-pressed` value before/after activation (click), `type="button"` where the component renders one.',
    components: ['FilterChips', 'FilterRail', 'Roster', 'AgentCard', 'ModuleCard', 'YesNoGate'],
    gaps: [],
  },
  {
    id: 'button',
    apg: 'Button (`role="button"` / native `<button>`, accessible name, Enter + Space)',
    requires: ['accessible name', 'focusable', 'activation on Enter and Space'],
    keyboard: ['Enter and Space activate'],
    jsdomScope: 'name, element type and the Enter/Space → callback contract (fireEvent.keyDown).',
    components: ['HazardPrompt', 'ApprovalBar', 'GateRow', 'RoutineRow'],
    gaps: [],
  },
  {
    id: 'dialog',
    apg: 'Dialog (Modal) — `role="dialog"`, `aria-modal`, focus management, Escape',
    requires: ['role="dialog"', 'aria-modal="true"', 'accessible name', 'focus moved into the dialog on open', 'Escape dismisses'],
    keyboard: ['Tab cycles inside the dialog (focus trap); Escape closes'],
    jsdomScope: 'role/name/aria-modal on the dialog surface, that initial focus lands on APPROVE (the component focuses it), and that Escape calls `onClose`. The Tab-cycling behaviour of MUI Modal’s focus trap is not assertable in jsdom (no real focus order).',
    components: ['GateDecisionDialog'],
    gaps: [],
  },
  {
    id: 'log',
    apg: 'Feed / live region — `role="log"` + `aria-live="polite"`',
    requires: ['role="log" (a live region)', 'aria-live="polite"', 'new rows announced without moving focus'],
    keyboard: ['not focusable; APG Feed additionally wants `role="feed"`/`article` for scrollable, paged feeds'],
    jsdomScope: 'role and aria-live on the scroll body, and that appended rows stay inside the live element.',
    components: ['LogConsole', 'Terminal'],
    gaps: [
      {
        component: 'Terminal',
        severity: 'minor',
        finding: 'No `role="log"`/live region — the typewriter transcript is invisible to AT until it finishes (and then reads as an undifferentiated text run).',
        remediation: 'Component change (6.4): `role="log"` + `aria-live="polite"` on the scroll body, or `aria-live="off"` while typing plus a "DIAGNOSTIC COMPLETE · 6 PASS · 1 FLAGGED" summary announced once.',
        demotes: false,
      },
    ],
  },
  {
    id: 'spinbutton',
    apg: 'Spinbutton (`role="spinbutton"`, `aria-valuenow`/`-min`/`-max`, ↑/↓ keys)',
    requires: ['the value element carries role="spinbutton"', 'aria-valuenow / aria-valuemin / aria-valuemax', 'accessible name'],
    keyboard: ['↑/↓ (and Home/End/PageUp/PageDown) change the value'],
    jsdomScope: 'role + aria-value* on the value element; arrow-key handling is out of jsdom scope.',
    components: ['NumberStepper'],
    gaps: [
      {
        component: 'NumberStepper',
        severity: 'moderate',
        finding: 'THE ONE FAILING PATTERN (10/11): the value field is a plain `input[readonly][aria-label="value"]` with no `role="spinbutton"` and no `aria-valuenow`/`-min`/`-max`, and ↑/↓ are not handled. A screen-reader user hears an empty read-only text box and gets no value or bounds; only the − / + buttons are usable.',
        remediation: 'Component change (6.4): put `role="spinbutton"` + `aria-valuenow={value}` + `aria-valuemin={min}` + `aria-valuemax={max}` + a real label on the value input and add ↑/↓/Home/End handling; the − / + buttons stay as they are.',
      },
    ],
  },
  {
    id: 'link',
    apg: 'Link (`<a href>` with an accessible name)',
    requires: ['anchor with a real href', 'accessible name from its text'],
    keyboard: ['Enter follows the link (native <a>)'],
    jsdomScope: 'role=link, name and the href attribute.',
    components: ['WikiLink', 'SiteHeader'],
    gaps: [],
  },
  {
    id: 'navigation',
    apg: 'Navigation / disclosure — `<nav>` landmark + `aria-current`',
    requires: ['nav landmark with an accessible name', 'aria-current="true" (or "page") on the active item'],
    keyboard: ['items are buttons/links, so Enter activates'],
    jsdomScope: 'landmark role + name, `aria-current` on the active item and its absence on the others.',
    components: ['ConsoleNav', 'SiteHeader', 'StepFlow', 'AgenticLoop'],
    gaps: [
      {
        component: 'SiteHeader',
        severity: 'minor',
        finding: 'The inner nav landmark (`<Box component="nav">`) takes no `aria-label`, so it is an unnamed landmark and a screen-reader landmark list shows a bare "navigation".',
        remediation: 'Component change (6.4): add an `ariaLabel` prop (defaulting to the brand name) for the inner nav. Not reachable from an example — the nav is an internal element.',
        demotes: false,
      },
      {
        component: 'StepFlow',
        severity: 'moderate',
        finding: 'The active step is conveyed only by a blinking fill — no `aria-current="step"` and no text alternative for done/upcoming.',
        remediation: 'Component change (6.4): set `aria-current="step"` on the active node (the root spreads attrs, so the example can carry it; the node itself is internal).',
        demotes: false,
      },
      {
        component: 'AgenticLoop',
        severity: 'moderate',
        finding: 'Same as StepFlow — the lit node has no `aria-current` and cycles without announcement.',
        remediation: 'Component change (6.4): add `aria-current` + an opt-out of self-cycling for AT (static first node).',
        demotes: false,
      },
    ],
  },
  {
    id: 'list',
    apg: 'List / listitem (`role="list"` > `role="listitem"`) — collection semantics',
    requires: ['a `role="list"` container', '`role="listitem"` on every row'],
    keyboard: ['not focusable — structure only (row actions stay buttons)'],
    jsdomScope: 'the container/listitem pairing and the row count on the canonical collections.',
    components: ['RailItem', 'SinkRow', 'RoutineRow', 'MemoryRow', 'GateRow'],
    gaps: [
      {
        component: '—',
        severity: 'minor',
        finding: 'Row components render a bare `<div>` and take list semantics from the consumer (`role="listitem"` via the root-attribute spread). The library ships no `list` wrapper, so a consumer who omits it gets an unstructured run of boxes.',
        remediation: 'Component change (6.4, optional): a `ConsoleList` wrapper (or a `list` prop on the rows) so list semantics are the default rather than the example’s job.',
        demotes: false,
      },
    ],
  },
];

/**
 * Findings that are real but sit outside any pattern's required
 * roles/states/keyboard, so they are recorded (and published) without
 * demoting a pattern. The audit asserts each still holds.
 */
export const RECORDED_FINDINGS: PatternGap[] = [
  {
    component: 'Roster, GateRow, ApprovalBar, ChipRadioGroup, HazardRating, FilterChips, ConsoleNav, NumberStepper',
    severity: 'minor',
    finding: 'Native `<button>` elements are rendered without an explicit `type="button"`. Harmless on these screens (no `<form>`), but inside one the buttons would submit it. (AgentCard, ModuleCard, RoutineRow and YesNoGate do set it.)',
    remediation: 'Component change (6.4): add `type="button"` to every non-submitting `<button>` the library renders.',
  },
];

/**
 * Gaps on components that implement *no* APG pattern (pure decoration: clocks,
 * marquees) — they cannot demote a pattern, but they are recorded and published
 * in `docs/a11y.md` like any other, and `aria-patterns.test.tsx` asserts each
 * still holds.
 */
export const DECORATION_GAPS: PatternGap[] = [
  {
    component: 'SevenSegClock',
    severity: 'moderate',
    finding: 'The time exists only as SVG polygons — there is no text content and no `role="img"`/`aria-label`, so a screen reader announces nothing for a clock.',
    remediation: 'Component change (6.4): `role="img"` + `aria-label` with the digit string (or visually-hidden text).',
  },
  {
    component: 'DigitalClock',
    severity: 'minor',
    finding: '`aria-label` sits on a generic `<div>` with no role, so it is ignored by AT; the digits themselves are only readable as text.',
    remediation: 'Component change (6.4): give the root a role a label can attach to (`role="timer"` is the right one for a clock).',
  },
  {
    component: 'Marquee',
    severity: 'minor',
    finding: 'The looping track is duplicated for the seam, so AT reads every item twice; nothing is `aria-hidden`.',
    remediation: 'Component change (6.4): mark the duplicate track `aria-hidden="true"` (and consider `role="marquee"`/pausing).',
  },
];

/** Total patterns the audit checks (the "11 applicable" of the D5 pass rate). */
export const APPLICABLE_PATTERN_COUNT = A11Y_PATTERNS.length;
/** Required pass rate (design.md D5: ≥ 10 of 11). */
export const REQUIRED_PATTERN_PASSES = 10;

/* ------------------------------------------------------------------ */
/* Component → pattern map (all 59 public components)                  */

export interface ComponentPattern {
  /** APG pattern id, `decoration` (visual-only) or `none` (plain text/structure). */
  pattern: PatternId | 'decoration' | 'none';
  /** How the semantics are expressed. */
  semantics: string;
  status: 'pass' | 'gap' | 'n/a';
  severity?: PatternGap['severity'];
  gap?: string;
  remediation?: string;
}

const none = (semantics: string): ComponentPattern => ({ pattern: 'none', semantics, status: 'n/a' });
const decoration = (semantics: string, severity?: PatternGap['severity'], gap?: string, remediation?: string): ComponentPattern => ({
  pattern: 'decoration',
  semantics,
  status: severity ? 'gap' : 'pass',
  severity,
  gap,
  remediation,
});

export const COMPONENT_PATTERNS: Record<string, ComponentPattern> = {
  // — text.tsx —
  BilingualLabel: none('text: one large term + its caption, no widget semantics.'),
  MetadataBlock: none('text: KEY:VALUE rows as plain content.'),
  SectionDivider: none('text: numbered section chrome.'),
  FieldLabel: none('native `<label>` (`component="label"`, `htmlFor`), so it is associated with its control by the browser.'),
  SectionHeading: none('text: `<h2>` + chrome (carries the document outline).'),
  DossierSheet: none('text: dossier block, headings and rows as plain content.'),
  // — chips.tsx —
  Stamp: decoration('non-interactive boxed `<span>`; filled/blink are visual state with no ARIA equivalent. The root spreads attributes, so a consumer can attach `role`/`aria-*` when a Stamp carries a status.'),
  // — layout.tsx —
  ConsoleFrame: none('structure: `header`/`main`/`aside`/`footer` landmarks come from the region elements.'),
  ZoneTitle: none('structure: `component` prop lets a consumer render a real heading (WCAG 1.3.1).'),
  Monogram: decoration('identity mark; bilingual text is real content.'),
  Stat: none('text: label + value.'),
  GaugeCard: none('container: the consumer’s gauge carries the semantics.'),
  TelemetryCard: none('container: ditto.'),
  // — flow.tsx —
  StepFlow: decoration('static step sequence; done/current are color-only.', 'moderate', 'The current step is conveyed only by a blinking fill — no `aria-current="step"` and no text alternative for done/upcoming.', 'Component change (6.4): `aria-current="step"` on the active node (the root spreads attrs, so the example can carry it; the node itself is internal).'),
  AgenticLoop: decoration('self-cycling loop; the lit node is color-only.', 'moderate', 'Same as StepFlow — the active node has no `aria-current` and cycles without announcement.', 'Add `aria-current` + an opt-out of self-cycling for AT (static first node).'),
  TaskCard: { pattern: 'progressbar', semantics: 'a card whose progress bar is an embedded, unreachable `SegmentBar`.', status: 'gap', severity: 'minor', gap: 'the embedded progress bar carries no `role="progressbar"`/`aria-valuenow` and cannot be reached from outside.', remediation: 'See the `progressbar` pattern gap.' },
  // — status.tsx —
  StatusLegend: decoration('legend stamps are text + color; the legend is the key itself.'),
  Roster: { pattern: 'toggle-button', semantics: 'each unit is a `<button aria-pressed>` in a grid.', status: 'pass' },
  StatTile: none('text: giant numeral KPI tile.'),
  RailItem: { pattern: 'list', semantics: 'a rail row; becomes `role="listitem"` inside a consumer `role="list"`.', status: 'pass' },
  GateRow: { pattern: 'button', semantics: 'row content + a real REVIEW `<button>` (or the verdict stamp when settled).', status: 'pass' },
  AgentCard: { pattern: 'toggle-button', semantics: '`<button type="button" aria-pressed={selected}>`.', status: 'pass' },
  RecallNote: none('text: cited fragment.'),
  SinkRow: { pattern: 'list', semantics: 'status row; list semantics come from the consumer container.', status: 'pass' },
  RoutineRow: { pattern: 'button', semantics: 'row content + a real RUN `<button>`.', status: 'pass' },
  ModuleCard: { pattern: 'toggle-button', semantics: '`<button type="button" aria-pressed={selected}>` with `<h3>` + `<p>` inside.', status: 'pass' },
  MemoryRow: { pattern: 'list', semantics: 'vault entry row; list semantics come from the consumer container.', status: 'pass' },
  AgentDot: none('text: status-bar readout (dot is `aria-hidden`-able decoration; the label carries the state in words).'),
  // — inputs.tsx —
  ChipRadioGroup: { pattern: 'radio-group', semantics: '`role="radiogroup"` + `role="radio" aria-checked` buttons.', status: 'gap', severity: 'minor', gap: 'no arrow-key roving tabindex (every option is tabbable).', remediation: 'See the `radio-group` pattern gap.' },
  NumberStepper: { pattern: 'spinbutton', semantics: '− / readonly value / + buttons; no spinbutton semantics yet.', status: 'gap', severity: 'moderate', gap: 'no `role="spinbutton"` / `aria-valuenow` / arrow keys on the value field.', remediation: 'See the `spinbutton` pattern gap.' },
  HazardRating: { pattern: 'radio-group', semantics: '`role="radiogroup"` + `role="radio" aria-checked aria-label={n}` segments.', status: 'gap', severity: 'minor', gap: 'no arrow-key roving tabindex; segments are labelled by number only.', remediation: 'See the `radio-group` pattern gap.' },
  TagInput: none('native `<input>` with `aria-label="add tag"` + MUI `Chip` delete buttons — the standard text-input pattern, no ARIA needed.'),
  DateSegments: none('read-only display; the segments are real text.'),
  // — navigation.tsx —
  FilterChips: { pattern: 'toggle-button', semantics: '`role="group" aria-label` + `aria-pressed` buttons.', status: 'pass' },
  FilterRail: { pattern: 'toggle-button', semantics: 'a `FilterChips` row + dim-not-hide rows (dimming is visual; nothing is removed from the tree).', status: 'pass' },
  WikiLink: { pattern: 'link', semantics: 'renders `<a href>` when `href` is given (a `<button>` otherwise).', status: 'pass' },
  ConsoleNav: { pattern: 'navigation', semantics: '`<nav aria-label>` + `aria-current` on the current item.', status: 'pass' },
  SiteHeader: { pattern: 'navigation', semantics: '`<header>` + inner `<nav>` of anchor links.', status: 'gap', severity: 'minor', gap: 'the inner nav landmark has no accessible name.', remediation: 'See the `navigation` pattern gap.' },
  Brand: decoration('wordmark lockup; the mark is a colored square with no content (decorative).'),
  // — feedback.tsx —
  HazardPrompt: { pattern: 'button', semantics: '`role="button" tabIndex={0} aria-label` + Enter/Space handler.', status: 'pass' },
  GateDecisionDialog: { pattern: 'dialog', semantics: 'MUI Modal (focus trap + Escape) over a full-screen surface; the example supplies `role="dialog" aria-modal` + name.', status: 'pass' },
  ApprovalBar: { pattern: 'button', semantics: 'two real `<button>`s (APPROVE/DENY) that disable once decided.', status: 'pass' },
  YesNoGate: { pattern: 'toggle-button', semantics: '`role="group" aria-label="decision"` + `aria-pressed` buttons over an `aria-live="polite"` response line (also covered by the `log` pattern’s live-region rule).', status: 'pass' },
  // — meters.tsx —
  SegmentedMeter: { pattern: 'meter', semantics: 'multi-column LED meter; value semantics are not expressible from outside.', status: 'gap', severity: 'moderate', gap: 'no per-column `role="meter"`/`aria-valuenow`.', remediation: 'See the `meter` pattern gap.' },
  RadialGauge: { pattern: 'meter', semantics: 'value semantics come from the consumer via the root spread (`role="meter" aria-valuenow…`), as the canonical example shows.', status: 'pass' },
  BarColumnGauge: { pattern: 'meter', semantics: 'self-driving bar + histogram with no accessible value.', status: 'gap', severity: 'moderate', gap: 'no name, no value.', remediation: 'See the `meter` pattern gap.' },
  ProgressMeter: { pattern: 'progressbar', semantics: 'value semantics from the consumer via the root spread.', status: 'pass' },
  HealthColumns: decoration('`role="img" aria-label="System health"` — a stopgap that keeps it out of the way of AT but hides the lit/total value.', 'minor', 'the computed lit/total summary is not exposed.', 'Set `aria-valuetext` on the existing `role="img"` root.'),
  SegmentBar: { pattern: 'progressbar', semantics: 'value semantics from the consumer via the root spread.', status: 'pass' },
  LedColumn: { pattern: 'meter', semantics: 'value semantics from the consumer via the root spread (`hotBelow` flips the fill, which the value already conveys).', status: 'pass' },
  MeterBar: { pattern: 'meter', semantics: 'value semantics from the consumer via the root spread.', status: 'pass' },
  // — terminal.tsx —
  Terminal: { pattern: 'log', semantics: 'typewriter transcript with no live-region semantics.', status: 'gap', severity: 'minor', gap: 'no `role="log"`/`aria-live`.', remediation: 'See the `log` pattern gap.' },
  LogConsole: { pattern: 'log', semantics: '`role="log" aria-live="polite"` on the scroll body.', status: 'pass' },
  // — clock.tsx —
  SevenSegClock: decoration('seven-segment SVG glyphs only — no text node anywhere.', 'moderate', 'A screen reader gets nothing: the time exists only as SVG polygons, so the information is missing entirely (WCAG 1.1.1).', 'Component change (6.4): `role="img"` + `aria-label`/sr-only text carrying the time or `digits` (and `aria-hidden` on the glyph SVGs).'),
  DigitalClock: decoration('`aria-label="system clock"` sits on a generic `<div>`, where AT ignores it — but the digits are real text, so the time is still read.', 'minor', 'the ignored `aria-label` is noise; the blinking colons are also announced as text.', 'Drop the `aria-label` or give the root `role="timer"` so the label applies.'),
  // — marquee.tsx —
  Marquee: decoration('hazard ticker; `reduced` renders it static.', 'minor', 'The track is duplicated for the seamless loop, so a screen reader reads every item twice.', 'Component change (6.4): `aria-hidden` on the duplicated track.'),
  // — charts.tsx —
  LineChart: decoration('canvas plot; the `label · status` caption is real text (the plot itself is decorative).'),
  Waveform: decoration('decorative separator; captions are real text.'),
  ScanLattice: decoration('decorative schematic grid + label.'),
};

/** Pattern lookup for the audit (`undefined` for components with no pattern). */
export function patternFor(component: string): PatternSpec | undefined {
  const entry = COMPONENT_PATTERNS[component];
  if (!entry || entry.pattern === 'none' || entry.pattern === 'decoration') return undefined;
  return A11Y_PATTERNS.find((p) => p.id === entry.pattern);
}