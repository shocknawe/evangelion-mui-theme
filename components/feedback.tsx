/**
 * Feedback pieces beyond MUI's Alert/Dialog (which the theme styles directly):
 * the tri-channel hazard decision prompt.
 */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { type ClassesOf, type RootHTMLAttributes, type WithRef, resolveClasses } from './util';

/* ------------------------------------------------------------------ */
/* HazardPrompt — a full-bleed Y/N decision surface. */

export interface HazardPromptProps extends RootHTMLAttributes, WithRef {
  /** Large kanji verb (e.g. `裁定`). */
  jp: string;
  /** English action shown in the punched-out band (e.g. `DECIDE`). */
  en: string;
  /** Fired on click / Enter / Space. */
  onDecide?: () => void;
  /** Height of the surface (px). @default 150 */
  height?: number;
  /** Class overrides by part: `root` (the hazard surface). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * The tri-channel hazard prompt: a solid red decision surface, hazard-striped top
 * and bottom, with a boxed kanji verb over a punched-out English action band. It
 * flashes (color-inverts) for one frame on activation. Keep it to one job.
 *
 * @example <HazardPrompt jp="裁定" en="DECIDE" onDecide={route} />
 */
export function HazardPrompt({ jp, en, onDecide, height = 150, classes, className, sx, ...rest }: HazardPromptProps) {
  const t = useTheme();
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const trigger = () => {
    setFlash(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), t.nerv.motion.durations.fast);
    onDecide?.();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trigger();
    }
  };

  const stripe = (th: Theme) => ({ position: 'absolute' as const, left: 0, right: 0, height: 14, background: `repeating-linear-gradient(-45deg, ${th.nerv.hue.black} 0 10px, transparent 10px 20px)` });

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={en.toLowerCase()}
      onClick={trigger}
      onKeyDown={onKey}
      {...rest}
      className={resolveClasses('HazardPrompt', 'root', classes, className)}
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
      <Box sx={(th) => ({ ...stripe(th), top: 0 })} />
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
      <Box sx={(th) => ({ ...stripe(th), bottom: 0 })} />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* GateDecisionDialog — a full-screen approve / deny / defer decision. */

export type GateDecision = 'approve' | 'deny' | 'defer';

/** Root is the full-screen surface inside the `Modal` (the component takes no
 *  `sx` — see the 2.1 inventory finding). */
