/**
 * StepFlow — a horizontal step sequence with chamfered nodes: completed steps
 * are solid mint, the current step is a blinking blue, upcoming steps are dim
 * outlines. For a *real* sequence only (an OODA loop, a pipeline) — order has to
 * carry meaning, per the design rules.
 */
import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';
import { SegmentBar } from './meters';

export interface StepFlowStep {
  /** Short glyph shown inside the node (e.g. `OBS`). */
  short: string;
  /** Full label under the node (e.g. `OBSERVE`). */
  label: string;
}

export interface StepFlowProps {
  steps: StepFlowStep[];
  /** Index of the current step: earlier steps read as done, this one as active. */
  active: number;
  sx?: SxProps<Theme>;
}

/**
 * @example
 * <StepFlow active={2} steps={[
 *   { short: 'OBS', label: 'OBSERVE' }, { short: 'UND', label: 'UNDERSTAND' },
 *   { short: 'DEC', label: 'DECIDE' }, { short: 'EXE', label: 'EXECUTE' },
 *   { short: 'LRN', label: 'LEARN' },
 * ]} />
 */
export function StepFlow({ steps, active, sx }: StepFlowProps) {
  return (
    <Box sx={[{ display: 'flex', alignItems: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {steps.map((s, i) => {
        const done = i < active;
        const now = i === active;
        return (
          <Box key={s.label} sx={{ display: 'contents' }}>
            {i > 0 && (
              <Box
                sx={(t) => ({
                  flex: 1,
                  height: 2,
                  minWidth: 14,
                  mb: '14px',
                  background: i <= active ? t.nerv.hue.mint : t.nerv.hue.greenDim,
                })}
              />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: 72 }}>
              <Box
                sx={(t) => ({
                  width: 26,
                  height: 26,
                  border: '2px solid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: t.nerv.fonts.mono,
                  fontSize: 10,
                  clipPath: t.nerv.chamfer(7),
                  ...(done
                    ? { background: t.nerv.hue.mint, borderColor: t.nerv.hue.mint, color: t.nerv.hue.void }
                    : now
                      ? { background: t.nerv.hue.blue, borderColor: t.nerv.hue.blue, color: t.nerv.hue.void, animation: `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` }
                      : { background: 'transparent', borderColor: t.nerv.hue.greenDim, color: t.nerv.hue.greenMap }),
                })}
              >
                {s.short}
              </Box>
              <Box
                sx={(t) => ({
                  fontSize: 8,
                  letterSpacing: '0.1em',
                  fontFamily: t.nerv.fonts.mono,
                  color: done ? t.nerv.hue.mint : now ? t.nerv.hue.blue : t.nerv.hue.greenMap,
                })}
              >
                {s.label}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* AgenticLoop — the OODA loop as a ring of kanji nodes, one lit at a time. */

export interface AgenticLoopStep {
  /** Kanji node label (e.g. `観測`). */
  jp: string;
  /** English caption (e.g. `OBSERVE`). */
  en: string;
}

export interface AgenticLoopProps {
  steps: AgenticLoopStep[];
  /** Small caption in the border notch (e.g. `ACTIVE_LOOP : AUTONOMOUS_LEARN`). */
  caption?: ReactNode;
  /** Controlled lit index. Omit to self-cycle. */
  active?: number;
  /** Self-cycle interval (ms). @default 900 */
  cycleMs?: number;
  sx?: SxProps<Theme>;
}

/**
 * The agentic loop as a bordered ring of bilingual nodes with `→` connectors and
 * a caption notch, one node lit (mint glow) at a time. Uncontrolled, it cycles
 * mechanically; under reduced motion it holds the first node. For a *progress*
 * stepper (done-up-to-active) use {@link StepFlow} instead.
 */
export function AgenticLoop({ steps, caption, active, cycleMs = 900, sx }: AgenticLoopProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [internal, setInternal] = useState(0);
  const lit = active ?? internal;

  useEffect(() => {
    if (active !== undefined || reduced) return;
    const id = setInterval(() => setInternal((s) => (s + 1) % steps.length), cycleMs);
    return () => clearInterval(id);
  }, [active, reduced, cycleMs, steps.length]);

  return (
    <Box sx={[(th) => ({ border: `1px solid ${th.nerv.hue.greenDim}`, p: '26px 20px 20px', position: 'relative' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      {caption && <Box component="span" sx={(th) => ({ position: 'absolute', top: -9, left: 16, background: th.nerv.hue.void, px: 1, fontSize: 10, color: th.nerv.hue.orange, letterSpacing: '0.14em', fontFamily: th.nerv.fonts.mono })}>{caption}</Box>}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
        {steps.map((n, i) => {
          const on = lit === i;
          return (
            <Box key={n.en} sx={{ display: 'contents' }}>
              {i > 0 && <Box component="span" sx={{ color: t.nerv.hue.orange, fontSize: 14, flex: '0 0 auto' }}>→</Box>}
              <Box
                sx={(th) => ({
                  flex: 1,
                  textAlign: 'center',
                  border: `1px solid ${on ? th.nerv.hue.mint : th.nerv.hue.greenDim}`,
                  boxShadow: on ? '0 0 14px rgba(82,242,154,.4)' : 'none',
                  p: '14px 6px',
                  background: th.nerv.hue.void,
                  transition: `border-color ${th.nerv.motion.durations.fast}ms linear, box-shadow ${th.nerv.motion.durations.fast}ms linear`,
                })}
              >
                <Box sx={(th) => ({ fontFamily: th.nerv.fonts.jp, fontWeight: 800, fontSize: 22, lineHeight: 1, textTransform: 'none', color: on ? th.nerv.hue.mintHi : th.nerv.hue.greenMap, textShadow: on ? '0 0 10px rgba(82,242,154,.5)' : 'none' })}>{n.jp}</Box>
                <Box sx={(th) => ({ fontSize: 9, letterSpacing: '0.08em', mt: '6px', color: th.nerv.hue.mint, opacity: on ? 1 : 0.6, fontFamily: th.nerv.fonts.mono })}>{n.en}</Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* TaskCard — a loop-synchronizer task: id · title · action, a StepFlow, progress. */

export interface TaskCardProps {
  /** Task id (e.g. `TASK·882`). */
  id: ReactNode;
  /** Task title. */
  title: ReactNode;
  /** Right-aligned action (button / gate stamp). */
  action?: ReactNode;
  /** Current step index for the embedded {@link StepFlow}. */
  active: number;
  /** Progress percentage (0..100). */
  pct: number;
  /** The step sequence. @default the OODA loop */
  steps?: StepFlowStep[];
  sx?: SxProps<Theme>;
}

const OODA: StepFlowStep[] = [
  { short: 'OBS', label: 'OBSERVE' }, { short: 'UND', label: 'UNDERSTAND' },
  { short: 'DEC', label: 'DECIDE' }, { short: 'EXE', label: 'EXECUTE' }, { short: 'LRN', label: 'LEARN' },
];

/**
 * A loop-synchronizer task row: an id · title · action header, an OODA
 * {@link StepFlow}, and a labeled progress bar. The composed task card used on
 * the agent-console dashboard.
 */
export function TaskCard({ id, title, action, active, pct, steps = OODA, sx }: TaskCardProps) {
  const t = useTheme();
  return (
    <Box sx={[(th) => ({ border: `1px solid ${th.nerv.hue.greenDim}`, p: '10px 14px' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
        <Box component="span" sx={(th) => ({ color: th.nerv.hue.amber, fontSize: 11, whiteSpace: 'nowrap', fontFamily: th.nerv.fonts.mono })}>{id}</Box>
        <Box component="span" sx={(th) => ({ color: th.nerv.hue.paper, fontSize: 13, fontFamily: th.nerv.fonts.mono })}>{title}</Box>
        {action && <Box sx={{ ml: 'auto' }}>{action}</Box>}
      </Box>
      <StepFlow sx={{ mt: 1.5 }} active={active} steps={steps} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 1.25, fontSize: 10, color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>
        <span>PROGRESS</span>
        <SegmentBar value={pct} />
        <Box component="b" sx={{ color: t.nerv.hue.mint, fontWeight: 400 }}>{pct}%</Box>
      </Box>
    </Box>
  );
}
