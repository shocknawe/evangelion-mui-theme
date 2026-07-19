/**
 * Terminal / diagnostic log — amber ink at two brightness levels, dot-leader
 * status rows, a blinking cursor when the stream ends. Rows reveal in sequence;
 * reduced-motion prints the full log at once. Ported from sonnet-20.
 */
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useReducedMotion } from '../lib/motion';

type Row =
  | { k: 'line' | 'rule' | 'note' | 'sum'; t: string }
  | { k: 'chk'; l: string; ok: boolean };

const ROWS: Row[] = [
  { k: 'line', t: 'KESTREL·4 DIAGNOSTIC MODULE REV 4.02' },
  { k: 'rule', t: '---- SYSTEM CONFIGURATION ----' },
  { k: 'chk', l: 'CONTROL BUS LINK', ok: true },
  { k: 'chk', l: 'NVRAM CHECKSUM', ok: true },
  { k: 'chk', l: 'VEGA·1 UPLINK', ok: true },
  { k: 'chk', l: 'PUMP·B SECONDARY DRIVE', ok: false },
  { k: 'note', t: '» VIBRATION 3.8G — EXCEEDS TOLERANCE' },
  { k: 'chk', l: 'THERMAL SENSOR RING', ok: true },
  { k: 'chk', l: 'RESERVOIR LEVEL 88%', ok: true },
  { k: 'sum', t: '7 CHECKS · 6 PASS · 1 FLAGGED' },
];

export function Terminal() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? ROWS.length : 0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) { setCount(ROWS.length); return; }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= ROWS.length) clearInterval(id);
    }, 130);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [count]);

  const dim = t.palette.nerv.termDim;
  return (
    <Box sx={{ border: `1px solid ${t.nerv.hue.amberDim}`, background: 'rgba(244,159,9,.02)', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '6px 12px', borderBottom: `1px solid ${t.nerv.hue.amberDim}`, fontSize: 9, color: t.nerv.hue.amber, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono }}>
        STDOUT // DIAGNOSTIC
        <Box sx={{ display: 'flex', gap: '5px', ml: 'auto' }}>
          {[t.nerv.hue.redHi, t.nerv.hue.amber, t.nerv.hue.mint].map((c, i) => (
            <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
        </Box>
      </Box>
      <Box ref={bodyRef} sx={{ p: '12px 14px', fontSize: 12, lineHeight: 1.5, minHeight: 150, maxHeight: 190, overflowY: 'auto', fontFamily: t.nerv.fonts.mono }}>
        {ROWS.slice(0, count).map((r, i) => {
          if (r.k === 'chk')
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 1, whiteSpace: 'nowrap' }}>
                <Box component="span" sx={{ color: t.nerv.hue.amber }}>{r.l}</Box>
                <Box sx={{ flex: 1, borderBottom: `1px dotted ${t.nerv.hue.amberDim}`, height: 0, mb: '4px', minWidth: 12 }} />
                <Box component="span" sx={{ fontWeight: 700, color: r.ok ? t.nerv.hue.amber : t.nerv.hue.redHi, textShadow: r.ok ? 'none' : '0 0 4px currentColor' }}>{r.ok ? 'OK' : 'FAIL'}</Box>
              </Box>
            );
          const color = r.k === 'rule' ? dim : r.k === 'note' ? t.nerv.hue.redHi : r.k === 'sum' ? t.nerv.hue.mint : t.nerv.hue.amber;
          return (
            <Box key={i} sx={{ color, fontSize: r.k === 'note' ? 11 : 12 }}>{r.t}</Box>
          );
        })}
        {count >= ROWS.length && (
          <Box component="span" sx={{ display: 'inline-block', width: 8, height: 13, background: t.nerv.hue.amber, verticalAlign: '-2px', animation: reduced ? 'none' : `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` }} />
        )}
      </Box>
    </Box>
  );
}
