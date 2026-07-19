/**
 * StepFlow — a horizontal step sequence with chamfered nodes: completed steps
 * are solid mint, the current step is a blinking blue, upcoming steps are dim
 * outlines. For a *real* sequence only (an OODA loop, a pipeline) — order has to
 * carry meaning, per the design rules.
 */
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

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
