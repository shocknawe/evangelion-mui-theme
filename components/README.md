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

### Text — bimodal / bilingual pairings

| Component | What it is | Key props |
|---|---|---|
| `BilingualLabel` | Large kanji + small English caption (the signature bimodal pair) | `jp`, `en`, `tone`, `size`, `layout` |
| `MetadataBlock` | Monospace `KEY:VALUE` spec block | `entries` (object or `[k,v][]`), `keyTone` |
| `SectionDivider` | Numbered index chip · kanji · title · fading rule | `index`, `jp`, `title` |
| `FieldLabel` | Bilingual caption above a form control | `jp`, `label`, `children` |

### Status

| Component | What it is | Key props |
|---|---|---|
| `StatusLegend` | Row of bilingual status stamps (filled = active) | `items: {jp,en,tone,filled?}[]` |
| `Roster` | Grid of selectable status tiles (OFFLINE inverts, CAUTION blinks) | `units`, `columns`, `onSelect` |
| `StatTile` | Negative-space KPI: tiny label, giant numeral, tiny footer | `label`, `value`, `footer`, `tone` |

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
| `FilterRail` | Filter chips that **dim** non-matching rows (never hide) | `filters`, `rows`, `value`/`defaultValue`, `onChange`, `allValue` |
| `WikiLink` | `[[cross-reference]]` that inverts on hover | `children`, `href`, `onClick` |

### Feedback

| Component | What it is | Key props |
|---|---|---|
| `HazardPrompt` | Full-bleed tri-channel Y/N decision surface (flashes on activate) | `jp`, `en`, `onDecide`, `height` |

### Data-viz

| Component | What it is | Key props |
|---|---|---|
| `SegmentedMeter` | Vertical LED columns with a drawn threshold line | `values`/`defaultValues`, `segments`, `limitPct`, `columnLabels`, `animated` |
| `RadialGauge` | Segmented arc with a big center readout | `value`, `label`, `segments`, `size`, `animated` |
| `BarColumnGauge` | Horizontal LED bar over a column histogram | `columns`, `bar`, `animated` |
| `Terminal` | Amber diagnostic log with dot-leader checks + typewriter reveal | `rows`, `title`, `typewriter`, `speed` |
| `SevenSegClock` | Seven-segment clock (mint chip + orange readout skins) | `variant` |
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
([`../app`](../app)) — the design-system page imports them all from `@components`.
