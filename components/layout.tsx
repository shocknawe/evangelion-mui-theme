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
  /** Optional full-width band directly under the header (e.g. a separator). */
  band?: ReactNode;
  /** Left column (nav). Omit to drop the column. */
  sidebar?: ReactNode;
  /** Right column (rail). Omit to drop the column. */
  rail?: ReactNode;
  /** Optional full-width status bar pinned to the bottom (agents, vitals). */
  footer?: ReactNode;
  /** Alarm state — recolors the frame red and shows a top hazard stripe. */
  alarm?: boolean;
  /** The scrolling main column. */
  children: ReactNode;
  /** Sidebar width (px). @default 198 */
  sidebarWidth?: number;
  /** Rail width (px). @default 292 */
  railWidth?: number;
  /** Header band height (px). @default 100 */
  headerHeight?: number;
  /** Height of the optional band row (px). @default 96 */
  bandHeight?: number;
  /** Height of the optional footer row (px). @default 44 */
  footerHeight?: number;
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
  band,
  sidebar,
  rail,
  footer,
  alarm = false,
  children,
  sidebarWidth = 198,
  railWidth = 292,
  headerHeight = 100,
  bandHeight = 96,
  footerHeight = 44,
  sx,
}: ConsoleFrameProps) {
  const cols = [sidebar ? `${sidebarWidth}px` : null, '1fr', rail ? `${railWidth}px` : null].filter(Boolean).join(' ');
  const spanRow = (area: string) => [sidebar ? area : null, area, rail ? area : null].filter(Boolean).join(' ');
  const midRow = [sidebar ? 'side' : null, 'main', rail ? 'rail' : null].filter(Boolean).join(' ');
  const headCols = spanRow('head');
  const bandCols = spanRow('band');
  const footCols = spanRow('foot');
  const mdRows = [`${headerHeight}px`, band ? `${bandHeight}px` : null, '1fr', footer ? `${footerHeight}px` : null].filter(Boolean).join(' ');
  const mdAreas = [`"${headCols}"`, band ? `"${bandCols}"` : null, `"${midRow}"`, footer ? `"${footCols}"` : null].filter(Boolean).join(' ');
  const xsAreas = ['"head"', band ? '"band"' : null, sidebar ? '"side"' : null, '"main"', rail ? '"rail"' : null, footer ? '"foot"' : null]
    .filter(Boolean)
    .join(' ');

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
          border: `3px solid ${alarm ? t.nerv.hue.redHi : t.nerv.hue.orange}`,
          clipPath: t.nerv.chamfer(28),
          boxShadow: '0 0 10px rgba(242,100,0,.4), inset 0 0 12px rgba(242,100,0,.14)',
          overflow: { xs: 'visible', md: 'hidden' },
          display: 'grid',
          // Desktop grid; stacks below md so the deck stays usable on mobile.
          gridTemplateColumns: { xs: '1fr', md: cols },
          gridTemplateRows: { xs: 'auto', md: mdRows },
          gridTemplateAreas: { xs: xsAreas, md: mdAreas },
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
      {alarm && (
        <Box
          aria-hidden
          sx={(t) => ({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 2,
            background: `repeating-linear-gradient(45deg, ${t.nerv.hue.crimson} 0 10px, ${t.nerv.hue.void} 10px 20px)`,
          })}
        />
      )}
      <Box component="header" sx={(t) => ({ gridArea: 'head', position: 'relative', zIndex: 1, borderBottom: `1px solid ${t.nerv.hue.orange}` })}>
        {header}
      </Box>
      {band && (
        <Box sx={(t) => ({ gridArea: 'band', position: 'relative', zIndex: 1, overflow: 'hidden', borderBottom: `1px solid ${t.nerv.hue.orange}` })}>
          {band}
        </Box>
      )}
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
      {footer && (
        <Box component="footer" sx={(t) => ({ gridArea: 'foot', position: 'relative', zIndex: 1, borderTop: `1px solid ${t.nerv.hue.orange}` })}>
          {footer}
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

/* ------------------------------------------------------------------ */
/* GaugeCard — a chamfered card framing one gauge (a trigger / channel). */

export interface GaugeCardProps {
  /** Small kanji-tagged channel label (e.g. `CRON · 定時`), tinted by `tone`. */
  kind: ReactNode;
  /** Condensed channel name (e.g. `NIGHTLY REVIEW`). */
  name: ReactNode;
  /** The gauge itself (RadialGauge, SegmentBar, LedColumn, …). */
  children: ReactNode;
  /** Optional readout line under the gauge (tinted by `tone`). */
  readout?: ReactNode;
  /** Optional footer line (e.g. `NEXT: 02:00:00`), in dim green. */
  sub?: ReactNode;
  /** Border / accent hue — the channel's state color. @default 'mint' */
  tone?: Tone;
  sx?: SxProps<Theme>;
}

/**
 * A single-corner-chamfered card that frames one gauge as a monitored channel:
 * a tinted channel label, a condensed name, the gauge, an optional readout, and
 * an optional footer. The border carries the channel's state hue (color = state)
 * — so a row of these reads as a legible trigger/channel bank.
 *
 * @example
 * <GaugeCard tone="blue" kind="WATCHER · 監視" name="MEDIA WATCHER"
 *   readout={<><b>45</b>% BUFFER</>} sub="POLLING: 10S">
 *   <SegmentBar value={45} tone="blue" height={36} />
 * </GaugeCard>
 */
export function GaugeCard({ kind, name, children, readout, sub, tone = 'mint', sx }: GaugeCardProps) {
  return (
    <Box
      sx={[
        (t) => ({
          border: `1px solid ${toneHue(t, tone)}`,
          p: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ fontSize: 9, letterSpacing: '0.16em', color: toneHue(t, tone), fontFamily: t.nerv.fonts.mono })}>{kind}</Box>
      <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 16, color: t.nerv.hue.paper })}>{name}</Box>
      {children}
      {readout && (
        <Box component="span" sx={(t) => ({ fontSize: 11, color: toneHue(t, tone), fontFamily: t.nerv.fonts.mono, '& b': { fontFamily: t.nerv.fonts.display, fontSize: 19, fontWeight: 700 } })}>{readout}</Box>
      )}
      {sub && <Box component="span" sx={(t) => ({ fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono })}>{sub}</Box>}
    </Box>
  );
}
