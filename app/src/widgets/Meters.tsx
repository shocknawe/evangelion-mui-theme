/**
 * Segmented meters & gauges — discrete LED segments, never a continuous fill.
 * Thresholds are drawn objects. All animate on an interval and settle to a
 * static reading under reduced-motion. Ported from sonnet-12 / sonnet-32.
 */
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type Theme } from '@mui/material/styles';
import { useReducedMotion } from '../lib/motion';

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

/* ---------- segmented vertical meter + threshold ---------- */
export function SegmentedMeter() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const SEGS = 20;
  const [levels, setLevels] = useState<number[]>(() => [10, 13, 8, 15]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setLevels((prev) => prev.map((l) => l + (Math.random() < 0.4 ? rnd(-2, 2) : 0)).map((l) => Math.max(3, Math.min(SEGS, l)))), 600);
    return () => clearInterval(id);
  }, [reduced]);

  const segColor = (i: number, lit: boolean) => {
    if (!lit) return { background: t.nerv.hue.greenDim, opacity: 0.3 };
    const p = ((i + 1) / SEGS) * 100;
    if (p > 70) return { background: t.nerv.hue.redHi, opacity: 1, boxShadow: '0 0 6px rgba(226,40,15,.55)' };
    if (p > 50) return { background: t.nerv.hue.amber, opacity: 1, boxShadow: '0 0 5px rgba(244,159,9,.45)' };
    return { background: t.nerv.hue.mint, opacity: 1, boxShadow: '0 0 5px rgba(82,242,154,.45)' };
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1.5, height: 150 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 9, color: t.nerv.hue.orange, borderRight: `1px solid ${t.nerv.hue.orange}`, pr: '5px', fontFamily: t.nerv.fonts.mono }}>
          <span>+100</span>
          <span>±0</span>
          <span>-100</span>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', gap: 2, position: 'relative' }}>
          {levels.map((lvl, bi) => (
            <Box key={bi} sx={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: '3px' }}>
              {Array.from({ length: SEGS }, (_, i) => (
                <Box key={i} sx={{ flex: 1, borderRadius: `${t.nerv.radius.chip}px`, transition: `opacity 120ms linear, background 120ms linear`, ...segColor(i, i < lvl) }} />
              ))}
            </Box>
          ))}
          <Box sx={{ position: 'absolute', left: -6, right: -6, bottom: '70%', height: 2, background: t.nerv.hue.orange, boxShadow: '0 0 6px rgba(242,100,0,.6)', zIndex: 2 }}>
            <Box component="span" sx={{ position: 'absolute', right: 0, top: -10, background: t.nerv.hue.void, border: `1px solid ${t.nerv.hue.orange}`, color: t.nerv.hue.orange, fontSize: 8, p: '1px 5px', fontFamily: t.nerv.fonts.mono }}>
              LIMIT · 70
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: '6px' }}>
        {['A', 'B', 'C', 'D'].map((l) => (
          <Box key={l} sx={{ flex: 1, textAlign: 'center', fontSize: 9, color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>
            {l}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ---------- radial arc gauge ---------- */
const polar = (cx: number, cy: number, r: number, d: number): [number, number] => {
  const a = ((d - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

export function RadialGauge() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(98);
  const RS = 22;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setPct(90 + Math.random() * 10), 1400);
    return () => clearInterval(id);
  }, [reduced]);

  const paths = useMemo(() => {
    const cx = 60, cy = 60, rO = 54, rI = 40, st = -135, en = 135, gap = 1.8;
    const span = (en - st - gap * RS) / RS;
    return Array.from({ length: RS }, (_, i) => {
      const a0 = st + i * (span + gap), a1 = a0 + span;
      const [p1x, p1y] = polar(cx, cy, rO, a1);
      const [p2x, p2y] = polar(cx, cy, rO, a0);
      const [p3x, p3y] = polar(cx, cy, rI, a0);
      const [p4x, p4y] = polar(cx, cy, rI, a1);
      return `M${p1x} ${p1y} A${rO} ${rO} 0 0 0 ${p2x} ${p2y} L${p3x} ${p3y} A${rI} ${rI} 0 0 1 ${p4x} ${p4y}Z`;
    });
  }, []);
  const lit = Math.round((pct / 100) * RS);

  return (
    <Box sx={{ position: 'relative', width: 120, height: 120 }}>
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        {paths.map((d, i) => (
          <path key={i} d={d} fill={i < lit ? t.nerv.hue.mint : t.nerv.hue.greenDim} opacity={i < lit ? 1 : 0.3} />
        ))}
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="b" sx={{ fontFamily: t.nerv.fonts.display, fontSize: 22, color: t.nerv.hue.mintHi, textShadow: '0 0 4px currentColor' }}>
          {Math.round(pct)}%
        </Box>
        <Box component="span" sx={{ fontSize: 8, color: t.nerv.hue.greenMap, letterSpacing: '0.12em' }}>ARMED</Box>
      </Box>
    </Box>
  );
}

/* ---------- horizontal bar + vertical columns gauge ---------- */
function seg(t: Theme, lit: boolean, hot = false) {
  if (!lit) return { background: t.nerv.hue.greenDim, opacity: 0.3 };
  if (hot) return { background: t.nerv.hue.redHi, opacity: 1 };
  return { background: t.nerv.hue.amber, opacity: 1, boxShadow: '0 0 4px rgba(244,159,9,.5)' };
}

export function BarColumnGauge() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [hbar, setHbar] = useState(9);
  const [cols, setCols] = useState<number[]>(() => [5, 7, 4, 6, 8, 5]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setHbar(Math.round((0.35 + Math.random() * 0.25) * 18));
      setCols(Array.from({ length: 6 }, () => 3 + Math.floor(Math.random() * 7)));
    }, 900);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: '3px', height: 34, width: '100%' }}>
        {Array.from({ length: 18 }, (_, i) => (
          <Box key={i} sx={{ flex: 1, ...(i < hbar ? { background: t.nerv.hue.blue, opacity: 1, boxShadow: '0 0 5px rgba(80,144,208,.5)' } : { background: t.nerv.hue.greenDim, opacity: 0.3 }) }} />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '6px', height: 110, alignItems: 'flex-end', width: '100%' }}>
        {cols.map((v, ci) => (
          <Box key={ci} sx={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: '2px', height: '100%' }}>
            {Array.from({ length: 10 }, (_, i) => (
              <Box key={i} sx={{ flex: 1, borderRadius: `${t.nerv.radius.chip}px`, ...seg(t, i < v, (i + 1) / 10 > 0.8) }} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ---------- negative-space stat ---------- */
export function NegativeStat() {
  const t = useTheme();
  return (
    <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, p: '22px', display: 'flex', flexDirection: 'column', gap: 1, minHeight: 150, justifyContent: 'center', width: '100%' }}>
      <Box component="span" sx={{ fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.16em', fontFamily: t.nerv.fonts.mono }}>MEMORY NODES</Box>
      <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 58, lineHeight: 0.9, color: t.nerv.hue.mintHi, textShadow: '0 0 10px rgba(82,242,154,.35)' }}>2,482</Box>
      <Box component="span" sx={{ fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em', mt: 'auto', fontFamily: t.nerv.fonts.mono }}>98.4% RETENTION · STABLE</Box>
    </Box>
  );
}
