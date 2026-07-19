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

The theme and the [`../components`](../components) library are imported from
source via the `@theme` / `@components` aliases (see
[`vite.config.ts`](vite.config.ts) + [`tsconfig.app.json`](tsconfig.app.json)),
so editing a token, override, or component is instantly live here with HMR — no
package build. Because both live at the repo root (no adjacent `node_modules`),
`resolve.dedupe` resolves their bare peer imports (`react`, `react-dom`,
`@mui/material`, `@emotion/*`) to this app's single install — which also
guarantees one copy of React (path-aliasing it instead would double it and break
hooks the moment a portal component mounts).

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
  App.tsx                   route switch: / → design system · /dashboard-0{1,2,3} · /landing-0{1,2}
  pages/DesignSystemPage    the whole reference, one scrolling page (route /)
  pages/Dashboard01Page     "Morning Brief" console screen (route /dashboard-01),
                            ported from sample-layouts/dashboard-01.html
  pages/Dashboard02Page     "Project Deep Dive" (route /dashboard-02),
                            ported from sample-layouts/dashboard-02.html
  pages/Dashboard03Page     "Automation Central" (route /dashboard-03),
                            ported from sample-layouts/dashboard-03.html
  pages/Landing01Page       "Command Center" marketing homepage (route /landing-01),
                            ported from sample-layouts/landing-page-01.html
  pages/Landing02Page       "Operator Manifest" app-shell homepage (route /landing-02),
                            ported from sample-layouts/landing-page-02.html
  components/               Shell (rail + scroll-spy TOC), Masthead, Footer, primitives
  sections/                 Foundations · Atoms · FormControls · DataDisplay ·
                            Feedback · Navigation · Patterns
  lib/router.ts             tiny dependency-free path router (navigate + useRoute)
  lib/motion.ts             pad2 + helpers
```

Routing is a ~30-line `pathname` router ([`lib/router.ts`](src/lib/router.ts)) —
no dependency, and it stays off the URL hash so the design-system page keeps its
`#section` scroll-spy TOC. The design-system rail links to each `/dashboard-0N`
screen; every dashboard links back.

MUI components do the heavy lifting (TextField, Select, Checkbox, Switch, Slider,
ToggleButtonGroup, Chip, Alert, Dialog, Tabs, Pagination, Breadcrumbs, List,
Stepper). The console-specific pieces MUI has no equivalent for — legends,
stamps, meters, gauges, the terminal, hazard prompt, roster, marquee, 7-seg
clock, canvas trend/waveform/lattice — now live in the reusable
[`../components`](../components) library and are imported here via the
`@components` alias (see [`vite.config.ts`](vite.config.ts) +
[`tsconfig.app.json`](tsconfig.app.json)), so each section doubles as a live
usage example of the library.
