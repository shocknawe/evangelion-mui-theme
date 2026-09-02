/**
 * Task 3.6 — API-convention assertions (specs/component-api-conventions/spec.md).
 *
 * One parametrized check-set per public `@components` component, asserting the
 * three strict-API contracts Tasks 3.2/3.3/3.4 implemented:
 *
 *   (a) prop spread   — an undeclared prop (`data-testid`) and a handler
 *                       (`onClick`) reach the root DOM element;
 *   (b) ref forwarding — a `ref` resolves to the component's outermost DOM node
 *                       (the MUI-Modal portal surface for GateDecisionDialog);
 *   (c) `classes`      — `classes={{ root: 'consumer-x' }}` puts BOTH
 *                       `consumer-x` and the stable `Nerv<Component>-root`
 *                       class on the root element (notes/2.3 naming contract),
 *                       with the consumer `className` appended after them and
 *                       neither `classes` nor `className` leaking as a DOM
 *                       attribute.
 *
 * The suite is driven by a render-fixture map (the same fail-closed shape
 * `a11y/coverage.ts` and `a11y/aria-patterns.ts` use): every public component
 * must have a fixture, and a stale fixture is an error too, so adding a
 * component to the library without exercising these contracts breaks the run.
 * Fixtures carry minimal valid props — the assertions are never weakened for
 * portal/dialog components (GateDecisionDialog) or required-prop components
 * (FieldLabel, ConsoleFrame, GaugeCard, TelemetryCard, …).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentType } from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import * as Phosphor from '@components';
import { theme } from '@theme';
import { NON_COMPONENT_EXPORTS } from '../a11y/coverage';

/* fixture map                                                        */

type PublicComponent = Exclude<keyof typeof Phosphor, 'toneHue' | 'useReducedMotion' | 'pad2'>;

interface Fixture {
  /** Minimal valid props for one mount of the component. */
  props?: Record<string, unknown>;
  /** The root renders inside a portal (MUI Modal) — assert accordingly. */
  portal?: boolean;
  /** The component draws on a <canvas> — stub getContext (jsdom has no canvas). */
  canvas?: boolean;
  /** Extra render cases for components with more than one root form. */
  variants?: Array<{ label: string; props?: Record<string, unknown> }>;
}

/**
 * Component name → minimal mount. Keyed by the public export name so the
 * `satisfies` below fails to compile when a component has no fixture.
 */
