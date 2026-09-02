# Phosphor Console — Material UI theme

A production Material UI **v9** theme that translates the NERV/MAGI tactical
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
npm i phosphor-console-theme @mui/material @emotion/react @emotion/styled
# optional: @mui/icons-material @mui/x-data-grid
```

## Use

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from 'phosphor-console-theme'; // or 'phosphor-console-theme/theme'

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline /> {/* loads the CRT pass, keyframes, reduced-motion */}
      {/* … */}
    </ThemeProvider>
  );
}
```

## Extending the theme

Extend with a **shallow object spread**. `theme` is a plain object, so each
top-level key (`palette`, `typography`, `components`, `transitions`, …) is
replaced one key at a time — spread the base value at *that key* when you want
to add to it, never splice into something nested deeper. Define the result once
at module scope (outside your component), never per render:

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { theme } from 'phosphor-console-theme';

// One level per key. `components` is a top-level key, so spread the base
// override map and add or replace whole component entries.
const consoleTheme: Theme = {
  ...theme,
  components: {
    ...theme.components,
    MuiButton: {
      ...theme.components?.MuiButton,
      defaultProps: {
        ...theme.components?.MuiButton?.defaultProps,
        // keep the console grammar, tighten your own app's defaults
        size: 'small',
      },
    },
  },
};

export default function App() {
  return (
    <ThemeProvider theme={consoleTheme} defaultMode="dark">
      <CssBaseline />
      {/* … */}
    </ThemeProvider>
  );
}
```

A shallow spread keeps the whole base theme intact — including the structural
`theme.nerv.*` tokens that the override callbacks read (`theme.nerv.motion`,
`theme.nerv.radius`, …) and the `--mui-*` variables `cssVariables` already
emitted. Replace a top-level key only when you mean to replace it wholesale.

> **Do not deep-merge.** There is no deep-merge helper in this package, on
> purpose:
>
> - **First-render cost.** A deep merge walks every key of a fully built theme
>   (palette, typography variants, ~40 component override objects) on every
>   call. MUI's own guidance is to build the theme once and spread — and note
>   that `createTheme(baseTheme, patch)` inside MUI *is* a deepmerge, so prefer
>   the explicit spread above, where every replaced key is visible.
> - **It breaks the single-source token guarantee.** `tokens.ts` is the only
>   place a hex, size, or timing value may live. Deep-merging silently writes
>   new values into nested groups (`theme.nerv.hue`,
>   `components.MuiButton.styleOverrides`), so styles no longer trace to a
>   token and you have two sources of truth.
> - **It desyncs the CSS variables.** `cssVariables` is on, so palette values
>   were resolved to `--mui-*` vars when the theme was created. Merging a new
>   color into the built theme object does not regenerate `theme.vars` — the
>   stylesheet and the object disagree.
>
> If a change you're making feels like it needs a deep merge, it's a token or
> override change: make it in `theme/` (or open an issue), not in a consumer.

### Tokens and overrides are separately importable

For per-component customization — `sx` on the root, the `classes` keys,
`slots`/`slotProps`, and the single-class `Nerv*-root` theme override — see the
**CUSTOMIZE · 改変** section on each component's doc-site page (one runnable
recipe per component — e.g.
[Stamp](https://shocknawe.github.io/evangelion-mui-theme/#/components/stamp)).
[Per-component documentation](#per-component-documentation) below describes the
approach those recipes take.

`phosphor-console-theme/tokens` is the raw, import-safe token module — usable
with no theme and no overrides at all:

```tsx
import { createTheme } from '@mui/material/styles';
import { hue, motion } from 'phosphor-console-theme/tokens';

