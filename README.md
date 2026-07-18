# The Phosphor Console

**A NERV/MAGI tactical UI system — an Evangelion-inspired design language, a production Material UI v7 theme, and reference implementations.**

Everything luminous blooms on true black. This is not a dark theme — it is a CRT
command deck. Information is drawn in glowing **phosphor mint**, cut with
**safety orange** chrome and **blood-red** alarms. There is no elevation, no
glass, no soft depth. Hierarchy is built from three materials only: **border,
glow, and hue** — dense, all-caps, bilingual (EN + JP), animated in abrupt
mechanical steps.

It is a **product**-register system (design serves the task) that is also a
themeable library: the same tokens power app screens (dashboards, forms, wiki)
and brand surfaces (landing pages). The bar is that a NERV screen from
*Neon Genesis Evangelion* and a screen built with this system should be
indistinguishable in grammar.

---

## Quick start (the MUI theme)

A production Material UI **v7** theme lives in [`theme/`](theme/).

```bash
npm i @mui/material @emotion/react @emotion/styled
# optional: @mui/icons-material @mui/x-data-grid
```

Copy `theme/` into your app, then:

```tsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline /> {/* installs the CRT pass, keyframes, reduced-motion guard */}
      {/* … */}
    </ThemeProvider>
  );
}
```

`CssBaseline` is **required** — it installs the CRT scanline/vignette overlay,
the blink keyframes the overrides depend on, and the `prefers-reduced-motion`
path. See [`theme/README.md`](theme/README.md) for tokens, custom variants, and
the full component map.

### Two schemes

| Scheme | Role |
| --- | --- |
| `dark` *(default)* | The canonical Phosphor Console — black field, phosphor glow, CRT pass. |
| `light` | The **Blueprint** schematic variant — pale field, dark ink, hairline traces, **no glow, no CRT**. A deliberate exception, not a generic light mode. |

`cssVariables` is on, so scheme-varying tokens switch without a re-render.

---

## The non-negotiable rules

1. **Black is the only surface** (`#0A0A0A`). No elevation grays, no drop
   shadows, no glass. Depth = border + glow + hue.
2. **Color is state.** mint = nominal/primary · orange = **chrome only** (never a
   data value) · blue = pending · amber = caution · red = critical.
3. **Filled means active.** Idle = outline on black; active/selected = solid hue
   fill with **black content** punched out. No glow on the content.
4. **Everything important is boxed** (a `.stamp`). Blinking = in-progress; solid
   fill = recorded/active.
5. **Bimodal type.** One giant element (kanji / numeral / heading) + tiny
   captions. Display = condensed ALL CAPS; data = monospace; JP = Mincho.
6. **Bilingual pairing.** A large kanji always carries a small English caption
   (`内部` / INTERNAL).
7. **Mechanical motion only.** `steps()` / `setInterval` / linear — never eased,
   spring, or bounce. Always ship a `prefers-reduced-motion` path.
8. **CRT pass** (scanline + vignette) on every dark screen.

**Absolute bans:** elevation shadows, glassmorphism, gradient text, colored
side-stripe borders, lowercase UI chrome, orange as a data value, glow on
black-on-fill content.

---

## Documentation

Two root docs are the authority — read both before building or editing any
screen or the theme:

- **[PRODUCT.md](PRODUCT.md)** — strategy: users, purpose, personality
  (bold · confident · distinctive), anti-references, the 5 design principles,
  and the WCAG 2.1 AA + reduced-motion bar.
- **[DESIGN.md](DESIGN.md)** — the visual system spec: North Star, tokens,
  typography, elevation=none, components, do's/don'ts.

Supporting references:

- **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)** — buildable token + component catalog.
- **[design-system.html](design-system.html)** — living gallery of the system.
- **[REFERENCE-ANALYSIS.md](REFERENCE-ANALYSIS.md)** — per-GIF breakdown of the
  source references in [`references-chosen/`](references-chosen/).
- **[EXPERIMENTS-SPEC.md](EXPERIMENTS-SPEC.md)** — build spec for new standalone
  HTML studies (viewport guard, init-order rules, browser verification flow).

---

## Repo layout

```
DESIGN.md · PRODUCT.md · design-system.html      # design authority
DESIGN-SYSTEM.md · REFERENCE-ANALYSIS.md         # research
EXPERIMENTS-SPEC.md                              # spec for new HTML studies
theme/                                           # the MUI v7 theme
sample-layouts/                                  # reference implementations
experiements/                                    # standalone HTML studies
references-chosen/                               # the 23 source GIFs
references/zapac-material-ui/                     # a reference MUI theme (not verbatim)
```

**Reference implementations** in [`sample-layouts/`](sample-layouts/) —
self-contained HTML, no build, no network:

- `dashboard-0{1,2,3}.html` — command-console dashboards
- `form-0{1,2}.html` — filing / data-entry forms
- `landing-page-0{1,2}.html` — brand surfaces
- `wiki.html` — long-form reading surface

The [`experiements/`](experiements/) folder holds ~40 standalone studies that
explore individual patterns.

---

## Accessibility

Targets **WCAG 2.1 AA**, held as a real bar:

- Body text ≥ 4.5:1 against its background; large/bold ≥ 3:1. The
  black-on-fill inversion is both the brand grammar and the higher-contrast
  choice.
- Visible keyboard focus on every interactive control (`:focus-visible`, never
  removed without a replacement ring).
- `prefers-reduced-motion` is honored on every animation, in both CSS and JS —
  killing blinks, strobes, and marquees while rendering the final settled state.
- Status is reinforced beyond hue: semantic colors travel with a boxed kanji +
  English stamp, so a state is legible without color discrimination alone.

---

## Conventions

- Prefer the tokens/components in [`theme/`](theme/) and the patterns in the
  reference implementations over reinventing. Branch out only when the UX wins.
- Verify visual work in the browser (screenshot) before calling it done; check
  the console and exercise at least one interaction.
- **Never hardcode a hex or size that isn't traceable to a token in**
  [`theme/tokens.ts`](theme/tokens.ts).