const FIXTURES = {
  // — text —
  BilingualLabel: { props: { jp: '内部', en: 'INTERNAL' } },
  MetadataBlock: { props: { entries: { CODE: '0771' } } },
  SectionDivider: { props: { index: '01', jp: '個体', title: 'IDENTITY' } },
  FieldLabel: { props: { jp: '件名', label: 'TEXT INPUT', children: <input aria-label="TEXT INPUT" /> } },
  SectionHeading: { props: { index: '02', children: 'SYSTEM TELEMETRY' } },
  DossierSheet: { props: { title: 'OPERATOR DOSSIER', rows: [['CODE', '0771']] } },
  // — atoms —
  Stamp: { props: { children: 'SYS:NOMINAL' } },
  // — layout —
  ConsoleFrame: { props: { header: 'MORNING BRIEF', children: 'MAIN COLUMN' } },
  ZoneTitle: { props: { children: 'ENGINEERING' } },
  Monogram: { props: { jp: '磁', label: 'MAGI' } },
  Stat: { props: { label: 'CPU', value: '12%' } },
  GaugeCard: { props: { kind: 'CRON · 定時', name: 'NIGHTLY REVIEW', children: 'gauge' } },
  TelemetryCard: { props: { title: '◐ VAULT RETENTION', children: 'gauge' } },
  // — flow —
  StepFlow: { props: { steps: [{ short: 'OBS', label: 'OBSERVE' }], active: 0 } },
  AgenticLoop: { props: { steps: [{ jp: '観測', en: 'OBSERVE' }], active: 0 } },
  TaskCard: { props: { id: 'TASK·882', title: 'OPTIMIZE LATENCY', active: 0, pct: 62 } },
  // — status —
  StatusLegend: { props: { items: [{ jp: '正常', en: 'NOMINAL', tone: 'mint' }] } },
  Roster: {},
  StatTile: { props: { label: 'MEMORY NODES', value: '2,482' } },
  RailItem: { props: { title: 'RENEW SERVER CLUSTER CERTS', when: '14:00' } },
  GateRow: { props: { id: 'GATE·04', title: 'APPROVE DEPLOY' } },
  AgentCard: { props: { name: 'AGENT·ORION', status: 'ACTIVE', task: 'REFACTOR POOL' } },
  RecallNote: { props: { id: 'DECISION_LOG_32', children: 'cited fragment' } },
  SinkRow: { props: { name: 'NTFY GATEWAY', status: 'ACTIVE' } },
  RoutineRow: { props: { id: 'RT·02', name: 'JOURNAL SYNC', kind: 'CRON', status: 'SUCCESS' } },
  ModuleCard: { props: { jp: '工', code: 'SYS·01', title: 'ENGINEERING', stamp: 'NOMINAL', children: 'Pipelines and gates.' } },
  MemoryRow: { props: { id: 'MEM-2024-0512', title: 'Recursive feedback loop', kind: 'pattern' } },
  AgentDot: { props: { children: 'AGENT·01: NOMINAL' } },
  // — inputs —
  ChipRadioGroup: { props: { options: [{ value: 'routine', jp: '通常', en: 'B++' }], value: 'routine', onChange: () => {} } },
  NumberStepper: { props: { value: 4, onChange: () => {} } },
  HazardRating: { props: { value: 3, onChange: () => {} } },
  TagInput: { props: { tags: ['ALPHA'], onChange: () => {} } },
  DateSegments: { props: { segments: ['2026', '07', '18'] } },
  // — navigation —
  FilterChips: { props: { filters: ['ALL', 'CRON'], value: 'ALL' } },
  FilterRail: { props: { filters: ['ALL', 'CRON'], rows: [{ id: 'R·01', name: 'EVENT JOB', kind: 'CRON' }] } },
  WikiLink: {
    props: { children: '[[MEMORY_VAULT]]', href: '#data' },
    variants: [{ label: 'button root', props: { children: '[[MEMORY_VAULT]]' } }],
  },
  ConsoleNav: { props: { items: [{ value: 'eng', jp: '工学', en: 'ENGINEERING' }], value: 'eng', onChange: () => {} } },
  SiteHeader: { props: { name: 'JAIRUS_OS', version: 'v2.4.0' } },
  Brand: { props: { name: 'JAIRUS_OS', version: 'v2.4.0' } },
  // — feedback —
  HazardPrompt: { props: { jp: '裁定', en: 'DECIDE' } },
  GateDecisionDialog: { props: { open: true, item: 'GATE·04', onDecide: () => {} }, portal: true },
  ApprovalBar: { props: { item: 'PR-442' } },
  YesNoGate: {},
  // — meters & gauges —
  SegmentedMeter: { props: { values: [10, 13, 8, 15], animated: false } },
  RadialGauge: { props: { value: 98, animated: false } },
  BarColumnGauge: { props: { columns: [5, 7, 4, 6, 8, 5], bar: 9, animated: false } },
  ProgressMeter: { props: { value: 68, animated: false } },
  HealthColumns: { props: { animated: false } },
  SegmentBar: { props: { value: 45 } },
  MeterBar: { props: { label: 'CPU', value: '12.4%', pct: 12 } },
  LedColumn: { props: { value: 72 } },
  // — terminal / clock / marquee / charts —
  Terminal: { props: { typewriter: false } },
  LogConsole: { props: { rows: [{ ts: '14:02:51', msg: 'PIPELINE V3 STARTED' }] } },
  SevenSegClock: { props: { digits: '142355' } },
  DigitalClock: {},
  Marquee: { props: { items: ['V2.4.0-STABLE DEPLOYED'] } },
  LineChart: { canvas: true },
  Waveform: { canvas: true },
  ScanLattice: {},
} satisfies Record<PublicComponent, Fixture>;

type FixtureName = keyof typeof FIXTURES;

/* harness                                                             */

