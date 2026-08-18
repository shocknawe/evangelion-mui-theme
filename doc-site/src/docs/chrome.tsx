/**
 * Doc-site page chrome — the masthead, TOC rail, shell, and section furniture.
 *
 * These are scaffolding for the documentation, not design-system components (the
 * same split `app/src/components/primitives.tsx` makes for the living gallery).
 * They compose house components where one exists — `SiteHeader`/`Brand` for the
 * masthead, `ZoneTitle` for section heads, `Stamp` for every tag — and resolve
 * every remaining value from `theme.nerv.*`.
 *
 * Sections here are deliberately *unnumbered*: a component page is a set of
 * facets, not a sequence, and the design language numbers only real sequences.
 */
import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Monogram, SiteHeader, Stamp, ZoneTitle } from '@components';

export interface TocLink {
  label: string;
  href: string;
  current?: boolean;
}

export interface TocGroup {
  title: string;
  links: TocLink[];
}

/* ------------------------------------------------------------------ */
/* Masthead                                                            */

export interface DocsMastheadProps {
  version: string;
  onSearchClick: () => void;
  onMenuClick: () => void;
}

/**
 * The sticky top bar: brand + version, the search trigger, and (below `md`) the
 * button that opens the TOC drawer. Built on the house `SiteHeader` — its
 * `links` slot is left empty because it smooth-scrolls `#anchor` hrefs, which
 * would collide with this site's `#/route` hash routing.
 */
