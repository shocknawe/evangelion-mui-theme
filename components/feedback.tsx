/**
 * Feedback pieces beyond MUI's Alert/Dialog (which the theme styles directly):
 * the tri-channel hazard decision prompt.
 */
import { useRef, useState, type KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

/* ------------------------------------------------------------------ */
/* HazardPrompt — a full-bleed Y/N decision surface. */

export interface HazardPromptProps {
  /** Large kanji verb (e.g. `裁定`). */
  jp: string;
  /** English action shown in the punched-out band (e.g. `DECIDE`). */
  en: string;
  /** Fired on click / Enter / Space. */
  onDecide?: () => void;
  /** Height of the surface (px). @default 150 */
  height?: number;
  sx?: SxProps<Theme>;
}

/**
 * The tri-channel hazard prompt: a solid red decision surface, hazard-striped top
 * and bottom, with a boxed kanji verb over a punched-out English action band. It
 * flashes (color-inverts) for one frame on activation. Keep it to one job.
 *
 * @example <HazardPrompt jp="裁定" en="DECIDE" onDecide={route} />
 */
export function HazardPrompt({ jp, en, onDecide, height = 150, sx }: HazardPromptProps) {
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const trigger = () => {
    setFlash(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 120);
    onDecide?.();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trigger();
    }
  };

  const stripe = { position: 'absolute' as const, left: 0, right: 0, height: 14, background: 'repeating-linear-gradient(-45deg, #000 0 10px, transparent 10px 20px)' };

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={en.toLowerCase()}
      onClick={trigger}
      onKeyDown={onKey}
      sx={[
        (t) => ({
          position: 'relative',
          border: `2px solid ${t.nerv.hue.redHi}`,
          background: t.nerv.hue.redHi,
          height,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          filter: flash ? 'invert(1)' : 'none',
          '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 2 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ ...stripe, top: 0 }} />
      <Box
        sx={(t) => ({
          fontFamily: t.nerv.fonts.jp,
          fontWeight: 800,
          fontSize: 20,
          color: t.nerv.hue.void,
          border: `2px solid ${t.nerv.hue.void}`,
          p: '1px 12px',
          letterSpacing: '0.4em',
          textIndent: '0.4em',
        })}
      >
        {jp}
      </Box>
      <Box sx={(t) => ({ background: t.nerv.hue.void, width: '100%', textAlign: 'center', py: '4px' })}>
        <Box sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 44, lineHeight: 1, color: t.nerv.hue.redHi })}>
          {en}
        </Box>
      </Box>
      <Box sx={{ ...stripe, bottom: 0 }} />
    </Box>
  );
}
