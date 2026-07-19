/**
 * Unit roster — a grid of selectable status tiles. Each status owns a hue
 * (NOMINAL mint · CAUTION amber+blink · STANDBY blue · OFFLINE red inversion);
 * selection thickens the border. Ported from sonnet-37.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type Theme } from '@mui/material/styles';
import { useReducedMotion } from '../lib/motion';

type Status = 'NOMINAL' | 'CAUTION' | 'STANDBY' | 'OFFLINE';
const UNITS: [string, Status][] = [
  ['UNIT-07', 'NOMINAL'],
  ['LYRA·4', 'CAUTION'],
  ['CYGNUS·7', 'STANDBY'],
  ['AQUILA·11', 'OFFLINE'],
];

function styleFor(t: Theme, s: Status) {
  switch (s) {
    case 'NOMINAL': return { borderColor: t.nerv.hue.mint, color: t.nerv.hue.mint };
    case 'CAUTION': return { borderColor: t.nerv.hue.amber, color: t.nerv.hue.amber };
    case 'STANDBY': return { borderColor: t.nerv.hue.blue, color: t.nerv.hue.blue };
    case 'OFFLINE': return { borderColor: t.nerv.hue.redHi, background: t.nerv.hue.redHi, color: t.nerv.hue.void };
  }
}

export function Roster() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [pressed, setPressed] = useState<number | null>(null);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1, width: '100%' }}>
      {UNITS.map(([id, s], i) => {
        const st = styleFor(t, s);
        const on = pressed === i;
        return (
          <Box
            key={id}
            component="button"
            aria-pressed={on}
            onClick={() => setPressed(on ? null : i)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              textAlign: 'left',
              cursor: 'pointer',
              p: '8px 9px',
              background: t.nerv.hue.void,
              fontFamily: t.nerv.fonts.mono,
              textTransform: 'uppercase',
              border: `${on ? 2 : 1}px solid`,
              ...st,
              '&:focus-visible': { outline: `2px dashed ${t.nerv.hue.amber}`, outlineOffset: 2 },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
              <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 14 }}>{id}</Box>
            </Box>
            <Box
              component="span"
              sx={{
                alignSelf: 'flex-start',
                border: `1px solid ${s === 'OFFLINE' ? t.nerv.hue.void : 'currentColor'}`,
                background: s === 'OFFLINE' ? t.nerv.hue.void : 'transparent',
                color: s === 'OFFLINE' ? t.nerv.hue.redHi : 'currentColor',
                p: '1px 6px',
                fontSize: 9,
                borderRadius: `${t.nerv.radius.chip}px`,
                animation: s === 'CAUTION' && !reduced ? `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` : 'none',
              }}
            >
              {s}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
