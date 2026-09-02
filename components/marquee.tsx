/**
 * Status marquee — a red hazard ticker. Scrolls linearly (mechanical, not eased);
 * reduced-motion renders it static.
 */
import Box from '@mui/material/Box';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';
import { type ClassesOf, type RootHTMLAttributes, type WithRef, resolveClasses } from './util';

export interface MarqueeProps extends RootHTMLAttributes, WithRef {
  /** Ticker items. Defaults to a sample status feed. */
  items?: string[];
  /** Seconds for one full pass. @default 18 */
  speedSec?: number;
  /** Class overrides by part: `root` (the ticker), `track` (the scrolling strip). */
  classes?: ClassesOf<'root' | 'track'>;
  sx?: SxProps<Theme>;
}

const DEFAULT_ITEMS = ['V2.4.0-STABLE DEPLOYED', '38 LISTENERS UP', 'NO ANOMALIES'];

export function Marquee({ items = DEFAULT_ITEMS, speedSec = 18, classes, className, sx, ...rest }: MarqueeProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const track = (
    <Box component="span" sx={{ display: 'inline-block', py: 1 }}>
      {items.map((item, i) => (
        <Box key={i} component="span" sx={{ mx: 3, '&::before': { content: '"▚ "', color: t.nerv.hue.orange } }}>
          {item}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      {...rest}
      className={resolveClasses('Marquee', 'root', classes, className)}
      sx={[
        {
          borderTop: `2px solid ${t.nerv.hue.redHi}`,
          borderBottom: `2px solid ${t.nerv.hue.redHi}`,
          background: t.nerv.hue.hazardBg,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
          fontSize: 11,
          letterSpacing: '0.16em',
          color: t.nerv.hue.redHi,
          textShadow: '0 0 6px rgba(226,40,15,.5)',
          fontFamily: t.nerv.fonts.mono,
          '@keyframes nervMarquee': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box className={resolveClasses('Marquee', 'track', classes)} sx={{ display: 'inline-block', whiteSpace: 'nowrap', animation: reduced ? 'none' : `nervMarquee ${speedSec}s linear infinite` }}>
        {track}
        {!reduced && track}
      </Box>
    </Box>
  );
}
