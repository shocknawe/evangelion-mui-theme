# Phosphor Console — component library

Reusable **NERV/MAGI tactical UI** React components that pair with the theme in
[`../theme`](../theme). These are the console-specific pieces Material UI has no
direct equivalent for — the bilingual pairings, boxed stamps, segmented meters,
diagnostic terminal, hazard prompt. Stock inputs, alerts, dialogs, tabs and lists
are already styled by the theme's overrides, so use those straight from
`@mui/material`.

Every component reads `theme.nerv.*` tokens — **nothing is hardcoded off-token** —
so dropping one into a `ThemeProvider` gives you the design language for free.

## Install / mount

The library is peer-dependent on `@mui/material`, `@emotion/react`,
`@emotion/styled` and `react`. Mount the theme, then import components:

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '../theme';
import { StatusLegend, SegmentedMeter, HazardPrompt } from '../components';

<ThemeProvider theme={theme} defaultMode="dark">
  <CssBaseline />
  <StatusLegend items={[{ jp: '正常', en: 'NOMINAL', tone: 'mint' }]} />
  <SegmentedMeter />
  <HazardPrompt jp="裁定" en="DECIDE" onDecide={route} />
</ThemeProvider>
```

Reduced motion is automatic: every animated component reads `useReducedMotion`
and settles to its final frame when the user prefers reduced motion.

## Components

### Atoms

| Component | What it is | Key props |
|---|---|---|
| `Stamp` | The boxed status pill (`.stamp`): outline on black, or a solid `filled` inversion; optional `blink`/`glow` | `children`, `tone`, `filled`, `blink`, `glow`, `size` |

### Text — bimodal / bilingual pairings

| Component | What it is | Key props |
|---|---|---|
| `BilingualLabel` | Large kanji + small English caption (the signature bimodal pair) | `jp`, `en`, `tone`, `size`, `layout` |
| `MetadataBlock` | Monospace `KEY:VALUE` spec block | `entries` (object or `[k,v][]`), `keyTone` |
| `SectionDivider` | Numbered index chip · kanji · title · fading rule | `index`, `jp`, `title` |
| `SectionHeading` | Marketing section head: numbered chip · big heading · fading rule · note | `index`, `children`, `note` |
| `DossierSheet` | Spec/dossier block: teal-ruled heading · KEY/VALUE rows · signature · optional watermark | `title`, `rows`, `watermark`, `signature` |
| `FieldLabel` | Bilingual caption above a form control | `jp`, `label`, `children` |

### Layout & structure

| Component | What it is | Key props |
|---|---|---|
| `ConsoleFrame` | The chamfered command shell: full-width header over a `sidebar · main · rail` grid, plus optional `band` / `footer` rows and an `alarm` state (red frame + hazard stripe); orange double-frame, independent scroll regions (stacks on mobile) | `header`, `band`, `sidebar`, `rail`, `footer`, `alarm`, `children`, `sidebarWidth`, `railWidth`, `headerHeight`, `footerHeight` |
| `ZoneTitle` | Orange section label over a hairline rule, with optional amber meta | `children`, `aside` |
| `Monogram` | Boxed bilingual monogram — glowing kanji over a caption | `jp`, `label`, `tone`, `size` |
| `Stat` | Compact label/value vital (lighter than `StatTile`) | `label`, `value`, `tone` |
| `GaugeCard` | Single-corner-chamfered card framing one gauge as a monitored channel (tinted by state) | `kind`, `name`, `children`, `readout`, `sub`, `tone` |
| `TelemetryCard` | Bordered telemetry panel: title/type header · gauge body · two-slot footer | `title`, `type`, `children`, `foot`, `tone` |

### Flow — step sequences

| Component | What it is | Key props |
|---|---|---|
| `StepFlow` | Horizontal progress stepper (done → current → upcoming) — chamfered nodes | `steps`, `active` |
| `AgenticLoop` | The OODA loop as a ring of kanji nodes, one lit at a time (self-cycling or controlled) | `steps`, `caption`, `active`, `cycleMs` |
| `TaskCard` | Loop-synchronizer task: id · title · action, a `StepFlow`, and a progress bar | `id`, `title`, `action`, `active`, `pct`, `steps` |

### Status

| Component | What it is | Key props |
|---|---|---|
| `StatusLegend` | Row of bilingual status stamps (filled = active) | `items: {jp,en,tone,filled?}[]` |
| `Roster` | Grid of selectable status tiles (OFFLINE inverts, CAUTION blinks) | `units`, `columns`, `onSelect` |
| `StatTile` | Negative-space KPI: tiny label, giant numeral, tiny footer | `label`, `value`, `footer`, `tone` |
| `RailItem` | Reminder / inbox row: title · subtitle · due, with a `done` strike | `title`, `sub`, `when`, `done` |
| `GateRow` | Decision-queue row: id · title · leader · priority · REVIEW/verdict | `id`, `title`, `sub`, `priority`, `verdict`, `onReview` |
| `SinkRow` | Delivery-sink row: name · state · ping · LIVE/DOWN stamp (OFFLINE inverts) | `name`, `status`, `detail`, `ping`, `stampLabel` |
| `RoutineRow` | Routine-manager row: id · name · kind · status stamp · RUN (dims when filtered) | `id`, `name`, `kind`, `status`, `dim`, `onRun` |
| `ModuleCard` | Pinnable product/system card: kanji glyph · code · title · body · state stamp | `jp`, `code`, `codeSub`, `title`, `children`, `stamp`, `meta`, `tone`, `selected`, `onSelect` |
| `MemoryRow` | Memory-vault entry: id · title · kind stamp (decision/pattern/mistake/learning) | `id`, `title`, `kind` |
| `AgentDot` | Status-bar agent readout: a state dot (mint nominal · amber busy) + label | `children`, `busy` |

### Form controls

| Component | What it is | Key props |
|---|---|---|
| `ChipRadioGroup` | Single-select bilingual chips with figure/ground inversion | `options`, `value`, `onChange` |
| `NumberStepper` | −/value/+ integer stepper | `value`, `onChange`, `min`, `max`, `step` |
| `HazardRating` | Discrete rating over a hazard-hatched track | `value`, `onChange`, `max` |
| `TagInput` | Deletable stamp chips + type-to-add | `tags`, `onChange`, `placeholder` |
| `DateSegments` | Read-only glowing segmented date/number | `segments`, `separator` |

### Navigation

| Component | What it is | Key props |
|---|---|---|
| `FilterChips` | Just the scope-chip row (active = orange inversion) — pair with your own dimmed rows | `filters`, `value`, `onChange`, `ariaLabel` |
| `FilterRail` | Filter chips that **dim** non-matching rows (never hide) | `filters`, `rows`, `value`/`defaultValue`, `onChange`, `allValue` |
| `WikiLink` | `[[cross-reference]]` that inverts on hover | `children`, `href`, `onClick` |
| `ConsoleNav` | Bilingual sidebar nav — `boxed` (mint inversion) or `rail` (app-shell links with a left-edge indicator) | `items`, `value`, `onChange`, `variant` |
| `SiteHeader` | Sticky landing-page brand nav: mark · wordmark · links (smooth-scroll `#anchors`) · actions slot | `name`, `version`, `links`, `actions` |
| `Brand` | The diamond mark + wordmark + version lockup (inline or stacked) | `name`, `version`, `size`, `stackVersion` |

