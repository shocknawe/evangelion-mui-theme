/**
 * Feedback pieces beyond MUI's Alert/Dialog (which the theme styles directly):
 * the tri-channel hazard decision prompt.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
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

/* ------------------------------------------------------------------ */
/* GateDecisionDialog — a full-screen approve / deny / defer decision. */

export type GateDecision = 'approve' | 'deny' | 'defer';

export interface GateDecisionDialogProps {
  /** Whether the overlay is shown. */
  open: boolean;
  /** The thing being decided (shown in the ITEM line). */
  item?: string;
  /** Fired with the chosen decision. */
  onDecide: (decision: GateDecision) => void;
  /** Fired on Escape / backdrop. If omitted, those are ignored. */
  onClose?: () => void;
  /** Large kanji verb. @default '裁定' */
  jp?: string;
  /** English action. @default 'DECIDE' */
  en?: string;
}

const ACTIONS: { kind: GateDecision; jp: string; en: string; tone: 'mint' | 'red' | 'blue' }[] = [
  { kind: 'approve', jp: '承認', en: 'APPROVE', tone: 'mint' },
  { kind: 'deny', jp: '否認', en: 'DENY', tone: 'red' },
  { kind: 'defer', jp: '保留', en: 'DEFER', tone: 'blue' },
];

/**
 * The gate decision surface as a modal: a full-screen red hazard field with
 * corner GATE markers, a boxed kanji verb over a punched-out action band, the
 * item under review, and an approve / deny / defer response rail. One focal job.
 * Focus lands on APPROVE; Escape/backdrop call `onClose`.
 */
export function GateDecisionDialog({ open, item, onDecide, onClose, jp = '裁定', en = 'DECIDE' }: GateDecisionDialogProps) {
  const approveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) approveRef.current?.focus();
  }, [open]);

  const stripes = { flex: 'none', height: 22, background: 'repeating-linear-gradient(-45deg, #000 0 14px, transparent 14px 28px)' };
  const cornerChip = (t: Theme) => ({
    position: 'absolute' as const,
    border: '3px solid #fff',
    color: '#fff',
    fontFamily: t.nerv.fonts.display,
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: '0.12em',
    p: '1px 14px',
    animation: `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite`,
  });

  return (
    <Modal open={open} onClose={onClose} aria-label="Gate decision required" closeAfterTransition={false}>
      <Box
        sx={(t) => ({
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          background: t.nerv.hue.redHi,
          outline: 'none',
        })}
      >
        <Box sx={stripes} />
        <Box component="span" sx={(t) => ({ ...cornerChip(t), top: 36, left: 26 })}>GATE</Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.4vh', px: 2 }}>
          <Box sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: '4.2vh', color: t.nerv.hue.void, border: `3px solid ${t.nerv.hue.void}`, p: '2px 24px', letterSpacing: '0.5em', textIndent: '0.5em' })}>
            {jp}
          </Box>
          <Box sx={(t) => ({ background: t.nerv.hue.void, width: '100%', textAlign: 'center', py: '1vh' })}>
            <Box sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: '11vw', lineHeight: 1, color: t.nerv.hue.redHi })}>{en}</Box>
          </Box>
          <Box sx={(t) => ({ fontSize: 13, color: t.nerv.hue.void, letterSpacing: '0.2em', fontWeight: 700, fontFamily: t.nerv.fonts.mono, textAlign: 'center' })}>
            ITEM: <Box component="b" sx={(t) => ({ background: t.nerv.hue.void, color: t.nerv.hue.redHi, p: '2px 10px' })}>{item ?? '—'}</Box>
          </Box>
        </Box>
        <Box component="span" sx={(t) => ({ ...cornerChip(t), bottom: 110, right: 26 })}>GATE</Box>
        <Box sx={(t) => ({ flex: 'none', display: 'flex', gap: 1.25, alignItems: 'stretch', background: t.nerv.hue.void, borderTop: `2px solid ${t.nerv.hue.orange}`, p: '12px 16px' })}>
          <Box component="span" sx={(t) => ({ display: 'flex', alignItems: 'center', fontSize: 10, color: t.nerv.hue.amber, letterSpacing: '0.18em', fontFamily: t.nerv.fonts.mono })}>
            RESPONSE REQUIRED:
          </Box>
          {ACTIONS.map((a, i) => {
            const hue = { mint: 'mint', red: 'redHi', blue: 'blue' }[a.tone] as 'mint' | 'redHi' | 'blue';
            return (
              <Box
                key={a.kind}
                component="button"
                ref={i === 0 ? approveRef : undefined}
                onClick={() => onDecide(a.kind)}
                sx={(t) => ({
                  flex: 1,
                  border: `2px solid ${t.nerv.hue[hue]}`,
                  background: t.nerv.hue.void,
                  color: t.nerv.hue[hue],
                  fontFamily: t.nerv.fonts.display,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '0.12em',
                  p: '11px 4px',
                  cursor: 'pointer',
                  '&:hover': { background: t.nerv.hue[hue], color: t.nerv.hue.void },
                  '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 2 },
                })}
              >
                <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, mr: 1, letterSpacing: '0.2em' })}>{a.jp}</Box>
                {a.en}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Modal>
  );
}
