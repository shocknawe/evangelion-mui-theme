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
