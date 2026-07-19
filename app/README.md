# Phosphor Console — demo app

A Vite + React + Material UI **v9** app that mounts the theme from
[`../theme`](../theme) and rebuilds [`design-system.html`](../design-system.html)
as a living, interactive reference — every token and component rendered with
**real MUI components** carrying the theme's overrides.

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run typecheck  # tsc -b (also type-checks ../theme in context)
```

## How it consumes the theme

The theme is imported from source via the `@theme` alias (see
[`vite.config.ts`](vite.config.ts) + [`tsconfig.app.json`](tsconfig.app.json)),
so editing a token or override in `../theme` is instantly live here with HMR — no
package build. Because the theme lives at the repo root (no adjacent
`node_modules`), the config also maps the theme's bare deps to this app's install.

Mounted dark-only, as the theme ships (see [`src/main.tsx`](src/main.tsx)):

```tsx
<ThemeProvider theme={theme} defaultMode="dark">
  <CssBaseline />   {/* CRT pass · keyframes · reduced-motion */}
  <App />
</ThemeProvider>
```

## Structure

```
src/
  main.tsx                  ThemeProvider + CssBaseline (dark)
  pages/DesignSystemPage    the whole reference, one scrolling page
  components/               Shell (rail + scroll-spy TOC), Masthead, Footer, primitives
  sections/                 Foundations · Atoms · FormControls · DataDisplay ·
                            Feedback · Navigation · Patterns
  widgets/                  bespoke data-viz not in MUI: 7-seg clock, segmented
                            meter, gauges, canvas trend/waveform, scan lattice,
                            terminal log, roster, marquee
  lib/motion.ts             useReducedMotion + helpers
```

MUI components do the heavy lifting (TextField, Select, Checkbox, Switch, Slider,
ToggleButtonGroup, Chip, Alert, Dialog, Tabs, Pagination, Breadcrumbs, List,
Stepper); the `widgets/` are the console-specific pieces MUI has no equivalent
for, each reading `theme.nerv.*` so nothing is hardcoded off-token.