### Feedback

| Component | What it is | Key props |
|---|---|---|
| `HazardPrompt` | Full-bleed tri-channel Y/N decision surface (flashes on activate) | `jp`, `en`, `onDecide`, `height` |
| `GateDecisionDialog` | Full-screen approve / deny / defer decision modal (focus-trapped, Esc-aware) | `open`, `item`, `onDecide`, `onClose`, `jp`, `en` |
| `YesNoGate` | Big marketing Y/N call-to-action with a self-tracked response line | `yesLabel`, `noLabel`, `yesResponse`, `noResponse`, `onDecide` |

### Data-viz

| Component | What it is | Key props |
|---|---|---|
| `SegmentedMeter` | Vertical LED columns with a drawn threshold line | `values`/`defaultValues`, `segments`, `limitPct`, `columnLabels`, `animated` |
| `RadialGauge` | Segmented arc with a big center readout | `value`, `label`, `segments`, `size`, `animated` |
| `BarColumnGauge` | Horizontal LED bar over a column histogram | `columns`, `bar`, `animated` |
| `LedColumn` | Single vertical LED column (fills bottom-up; goes red under `hotBelow`) | `value`, `segments`, `tone`, `hotBelow` |
| `MeterBar` | Labeled thin **continuous** vitals bar (CPU/mem sidebar stat); `warn` flips to amber | `label`, `value`, `pct`, `tone`, `warn` |
| `ProgressMeter` | Horizontal segmented progress bar with a drawn threshold/gate line | `value`, `segments`, `threshold`, `label`, `readout`, `animated` |
| `HealthColumns` | Mini stepped system-health bars (biased-nominal) | `columns`, `cells`, `animated` |
| `Terminal` | Amber diagnostic log — dot-leader checks, `exec` rows (timestamp + rich message), typewriter reveal | `rows`, `title`, `typewriter`, `speed`, `minBodyHeight`, `maxBodyHeight` |
| `SevenSegClock` | Seven-segment clock (mint chip + orange readout skins); drive with `digits` for uptime | `variant`, `digits` |
| `DigitalClock` | Plain mono `HH:MM:SS` readout with blinking colons (header/nav clock) | `tone`, `size` |
| `Marquee` | Red hazard status ticker (linear scroll) | `items`, `speedSec` |
| `LineChart` | Glowing sparse trend line over a dotted field | `label`, `status`, `height` |
| `Waveform` | Braided oscilloscope separator | `label`, `caption`, `height` |
| `ScanLattice` | Static schematic grid with a targeting reticle | `height`, `nodeLabel` |

