/**
 * FOUNDATIONS — Motion.
 *
 * Mechanical only: linear or `steps()`, never eased/spring/bounce. Every
 * animated demo here gates on `useReducedMotion()` and settles to its final
 * frame, the same contract every library component honors internally.
 */
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { Stamp, useReducedMotion } from '@components';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

/** A 4-segment stepper driven by setInterval + hard cuts (steps(), not opacity fade). */
function SteppedSegments() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) {
      setActive(3); // settle lit — the reduced-motion contract
      return;
    }
    const id = setInterval(() => setActive((a) => (a + 1) % 4), 420);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={(t) => ({
            width: 26,
            height: 26,
            border: `1px solid ${t.nerv.hue.greenDim}`,
            background: i <= active ? t.nerv.hue.mint : 'transparent',
            transition: `background-color ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.step}`,
          })}
        />
      ))}
    </Box>
  );
}

export default function MotionPage() {
  const t = useTheme();
  const reduced = useReducedMotion();

  return (
    <>
      <PageHeader
        eyebrow="FOUNDATIONS"
        title="MOTION"
        lede="Mechanical only — linear or steps(), never an easing curve, a spring, or a bounce. Every animation ships a prefers-reduced-motion path that settles on the final, already-arrived-at state."
      />

      <DocSection id="tokens" title="THE MOTION TOKENS" aside="theme.nerv.motion">
        <Prose>
          Two timing functions — `linear` and the hard-cut `steps()` family — and three durations. `snap`
          ({t.nerv.motion.durations.snap}ms) is a state flip, `fast` ({t.nerv.motion.durations.fast}ms) is
          hover/focus, `blink` ({t.nerv.motion.durations.blink}ms) is the 1Hz in-progress loop.
        </Prose>
        <CodeBlock
          noCopy
          filename="theme/tokens.ts"
          code={`motion.linear = "${t.nerv.motion.linear}"\nmotion.step   = "${t.nerv.motion.step}"\nmotion.snap   = "${t.nerv.motion.snap}"\n\ndurations.snap  = ${t.nerv.motion.durations.snap}ms\ndurations.fast  = ${t.nerv.motion.durations.fast}ms\ndurations.blink = ${t.nerv.motion.durations.blink}ms`}
        />
      </DocSection>

      <DocSection id="demos" title="LIVE DEMOS">
        <Prose>
          A blinking `Stamp` (hard on/off via `motion.snap`), a stepped 4-segment fill (`motion.step`), and
          the stock `Button` hover/focus snap (linear at `durations.fast`).
        </Prose>
        <DemoStage>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Stamp tone="red" blink glow>
              ALERT
            </Stamp>
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}>
              blink · motion.snap
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <SteppedSegments />
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}>
              stepped fill · motion.step
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Button variant="alt">HOVER / FOCUS ME</Button>
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}>
              linear · durations.fast
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Button variant="stamp" className="nerv-live">
              LIVE
            </Button>
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}>
              className="nerv-live" · nervBtnBlink
            </Box>
          </Box>
        </DemoStage>
      </DocSection>

      <DocSection id="keyframes" title="THE GLOBAL KEYFRAMES" aside="CssBaseline">
        <Prose>
          `CssBaseline` installs two keyframes once at the document root: `nervBlink` (hard on/off, 1Hz — the
          in-progress signal `Stamp blink` and every status dot uses) and `nervBtnBlink` (inverts a button
          between filled and outlined — the "live selected action," reached via `.Mui-selected` on a{' '}
          `stamp`-variant `Button`, or `className="nerv-live"` on any button). Both are hard cuts, timed with
          `motion.snap`, never a fade.
        </Prose>
      </DocSection>

      <DocSection id="reduced-motion" title="THE REDUCED-MOTION CONTRACT" aside="useReducedMotion()">
        <Prose>
          Every animated Phosphor Console component reads `useReducedMotion()` (from `@components`) and
          settles on its final frame — no ticking, no strobing — when the OS preference is set. `CssBaseline`
          backstops this globally too, collapsing every transition/animation duration under{' '}
          `prefers-reduced-motion: reduce`. Flip the OS setting to see the live value below flip, and the
          stepped-segment demo above settle fully lit instead of cycling.
        </Prose>
        <DemoStage>
          <Stamp tone={reduced ? 'amber' : 'mint'} glow filled={reduced}>
            useReducedMotion() = {String(reduced)}
          </Stamp>
        </DemoStage>
      </DocSection>

      <DocSection id="bans" title="BANS">
        <Guidance
          tone="red"
          items={[
            'An easing curve (ease-in-out, cubic-bezier) on any transition — linear or steps() only.',
            'A spring or bounce — this is a CRT console, not a physics toy.',
            'An opacity fade standing in for a state change — cut hard with steps(1, jump-none) instead.',
          ]}
        />
      </DocSection>
    </>
  );
}
