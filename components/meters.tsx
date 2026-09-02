/**
 * Segmented meters & gauges — discrete LED segments, never a continuous fill;
 * thresholds are drawn objects. Each accepts controlled values, or animates a
 * self-driving demo when uncontrolled. All settle to a static reading under
 * `prefers-reduced-motion`.
 */
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';
import { type ClassesOf, type RootHTMLAttributes, type RootSVGAttributes, type SlotsOf, type WithRef, type Tone, resolveClasses, resolveSlot, toneHue } from './util';

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

/* ------------------------------------------------------------------ */
/* SegmentedMeter — vertical LED columns with a drawn threshold line. */

export interface SegmentedMeterProps extends RootHTMLAttributes, WithRef {
  /** Controlled per-column levels (0..segments). Omit to self-animate. */
  values?: number[];
  /** Seed levels when uncontrolled. @default [10, 13, 8, 15] */
  defaultValues?: number[];
  /** Segments per column. @default 20 */
  segments?: number;
  /** Threshold line as a percentage of full scale. @default 70 */
  limitPct?: number;
  /** Per-column labels along the bottom. @default ['A','B','C','D'] */
  columnLabels?: string[];
  /** Left-axis tick labels, top→bottom. @default ['+100','±0','-100'] */
  axisLabels?: [string, string, string];
  /** Animate when uncontrolled. @default true */
  animated?: boolean;
  /** Class overrides by part: `root`, `axis` (the tick rail), `segment` (a lit/unlit cell), `marker` (the threshold line). */
  classes?: ClassesOf<'root' | 'axis' | 'segment' | 'marker'>;
  sx?: SxProps<Theme>;
}

