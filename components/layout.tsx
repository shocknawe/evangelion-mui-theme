/**
 * Layout & structural primitives — the command-shell frame, the zone title rule,
 * the boxed monogram, and the compact stat pair. These are the scaffolding a
 * full console screen (dashboard, form, wiki) is built on.
 */
import type { ElementType, ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { type ClassesOf, type RootHTMLAttributes, type WithRef, type Tone, resolveClasses, toneHue } from './util';

/* ------------------------------------------------------------------ */
/* ConsoleFrame — the chamfered command shell: full-bleed header over a
   sidebar · main · rail grid, one orange double-frame, internal scroll. */

export interface ConsoleFrameProps extends RootHTMLAttributes, WithRef {
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
  /** Class overrides by part: `root`, `header`, `band`, `sidebar`, `main`, `rail`, `footer`. */
  classes?: ClassesOf<'root' | 'header' | 'band' | 'sidebar' | 'main' | 'rail' | 'footer'>;
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
  classes,
  className,
  sx,
  ...rest
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
      {...rest}
      className={resolveClasses('ConsoleFrame', 'root', classes, className)}
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
      <Box component="header" className={resolveClasses('ConsoleFrame', 'header', classes)} sx={(t) => ({ gridArea: 'head', position: 'relative', zIndex: 1, borderBottom: `1px solid ${t.nerv.hue.orange}` })}>
        {header}
      </Box>
      {band && (
        <Box className={resolveClasses('ConsoleFrame', 'band', classes)} sx={(t) => ({ gridArea: 'band', position: 'relative', zIndex: 1, overflow: 'hidden', borderBottom: `1px solid ${t.nerv.hue.orange}` })}>
          {band}
        </Box>
      )}
      {sidebar && (
        <Box component="aside" className={resolveClasses('ConsoleFrame', 'sidebar', classes)} sx={(t) => ({ ...region, gridArea: 'side', borderRight: { md: `1px solid ${t.nerv.hue.orange}` }, borderBottom: { xs: `1px solid ${t.nerv.hue.orange}`, md: 0 } })}>
          {sidebar}
        </Box>
      )}
      <Box component="main" className={resolveClasses('ConsoleFrame', 'main', classes)} sx={{ ...region, gridArea: 'main' }}>
        {children}
      </Box>
      {rail && (
        <Box component="aside" className={resolveClasses('ConsoleFrame', 'rail', classes)} sx={(t) => ({ ...region, gridArea: 'rail', borderLeft: { md: `1px solid ${t.nerv.hue.orange}` }, borderTop: { xs: `1px solid ${t.nerv.hue.orange}`, md: 0 } })}>
          {rail}
        </Box>
      )}
      {footer && (
        <Box component="footer" className={resolveClasses('ConsoleFrame', 'footer', classes)} sx={(t) => ({ gridArea: 'foot', position: 'relative', zIndex: 1, borderTop: `1px solid ${t.nerv.hue.orange}` })}>
          {footer}
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ZoneTitle — an orange section label over a hairline rule. */

export interface ZoneTitleProps extends RootHTMLAttributes, WithRef {
  children: ReactNode;
  /** Right-aligned meta (e.g. a count chip). Rendered in amber. */
  aside?: ReactNode;
  /**
   * The element to render. Pass a heading (`h2`, `h3`…) when the zone is a real
   * document section so the page carries an outline (WCAG 1.3.1). The type
   * ramp is set here, so a heading looks identical to the default `div`.
   * @default 'div'
   */
  component?: ElementType;
  /** Class overrides by part: `root` (the zone row). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A zone header: condensed orange caps over a dim-green rule, with optional
 * right-aligned amber meta (a due count, an item total).
 */
export function ZoneTitle({ children, aside, component = 'div', classes, className, sx, ...rest }: ZoneTitleProps) {
  return (
    <Box
      component={component}
      {...rest}
      className={resolveClasses('ZoneTitle', 'root', classes, className)}
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
          // Zero the UA heading margin — CssBaseline does not reset it, so an
          // `h2` would otherwise sit lower than the default `div`.
          mt: 0,
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

export interface MonogramProps extends RootHTMLAttributes, WithRef {
  /** The kanji monogram. */
  jp: string;
  /** Small caption below. */
  label: string;
  /** Border/text hue. @default 'orange' */
  tone?: Tone;
  /** Kanji size (px). @default 26 */
  size?: number;
  /** Class overrides by part: `root` (the boxed mark). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A boxed bilingual monogram — a glowing kanji over a tiny caption, in a 1px
 * chrome box. The masthead identity mark (磁 MAGI · 統制 COMMAND).
 */
export function Monogram({ jp, label, tone = 'orange', size = 26, classes, className, sx, ...rest }: MonogramProps) {
  return (
    <Box
      {...rest}
      className={resolveClasses('Monogram', 'root', classes, className)}
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

export interface StatProps extends RootHTMLAttributes, WithRef {
  /** Small caption. */
  label: string;
  /** The value. */
  value: ReactNode;
  /** Value hue; `mint` also gets a glow. @default 'paper' */
  tone?: Tone;
  /** Class overrides by part: `root` (the pair). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A compact vital: a tiny mono label above a condensed value. Lighter than
 * {@link StatTile} — for a row of readouts in a header or hero.
 */
export function Stat({ label, value, tone = 'paper', classes, className, sx, ...rest }: StatProps) {
  return (
    <Box {...rest} className={resolveClasses('Stat', 'root', classes, className)} sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
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

export interface GaugeCardProps extends RootHTMLAttributes, WithRef {
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
  /** Class overrides by part: `root` (the card). */
  classes?: ClassesOf<'root'>;
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
export function GaugeCard({ kind, name, children, readout, sub, tone = 'mint', classes, className, sx, ...rest }: GaugeCardProps) {
  return (
    <Box
      {...rest}
      className={resolveClasses('GaugeCard', 'root', classes, className)}
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

/* ------------------------------------------------------------------ */
/* TelemetryCard — a bordered telemetry panel (title/type header · body · foot). */

export interface TelemetryCardProps extends Omit<RootHTMLAttributes, 'title'>, WithRef {
  /** Left header caption (e.g. `◐ VAULT RETENTION`). */
  title: ReactNode;
  /** Right header tag (e.g. `ARC` / `BAR` / `COL`). */
  type?: ReactNode;
  /** The gauge / body content. */
  children: ReactNode;
  /** Two-slot footer row (left, right) in dim green. */
  foot?: [ReactNode, ReactNode];
  /** Border hue. @default 'orange' */
  tone?: Tone;
  /** Class overrides by part: `root` (the panel), `header` (title/type bar), `foot` (footer row). */
  classes?: ClassesOf<'root' | 'header' | 'foot'>;
  sx?: SxProps<Theme>;
}

/**
 * A bordered telemetry panel: an orange header (title left, type tag right) over
 * a hairline rule, the gauge body, and an optional two-slot footer. The card
 * shell for a landing-page metric — drop a {@link RadialGauge}, {@link SegmentBar},
 * or {@link LedColumn} row inside.
 */
export function TelemetryCard({ title, type, children, foot, tone = 'orange', classes, className, sx, ...rest }: TelemetryCardProps) {
  return (
    <Box {...rest} className={resolveClasses('TelemetryCard', 'root', classes, className)} sx={[(t) => ({ border: `1px solid ${toneHue(t, tone)}`, background: t.nerv.hue.void, p: '18px' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box className={resolveClasses('TelemetryCard', 'header', classes)} sx={(t) => ({ display: 'flex', justifyContent: 'space-between', gap: 1, fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.1em', borderBottom: `1px solid ${t.nerv.hue.greenDim}`, pb: 1, mb: 2, fontFamily: t.nerv.fonts.mono })}>
        <span>{title}</span>{type != null && <span>{type}</span>}
      </Box>
      {children}
      {foot && (
        <Box className={resolveClasses('TelemetryCard', 'foot', classes)} sx={(t) => ({ mt: 1.75, fontSize: 9, color: t.nerv.hue.greenMap, display: 'flex', justifyContent: 'space-between', fontFamily: t.nerv.fonts.mono })}>
          <span>{foot[0]}</span><span>{foot[1]}</span>
        </Box>
      )}
    </Box>
  );
}
