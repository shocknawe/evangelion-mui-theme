/**
 * Layout & structural primitives — the command-shell frame, the zone title rule,
 * the boxed monogram, and the compact stat pair. These are the scaffolding a
 * full console screen (dashboard, form, wiki) is built on.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { type Tone, toneHue } from './util';

/* ------------------------------------------------------------------ */
/* ConsoleFrame — the chamfered command shell: full-bleed header over a
   sidebar · main · rail grid, one orange double-frame, internal scroll. */

export interface ConsoleFrameProps {
  /** Full-width top band. */
  header: ReactNode;
  /** Left column (nav). Omit to drop the column. */
  sidebar?: ReactNode;
  /** Right column (rail). Omit to drop the column. */
  rail?: ReactNode;
  /** The scrolling main column. */
  children: ReactNode;
  /** Sidebar width (px). @default 198 */
  sidebarWidth?: number;
  /** Rail width (px). @default 292 */
  railWidth?: number;
  /** Header band height (px). @default 100 */
  headerHeight?: number;
  sx?: SxProps<Theme>;
}

/**
 * The single chamfered frame that holds a whole screen: a full-width header over
 * a `sidebar · main · rail` grid, with the orange double-frame, glow, and CRT
 * (from the theme) doing the depth. Each region scrolls independently on
 * desktop; the layout stacks and scrolls as one on narrow screens.
 *
 * @example
 * <ConsoleFrame header={<Head/>} sidebar={<Nav/>} rail={<Rail/>}>
 *   <MainColumn/>
 * </ConsoleFrame>
 */