export function SegmentedMeter({
  values,
  defaultValues = [10, 13, 8, 15],
  segments = 20,
  limitPct = 70,
  columnLabels,
  axisLabels = ['+100', '±0', '-100'],
  animated = true,
  classes,
  className,
  sx,
  ...rest
}: SegmentedMeterProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [internal, setInternal] = useState<number[]>(defaultValues);
  const levels = values ?? internal;

  useEffect(() => {
    if (values !== undefined || !animated || reduced) return;
    const id = setInterval(
      () =>
        setInternal((prev) =>
          prev.map((l) => l + (Math.random() < 0.4 ? rnd(-2, 2) : 0)).map((l) => Math.max(3, Math.min(segments, l))),
        ),
      600,
    );
    return () => clearInterval(id);
  }, [values, animated, reduced, segments]);

  const labels = columnLabels ?? levels.map((_, i) => String.fromCharCode(65 + i));

  const segColor = (i: number, lit: boolean) => {
    if (!lit) return { background: t.nerv.hue.greenDim, opacity: 0.3 };
    const p = ((i + 1) / segments) * 100;
    if (p > 70) return { background: t.nerv.hue.redHi, opacity: 1, boxShadow: '0 0 6px rgba(226,40,15,.55)' };
    if (p > 50) return { background: t.nerv.hue.amber, opacity: 1, boxShadow: '0 0 5px rgba(244,159,9,.45)' };
    return { background: t.nerv.hue.mint, opacity: 1, boxShadow: '0 0 5px rgba(82,242,154,.45)' };
  };

  return (
    <Box {...rest} className={resolveClasses('SegmentedMeter', 'root', classes, className)} sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', gap: 1.5, height: 150 }}>
        <Box className={resolveClasses('SegmentedMeter', 'axis', classes)} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 9, color: t.nerv.hue.orange, borderRight: `1px solid ${t.nerv.hue.orange}`, pr: '5px', fontFamily: t.nerv.fonts.mono }}>
          {axisLabels.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', gap: 2, position: 'relative' }}>
          {levels.map((lvl, bi) => (
            <Box key={bi} sx={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: '3px' }}>
              {Array.from({ length: segments }, (_, i) => (
                <Box key={i} className={resolveClasses('SegmentedMeter', 'segment', classes)} sx={{ flex: 1, borderRadius: `${t.nerv.radius.chip}px`, transition: `opacity ${t.nerv.motion.durations.fast}ms linear, background ${t.nerv.motion.durations.fast}ms linear`, ...segColor(i, i < lvl) }} />
              ))}
            </Box>
          ))}
          <Box className={resolveClasses('SegmentedMeter', 'marker', classes)} sx={{ position: 'absolute', left: -6, right: -6, bottom: `${limitPct}%`, height: 2, background: t.nerv.hue.orange, boxShadow: '0 0 6px rgba(242,100,0,.6)', zIndex: 2 }}>
            <Box component="span" sx={{ position: 'absolute', right: 0, top: -10, background: t.nerv.hue.void, border: `1px solid ${t.nerv.hue.orange}`, color: t.nerv.hue.orange, fontSize: 8, p: '1px 5px', fontFamily: t.nerv.fonts.mono }}>
              LIMIT · {limitPct}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: '6px' }}>
        {labels.map((l) => (
          <Box key={l} sx={{ flex: 1, textAlign: 'center', fontSize: 9, color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>
            {l}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* RadialGauge — a segmented arc with a big center readout. */

const polar = (cx: number, cy: number, r: number, d: number): [number, number] => {
  const a = ((d - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

/** Props the `track` slot receives — a consumer supplying it owns the whole SVG. */
export interface RadialGaugeTrackProps extends RootSVGAttributes {}

/** Props the `readout` slot receives (notes/2.2 §3). */
export interface RadialGaugeReadoutProps extends RootHTMLAttributes<'div'> {
  /** The current reading (already rounded). */
  value?: number;
  /** The caption under the readout. */
  label?: string;
}

export interface RadialGaugeSlotProps {
  /** Props merged onto the gauge track (default: the segmented-arc `<svg>`). */
  track?: RadialGaugeTrackProps;
  /** Props merged onto the center readout stack. */
  readout?: RadialGaugeReadoutProps;
}

export interface RadialGaugeProps extends RootHTMLAttributes, WithRef {
  /** Controlled percentage (0..100). Omit to self-animate near full. */
  value?: number;
  /** Caption under the readout. @default 'ARMED' */
  label?: string;
  /** Number of arc segments. @default 22 */
  segments?: number;
  /** Diameter (px). @default 120 */
  size?: number;
  /** Animate when uncontrolled. @default true */
  animated?: boolean;
  /**
   * Replace an internal part: `track` (the arc `<svg>` — a custom one owns the
   * whole drawing; the `paths` geometry stays internal) or `readout` (the
   * center value + label stack).
   */
  slots?: SlotsOf<'track' | 'readout'>;
  /** Props merged onto each part, consumer props winning. */
  slotProps?: RadialGaugeSlotProps;
  /** Class overrides by part: `root`, `track` (the arc SVG), `readout` (the center stack), `readoutValue`, `readoutLabel`. */
  classes?: ClassesOf<'root' | 'track' | 'readout' | 'readoutValue' | 'readoutLabel'>;
  sx?: SxProps<Theme>;
}

export function RadialGauge({ value, label = 'ARMED', segments = 22, size = 120, animated = true, slots, slotProps, classes, className, sx, ...rest }: RadialGaugeProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [internal, setInternal] = useState(98);
  const pct = value ?? internal;

  useEffect(() => {
    if (value !== undefined || !animated || reduced) return;
    const id = setInterval(() => setInternal(90 + Math.random() * 10), 1400);
    return () => clearInterval(id);
  }, [value, animated, reduced]);

  const paths = useMemo(() => {
    const cx = 60, cy = 60, rO = 54, rI = 40, st = -135, en = 135, gap = 1.8;
    const span = (en - st - gap * segments) / segments;
    return Array.from({ length: segments }, (_, i) => {
      const a0 = st + i * (span + gap), a1 = a0 + span;
      const [p1x, p1y] = polar(cx, cy, rO, a1);
      const [p2x, p2y] = polar(cx, cy, rO, a0);
      const [p3x, p3y] = polar(cx, cy, rI, a0);
      const [p4x, p4y] = polar(cx, cy, rI, a1);
      return `M${p1x} ${p1y} A${rO} ${rO} 0 0 0 ${p2x} ${p2y} L${p3x} ${p3y} A${rI} ${rI} 0 0 1 ${p4x} ${p4y}Z`;
    });
  }, [segments]);
  const lit = Math.round((pct / 100) * segments);

  // `track` slot (notes/2.2 §3): the consumer owns the whole SVG; the `paths`
  // memo and the `lit` math stay internal — the slot replaces the rendering,
  // not the geometry calculation.
  const [TrackSlot, trackProps] = resolveSlot(slots?.track, 'svg', {
    defaults: {
      viewBox: '0 0 120 120',
      width: '100%',
      height: '100%',
      children: paths.map((d, i) => (
        <path key={i} d={d} fill={i < lit ? t.nerv.hue.mint : t.nerv.hue.greenDim} opacity={i < lit ? 1 : 0.3} />
      )),
    },
    slotProps: slotProps?.track,
    className: resolveClasses('RadialGauge', 'track', classes),
  });
  // `readout` slot: the centered value + label stack, fed the rounded reading.
  const [ReadoutSlot, readoutProps] = resolveSlot(slots?.readout, Box, {
    contract: { value: Math.round(pct), label },
    defaults: {
      sx: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
      children: (
        <>
          <Box component="b" className={resolveClasses('RadialGauge', 'readoutValue', classes)} sx={{ fontFamily: t.nerv.fonts.display, fontSize: 22, color: t.nerv.hue.mintHi, textShadow: '0 0 4px currentColor' }}>
            {Math.round(pct)}%
          </Box>
          <Box component="span" className={resolveClasses('RadialGauge', 'readoutLabel', classes)} sx={{ fontSize: 8, color: t.nerv.hue.greenMap, letterSpacing: '0.12em' }}>
            {label}
          </Box>
        </>
      ),
    },
    slotProps: slotProps?.readout,
    className: resolveClasses('RadialGauge', 'readout', classes),
  });

  return (
    <Box {...rest} className={resolveClasses('RadialGauge', 'root', classes, className)} sx={[{ position: 'relative', width: size, height: size }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <TrackSlot {...trackProps} />
      <ReadoutSlot {...readoutProps} />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* BarColumnGauge — a horizontal LED bar over a column histogram. */

function seg(t: Theme, lit: boolean, hot = false) {
  if (!lit) return { background: t.nerv.hue.greenDim, opacity: 0.3 };
  if (hot) return { background: t.nerv.hue.redHi, opacity: 1 };
  return { background: t.nerv.hue.amber, opacity: 1, boxShadow: '0 0 4px rgba(244,159,9,.5)' };
}

export interface BarColumnGaugeProps extends RootHTMLAttributes, WithRef {
  /** Controlled column heights (0..10). Omit to self-animate. */
  columns?: number[];
  /** Controlled horizontal-bar fill (0..18). Omit to self-animate. */
  bar?: number;
  /** Animate when uncontrolled. @default true */
  animated?: boolean;
  /** Class overrides by part: `root` (the pair). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

export function BarColumnGauge({ columns, bar, animated = true, classes, className, sx, ...rest }: BarColumnGaugeProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [hbar, setHbar] = useState(9);
  const [cols, setCols] = useState<number[]>([5, 7, 4, 6, 8, 5]);
  const barVal = bar ?? hbar;
  const colVals = columns ?? cols;

  useEffect(() => {
    if ((columns !== undefined && bar !== undefined) || !animated || reduced) return;
    const id = setInterval(() => {
      setHbar(Math.round((0.35 + Math.random() * 0.25) * 18));
      setCols(Array.from({ length: 6 }, () => 3 + Math.floor(Math.random() * 7)));
    }, 900);
    return () => clearInterval(id);
  }, [columns, bar, animated, reduced]);

  return (
    <Box {...rest} className={resolveClasses('BarColumnGauge', 'root', classes, className)} sx={[{ display: 'flex', flexDirection: 'column', gap: 1.75, width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', gap: '3px', height: 34, width: '100%' }}>
        {Array.from({ length: 18 }, (_, i) => (
          <Box key={i} sx={{ flex: 1, ...(i < barVal ? { background: t.nerv.hue.blue, opacity: 1, boxShadow: '0 0 5px rgba(80,144,208,.5)' } : { background: t.nerv.hue.greenDim, opacity: 0.3 }) }} />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '6px', height: 110, alignItems: 'flex-end', width: '100%' }}>
        {colVals.map((val, ci) => (
          <Box key={ci} sx={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: '2px', height: '100%' }}>
            {Array.from({ length: 10 }, (_, i) => (
              <Box key={i} sx={{ flex: 1, borderRadius: `${t.nerv.radius.chip}px`, ...seg(t, i < val, (i + 1) / 10 > 0.8) }} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ProgressMeter — a horizontal segmented bar with an optional threshold line. */

export interface ProgressMeterProps extends RootHTMLAttributes, WithRef {
  /** Target completion (0..100). */
  value: number;
  /** Number of discrete segments. @default 25 */
  segments?: number;
  /** A drawn gate/threshold marker at this percentage. */
  threshold?: { pct: number; label?: string };
  /** Left caption after the percentage. @default 'COMPLETE' */
  label?: string;
  /** Right-aligned readout (e.g. an ETA). */
  readout?: React.ReactNode;
  /** Fill in stepped increments on mount. @default true */
  animated?: boolean;
  /** Class overrides by part: `root`, `marker` (the threshold line + label). */
  classes?: ClassesOf<'root' | 'marker'>;
  sx?: SxProps<Theme>;
}

/**
 * A horizontal progress meter drawn as discrete LED segments (never a continuous
 * fill), with an optional threshold/gate line rendered as its own object. Fills
 * in mechanical steps on mount; jumps straight to `value` under reduced motion.
 */
export function ProgressMeter({ value, segments = 25, threshold, label = 'COMPLETE', readout, animated = true, classes, className, sx, ...rest }: ProgressMeterProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const target = Math.round((value / 100) * segments);
  const [fill, setFill] = useState(animated && !reduced ? 0 : target);

  useEffect(() => {
    if (!animated || reduced) {
      setFill(target);
      return;
    }
    setFill(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setFill(n);
      if (n >= target) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, [target, animated, reduced]);

  const pct = Math.round((fill / segments) * 100);

  return (
    <Box {...rest} className={resolveClasses('ProgressMeter', 'root', classes, className)} sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ position: 'relative', pt: '2px' }}>
        <Box sx={{ display: 'flex', gap: '3px', height: 18 }}>
          {Array.from({ length: segments }, (_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                borderRadius: `${t.nerv.radius.chip}px`,
                transition: `opacity ${t.nerv.motion.durations.fast}ms linear, background ${t.nerv.motion.durations.fast}ms linear`,
                ...(i < fill ? { background: t.nerv.hue.mint, opacity: 1, boxShadow: '0 0 5px rgba(82,242,154,.45)' } : { background: t.nerv.hue.greenDim, opacity: 0.35 }),
              }}
            />
          ))}
        </Box>
        {threshold && (
          <Box className={resolveClasses('ProgressMeter', 'marker', classes)} sx={{ position: 'absolute', top: -4, bottom: -4, left: `${threshold.pct}%`, width: 2, background: t.nerv.hue.amber, boxShadow: '0 0 6px rgba(244,159,9,.6)' }}>
            {threshold.label && (
              <Box component="span" sx={{ position: 'absolute', top: -11, left: '50%', transform: 'translate(-50%, -100%)', color: t.nerv.hue.amber, background: t.nerv.hue.void, border: `1px solid ${t.nerv.hue.amber}`, borderRadius: `${t.nerv.radius.chip}px`, fontSize: 9, p: '1px 6px', whiteSpace: 'nowrap', fontFamily: t.nerv.fonts.mono }}>
                {threshold.label}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, fontSize: 10, color: t.nerv.hue.greenMap, mt: '6px', fontFamily: t.nerv.fonts.mono }}>
        <span>
          <Box component="b" sx={{ color: t.nerv.hue.mint, fontWeight: 400 }}>{pct}%</Box> {label}
        </span>
        {readout && <span>{readout}</span>}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* HealthColumns — mini stepped system-health bars for a header. */

export interface HealthColumnsProps extends RootHTMLAttributes, WithRef {
  /** Number of columns. @default 4 */
  columns?: number;
  /** Cells per column. @default 7 */
  cells?: number;
  /** Repaint on an interval (biased-nominal). @default true */
  animated?: boolean;
  /** Reports lit vs total cells on each repaint — drive a "SYSTEM HEALTH" word. */
  onSummary?: (lit: number, total: number) => void;
  /** Class overrides by part: `root` (the column bank). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/** A tiny system-health readout: stepped mini columns, mostly nominal (mint),
 *  with occasional amber peaks. Static under reduced motion. */
export function HealthColumns({ columns = 4, cells = 7, animated = true, onSummary, classes, className, sx, ...rest }: HealthColumnsProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const seed = () => Array.from({ length: columns }, () => ({ lit: 3 + Math.floor(Math.random() * 3), hot: Math.random() < 0.16 }));
  const [cols, setCols] = useState(seed);

  useEffect(() => {
    if (!animated || reduced) return;
    const id = setInterval(() => setCols(seed()), 700);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, reduced, columns]);

  const litTotal = cols.reduce((s, c) => s + c.lit, 0);
  useEffect(() => {
    onSummary?.(litTotal, columns * cells);
  }, [litTotal, columns, cells, onSummary]);

  return (
    <Box role="img" aria-label="System health" {...rest} className={resolveClasses('HealthColumns', 'root', classes, className)} sx={[{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: 40 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {cols.map((col, ci) => (
        <Box key={ci} sx={{ width: 9, display: 'flex', flexDirection: 'column-reverse', gap: '2px' }}>
          {Array.from({ length: cells }, (_, i) => {
            const on = i < col.lit;
            const hot = on && col.hot && i === col.lit - 1;
            return (
              <Box
                key={i}
                sx={{
                  height: 4,
                  borderRadius: '1px',
                  ...(on
                    ? hot
                      ? { background: t.nerv.hue.amber, boxShadow: '0 0 4px rgba(244,159,9,.5)' }
                      : { background: t.nerv.hue.mint, boxShadow: '0 0 4px rgba(82,242,154,.5)' }
                    : { background: t.nerv.hue.greenDim, opacity: 0.35 }),
                }}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* SegmentBar — a thin inline horizontal segmented fill. */

export interface SegmentBarProps extends RootHTMLAttributes, WithRef {
  /** Fill percentage (0..100). */
  value: number;
  /** Number of segments. @default 20 */
  segments?: number;
  /** Fill hue. @default 'mint' */
  tone?: Tone;
  /** Bar height (px). @default 8 */
  height?: number;
  /** Class overrides by part: `root`, `segment` (a lit/unlit cell). */
  classes?: ClassesOf<'root' | 'segment'>;
  sx?: SxProps<Theme>;
}

/**
 * A compact horizontal progress bar drawn as discrete lit segments — the inline
 * counterpart to {@link ProgressMeter} (no labels or threshold), for a `PROGRESS
 * … 62%` row.
 */
export function SegmentBar({ value, segments = 20, tone = 'mint', height = 8, classes, className, sx, ...rest }: SegmentBarProps) {
  const t = useTheme();
  const lit = Math.round((value / 100) * segments);
  const c = toneHue(t, tone);
  return (
    <Box {...rest} className={resolveClasses('SegmentBar', 'root', classes, className)} sx={[{ display: 'flex', gap: '2px', height, flex: 1, minWidth: 40 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {Array.from({ length: segments }, (_, i) => (
        <Box
          key={i}
          className={resolveClasses('SegmentBar', 'segment', classes)}
          sx={{
            flex: 1,
            borderRadius: '1px',
            ...(i < lit
              ? { background: c, opacity: 1, boxShadow: `0 0 4px color-mix(in srgb, ${c} 40%, transparent)` }
              : { background: t.nerv.hue.greenDim, opacity: 0.3 }),
          }}
        />
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* MeterBar — a labeled thin continuous vitals bar (label · value · fill). */

export interface MeterBarProps extends RootHTMLAttributes, WithRef {
  /** Left label (e.g. `CPU`). */
  label: React.ReactNode;
  /** Right-aligned readout (e.g. `12.4%`). */
  value?: React.ReactNode;
  /** Fill percentage (0..100). */
  pct: number;
  /** Fill hue. @default 'mint' */
  tone?: Tone;
  /** Force the caution (amber) fill regardless of tone. @default false */
  warn?: boolean;
  /** Track height (px). @default 5 */
  height?: number;
  /** Class overrides by part: `root`, `fill` (the continuous fill bar). */
  classes?: ClassesOf<'root' | 'fill'>;
  sx?: SxProps<Theme>;
}

/**
 * A compact vitals meter: a label + value row over a thin **continuous** glowing
 * fill (not segmented — the quiet counterpart to {@link SegmentBar}, for a
 * sidebar/cluster stat like CPU or memory). `warn` flips the fill to amber.
 */
export function MeterBar({ label, value, pct, tone = 'mint', warn = false, height = 5, classes, className, sx, ...rest }: MeterBarProps) {
  const t = useTheme();
  const c = warn ? t.nerv.hue.amber : toneHue(t, tone);
  return (
    <Box {...rest} className={resolveClasses('MeterBar', 'root', classes, className)} sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, fontSize: 10, color: t.nerv.hue.mint, mb: '4px', fontFamily: t.nerv.fonts.mono, '& b': { color: t.nerv.hue.mintHi, fontWeight: 400 } }}>
        <Box component="span">{label}</Box>
        {value != null && <Box component="b">{value}</Box>}
      </Box>
      <Box sx={{ height, background: t.palette.nerv.overlay, position: 'relative', overflow: 'hidden' }}>
        <Box className={resolveClasses('MeterBar', 'fill', classes)} sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(100, pct))}%`, background: c, boxShadow: `0 0 6px ${c}`, transition: `width ${t.nerv.motion.durations.slide}ms linear` }} />
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* LedColumn — a single vertical LED column that fills bottom-up. */

export interface LedColumnProps extends RootHTMLAttributes, WithRef {
  /** Fill percentage (0..100). */
  value: number;
  /** Number of stacked segments. @default 14 */
  segments?: number;
  /** Fill hue. @default 'amber' */
  tone?: Tone;
  /** Below this percentage the lit segments turn critical (red) — a low-level
   *  warning (e.g. a freshness/fuel gauge draining). Omit to disable. */
  hotBelow?: number;
  /** Column height (px). @default 104 */
  height?: number;
  /** Column width (px). @default 44 */
  width?: number;
  /** Class overrides by part: `root`, `segment` (a lit/unlit cell). */
  classes?: ClassesOf<'root' | 'segment'>;
  sx?: SxProps<Theme>;
}

/**
 * A single vertical LED column that fills from the bottom — the vertical
 * counterpart to {@link SegmentBar}. When `value` falls under `hotBelow`, the lit
 * segments switch to the critical (red) hue, so a draining gauge reads as an
 * alarm without a separate control.
 */
export function LedColumn({ value, segments = 14, tone = 'amber', hotBelow, height = 104, width = 44, classes, className, sx, ...rest }: LedColumnProps) {
  const t = useTheme();
  const lit = Math.round((value / 100) * segments);
  const hot = hotBelow !== undefined && value < hotBelow;
  const c = hot ? t.nerv.hue.redHi : toneHue(t, tone);
  return (
    <Box {...rest} className={resolveClasses('LedColumn', 'root', classes, className)} sx={[{ display: 'flex', flexDirection: 'column-reverse', gap: '3px', width, height }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {Array.from({ length: segments }, (_, i) => (
        <Box
          key={i}
          className={resolveClasses('LedColumn', 'segment', classes)}
          sx={{
            flex: 1,
            borderRadius: `${t.nerv.radius.chip}px`,
            transition: `opacity ${t.nerv.motion.durations.fast}ms linear, background ${t.nerv.motion.durations.fast}ms linear`,
            ...(i < lit
              ? { background: c, opacity: 1, boxShadow: `0 0 ${hot ? 6 : 5}px color-mix(in srgb, ${c} ${hot ? 60 : 50}%, transparent)` }
              : { background: t.nerv.hue.greenDim, opacity: 0.3 }),
          }}
        />
      ))}
    </Box>
  );
}