export interface GateDecisionDialogProps extends RootHTMLAttributes, WithRef {
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
  /** Class overrides by part: `root` (the full-screen surface), `rail` (the response bar), `marker` (a corner GATE chip). */
  classes?: ClassesOf<'root' | 'rail' | 'marker'>;
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
export function GateDecisionDialog({ open, item, onDecide, onClose, jp = '裁定', en = 'DECIDE', classes, className, ...rest }: GateDecisionDialogProps) {
  const approveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) approveRef.current?.focus();
  }, [open]);

  const stripes = (th: Theme) => ({ flex: 'none' as const, height: 22, background: `repeating-linear-gradient(-45deg, ${th.nerv.hue.black} 0 14px, transparent 14px 28px)` });
  const cornerChip = (t: Theme) => ({
    position: 'absolute' as const,
    border: `3px solid ${t.nerv.hue.white}`,
    color: t.nerv.hue.white,
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
        {...rest}
        className={resolveClasses('GateDecisionDialog', 'root', classes, className)}
        sx={(t) => ({
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          background: t.nerv.hue.redHi,
          outline: 'none',
        })}
      >
        <Box sx={(th) => stripes(th)} />
        <Box component="span" className={resolveClasses('GateDecisionDialog', 'marker', classes)} sx={(t) => ({ ...cornerChip(t), top: 36, left: 26 })}>GATE</Box>
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
        <Box component="span" className={resolveClasses('GateDecisionDialog', 'marker', classes)} sx={(t) => ({ ...cornerChip(t), bottom: 110, right: 26 })}>GATE</Box>
        <Box className={resolveClasses('GateDecisionDialog', 'rail', classes)} sx={(t) => ({ flex: 'none', display: 'flex', gap: 1.25, alignItems: 'stretch', background: t.nerv.hue.void, borderTop: `2px solid ${t.nerv.hue.orange}`, p: '12px 16px' })}>
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

/* ------------------------------------------------------------------ */
/* YesNoGate — a large marketing Y/N decision with a response line. */

export interface YesNoGateProps extends RootHTMLAttributes, WithRef {
  /** Yes button text. @default 'YES' */
  yesLabel?: string;
  /** No button text. @default 'NO' */
  noLabel?: string;
  /** Response shown after choosing YES. */
  yesResponse?: React.ReactNode;
  /** Response shown after choosing NO. */
  noResponse?: React.ReactNode;
  /** Fired with the chosen answer. */
  onDecide?: (answer: 'yes' | 'no') => void;
  /** Class overrides by part: `root` (the gate). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A big Y/N call-to-action gate: a mint YES beside a red NO (each fills on hover
 * or once chosen), with an aria-live response line beneath. Self-contained — pass
 * the two response messages; it tracks the selection.
 *
 * @example
 * <YesNoGate yesResponse="◉ ACCEPTED" noResponse="✕ DEFERRED" onDecide={track} />
 */
export function YesNoGate({ yesLabel = 'YES', noLabel = 'NO', yesResponse, noResponse, onDecide, classes, className, sx, ...rest }: YesNoGateProps) {
  const [sel, setSel] = useState<'yes' | 'no' | null>(null);
  const choose = (a: 'yes' | 'no') => { setSel(a); onDecide?.(a); };

  const btn = (kind: 'yes' | 'no') => (t: Theme) => {
    const c = kind === 'yes' ? t.nerv.hue.mint : t.nerv.hue.redHi;
    const glow = kind === 'yes' ? 'rgba(82,242,154,.5)' : 'rgba(226,40,15,.5)';
    const on = sel === kind;
    return {
      fontFamily: t.nerv.fonts.display,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: '0.1em',
      p: '14px 46px',
      cursor: 'pointer',
      background: on ? c : 'transparent',
      color: on ? t.nerv.hue.void : c,
      border: `2px solid ${c}`,
      boxShadow: on ? `0 0 16px ${glow}` : 'none',
      '&:hover': { background: c, color: t.nerv.hue.void, boxShadow: `0 0 16px ${glow}` },
      '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 3 },
    };
  };

  return (
    <Box {...rest} className={resolveClasses('YesNoGate', 'root', classes, className)} sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box role="group" aria-label="decision" sx={{ display: 'flex', gap: 2 }}>
        <Box component="button" type="button" aria-pressed={sel === 'yes'} onClick={() => choose('yes')} sx={btn('yes')}>{yesLabel}</Box>
        <Box component="button" type="button" aria-pressed={sel === 'no'} onClick={() => choose('no')} sx={btn('no')}>{noLabel}</Box>
      </Box>
      <Box aria-live="polite" sx={(t) => ({ mt: 2.5, fontSize: 12, letterSpacing: '0.1em', minHeight: 18, color: sel === 'no' ? t.nerv.hue.redHi : t.nerv.hue.amber, fontFamily: t.nerv.fonts.mono })}>
        {sel === 'yes' && yesResponse}
        {sel === 'no' && noResponse}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ApprovalBar — an inline human-in-the-loop gate (approve / deny). */

export interface ApprovalBarProps extends RootHTMLAttributes, WithRef {
  /** Small caption. @default 'PENDING APPROVAL ·' */
  label?: string;
  /** What awaits approval. */
  item: React.ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  /** Approve button text. @default 'APPROVE · 承認' */
  approveLabel?: string;
  /** Deny button text. @default 'DENY · 否認' */
  denyLabel?: string;
  /** Once decided, replaces the buttons with a verdict (buttons disable). */
  verdict?: { ok: boolean; text: React.ReactNode } | null;
  /** Class overrides by part: `root` (the bar). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * The human gate: a bar naming what's pending, with approve / deny actions
 * (approve blinks like a primary action). Once decided, the actions disable and
 * a mint/red verdict takes their place. Pairs under {@link LogConsole}.
 */
export function ApprovalBar({ label = 'PENDING APPROVAL ·', item, onApprove, onDeny, approveLabel = 'APPROVE · 承認', denyLabel = 'DENY · 否認', verdict, classes, className, sx, ...rest }: ApprovalBarProps) {
  const decided = !!verdict;
  const btn = (t: Theme, hue: string, blink = false) => ({
    border: `1px solid ${hue}`,
    background: t.nerv.hue.void,
    color: hue,
    p: '8px 16px',
    fontSize: 11,
    cursor: decided ? 'default' : 'pointer',
    fontFamily: t.nerv.fonts.mono,
    opacity: decided ? 0.35 : 1,
    animation: blink && !decided ? `nervBtnBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` : 'none',
    '&:hover': decided ? null : { background: hue, color: t.nerv.hue.void },
    '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2 },
    '&:disabled': { opacity: 0.35, cursor: 'default', animation: 'none' },
  });
  return (
    <Box
      {...rest}
      className={resolveClasses('ApprovalBar', 'root', classes, className)}
      sx={[
        (t) => ({ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', border: `1px solid ${t.nerv.hue.amberDim}`, borderTop: 'none', p: '10px 12px' }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={(t) => ({ fontSize: 9, letterSpacing: '0.16em', color: t.nerv.hue.amber, fontFamily: t.nerv.fonts.mono })}>{label}</Box>
      <Box component="span" sx={(t) => ({ fontSize: 12, color: t.nerv.hue.paper, fontFamily: t.nerv.fonts.mono })}>{item}</Box>
      <Box sx={{ flex: 1 }} />
      {verdict ? (
        <Box component="span" sx={(t) => ({ fontSize: 11, color: verdict.ok ? t.nerv.hue.mint : t.nerv.hue.redHi, fontFamily: t.nerv.fonts.mono })}>{verdict.text}</Box>
      ) : (
        <>
          <Box component="button" disabled={decided} onClick={onApprove} sx={(t) => btn(t, t.nerv.hue.mint, true)}>{approveLabel}</Box>
          <Box component="button" disabled={decided} onClick={onDeny} sx={(t) => btn(t, t.nerv.hue.redHi)}>{denyLabel}</Box>
        </>
      )}
    </Box>
  );
}
