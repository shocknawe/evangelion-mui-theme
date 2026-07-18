# CLAUDE.md

Guidance for agents working in this repository.

## What this is

A reusable **NERV/MAGI tactical UI system** — an Evangelion-inspired design
language plus a Material UI theme and reference implementations. The identity is
**"The Phosphor Console"**: a black CRT command deck where information glows in
phosphor mint, safety orange, and blood red — dense, all-caps, bilingual
(EN + JP), animated in abrupt mechanical steps.

It is a **product**-register project (design serves the task) that is also a
themeable library: the same tokens power app screens (dashboards, forms, wiki)
and brand surfaces (landing pages).

## Read before touching UI

Two root docs are the authority. Read both before building or editing any screen
or the theme:

- **[PRODUCT.md](PRODUCT.md)** — strategy: users (developers adopting the theme),
  purpose, personality (bold · confident · distinctive), anti-references, the 5
  design principles, and the WCAG 2.1 AA + reduced-motion bar.
- **[DESIGN.md](DESIGN.md)** — the visual system spec (North Star, tokens,
  typography, elevation=none, components, do's/don'ts). Machine-readable
  frontmatter + `.impeccable/design.json` sidecar.

Supporting references: [design-system.md](design-system.md) (buildable token +
component catalog), [design-system.html](design-system.html) (living gallery),
[REFERENCE-ANALYSIS.md](REFERENCE-ANALYSIS.md) (per-GIF breakdown of the 23
source references in `references-chosen/`).

## The non-negotiable rules

1. **Black is the only surface.** `#0A0A0A`. No elevation grays, no drop
   shadows, no glass. Depth = border + glow + hue.
2. **Color is state.** mint = nominal/primary · orange = **chrome only** (never a
   data value) · blue = pending · amber = caution · red = critical.
3. **Filled means active.** Idle = outline on black; active/selected = solid hue
   fill with **black (`#0A0A0A`) content** punched out. No glow on the content.
4. **Everything important is boxed** (a `.stamp`). Blinking = in-progress; solid
   fill = recorded/active.
5. **Bimodal type.** One giant element (kanji / numeral / heading) + tiny
   captions. Display = condensed ALL CAPS; data = monospace; JP = Mincho.
6. **Bilingual pairing.** Large kanji always carries a small English caption.
7. **Mechanical motion only.** `steps()` / `setInterval` / linear — never eased,
   spring, or bounce. Loaders end by reverse-cascade to black. Always ship a
   `prefers-reduced-motion` path that renders the final state.
8. **CRT pass** (scanline + vignette) on every dark screen.
9. Number a sequence only when it *is* one (form sections, OODA loop, pipeline).

Absolute bans: elevation shadows, glassmorphism, gradient text, side-stripe
borders (`border-left/right` > 1px accent), lowercase UI chrome, orange as a
data value, glow on black-on-fill content. Modals are one focal job only.

## The MUI theme

A production Material UI **v7** theme lives in [`theme/`](theme/) — see
[`theme/README.md`](theme/README.md) for install and usage.

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
<ThemeProvider theme={theme} defaultMode="dark"><CssBaseline />…</ThemeProvider>
```

- Two schemes: `dark` (canonical, default) and `light` (the **Blueprint**
  schematic variant — flat, no glow/CRT). `cssVariables` is on.
- Tokens: scheme-invariant on `theme.nerv.*`, scheme-varying on
  `theme.palette.nerv.*` (CSS vars — reach them via `theme.vars.palette.nerv.*`).
- Custom variants: Button `ghost`/`alt`/`stamp` (+ `className="nerv-live"`),
  Chip `stamp`, Paper `chamfer`/`frame`, Typography `jp`/`terminal`/`stamp`/`data`.
- Overrides source of truth is `theme/tokens.ts`. **Never hardcode a hex or size
  that isn't traceable to a token there.**

Typecheck the theme against MUI types (no deps installed at root) with the
Zapac reference's toolchain if needed:
`references/zapac-material-ui/node_modules/.bin/tsc -p <tsconfig>`.

## Repo layout

```
DESIGN.md · PRODUCT.md · design-system.{md,html}   # design authority
REFERENCE-ANALYSIS.md · DESIGN-SYSTEM.md           # research
theme/                                             # the MUI v7 theme
experiment-*.html · experiment-sonnet-*.html       # standalone studies
dashboard-0{1,2,3}.html · form-0{1,2}.html         # reference implementations
landing-page-0{1,2}.html · wiki.html
references-chosen/                                 # the 23 source GIFs
references/zapac-material-ui/                       # a reference MUI theme (do not copy verbatim)
.impeccable/                                        # design.json sidecar + live config
```

The standalone HTML files are self-contained (no build, no network). When
building new ones, follow `EXPERIMENTS-SPEC.md` — it carries the zero-size
viewport guard, init-order/TDZ rules, and the browser-pane verification flow.

## Conventions

- Prefer the tokens/components in `theme/` and the patterns in the reference
  implementations over reinventing. Branch out only when the UX wins.
- Verify visual work in the browser (screenshot) before calling it done; check
  the console for errors and exercise at least one interaction.
- Interpunct in IDs (`VEGA·1`, `GATE·04`); `KEY:VALUE` metadata blocks
  (`CODE:`, `FILE:`, `EXTENTION:` — the canonical misspelling, `EX_MODE:`,
  `PRIORITY:`).