**Controlled vs. self-driving:** the meters, gauges and charts animate a demo
feed when uncontrolled; pass `values` / `value` / `columns` (etc.) to drive them
from your own data, which also stops the internal animation.

## Tones

Components take a semantic `tone` instead of a raw hex, mapped by `toneHue`:

| tone | meaning | hue |
|---|---|---|
| `mint` | nominal / primary / success | `#52F29A` |
| `green` | secondary data / captions | `#3C9C6C` |
| `amber` | caution / terminal | `#F49F09` |
| `blue` | pending / in-review | `#5090D0` |
| `red` | critical / error | `#E2280F` |
| `orange` | chrome (borders, chips) — **never a data value** | `#F26400` |
| `paper` | max-brightness fill | `#EDF8D6` |
| `dim` | idle border / disabled | `#246C3C` |

## Styling

Each component accepts an `sx` prop, merged after its base styles (MUI array-sx
pattern), so you can extend without fighting the defaults:

```tsx
<StatTile label="NODES" value="2,482" sx={{ minHeight: 120 }} />
```

Live examples of every component render in the demo app
([`../app`](../app)): the design-system page (`/`) imports them all from
`@components`, and three full console screens assemble them, each ported from the
matching `sample-layouts/` file:

- **`/dashboard-01`** — "Morning Brief" (header · sidebar · main · rail + the gate
  decision modal).
- **`/dashboard-02`** — "Project Deep Dive" (agent consoles, OODA loop, approval bar).
- **`/dashboard-03`** — "Automation Central" (a `GaugeCard` trigger bank, a live
  `LogConsole` exec feed, `SinkRow` sinks, and a `FilterChips`-scoped `RoutineRow`
  manager inside a `ConsoleFrame` with a footer status bar + retry-alarm state).
- **`/landing-01`** — "Command Center" marketing homepage (`SiteHeader` sticky nav,
  a live hero cluster, `Marquee` ticker, a `ModuleCard` system grid, `ScanLattice`
  separator, `RadialGauge`/`SegmentBar`/`LedColumn` telemetry, a `Terminal` feed,
  and a Y/N deploy gate — section breaks by `SectionHeading`).
- **`/landing-02`** — "Operator Manifest" editorial app-shell (dual sticky rails,
  `ConsoleNav` `rail` variant, a cycling agentic-loop hero, `Waveform` separator,
  `LedColumn` retention bars, a `FilterChips` + `MemoryRow` query list, a
  `LineChart` throughput signal, a dossier block, and a theme-styled access
  `Dialog`).