export function DocsMasthead({ version, onSearchClick, onMenuClick }: DocsMastheadProps) {
  return (
    <SiteHeader
      name={
        <Box component="a" href="#/" sx={{ color: 'inherit', textDecoration: 'none' }}>
          PHOSPHOR_CONSOLE
        </Box>
      }
      version={`v${version}`}
      maxWidth={1680}
      actions={
        <>
          <Button
            variant="ghost"
            size="small"
            onClick={onSearchClick}
            sx={{ fontSize: 10, py: 0.5 }}
            aria-label="Search the documentation"
          >
            SEARCH
            <Box
              component="span"
              sx={(t) => ({ ml: 1, color: t.nerv.hue.orange, letterSpacing: '0.1em' })}
            >
              ⌘K
            </Box>
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={onMenuClick}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, fontSize: 10, py: 0.5, minWidth: 0 }}
            aria-label="Open the navigation"
          >
            ☰ NAV
          </Button>
        </>
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Table of contents                                                   */

/**
 * The grouped nav rail. The current link inverts to a mint left-edge indicator
 * over a faint tint — the same "current item" grammar `ConsoleNav variant="rail"`
 * uses in an app shell.
 */
export function TableOfContents({ groups, onNavigate }: { groups: TocGroup[]; onNavigate?: () => void }) {
  return (
    <Box component="nav" aria-label="Documentation">
      {groups.map((g) => (
        <Box key={g.title} sx={{ mb: 2.5 }}>
          <Box
            sx={(t) => ({
              fontFamily: t.nerv.fonts.display,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.16em',
              color: t.nerv.hue.orange,
              textTransform: 'uppercase',
              borderBottom: `1px solid ${t.nerv.hue.greenDim}`,
              pb: 0.5,
              mb: 0.75,
            })}
          >
            {g.title}
          </Box>
          {g.links.map((l) => (
            <Box
              key={l.href}
              component="a"
              href={l.href}
              onClick={onNavigate}
              aria-current={l.current ? 'page' : undefined}
              sx={(t) => ({
                display: 'block',
                fontFamily: t.nerv.fonts.mono,
                fontSize: 11,
                lineHeight: 1.5,
                p: '4px 8px',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: l.current ? t.nerv.hue.mintHi : t.nerv.hue.mint,
                opacity: l.current ? 1 : 0.66,
                borderLeft: `2px solid ${l.current ? t.nerv.hue.mint : 'transparent'}`,
                background: l.current ? 'rgba(82,242,154,.08)' : 'transparent',
                transition: `background ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}`,
                '&:hover': { opacity: 1, background: 'rgba(82,242,154,.05)' },
                '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: -2, opacity: 1 },
              })}
            >
              {l.label}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */

const RAIL_W = 236;

export interface DocShellProps {
  toc: ReactNode;
  tocOpen: boolean;
  onTocClose: () => void;
  children: ReactNode;
}

/** Sticky TOC rail (a drawer below `md`) beside the scrolling main column. */
export function DocShell({ toc, tocOpen, onTocClose, children }: DocShellProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `${RAIL_W}px 1fr` } }}>
      <Box
        component="aside"
        sx={(t) => ({
          display: { xs: 'none', md: 'block' },
          position: 'sticky',
          top: 60, // clears the 60px masthead
          alignSelf: 'start',
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          p: '18px 12px',
          borderRight: `2px solid ${t.nerv.hue.orange}`,
          boxShadow: '2px 0 14px rgba(242,100,0,.12)',
          '&::-webkit-scrollbar': { width: 7 },
          '&::-webkit-scrollbar-thumb': { background: t.nerv.hue.greenDim },
        })}
      >
        {toc}
      </Box>

      <Drawer
        open={tocOpen}
        onClose={onTocClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{ paper: { sx: { width: RAIL_W + 40, p: '18px 12px' } } }}
      >
        {toc}
      </Drawer>

      <Box
        component="main"
        sx={{ minWidth: 0, px: { xs: 2.25, sm: 4, lg: 6 }, pt: 4, pb: 10, maxWidth: 1180 }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Page furniture                                                      */

export interface PageHeaderProps {
  /** Small kicker above the title (group name / area). */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Right-of-title tags (e.g. a `component` / `hook` stamp). */
  tags?: ReactNode;
  /** The lede paragraph. */
  lede?: ReactNode;
}

/** Page masthead: eyebrow · title · tags · lede, over the orange chrome rule. */
export function PageHeader({ eyebrow, title, tags, lede }: PageHeaderProps) {
  return (
    <Box component="header" sx={(t) => ({ pb: 2.5, mb: 3.5, borderBottom: `2px solid ${t.nerv.hue.orange}` })}>
      {eyebrow && (
        <Typography
          sx={(t) => ({
            fontFamily: t.nerv.fonts.mono,
            fontSize: 10,
            letterSpacing: '0.22em',
            color: t.nerv.hue.amber,
            mb: 1.25,
            '&::before': { content: '"◈ "' },
          })}
        >
          {eyebrow}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.75, flexWrap: 'wrap' }}>
        <Typography
          variant="h1"
          sx={(t) => ({
            fontSize: 'clamp(26px, 4.2vw, 44px)',
            color: t.nerv.hue.paper,
            textShadow: '0 0 5px currentColor, 0 0 16px rgba(82,242,154,.28)',
          })}
        >
          {title}
        </Typography>
        {tags}
      </Box>
      {lede && (
        <Typography
          sx={(t) => ({
            mt: 1.75,
            fontFamily: t.nerv.fonts.mono,
            fontSize: 13,
            lineHeight: 1.7,
            color: t.nerv.hue.mint,
            opacity: 0.78,
            maxWidth: '76ch',
            textTransform: 'none',
            letterSpacing: '0.02em',
          })}
        >
          {lede}
        </Typography>
      )}
    </Box>
  );
}

export interface DocSectionProps {
  id: string;
  title: ReactNode;
  /** Right-aligned meta on the section rule. */
  aside?: ReactNode;
  children: ReactNode;
}

/**
 * A titled page section. Uses the house `ZoneTitle` (orange label over a
 * hairline) rather than a numbered head — these facets are not a sequence.
 */
export function DocSection({ id, title, aside, children }: DocSectionProps) {
  return (
    <Box component="section" id={id} sx={{ scrollMarginTop: 76 }}>
      <ZoneTitle aside={aside}>{title}</ZoneTitle>
      {children}
    </Box>
  );
}

/** Body prose inside a section — mono, sentence case, measure-capped. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={(t) => ({
        fontFamily: t.nerv.fonts.mono,
        fontSize: 12.5,
        lineHeight: 1.7,
        letterSpacing: '0.02em',
        color: t.nerv.hue.greenMap,
        textTransform: 'none',
        maxWidth: '80ch',
      })}
    >
      {children}
    </Typography>
  );
}

/** A bullet list of guidance lines (use / avoid / a11y). */
export function Guidance({ items, tone = 'mint' }: { items: string[]; tone?: 'mint' | 'red' }) {
  return (
    <Box
      component="ul"
      sx={(t) => ({
        m: 0,
        pl: 0,
        listStyle: 'none',
        display: 'grid',
        gap: 0.75,
        maxWidth: '84ch',
        '& li': {
          position: 'relative',
          pl: 2.5,
          fontFamily: t.nerv.fonts.mono,
          fontSize: 12.5,
          lineHeight: 1.65,
          letterSpacing: '0.02em',
          textTransform: 'none',
          color: t.nerv.hue.greenMap,
        },
        '& li::before': {
          content: tone === 'red' ? '"✕"' : '"▸"',
          position: 'absolute',
          left: 0,
          color: tone === 'red' ? t.nerv.hue.redHi : t.nerv.hue.orange,
        },
      })}
    >
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </Box>
  );
}

/**
 * The framed stage a static demo sits on. `flush` removes padding for
 * edge-to-edge widgets; `column` stacks the content.
 */
export function DemoStage({
  children,
  flush = false,
  column = false,
  minHeight = 120,
}: {
  children: ReactNode;
  flush?: boolean;
  column?: boolean;
  minHeight?: number;
}) {
  return (
    <Box
      sx={(t) => ({
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        flexWrap: 'wrap',
        alignItems: column ? 'stretch' : 'center',
        justifyContent: 'center',
        gap: 1.75,
        minHeight,
        p: flush ? 0 : '20px 18px',
        border: `1px solid ${t.nerv.hue.greenDim}`,
        background: t.nerv.hue.void,
      })}
    >
      {children}
    </Box>
  );
}

/** Zero-state panel (unknown route). */
export function EmptyPanel({ title, detail }: { title: string; detail: string }) {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', gap: 2, py: 10, textAlign: 'center' }}>
      <Monogram jp="無" label="NO SIGNAL" tone="red" size={40} />
      <Typography variant="h3" sx={(t) => ({ color: t.nerv.hue.redHi })}>
        {title}
      </Typography>
      <Prose>{detail}</Prose>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */

export function DocFooter() {
  return (
    <Box
      component="footer"
      sx={(t) => ({
        mt: 8,
        pt: 2.5,
        borderTop: `2px solid ${t.nerv.hue.orange}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        fontFamily: t.nerv.fonts.mono,
        fontSize: 10,
        letterSpacing: '0.1em',
        color: t.nerv.hue.greenMap,
      })}
    >
      <Stamp tone="mint" size="sm" glow>
        DOCS:NOMINAL
      </Stamp>
      <Box component="span">PHOSPHOR CONSOLE · 燐光</Box>
      <Box component="span" sx={{ ml: 'auto' }}>
        BLACK IS THE ONLY SURFACE
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */

/** Scroll to the top whenever the routed key changes. */
export function useScrollTopOnChange(key: string) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);
}

/** ⌘K / Ctrl-K toggle for the search palette. */
export function useCommandPalette(): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return [open, setOpen];
}