const myTheme = createTheme({
  palette: { mode: 'dark', primary: { main: hue.mint } },
  transitions: { duration: { standard: motion.durations.fast } },
});
```

`phosphor-console-theme/overrides` is the bare `components` override map. Its
style callbacks read `theme.nerv.*`, so if you feed it to your own
`createTheme`, pair it with the structural tokens — the quickest way is the
spread above, starting from the full theme.

## Developing in this repo

If you're editing the theme *source* (not consuming the published package),
`app/` imports `theme/index.ts` and `components/index.ts` straight from the
repo root via a Vite alias (see `app/vite.config.ts`) — no build step, tokens
update live under HMR. Run `npm run build` at the repo root (via `tsup`) only
to produce the publishable `dist/` used by `npm publish`.

`CssBaseline` is required — it installs the CRT scanline/vignette overlay, the
`nervBlink` / `nervBtnBlink` keyframes the overrides depend on, and the
`prefers-reduced-motion` guard.

## Dark only

The theme ships a single `dark` scheme — the canonical Phosphor Console (black
field, phosphor glow, CRT pass). There is no light mode: the console is a black
CRT command deck by definition. Mount it with `defaultMode="dark"`.

`cssVariables` is on (`colorSchemeSelector: 'class'`), so every custom token is
emitted as a `--mui-*` CSS variable and consumed via `theme.vars.*`.

## Structure

```
theme/
  index.ts          createTheme composition (dark scheme, transitions, zIndex, nerv tokens)
  tokens.ts         raw primitives — the single source of truth
  palette.ts        buildPalette() → MUI palette + custom palette.nerv group
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

Structural tokens live on `theme.nerv`; palette tokens on `theme.palette.nerv`
(emitted as CSS vars). In `sx` / `styled`:

```tsx
sx={(t) => ({
  color: t.nerv.hue.mint,                 // structural hue
  border: `1px solid ${t.vars.palette.nerv.stroke}`, // palette token (CSS var)
  clipPath: t.nerv.chamfer(20),           // chamfered panel
  background: t.nerv.hazard(),            // 45° hazard stripes
})}
```

`theme.nerv` includes: `hue` (all 14 named colors), `radius`, `space`, `fonts`,
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

> **Live-example coverage (honest).** Six of the ten custom variants above are
> exercised by no `app/` route — Button `stamp`, Paper `frame`, and the
> Typography `jp` / `terminal` / `stamp` / `data` variant props. They *are*
> verified rendering (token/color/geometry asserted against the real theme in a
> throwaway harness), just not on a demo screen; the variant-by-variant matrix,
> method, and evidence live in
> [`openspec/changes/upgrade-theme-quality-maturity/notes/4.3-variant-rendering.md`](../openspec/changes/upgrade-theme-quality-maturity/notes/4.3-variant-rendering.md).
> Follow-ups that add them to an `app/src/sections/*` card should tick that
> route-coverage gap — no new routes were built for this note.

## Per-component documentation

Every one of the 59 components has a page in the docs site with a live
playground, the generated props table, and three contract sections:

- **Edge cases** — reduced-motion behavior (hook-gated vs. the global CssBaseline
  guard), portal rendering (`GateDecisionDialog`), controlled/uncontrolled
  modes, clamping, and the props-spread/ref conventions (Tasks 3.2–3.3).
- **Performance notes** — what the component actually runs: intervals, canvas
  repaint rates, memoization, and per-module gzip weight
  ([`docs/bundle-budgets.md`](../docs/bundle-budgets.md)).
- **Customize** — a runnable recipe per component: `sx` on the root, the
  `classes` keys (parsed from the props interface, so they cannot drift),
  `slots`/`slotProps` where the component has them, and the theme-wide
  single-class `Nerv*-root` override.

Component pages live at `/components/<slug>` on the
[doc site](https://shocknawe.github.io/evangelion-mui-theme/#/components/stamp)
(source: `doc-site/src/components/ComponentPage.tsx` + the per-component notes in
`doc-site/src/registry.tsx`, rendered against the generated
`doc-site/src/generated/site-data.json`), and the machine-readable spine — name, module,
props summary, `classes` keys, consumed tokens, and example `app/` route per
component — is [`registry.json`](../registry.json), generated from source by
`npm run registry`. `llms.txt` at the doc-site root indexes the same pages for
agent consumption.

The theme-wide half of every recipe is one class of specificity: the library
emits `Nerv<Component>-root` (and `Nerv<Component>-<part>`) on its own elements,
defines **zero** selectors against those classes, and puts no `!important` on
any `Nerv*` class — its only three `!important` declarations sit inside the
sanctioned global `prefers-reduced-motion: reduce` reset in
`theme/components/cssBaseline.ts` (the accessibility backstop, targeting `*`,
`*::before`, and `*::after`; see the
[reduced-motion exception](../openspec/changes/upgrade-theme-quality-maturity/notes/3.5-selector-specificity.md)).
So a consumer rule on `.NervStamp-root` wins without escalation (see the selector
audit in
[`openspec/changes/upgrade-theme-quality-maturity/notes/3.5-selector-specificity.md`](../openspec/changes/upgrade-theme-quality-maturity/notes/3.5-selector-specificity.md)).

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
