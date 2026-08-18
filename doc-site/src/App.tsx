/**
 * App shell — hash-routed docs site.
 *
 * The TOC rail lists the static pages (getting started, foundations, themed MUI,
 * patterns) followed by every component family from the generated site data, so
 * a new export is reachable here the moment it ships. The ⌘K palette and the
 * mobile nav drawer both hang off the same `tocOpen` state.
 */
import { Component, lazy, Suspense, useState } from 'react';
import type { ReactNode } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DocFooter,
  DocShell,
  DocsMasthead,
  EmptyPanel,
  TableOfContents,
  useCommandPalette,
  useScrollTopOnChange,
  type TocGroup,
} from './docs/chrome';
import { SearchDialog } from './search/SearchDialog';
import { groups, version } from './siteData';

// Pages are code-split so the landing bundle stays light — ~60 live previews
// plus the playground compiler are the heavy part, and only the route that
// needs them pays for them.
const Landing = lazy(() => import('./pages/Landing'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const ComponentPage = lazy(() => import('./components/ComponentPage'));
const Color = lazy(() => import('./pages/foundations/Color'));
const TypographyPage = lazy(() => import('./pages/foundations/TypographyPage'));
const SpacingShape = lazy(() => import('./pages/foundations/SpacingShape'));
const DepthGlow = lazy(() => import('./pages/foundations/DepthGlow'));
const MotionPage = lazy(() => import('./pages/foundations/MotionPage'));
const MuiButtons = lazy(() => import('./pages/mui/MuiButtons'));
const MuiGallery = lazy(() => import('./pages/mui/MuiGallery'));
const FormsPattern = lazy(() => import('./pages/patterns/FormsPattern'));
const ScreensPattern = lazy(() => import('./pages/patterns/ScreensPattern'));

/** The static nav above the component families. */
const STATIC_GROUPS: TocGroup[] = [
  {
    title: 'Overview',
    links: [{ label: 'Getting started', href: '#/getting-started' }],
  },
  {
    title: 'Foundations',
    links: [
      { label: 'Color & state', href: '#/foundations/color' },
      { label: 'Typography', href: '#/foundations/typography' },
      { label: 'Spacing & shape', href: '#/foundations/spacing-shape' },
      { label: 'Depth & glow', href: '#/foundations/depth-glow' },
      { label: 'Motion', href: '#/foundations/motion' },
    ],
  },
  {
    title: 'Themed MUI',
    links: [
      { label: 'Buttons & actions', href: '#/mui/buttons' },
      { label: 'Everything else', href: '#/mui/gallery' },
    ],
  },
  {
    title: 'Patterns',
    links: [
      { label: 'Forms', href: '#/patterns/forms' },
      { label: 'Screens', href: '#/patterns/screens' },
    ],
  },
];

/** Component families become their own TOC groups. */
const componentGroups: TocGroup[] = groups.map((g) => ({
  title: g.title,
  links: g.items.map((c) => ({ label: c.name, href: `#/components/${c.slug}` })),
}));

const TOC_GROUPS: TocGroup[] = [...STATIC_GROUPS, ...componentGroups];

/**
 * Catches lazy-chunk load failures. Routes are hashed chunks; after a Pages
 * deploy replaces the old assets, an already-open tab navigating to an unloaded
 * route 404s the chunk and would otherwise escape to the root. Offer a reload
 * instead of a blank page.
 */
class ChunkErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <Box
          sx={(t) => ({
            py: 14,
            textAlign: 'center',
            fontFamily: t.nerv.fonts.mono,
            fontSize: 11,
            letterSpacing: '0.14em',
            color: t.nerv.hue.amber,
          })}
        >
          <Box sx={{ mb: 2 }}>ROUTE FAILED TO LOAD — THE SITE WAS UPDATED.</Box>
          <Button variant="ghost" size="small" onClick={() => window.location.reload()}>
            ↺ RELOAD
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

function Shell() {
  const { pathname } = useLocation();
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useCommandPalette();

  // Scroll the routed page to the top on navigation.
  useScrollTopOnChange(pathname);

  // Mark the current link in the rail.
  const toc: TocGroup[] = TOC_GROUPS.map((g) => ({
    ...g,
    links: g.links.map((l) => ({ ...l, current: l.href === `#${pathname}` })),
  }));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DocsMasthead version={version} onSearchClick={() => setSearchOpen(true)} onMenuClick={() => setTocOpen(true)} />

      <DocShell toc={<TableOfContents groups={toc} onNavigate={() => setTocOpen(false)} />} tocOpen={tocOpen} onTocClose={() => setTocOpen(false)}>
        <ChunkErrorBoundary>
        <Suspense
          fallback={
            <Box
              sx={(t) => ({
                py: 14,
                textAlign: 'center',
                fontFamily: t.nerv.fonts.mono,
                fontSize: 11,
                letterSpacing: '0.14em',
                color: t.nerv.hue.amber,
              })}
            >
              LOADING…
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/components/:slug" element={<ComponentPage />} />
            <Route path="/foundations/color" element={<Color />} />
            <Route path="/foundations/typography" element={<TypographyPage />} />
            <Route path="/foundations/spacing-shape" element={<SpacingShape />} />
            <Route path="/foundations/depth-glow" element={<DepthGlow />} />
            <Route path="/foundations/motion" element={<MotionPage />} />
            <Route path="/mui/buttons" element={<MuiButtons />} />
            <Route path="/mui/gallery" element={<MuiGallery />} />
            <Route path="/patterns/forms" element={<FormsPattern />} />
            <Route path="/patterns/screens" element={<ScreensPattern />} />
            <Route path="*" element={<EmptyPanel title="NO SUCH ROUTE" detail="That address is not on the board. Pick a destination from the navigation or press ⌘K." />} />
          </Routes>
        </Suspense>
        </ChunkErrorBoundary>
        <DocFooter />
      </DocShell>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
