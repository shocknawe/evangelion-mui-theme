/**
 * Seven-segment clock — two skins driven by one digit factory:
 *   · mint timestamp chip (dark digits on a paper face)
 *   · orange countdown readout (glowing digits on void)
 * Colons blink at 1 Hz; reduced-motion holds them lit. Ported from exp-01.
 */
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useReducedMotion, pad2 } from '../lib/motion';

const SEGMAP: Record<number, string> = {
  0: 'abcdef',
  1: 'bc',
  2: 'abged',
  3: 'abgcd',
  4: 'fgbc',
  5: 'afgcd',
  6: 'afgedc',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcfgd',
};
const SEGPTS: Record<string, string> = {
  a: '7,4 10.5,0.5 29.5,0.5 33,4 29.5,7.5 10.5,7.5',
  b: '36,7 39.5,10.5 39.5,27.5 36,31 32.5,27.5 32.5,10.5',
  c: '36,33 39.5,36.5 39.5,53.5 36,57 32.5,53.5 32.5,36.5',
  d: '7,60 10.5,56.5 29.5,56.5 33,60 29.5,63.5 10.5,63.5',
  e: '4,33 7.5,36.5 7.5,53.5 4,57 0.5,53.5 0.5,36.5',
  f: '4,7 7.5,10.5 7.5,27.5 4,31 0.5,27.5 0.5,10.5',
  g: '7,32 10.5,28.5 29.5,28.5 33,32 29.5,35.5 10.5,35.5',
};

function Digit({ value, w, h, on, off, glow }: { value: number; w: number; h: number; on: string; off: string; glow?: boolean }) {
  const lit = SEGMAP[value] ?? '';
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 46 64"
      style={glow ? { filter: 'drop-shadow(0 0 3px rgba(242,100,0,.85)) drop-shadow(0 0 8px rgba(242,100,0,.4))' } : undefined}
    >
      {'abcdefg'.split('').map((k) => (
        <polygon key={k} points={SEGPTS[k]} transform="translate(6,0) skewX(-6)" fill={lit.includes(k) ? on : off} />
      ))}
    </svg>
  );
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  const [tick, setTick] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      setTick((t) => !t);
    }, 500);
    return () => clearInterval(id);
  }, []);
  return { now, tick };
}

export function SevenSegClock() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const { now, tick } = useNow();

  const h = now.getHours();
  const h12 = pad2(h % 12 || 12);
  const mm = pad2(now.getMinutes());
  const ss = pad2(now.getSeconds());
  const chipDigits = (h12 + mm + ss).split('').map(Number);
  const cdDigits = (pad2(h) + mm + ss).split('').map(Number);
  const colonOpacity = reduced || tick ? 1 : 0.25;

  const Colon = ({ dark }: { dark?: boolean }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: dark ? '5px' : '6px', mx: '1px', opacity: colonOpacity }}>
      <Box sx={{ width: dark ? 3 : 4, height: dark ? 3 : 4, background: dark ? t.nerv.hue.void : t.nerv.hue.orange, boxShadow: dark ? 'none' : `0 0 4px ${t.nerv.hue.orange}` }} />
      <Box sx={{ width: dark ? 3 : 4, height: dark ? 3 : 4, background: dark ? t.nerv.hue.void : t.nerv.hue.orange, boxShadow: dark ? 'none' : `0 0 4px ${t.nerv.hue.orange}` }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
      {/* mint timestamp chip — dark digits on paper */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: t.nerv.hue.paper,
          p: '5px 9px 4px',
          borderRadius: `${t.nerv.radius.chip}px`,
          boxShadow: '0 0 10px rgba(237,248,214,.4), inset 0 0 4px rgba(10,10,10,.15)',
        }}
      >
        {chipDigits.map((d, i) => (
          <Box key={i} sx={{ display: 'contents' }}>
            <Digit value={d} w={13} h={20} on={t.nerv.hue.void} off="rgba(10,10,10,.12)" />
            {(i === 1 || i === 3) && <Colon dark />}
          </Box>
        ))}
        <Box component="span" sx={{ fontWeight: 700, fontSize: 10, color: t.nerv.hue.void, ml: '5px', letterSpacing: '0.08em', fontFamily: t.nerv.fonts.mono }}>
          {h < 12 ? 'AM' : 'PM'}
        </Box>
      </Box>

      {/* orange countdown — glowing digits on void */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {cdDigits.map((d, i) => (
          <Box key={i} sx={{ display: 'contents' }}>
            <Digit value={d} w={20} h={30} on={t.nerv.hue.orange} off="rgba(242,100,0,.07)" glow />
            {(i === 1 || i === 3) && <Colon />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
