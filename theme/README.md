# Phosphor Console — Material UI theme

A production Material UI **v7** theme that translates the NERV/MAGI tactical
design system (see [`DESIGN.md`](../DESIGN.md), [`design-system.md`](../design-system.md),
[`design-system.html`](../design-system.html)) into a complete `createTheme`
configuration: tokens, typography, glow-as-elevation, shape, and overrides for
every commonly used component.

> **Identity — "The Phosphor Console."** Black CRT command deck. Color *is*
> state (mint nominal · orange chrome · blue pending · amber caution · red
> critical). Active/selected inverts figure and ground (solid hue, black
> content). No elevation — depth is border + glow + hue. Motion is mechanical
> (linear / `steps()`), never eased.

## Install

```bash
npm i @mui/material @emotion/react @emotion/styled
# optional: @mui/icons-material @mui/x-data-grid
```

Copy `theme/` into your app (e.g. `src/theme/`).

## Use

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline /> {/* loads the CRT pass, keyframes, reduced-motion */}
      {/* … */}
    </ThemeProvider>
  );
}
```

`CssBaseline` is required — it installs the CRT scanline/vignette overlay, the
`nervBlink` / `nervBtnBlink` keyframes the overrides depend on, and the
`prefers-reduced-motion` guard.

## Two schemes

| Scheme | Role |
| --- | --- |
| `dark` *(default)* | The canonical Phosphor Console — black field, phosphor glow, CRT pass. |
| `light` | The **Blueprint** schematic daylight variant — pale gray field, dark ink, hairline traces, **no glow, no CRT**. A deliberate schematic exception (per DESIGN.md), not a generic light mode. |

Toggle with MUI's color-scheme API:

```tsx
import { useColorScheme } from '@mui/material/styles';
const { mode, setMode } = useColorScheme();
setMode(mode === 'dark' ? 'light' : 'dark');
```

`cssVariables` is on (`colorSchemeSelector: 'class'`), so scheme-varying tokens
are emitted as `--mui-*` CSS variables and switch without a re-render.

## Structure

```
theme/
  index.ts          createTheme composition (schemes, transitions, zIndex, nerv tokens)
  tokens.ts         raw primitives — the single source of truth
  palette.ts        buildPalette(scheme) → MUI palette + custom palette.nerv group
  typography.ts     three faces (display / mono / jp) + custom variants
  shape.ts          radius 0
  spacing.ts        8px unit (matches the 4/8/16/24/32 rhythm)
  shadows.ts        glow-as-elevation (there are no drop shadows)
  augmentation.ts   TS module augmentation (custom keys + variants)
  components/
    index.ts        merged override map
    cssBaseline.ts  CRT pass, keyframes, reduced-motion, base body
    buttons.ts      Button (+ ghost/alt/stamp), IconButton, ButtonGroup, Toggle*, Fab
    inputs.ts       TextField, OutlinedInput, Input*, Select, Checkbox, Radio, Switch, Slider
    surfaces.ts     Paper (+ chamfer/frame), Card, Accordion, AppBar
    dataDisplay.ts  Chip (+ stamp), Avatar, Badge, Table, List, Divider, Tooltip, Typography
    navigation.ts   Tabs, Drawer, Menu, Breadcrumbs, Pagination, Stepper, Link
    feedback.ts     Alert, Snackbar, Dialog, Progress, Skeleton, Backdrop
    dataGrid.ts     OPT-IN @mui/x-data-grid overrides (merge yourself; see file)
    util.ts         v(theme) CSS-var resolver, stamp helper, keyframe names
```

## Custom tokens

Scheme-invariant tokens live on `theme.nerv`; scheme-varying ones on
`theme.palette.nerv` (so they become CSS vars). In `sx` / `styled`:

```tsx
sx={(t) => ({
  color: t.nerv.hue.mint,                 // invariant hue
  border: `1px solid ${t.vars.palette.nerv.stroke}`, // scheme-varying (CSS var)
  clipPath: t.nerv.chamfer(20),           // chamfered panel
  background: t.nerv.hazard(),            // 45° hazard stripes
})}
```

`theme.nerv` includes: `hue` (all 15 named colors), `radius`, `space`, `fonts`,
`motion`, `layers`, and the `chamfer(cut)` / `hazard(a,b)` helpers.
`theme.palette.nerv` includes: `surface2`, `stroke`, `stroke2`, `track`, `field`,
`fieldFocus`, `termText`, `termDim`, `glowPanel*`, `glowFocus`, `glowMint`, `crt`.

## Custom variants

| Component | Variant | Use |
| --- | --- | --- |
| `Button` | `ghost` | Quiet secondary (dim outline, mono). |
| `Button` | `alt` | Chrome-level action (orange outline). |
| `Button` | `stamp` | Boxed status-stamp; `.Mui-selected` blinks (the live action). |
| `Button` | `className="nerv-live"` | Any button → blinking selected-action. |
| `Chip` | `stamp` | Solid-fill inverse stamp (black content on hue). |
| `Paper` | `chamfer` | Hero/focal panel with a cut corner. |
| `Paper` | `frame` | Double-frame command shell. |
| `Typography` | `jp` / `terminal` / `stamp` / `data` | Kanji graphic / log line / stamp / tabular numerals. |

Status colors map to `color` props: `success`=mint, `info`=blue,
`warning`=amber, `error`=red across Chip/Alert/Button — the "subtle / outlined /
elevated / ghost / destructive / success / warning" intents are expressed
through these semantic colors + variants rather than one-off styles.

## Fonts

System stacks by default (self-contained, no network). Web-font upgrade targets
are named in `tokens.ts`: **Oswald** (display), **Share Tech Mono** (data),
**Shippori Mincho B1** (JP). Load them via `@fontsource/*` and the stacks pick
them up automatically.

## Accessibility

Targets WCAG 2.1 AA. The black-on-fill inversion is both the brand grammar and
the higher-contrast choice (black beats white on mint/amber/red/blue). Focus is
always visible (`:focus-visible` rings, never removed). `prefers-reduced-motion`
kills every blink/strobe via `CssBaseline`. Terminal "dim" text is lifted off
the raw `#9C3C24` (fails AA) to an AA-safe rust for actual text.