export function ConsoleFrame({
  header,
  sidebar,
  rail,
  children,
  sidebarWidth = 198,
  railWidth = 292,
  headerHeight = 100,
  sx,
}: ConsoleFrameProps) {
  const cols = [sidebar ? `${sidebarWidth}px` : null, '1fr', rail ? `${railWidth}px` : null].filter(Boolean).join(' ');
  const midRow = [sidebar ? 'side' : null, 'main', rail ? 'rail' : null].filter(Boolean).join(' ');
  const headCols = [sidebar ? 'head' : null, 'head', rail ? 'head' : null].filter(Boolean).join(' ');

  // Desktop: each region scrolls inside the fixed-height frame. Mobile: the
  // frame grows and the page scrolls as one, so regions must not clip.
  const region = {
    minHeight: { xs: 'auto', md: 0 } as const,
    position: 'relative' as const,
    zIndex: 1,
    overflowY: { xs: 'visible', md: 'auto' } as const,
  };

  return (
    <Box
      sx={[
        (t) => ({
          position: 'relative',
          boxSizing: 'border-box',
          m: '14px',
          // Fill the viewport as a command deck on desktop; grow to content and
          // let the page scroll on mobile (stacked regions would clip otherwise).
          height: { xs: 'auto', md: 'calc(100vh - 28px)' },
          minHeight: { xs: 'calc(100vh - 28px)', md: 0 },
          backgroundColor: t.nerv.hue.void,
          border: `3px solid ${t.nerv.hue.orange}`,
          clipPath: t.nerv.chamfer(28),
          boxShadow: '0 0 10px rgba(242,100,0,.4), inset 0 0 12px rgba(242,100,0,.14)',
          overflow: { xs: 'visible', md: 'hidden' },
          display: 'grid',
          // Desktop grid; stacks below md so the deck stays usable on mobile.
          gridTemplateColumns: { xs: '1fr', md: cols },
          gridTemplateRows: { xs: 'auto', md: `${headerHeight}px 1fr` },
          gridTemplateAreas: {
            xs: `"head" ${sidebar ? '"side"' : ''} "main" ${rail ? '"rail"' : ''}`.trim(),
            md: `"${headCols}" "${midRow}"`,
          },
          // Inner rule = the second frame line.
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '6px',
            border: `1px solid ${t.nerv.hue.orange}`,
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: 0,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="header" sx={(t) => ({ gridArea: 'head', position: 'relative', zIndex: 1, borderBottom: `1px solid ${t.nerv.hue.orange}` })}>
        {header}
      </Box>
      {sidebar && (
        <Box component="aside" sx={(t) => ({ ...region, gridArea: 'side', borderRight: { md: `1px solid ${t.nerv.hue.orange}` }, borderBottom: { xs: `1px solid ${t.nerv.hue.orange}`, md: 0 } })}>
          {sidebar}
        </Box>
      )}
      <Box component="main" sx={{ ...region, gridArea: 'main' }}>
        {children}
      </Box>
      {rail && (
        <Box component="aside" sx={(t) => ({ ...region, gridArea: 'rail', borderLeft: { md: `1px solid ${t.nerv.hue.orange}` }, borderTop: { xs: `1px solid ${t.nerv.hue.orange}`, md: 0 } })}>
          {rail}
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ZoneTitle — an orange section label over a hairline rule. */

export interface ZoneTitleProps {
  children: ReactNode;
  /** Right-aligned meta (e.g. a count chip). Rendered in amber. */
  aside?: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * A zone header: condensed orange caps over a dim-green rule, with optional
 * right-aligned amber meta (a due count, an item total).
 */
export function ZoneTitle({ children, aside, sx }: ZoneTitleProps) {
  return (
    <Box
      sx={[
        (t) => ({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 1,
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 12,
          color: t.nerv.hue.orange,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          borderBottom: `1px solid ${t.nerv.hue.greenDim}`,
          pb: 0.5,
          mb: 1,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span">{children}</Box>
      {aside && <Box component="span" sx={(t) => ({ color: t.nerv.hue.amber, fontFamily: t.nerv.fonts.mono, fontWeight: 400 })}>{aside}</Box>}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Monogram — a boxed kanji with a small caption (masthead grammar). */

export interface MonogramProps {
  /** The kanji monogram. */
  jp: string;
  /** Small caption below. */
  label: string;
  /** Border/text hue. @default 'orange' */
  tone?: Tone;
  /** Kanji size (px). @default 26 */
  size?: number;
  sx?: SxProps<Theme>;
}

/**
 * A boxed bilingual monogram — a glowing kanji over a tiny caption, in a 1px
 * chrome box. The masthead identity mark (磁 MAGI · 統制 COMMAND).
 */
export function Monogram({ jp, label, tone = 'orange', size = 26, sx }: MonogramProps) {
  return (
    <Box
      sx={[
        (t) => {
          const c = toneHue(t, tone);
          return {
            flex: 'none',
            textAlign: 'center',
            border: `1px solid ${c}`,
            color: c,
            fontFamily: t.nerv.fonts.jp,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1,
            p: '7px 9px',
            letterSpacing: '0.1em',
            textShadow: '0 0 4px currentColor',
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {jp}
      <Box component="small" sx={(t) => ({ display: 'block', fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 8, letterSpacing: '0.16em', mt: '4px', textTransform: 'uppercase' })}>
        {label}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Stat — a compact label/value pair (dashboard vitals). */

export interface StatProps {
  /** Small caption. */
  label: string;
  /** The value. */
  value: ReactNode;
  /** Value hue; `mint` also gets a glow. @default 'paper' */
  tone?: Tone;
  sx?: SxProps<Theme>;
}

/**
 * A compact vital: a tiny mono label above a condensed value. Lighter than
 * {@link StatTile} — for a row of readouts in a header or hero.
 */
export function Stat({ label, value, tone = 'paper', sx }: StatProps) {
  return (
    <Box sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={(t) => ({ fontSize: 10, color: t.nerv.hue.greenMap, letterSpacing: '0.14em', fontFamily: t.nerv.fonts.mono })}>{label}</Box>
      <Box
        sx={(t) => ({
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 27,
          mt: '3px',
          letterSpacing: '0.02em',
          color: tone === 'paper' ? t.nerv.hue.paper : toneHue(t, tone),
          textShadow: tone === 'mint' ? '0 0 5px rgba(82,242,154,.5)' : 'none',
        })}
      >
        {value}
      </Box>
    </Box>
  );
}
