/**
 * Status displays — the boxed, color-as-state pieces: the bilingual legend, the
 * selectable unit roster, and the negative-space stat tile.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { type Tone, toneHue } from './util';
import { useReducedMotion } from './hooks';

/* ------------------------------------------------------------------ */
/* StatusLegend — a row of bilingual status stamps. */

export interface LegendItem {
  jp: string;
  en: string;
  tone: Tone;
  /** Solid-fill (recorded/active) vs outline (idle). @default false */
  filled?: boolean;
}

export interface StatusLegendProps {
  items: LegendItem[];
  sx?: SxProps<Theme>;
}

/**
 * The status key: each state boxed, bilingual, and colored by its tone. Filled =
 * active; outline = idle.
 *
 * @example
 * <StatusLegend items={[
 *   { jp: '正常', en: 'NOMINAL', tone: 'mint' },
 *   { jp: '阻止', en: 'BLOCKED', tone: 'red', filled: true },
 * ]} />
 */
export function StatusLegend({ items, sx }: StatusLegendProps) {
  return (
    <Box sx={[{ display: 'flex', gap: 1, flexWrap: 'wrap' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {items.map((it) => (
        <Box
          key={it.en}
          sx={(t) => {
            const c = toneHue(t, it.tone);
            return {
              border: `1px solid ${c}`,
              background: it.filled ? c : 'transparent',
              color: it.filled ? t.nerv.hue.void : c,
              p: '2px 9px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 54,
              borderRadius: `${t.nerv.radius.chip}px`,
            };
          }}
        >
          <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 13, lineHeight: 1.2, letterSpacing: '0.2em', textIndent: '0.2em' })}>
            {it.jp}
          </Box>
          <Box component="span" sx={(t) => ({ fontSize: 8, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono })}>
            {it.en}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Roster — a grid of selectable status tiles. */

export type RosterStatus = 'NOMINAL' | 'CAUTION' | 'STANDBY' | 'OFFLINE';

export interface RosterUnit {
  id: string;
  status: RosterStatus;
}

export interface RosterProps {
  /** Units to display. Defaults to a sample roster so it renders out of the box. */
  units?: RosterUnit[];
  /** Columns at the `sm`+ breakpoint. @default 4 */
  columns?: number;
  /** Fires with the selected unit id (or `null` when toggled off). */
  onSelect?: (id: string | null) => void;
  sx?: SxProps<Theme>;
}

const ROSTER_TONE: Record<RosterStatus, Tone> = {
  NOMINAL: 'mint',
  CAUTION: 'amber',
  STANDBY: 'blue',
  OFFLINE: 'red',
};

const DEFAULT_UNITS: RosterUnit[] = [
  { id: 'UNIT-07', status: 'NOMINAL' },
  { id: 'LYRA·4', status: 'CAUTION' },
  { id: 'CYGNUS·7', status: 'STANDBY' },
  { id: 'AQUILA·11', status: 'OFFLINE' },
];

/**
 * Unit roster — status tiles that each own a hue; OFFLINE uses the figure/ground
 * inversion (solid red, black content), CAUTION blinks. Selecting thickens the
 * border.
 */
export function Roster({ units = DEFAULT_UNITS, columns = 4, onSelect, sx }: RosterProps) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <Box
      sx={[
        { display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: `repeat(${columns}, 1fr)` }, gap: 1, width: '100%' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {units.map((u) => {
        const on = pressed === u.id;
        const offline = u.status === 'OFFLINE';
        return (
          <Box
            key={u.id}
            component="button"
            aria-pressed={on}
            onClick={() => {
              const next = on ? null : u.id;
              setPressed(next);
              onSelect?.(next);
            }}
            sx={(t) => {
              const c = toneHue(t, ROSTER_TONE[u.status]);
              return {
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                textAlign: 'left',
                cursor: 'pointer',
                p: '8px 9px',
                background: offline ? c : t.nerv.hue.void,
                borderColor: c,
                color: offline ? t.nerv.hue.void : c,
                fontFamily: t.nerv.fonts.mono,
                textTransform: 'uppercase',
                border: `${on ? 2 : 1}px solid`,
                '&:focus-visible': { outline: `2px dashed ${t.nerv.hue.amber}`, outlineOffset: 2 },
              };
            }}
          >
            <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 14 })}>
              {u.id}
            </Box>
            <Box
              component="span"
              sx={(t) => ({
                alignSelf: 'flex-start',
                border: `1px solid ${offline ? t.nerv.hue.void : 'currentColor'}`,
                background: offline ? t.nerv.hue.void : 'transparent',
                color: offline ? toneHue(t, 'red') : 'currentColor',
                p: '1px 6px',
                fontSize: 9,
                borderRadius: `${t.nerv.radius.chip}px`,
                animation: u.status === 'CAUTION' && !reduced ? `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` : 'none',
              })}
            >
              {u.status}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* StatTile — a big negative-space metric. */

export interface StatTileProps {
  /** Caption above the value. */
  label: string;
  /** The headline metric. */
  value: React.ReactNode;
  /** Sub-caption / status line below. */
  footer?: React.ReactNode;
  /** Hue of the big value. @default 'mint' */
  tone?: Tone;
  sx?: SxProps<Theme>;
}

/**
 * A negative-space stat: a tiny label, one giant numeral, a tiny footer — the
 * bimodal type rule as a KPI tile.
 *
 * @example
 * <StatTile label="MEMORY NODES" value="2,482" footer="98.4% RETENTION · STABLE" />
 */
export function StatTile({ label, value, footer, tone = 'mint', sx }: StatTileProps) {
  return (
    <Box
      sx={[
        (t) => ({
          border: `1px solid ${t.nerv.hue.greenDim}`,
          p: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 150,
          justifyContent: 'center',
          width: '100%',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.16em', fontFamily: t.nerv.fonts.mono })}>
        {label}
      </Box>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 0.9,
          color: tone === 'mint' ? t.nerv.hue.mintHi : toneHue(t, tone),
          textShadow: '0 0 10px rgba(82,242,154,.35)',
        })}
      >
        {value}
      </Box>
      {footer && (
        <Box component="span" sx={(t) => ({ fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em', mt: 'auto', fontFamily: t.nerv.fonts.mono })}>
          {footer}
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* RailItem — a reminder / inbox row with a due time. */

export interface RailItemProps {
  /** Primary line. */
  title: React.ReactNode;
  /** Small subtitle (category / source). */
  sub?: React.ReactNode;
  /** Right-aligned time / due marker (amber). */
  when?: React.ReactNode;
  /** Completed — dims and strikes the title. @default false */
  done?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * A rail list row: a title with an optional subtitle on the left, a due/time
 * marker on the right, divided by a dotted hairline. `done` dims and strikes it.
 */
export function RailItem({ title, sub, when, done = false, sx }: RailItemProps) {
  return (
    <Box
      sx={[
        (t) => ({
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1,
          borderBottom: `1px dotted ${t.nerv.hue.greenDim}`,
          py: '5px',
          fontSize: 11,
          fontFamily: t.nerv.fonts.mono,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ color: done ? t.nerv.hue.greenDim : t.nerv.hue.paper, lineHeight: 1.4, textDecoration: done ? 'line-through' : 'none' })}>
        {title}
        {sub && <Box component="small" sx={(t) => ({ display: 'block', color: t.nerv.hue.greenMap, fontSize: 9, letterSpacing: '0.1em', mt: '2px' })}>{sub}</Box>}
      </Box>
      {when && <Box component="span" sx={(t) => ({ color: t.nerv.hue.amber, whiteSpace: 'nowrap', fontSize: 10 })}>{when}</Box>}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* GateRow — a decision-queue row: id · title · leader · priority · action. */

export type GatePriority = 'critical' | 'elevated' | 'routine';
export type GateVerdict = 'approve' | 'deny' | 'defer';

export interface GateRowProps {
  /** Gate id (e.g. `GATE·04`). */
  id: string;
  /** Gate title. */
  title: string;
  /** Sub-line (owner / status). */
  sub?: string;
  /** Priority — colors the priority stamp and idle left edge. @default 'routine' */
  priority?: GatePriority;
  /** Decision, once made. `null`/undefined = still awaiting review. */
  verdict?: GateVerdict | null;
  /** Fired when the REVIEW button is pressed (only shown while awaiting). */
  onReview?: () => void;
  sx?: SxProps<Theme>;
}

const PRIO_TONE: Record<GatePriority, Tone> = { critical: 'red', elevated: 'amber', routine: 'green' };
const PRIO_LABEL: Record<GatePriority, string> = { critical: 'AAA', elevated: 'AA-', routine: 'B++' };
const VERDICT: Record<GateVerdict, { label: string; tone: Tone }> = {
  approve: { label: '承認 APPROVED', tone: 'mint' },
  deny: { label: '否認 DENIED', tone: 'red' },
  defer: { label: '保留 DEFERRED', tone: 'blue' },
};

/**
 * A "blocked on you" decision row: id · title · dot leader · sub · priority
 * stamp, ending in a REVIEW action or — once decided — the verdict stamp. The
 * idle left edge is tinted by priority (1px, per the no-side-stripe rule);
 * approve/deny settle it back to a neutral hairline.
 */
export function GateRow({ id, title, sub, priority = 'routine', verdict, onReview, sx }: GateRowProps) {
  const settled = verdict === 'approve' || verdict === 'deny';
  return (
    <Box
      sx={[
        (t) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          border: `1px solid ${t.nerv.hue.greenDim}`,
          borderLeftColor: settled ? t.nerv.hue.greenDim : toneHue(t, PRIO_TONE[priority]),
          p: '9px 12px',
          fontFamily: t.nerv.fonts.mono,
          flexWrap: 'wrap',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ color: t.nerv.hue.amber, whiteSpace: 'nowrap', fontSize: 11 })}>{id}</Box>
      <Box component="span" sx={(t) => ({ color: t.nerv.hue.paper, whiteSpace: 'nowrap', fontSize: 12 })}>{title}</Box>
      <Box aria-hidden sx={(t) => ({ flex: 1, minWidth: 16, overflow: 'hidden', whiteSpace: 'nowrap', color: t.nerv.hue.greenDim, letterSpacing: '2px', '&::after': { content: '"' + '.'.repeat(64) + '"' } })} />
      {sub && <Box component="span" sx={(t) => ({ color: t.nerv.hue.greenMap, fontSize: 10, whiteSpace: 'nowrap' })}>{sub}</Box>}
      <Box
        component="span"
        sx={(t) => {
          const c = toneHue(t, PRIO_TONE[priority]);
          return { border: `1px solid ${c}`, color: c, borderRadius: `${t.nerv.radius.chip}px`, fontSize: 9, p: '2px 7px', letterSpacing: '0.08em', flex: 'none' };
        }}
      >
        {PRIO_LABEL[priority]}
      </Box>
      {verdict ? (
        <Box
          component="span"
          sx={(t) => {
            const c = toneHue(t, VERDICT[verdict].tone);
            return { border: `1px solid ${c}`, color: c, borderRadius: `${t.nerv.radius.chip}px`, fontSize: 11, p: '2px 8px', whiteSpace: 'nowrap', flex: 'none' };
          }}
        >
          {VERDICT[verdict].label}
        </Box>
      ) : (
        <Box
          component="button"
          onClick={onReview}
          sx={(t) => ({
            border: `1px solid ${t.nerv.hue.redHi}`,
            background: t.nerv.hue.void,
            color: t.nerv.hue.redHi,
            p: '5px 12px',
            fontSize: 10,
            cursor: 'pointer',
            flex: 'none',
            fontFamily: t.nerv.fonts.mono,
            '&:hover': { background: t.nerv.hue.redHi, color: t.nerv.hue.void },
            '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2 },
          })}
        >
          REVIEW
        </Box>
      )}
    </Box>
  );
}