interface Mounted {
  container: HTMLElement;
  root: HTMLElement | null;
  onClick: ReturnType<typeof vi.fn>;
  /** True when the root renders inside a portal (MUI Modal). */
  portal: boolean;
}

/**
 * Mounts one fixture with the three contracts applied uniformly on top of the
 * component's own minimal props: an undeclared `data-testid`, a consumer
 * `className`, a root `onClick`, a `ref`, and `classes={{ root: … }}`.
 */
function mountFixture(name: FixtureName, props: Record<string, unknown> = {}, portal = false, canvas = false): Mounted {
  if (canvas) vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  const Comp = Phosphor[name] as unknown as ComponentType<Record<string, unknown>>;
  const onClick = vi.fn();
  const ref = { current: null as HTMLElement | null };
  const container = render(
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <Comp
        {...props}
        classes={{ root: 'consumer-x' }}
        className="consumer-class"
        data-testid="nerv-root"
        onClick={onClick}
        ref={ref}
      />
    </ThemeProvider>,
  ).container;
  return { container, onClick, root: ref.current, portal };
}

/* the suite                                                           */

describe('API conventions (Task 3.6)', () => {
  afterEach(cleanup);

  it('asserts all three contracts on every public component (fail closed)', () => {
    const publicComponents = Object.keys(Phosphor)
      .filter((name) => /^[A-Z]/.test(name) && !NON_COMPONENT_EXPORTS.has(name))
      .sort();
    const fixtures = Object.keys(FIXTURES).sort();
    expect(
      {
        missing: publicComponents.filter((name) => !fixtures.includes(name)),
        stale: fixtures.filter((name) => !publicComponents.includes(name)),
      },
      'FIXTURES must cover exactly the public component list — add a fixture (never skip the assertions)',
    ).toEqual({ missing: [], stale: [] });
    console.log(`[api-conventions] ${publicComponents.length} public components × (prop spread, ref forwarding, classes.root)`);
  });

  describe.each(Object.entries(FIXTURES) as [FixtureName, Fixture][])('%s', (name, fixture) => {
    const cases = [
      { label: name, props: fixture.props, portal: fixture.portal, canvas: fixture.canvas },
      ...(fixture.variants ?? []).map((v) => ({ label: `${name} (${v.label})`, props: v.props, portal: fixture.portal, canvas: fixture.canvas })),
    ];

    it.each(cases)('$label — spreads undeclared props, forwards ref to the outermost node, applies classes.root', (c) => {
      const { container, onClick, root, portal } = mountFixture(name, c.props, c.portal, c.canvas);

      /* (b) ref forwarding — the ref resolves to the outermost DOM node. */
      expect(root, `${name}: ref did not resolve to a DOM node`).toBeTruthy();
      if (portal) {
        expect(container.contains(root), `${name}: the root must render in the Modal portal, not the container`).toBe(false);
        expect(document.body.contains(root), `${name}: the portal root must be in document.body`).toBe(true);
      } else {
        expect(container.firstElementChild, `${name}: ref must land on the outermost rendered element`).toBe(root);
      }

      /* (a) prop spread — an undeclared attribute and a handler reach it. */
      expect(root!.getAttribute('data-testid'), `${name}: undeclared data-testid did not reach the root element`).toBe('nerv-root');
      expect(root!.getAttribute('class'), `${name}: consumer className did not reach the root element`).toContain('consumer-class');
      fireEvent.click(root!);
      expect(onClick, `${name}: consumer onClick did not fire from the root element`).toHaveBeenCalledOnce();

      /* (c) classes — the consumer key AND the stable generated name. */
      const classList = root!.getAttribute('class') ?? '';
      expect(classList, `${name}: classes.root was not applied to the root element`).toContain('consumer-x');
      expect(classList, `${name}: the stable Nerv<${name}>-root class is missing from the root element`).toContain(`Nerv${name}-root`);
      expect(root!.hasAttribute('classes'), `${name}: the classes prop leaked to the DOM as an attribute`).toBe(false);
      expect(root!.hasAttribute('classname'), `${name}: className was applied as a DOM attribute, not a class`).toBe(false);
    });
  });
});