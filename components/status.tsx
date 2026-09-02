/**
 * Status displays — the boxed, color-as-state pieces: the bilingual legend, the
 * selectable unit roster, and the negative-space stat tile.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { type RootHTMLAttributes, type WithRef, type Tone, toneHue } from './util';
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

export interface StatusLegendProps extends RootHTMLAttributes, WithRef {
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
export function StatusLegend({ items, sx, ...rest }: StatusLegendProps) {
  return (
    <Box {...rest} sx={[{ display: 'flex', gap: 1, flexWrap: 'wrap' }, ...(Array.isArray(sx) ? sx : [sx])]}>
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

/** `onSelect` is the tile-selection callback, not the DOM `onSelect`. */
export interface RosterProps extends Omit<RootHTMLAttributes, 'onSelect'>, WithRef {
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
export function Roster({ units = DEFAULT_UNITS, columns = 4, onSelect, sx, ...rest }: RosterProps) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState<string | null>(null);

  return (
    <Box
      {...rest}
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

export interface StatTileProps extends RootHTMLAttributes, WithRef {
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
export function StatTile({ label, value, footer, tone = 'mint', sx, ...rest }: StatTileProps) {
  return (
    <Box
      {...rest}
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

/** `title` is this row's display text, not the DOM `title`. */
export interface RailItemProps extends Omit<RootHTMLAttributes, 'title'>, WithRef {
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
export function RailItem({ title, sub, when, done = false, sx, ...rest }: RailItemProps) {
  return (
    <Box
      {...rest}
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

/** `id`/`title` are this row's display text, not the DOM `id`/`title`. */
export interface GateRowProps extends Omit<RootHTMLAttributes, 'id' | 'title'>, WithRef {
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
export function GateRow({ id, title, sub, priority = 'routine', verdict, onReview, sx, ...rest }: GateRowProps) {
  const settled = verdict === 'approve' || verdict === 'deny';
  return (
    <Box
      {...rest}
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

/* ------------------------------------------------------------------ */
/* AgentCard — a selectable status card (name · stamp · task). */

export type AgentStatus = 'ACTIVE' | 'REVIEWING' | 'IDLE';

/** `onSelect` is the card-selection callback, not the DOM `onSelect`. */
export interface AgentCardProps extends Omit<RootHTMLAttributes<'button'>, 'onSelect'>, WithRef<'button'> {
  /** Agent name (e.g. `AGENT·ORION`). */
  name: string;
  status: AgentStatus;
  /** Current task line. */
  task: string;
  /** Selected = the console currently shown (thicker border + inset glow). */
  selected?: boolean;
  onSelect?: () => void;
  sx?: SxProps<Theme>;
}

const AGENT_TONE: Record<AgentStatus, Tone> = { ACTIVE: 'mint', REVIEWING: 'blue', IDLE: 'dim' };

/**
 * A boxed agent card colored by status (ACTIVE mint · REVIEWING blue · IDLE dim),
 * with a name, a status stamp, and a task line. Selecting it (to view a console,
 * say) thickens the border and adds an inset glow.
 */
export function AgentCard({ name, status, task, selected = false, onSelect, sx, ...rest }: AgentCardProps) {
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      {...rest}
      sx={[
        (t) => {
          const c = toneHue(t, AGENT_TONE[status]);
          return {
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            textAlign: 'left',
            width: '100%',
            cursor: 'pointer',
            background: t.nerv.hue.void,
            border: `${selected ? 2 : 1}px solid ${c}`,
            color: c,
            p: '9px 11px',
            fontFamily: t.nerv.fonts.mono,
            boxShadow: selected ? `inset 0 0 12px color-mix(in srgb, ${c} 16%, transparent)` : 'none',
            '&:focus-visible': { outline: `2px dashed ${t.nerv.hue.amber}`, outlineOffset: 2 },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '6px' }}>
        <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 15, letterSpacing: '0.02em' })}>{name}</Box>
        <Box component="span" sx={(t) => ({ border: '1px solid currentColor', borderRadius: `${t.nerv.radius.chip}px`, p: '1px 6px', fontSize: 9, letterSpacing: '0.06em', flex: 'none' })}>{status}</Box>
      </Box>
      <Box component="span" sx={{ fontSize: 9, letterSpacing: '0.06em', opacity: 0.85 }}>{task}</Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* RecallNote — a cited memory / decision-log fragment. */

/** `id` is the displayed reference id, not the DOM `id`. */
export interface RecallNoteProps extends Omit<RootHTMLAttributes, 'id'>, WithRef {
  /** Reference id (e.g. `DECISION_LOG_32`). */
  id: string;
  /** The recalled text. */
  children: React.ReactNode;
  /** Left-edge + tint accent. @default 'teal' */
  tone?: Tone;
  sx?: SxProps<Theme>;
}

/**
 * A recalled reference — a cited decision-log or memory fragment with a tinted
 * left edge (1px, per the no-side-stripe rule), an amber id, and readable body
 * text.
 */
export function RecallNote({ id, children, tone = 'teal', sx, ...rest }: RecallNoteProps) {
  return (
    <Box
      {...rest}
      sx={[
        (t) => {
          const c = toneHue(t, tone);
          return {
            border: `1px solid ${t.nerv.hue.greenDim}`,
            borderLeft: `1px solid ${c}`,
            background: `color-mix(in srgb, ${c} 6%, transparent)`,
            p: '7px 10px',
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={(t) => ({ fontSize: 9, color: t.nerv.hue.amber, letterSpacing: '0.14em', fontFamily: t.nerv.fonts.mono })}>{id}</Box>
      <Box sx={(t) => ({ fontSize: 11, color: t.nerv.hue.paper, textTransform: 'none', lineHeight: 1.5, mt: '3px', fontFamily: t.nerv.fonts.mono })}>{children}</Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* SinkRow — a notification-sink status row (name · state · ping · stamp). */

export type SinkStatus = 'ACTIVE' | 'CONNECTED' | 'OFFLINE';

export interface SinkRowProps extends RootHTMLAttributes, WithRef {
  /** Sink name (e.g. `NTFY GATEWAY`). */
  name: React.ReactNode;
  status: SinkStatus;
  /** Small state line under the name. @default the status word */
  detail?: React.ReactNode;
  /** Right-aligned latency readout. @default `—` when OFFLINE */
  ping?: React.ReactNode;
  /** Stamp label. @default `DOWN` when OFFLINE, else `LIVE` */
  stampLabel?: string;
  sx?: SxProps<Theme>;
}

const SINK_TONE: Record<SinkStatus, Tone> = { ACTIVE: 'mint', CONNECTED: 'blue', OFFLINE: 'red' };

/**
 * A delivery-sink row: name over a state line, a ping readout, and a state stamp.
 * The hue is the sink's state (ACTIVE mint · CONNECTED blue · OFFLINE red);
 * OFFLINE inverts the stamp to a solid red fill with black content (the
 * figure/ground "recorded" grammar). Divided by a dotted hairline.
 */
export function SinkRow({ name, status, detail, ping, stampLabel, sx, ...rest }: SinkRowProps) {
  const offline = status === 'OFFLINE';
  const label = stampLabel ?? (offline ? 'DOWN' : 'LIVE');
  return (
    <Box
      {...rest}
      sx={[
        (t) => ({ display: 'flex', alignItems: 'center', gap: 1.25, borderBottom: `1px dotted ${t.nerv.hue.greenDim}`, py: 1, fontFamily: t.nerv.fonts.mono }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ color: t.nerv.hue.paper, fontSize: 12, flex: 1, minWidth: 0 })}>
        {name}
        <Box component="small" sx={(t) => ({ display: 'block', fontSize: 9, letterSpacing: '0.12em', mt: '2px', color: toneHue(t, SINK_TONE[status]) })}>
          {detail ?? status}
        </Box>
      </Box>
      <Box component="span" sx={(t) => ({ fontSize: 10, color: t.nerv.hue.amber, whiteSpace: 'nowrap' })}>{ping ?? (offline ? '—' : null)}</Box>
      <Box
        component="span"
        sx={(t) => {
          const c = toneHue(t, SINK_TONE[status]);
          return {
            flex: 'none',
            fontSize: 9,
            border: `1px solid ${c}`,
            background: offline ? c : 'transparent',
            color: offline ? t.nerv.hue.void : c,
            p: '2px 8px',
            borderRadius: `${t.nerv.radius.chip}px`,
          };
        }}
      >
        {label}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* RoutineRow — a scheduled-routine row (id · name · kind · status · RUN). */

export type RoutineStatus = 'PENDING' | 'SUCCESS' | 'RETRIED';

/** `id` is the displayed routine id, not the DOM `id`. */
export interface RoutineRowProps extends Omit<RootHTMLAttributes, 'id'>, WithRef {
  /** Routine id (e.g. `RT·01`). */
  id: React.ReactNode;
  /** Routine name. */
  name: React.ReactNode;
  /** Trigger kind (e.g. `CRON`). */
  kind: React.ReactNode;
  status: RoutineStatus;
  /** Dim + desaturate (filtered out but never hidden). @default false */
  dim?: boolean;
  /** Fires when RUN is pressed. */
  onRun?: () => void;
  sx?: SxProps<Theme>;
}

const ROUTINE_TONE: Record<RoutineStatus, Tone> = { PENDING: 'blue', SUCCESS: 'mint', RETRIED: 'red' };

/**
 * A routine-manager row: id · name · kind · a state stamp (PENDING blue ·
 * SUCCESS mint · RETRIED red, blinking) · a RUN action. `dim` fades and
 * desaturates it (for filter-rail scoping) without removing it from the list.
 */
export function RoutineRow({ id, name, kind, status, dim = false, onRun, sx, ...rest }: RoutineRowProps) {
  const reduced = useReducedMotion();
  return (
    <Box
      {...rest}
      sx={[
        (t) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          border: `1px solid ${t.nerv.hue.greenDim}`,
          p: '8px 10px',
          fontFamily: t.nerv.fonts.mono,
          opacity: dim ? 0.25 : 1,
          filter: dim ? 'grayscale(.6)' : 'none',
          transition: `opacity ${t.nerv.motion.durations.fast}ms linear`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ color: t.nerv.hue.amber, fontSize: 10, whiteSpace: 'nowrap' })}>{id}</Box>
      <Box component="span" sx={(t) => ({ color: t.nerv.hue.paper, fontSize: 11, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' })}>{name}</Box>
      <Box component="span" sx={(t) => ({ fontSize: 8, color: t.nerv.hue.greenMap, letterSpacing: '0.12em', whiteSpace: 'nowrap' })}>{kind}</Box>
      <Box
        component="span"
        sx={(t) => {
          const c = toneHue(t, ROUTINE_TONE[status]);
          return {
            flex: 'none',
            fontSize: 9,
            border: `1px solid ${c}`,
            color: c,
            p: '2px 8px',
            borderRadius: `${t.nerv.radius.chip}px`,
            textShadow: status === 'RETRIED' ? '0 0 4px currentColor' : 'none',
            animation: status === 'RETRIED' && !reduced ? `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` : 'none',
          };
        }}
      >
        {status}
      </Box>
      <Box
        component="button"
        type="button"
        onClick={onRun}
        sx={(t) => ({
          flex: 'none',
          border: `1px solid ${t.nerv.hue.mint}`,
          background: t.nerv.hue.void,
          color: t.nerv.hue.mint,
          fontSize: 9,
          p: '3px 8px',
          cursor: 'pointer',
          fontFamily: t.nerv.fonts.mono,
          '&:hover': { background: t.nerv.hue.mint, color: t.nerv.hue.void },
          '&:focus-visible': { outline: `2px solid ${t.nerv.hue.amber}`, outlineOffset: 2 },
        })}
      >
        RUN
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ModuleCard — a pinnable system/product card (jp glyph · code · desc · stamp). */

/** `title` is the card's display heading, not the DOM `title`; `onSelect` is
 *  the pin/selection callback, not the DOM `onSelect`. */
export interface ModuleCardProps extends Omit<RootHTMLAttributes<'button'>, 'title' | 'onSelect'>, WithRef<'button'> {
  /** Large kanji glyph (the system's mark). */
  jp: string;
  /** System code (e.g. `SYS·01`). */
  code: React.ReactNode;
  /** Second code line (e.g. the system name). */
  codeSub?: React.ReactNode;
  /** Card title. */
  title: React.ReactNode;
  /** Body copy. */
  children: React.ReactNode;
  /** Footer state stamp text (e.g. `NOMINAL`). */
  stamp: React.ReactNode;
  /** Right-aligned footer meta (e.g. `2,482 NODES`). */
  meta?: React.ReactNode;
  /** Stamp hue — the system's state. @default 'mint' */
  tone?: Tone;
  /** Pinned/selected — mint border + glow. @default false */
  selected?: boolean;
  onSelect?: () => void;
  sx?: SxProps<Theme>;
}

/**
 * A product/system card for landing pages: a glowing kanji glyph with a `SYS·NN`
 * code, a title, body copy, and a footer state stamp (tinted by `tone`). Chrome
 * (orange) border at rest that lifts on hover; selecting it pins the card with a
 * mint border + glow (figure/ground). Renders as a button so it's keyboard-usable.
 */
export function ModuleCard({ jp, code, codeSub, title, children, stamp, meta, tone = 'mint', selected = false, onSelect, sx, ...rest }: ModuleCardProps) {
  return (
    <Box
      component="button"
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      {...rest}
      sx={[
        (t) => ({
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          width: '100%',
          minHeight: 150,
          cursor: 'pointer',
          background: t.nerv.hue.void,
          border: `1px solid ${selected ? t.nerv.hue.mint : t.nerv.hue.orange}`,
          p: '16px',
          fontFamily: t.nerv.fonts.mono,
          boxShadow: selected ? '0 0 16px rgba(82,242,154,.4)' : 'none',
          transition: `box-shadow ${t.nerv.motion.durations.fast}ms linear, border-color ${t.nerv.motion.durations.fast}ms linear`,
          '&:hover': selected ? null : { boxShadow: '0 0 14px rgba(242,100,0,.35), inset 0 0 16px rgba(242,100,0,.06)' },
          '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 3 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
        <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 26, lineHeight: 1, color: t.nerv.hue.mintHi, textTransform: 'none', textShadow: '0 0 8px rgba(82,242,154,.3)' })}>{jp}</Box>
        <Box sx={(t) => ({ fontSize: 9, color: t.nerv.hue.orange, letterSpacing: '0.1em', textAlign: 'right', lineHeight: 1.4 })}>
          {code}
          {codeSub && <Box component="span" sx={{ display: 'block' }}>{codeSub}</Box>}
        </Box>
      </Box>
      <Box component="h3" sx={(t) => ({ m: 0, fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 19, color: t.nerv.hue.mint, letterSpacing: '0.04em', mb: '6px' })}>{title}</Box>
      <Box component="p" sx={(t) => ({ m: 0, flex: 1, fontSize: 11, lineHeight: 1.55, color: t.nerv.hue.mint, opacity: 0.7, textTransform: 'none' })}>{children}</Box>
      <Box sx={(t) => ({ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: t.nerv.hue.greenMap })}>
        <Box component="span" sx={(t) => ({ border: `1px solid ${toneHue(t, tone)}`, color: toneHue(t, tone), p: '2px 6px', letterSpacing: '0.08em' })}>{stamp}</Box>
        {meta && <Box component="span">{meta}</Box>}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* AgentDot — a status-bar agent readout: a state dot + label. */

export interface AgentDotProps extends RootHTMLAttributes<'span'>, WithRef<'span'> {
  /** The readout text (e.g. `AGENT·01: NOMINAL`). */
  children: React.ReactNode;
  /** Busy — amber dot + amber text; otherwise a mint dot. @default false */
  busy?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * A single agent status readout for a footer / status bar: a small round state
 * dot (mint nominal · amber busy) before its label, the whole thing tinted amber
 * when busy.
 */
export function AgentDot({ children, busy = false, sx, ...rest }: AgentDotProps) {
  return (
    <Box
      component="span"
      {...rest}
      sx={[
        (t) => ({ display: 'inline-flex', alignItems: 'center', color: busy ? t.nerv.hue.amber : 'inherit', fontFamily: t.nerv.fonts.mono, whiteSpace: 'nowrap' }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="i" sx={(t) => ({ width: 7, height: 7, borderRadius: '50%', flex: 'none', mr: '6px', background: busy ? t.nerv.hue.amber : t.nerv.hue.mint })} />
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* MemoryRow — a queryable memory-vault entry (id · title · kind stamp). */

export type MemoryKind = 'decision' | 'pattern' | 'mistake' | 'learning';

/** `id`/`title` are this row's display text, not the DOM `id`/`title`. */
export interface MemoryRowProps extends Omit<RootHTMLAttributes, 'id' | 'title'>, WithRef {
  /** Node id (e.g. `MEM-2024-0512`). */
  id: React.ReactNode;
  /** The entry title. */
  title: React.ReactNode;
  /** Entry kind — colors the stamp (decision amber · pattern mint · mistake red · learning blue). */
  kind: MemoryKind;
  sx?: SxProps<Theme>;
}

const MEMORY_TONE: Record<MemoryKind, Tone> = { decision: 'amber', pattern: 'mint', mistake: 'red', learning: 'blue' };

/**
 * A memory-vault entry row: a fixed-width node id, a readable title, and a kind
 * stamp colored by type. Hovering lifts the border to orange. Pair with
 * {@link FilterChips} to build a queryable memory list.
 */
export function MemoryRow({ id, title, kind, sx, ...rest }: MemoryRowProps) {
  return (
    <Box
      {...rest}
      sx={[
        (t) => ({ display: 'flex', alignItems: 'center', gap: 1.75, border: `1px solid ${t.nerv.hue.greenDim}`, background: t.nerv.hue.void, p: '12px 14px', fontFamily: t.nerv.fonts.mono, '&:hover': { borderColor: t.nerv.hue.orange } }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ fontSize: 9, color: t.nerv.hue.greenMap, width: 120, flex: 'none', letterSpacing: '0.06em' })}>{id}</Box>
      <Box component="span" sx={(t) => ({ flex: 1, minWidth: 0, fontSize: 12, color: t.nerv.hue.mint, textTransform: 'none', letterSpacing: '0.02em' })}>{title}</Box>
      <Box component="span" sx={(t) => ({ flex: 'none', fontSize: 9, border: `1px solid ${toneHue(t, MEMORY_TONE[kind])}`, color: toneHue(t, MEMORY_TONE[kind]), p: '2px 7px', letterSpacing: '0.08em' })}>{kind.toUpperCase()}</Box>
    </Box>
  );
}
