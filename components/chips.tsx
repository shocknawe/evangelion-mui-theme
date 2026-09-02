/**
 * Stamp — the boxed status pill the design language stamps everywhere: a 1px
 * chrome/state outline (or a solid fill with black content) around a short label.
 * The atomic version of the `.stamp` grammar — use it instead of hand-rolling a
 * bordered `<span>` for every id, status, or tag.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';
import { type RootHTMLAttributes, type Tone, type WithRef, toneHue } from './util';

export interface StampProps extends RootHTMLAttributes<'span'>, WithRef<'span'> {
  children: ReactNode;
  /** Border / text hue (or fill hue when `filled`). @default 'orange' */
  tone?: Tone;
  /** Solid fill with black (`void`) content — the "recorded/active" inversion. */
  filled?: boolean;
  /** Blink at 1 Hz (in-progress) — settles lit under reduced motion. */
  blink?: boolean;
  /** Add a `currentColor` glow to the outline text. */
  glow?: boolean;
  /** `sm` (9px) or `md` (11px). @default 'md' */
  size?: 'sm' | 'md';
  sx?: SxProps<Theme>;
}

/**
 * A boxed stamp/pill. Idle = outline on black; `filled` inverts to a solid hue
 * fill with black content. `blink` marks in-progress; `glow` adds a phosphor
 * halo to the outline form.
 *
 * @example
 * <Stamp tone="mint" glow>SYS:NOMINAL</Stamp>
 * <Stamp tone="red" filled>DOWN</Stamp>
 */
export function Stamp({ children, tone = 'orange', filled = false, blink = false, glow = false, size = 'md', sx, ...rest }: StampProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const c = toneHue(t, tone);
  return (
    <Box
      component="span"
      {...rest}
      sx={[
        {
          display: 'inline-block',
          flex: 'none',
          border: `1px solid ${c}`,
          background: filled ? c : 'transparent',
          color: filled ? t.nerv.hue.void : c,
          borderRadius: `${t.nerv.radius.chip}px`,
          p: size === 'sm' ? '2px 7px' : '2px 8px',
          fontSize: size === 'sm' ? 9 : 11,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          letterSpacing: '0.06em',
          fontFamily: t.nerv.fonts.mono,
          textShadow: glow && !filled ? '0 0 4px currentColor' : 'none',
          animation: blink && !reduced ? `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` : 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
