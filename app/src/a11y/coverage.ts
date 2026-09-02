/**
 * Task 6.1 — coverage map for the axe-core harness.
 *
 * D5 decision: the audit fixtures are the app's own live-example routes. Every
 * public component in `components/index.ts` is rendered by at least one route in
 * `app/src/pages/*`; this map records which. `axe.test.tsx` derives the public
 * component list from `import * as Phosphor from '@components'` and fails if a
 * component is missing from (or stale in) this map, so adding a component to the
 * library without an audited live example breaks CI rather than silently
 * dropping coverage.
 *
 * Routes:
 *   `/`               DesignSystemPage — Foundations · Atoms · FormControls ·
 *                     DataDisplay · Feedback · Navigation · Patterns · Additions
 *   `/dashboard-0N`   full console screens ported from sample-layouts
 *   `/landing-0N`     marketing/manifest screens
 */
export interface RouteFixture {
  /** Client-side route path (see `app/src/App.tsx`). */
  path: string;
  /** Human label used in test names and the Task 6.4 gap list. */
  label: string;
}

export const ROUTES: RouteFixture[] = [
  { path: '/', label: 'design-system' },
  { path: '/dashboard-01', label: 'dashboard-01 · morning brief' },
  { path: '/dashboard-02', label: 'dashboard-02 · project deep dive' },
  { path: '/dashboard-03', label: 'dashboard-03 · automation central' },
  { path: '/landing-01', label: 'landing-01 · command center' },
  { path: '/landing-02', label: 'landing-02 · operator manifest' },
];

/** Public component name → app routes that render it live. */
export const COVERAGE: Record<string, string[]> = {
  // — text —
  BilingualLabel: ['/dashboard-01'],
  MetadataBlock: ['/'],
  SectionDivider: ['/'],
  FieldLabel: ['/'],
  SectionHeading: ['/', '/landing-02'],
  DossierSheet: ['/', '/landing-02'],
  // — atoms —
  Stamp: ['/', '/dashboard-01', '/dashboard-02', '/dashboard-03', '/landing-01', '/landing-02'],
  // — layout —
  ConsoleFrame: ['/dashboard-01', '/dashboard-02', '/dashboard-03'],
  ZoneTitle: ['/dashboard-01', '/dashboard-02', '/dashboard-03'],
  Monogram: ['/dashboard-01'],
  Stat: ['/dashboard-01'],
  GaugeCard: ['/', '/dashboard-03'],
  TelemetryCard: ['/', '/landing-01'],
  // — flow —
  StepFlow: ['/dashboard-02'],
  AgenticLoop: ['/', '/landing-02'],
  TaskCard: ['/', '/dashboard-02'],
  // — status —
  StatusLegend: ['/', '/dashboard-01', '/dashboard-02', '/dashboard-03'],
  Roster: ['/'],
  StatTile: ['/'],
  RailItem: ['/dashboard-01'],
  GateRow: ['/dashboard-01'],
  AgentCard: ['/dashboard-02'],
  RecallNote: ['/dashboard-02'],
  SinkRow: ['/', '/dashboard-03'],
  RoutineRow: ['/', '/dashboard-03'],
  ModuleCard: ['/', '/landing-01'],
  MemoryRow: ['/', '/landing-02'],
  AgentDot: ['/', '/dashboard-03', '/landing-01', '/landing-02'],
  // — inputs —
  ChipRadioGroup: ['/'],
  NumberStepper: ['/'],
  HazardRating: ['/'],
  TagInput: ['/'],
  DateSegments: ['/'],
  // — navigation —
  FilterChips: ['/', '/dashboard-03', '/landing-02'],
  FilterRail: ['/'],
  WikiLink: ['/'],
  ConsoleNav: ['/', '/dashboard-01', '/landing-02'],
  SiteHeader: ['/landing-01'],
  Brand: ['/', '/landing-02'],
  // — feedback —
  HazardPrompt: ['/'],
  GateDecisionDialog: ['/dashboard-01'],
  ApprovalBar: ['/dashboard-02'],
  YesNoGate: ['/', '/landing-01'],
  // — meters & gauges —
  SegmentedMeter: ['/'],
  RadialGauge: ['/', '/dashboard-03', '/landing-01'],
  BarColumnGauge: ['/'],
  ProgressMeter: ['/dashboard-01'],
  HealthColumns: ['/dashboard-01', '/dashboard-02'],
  SegmentBar: ['/', '/dashboard-03', '/landing-01'],
  LedColumn: ['/', '/dashboard-03', '/landing-01', '/landing-02'],
  MeterBar: ['/', '/landing-02'],
  // — terminal / clock / charts —
  Terminal: ['/', '/landing-01'],
  LogConsole: ['/dashboard-02', '/dashboard-03'],
  SevenSegClock: ['/', '/dashboard-01', '/dashboard-02', '/dashboard-03'],
  DigitalClock: ['/', '/landing-01'],
  Marquee: ['/', '/landing-01'],
  LineChart: ['/', '/landing-02'],
  Waveform: ['/', '/dashboard-02', '/landing-02'],
  ScanLattice: ['/', '/landing-01'],
};

/** Names exported from `@components` that are helpers, not components. */
export const NON_COMPONENT_EXPORTS = new Set(['toneHue', 'useReducedMotion', 'pad2']);