/**
 * FOUNDATIONS — Color & state.
 *
 * The hue set is read live off `theme.nerv.hue` (never copy-pasted), the
 * semantic `Tone` vocabulary is demoed through `Stamp`, and the figure/ground
 * inversion ("filled means active") is shown idle-vs-active side by side.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { Stamp, type Tone } from '@components';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

type HueKey = keyof Theme['nerv']['hue'];

/** Meaning of every hue — the "color is state" table. Order mirrors tokens.ts. */
const MEANING: Record<HueKey, string> = {
  void: 'THE ONLY SURFACE · #0A0A0A EVERYWHERE',
  mint: 'NOMINAL · PRIMARY · SUCCESS',
  mintHi: 'HOVER · PEAK · GLOW-CORE',
  greenMap: 'SECONDARY DATA · DIM LABELS',
  greenDim: 'IDLE BORDERS · TRACKS · DISABLED',
  paper: 'MAX-BRIGHTNESS FILL',
  orange: 'CHROME ONLY — NEVER A DATA VALUE',
  amber: 'CAUTION · TERMINAL TEXT',
  amberDim: 'TERMINAL CHROME, NON-TEXT',
  red: 'CRITICAL · DANGER DATA',
  redHi: 'CRITICAL · ALERT SURFACES · STROBES',
  crimson: 'HAZARD STRIPES ONLY',
  teal: 'HEADER DOUBLE-RULES · HARDWARE BEZEL',
  blue: 'PENDING · DELIBERATING · IN-REVIEW',
};

const TONES: Tone[] = ['mint', 'green', 'amber', 'blue', 'red', 'orange', 'paper', 'dim', 'teal'];

export default function Color() {
  const t = useTheme();
  const hueKeys = Object.keys(t.nerv.hue) as HueKey[];

  return (
    <>
      <PageHeader
        eyebrow="FOUNDATIONS"
        title="COLOR & STATE"
        lede="Every hue on this page is read live off theme.nerv.hue — color is never chosen for taste, it announces a state, and the same hue means the same thing everywhere in the console."
      />

      <DocSection id="hues" title="THE HUE SET" aside={`${hueKeys.length} TOKENS`}>
        <Prose>
          Fourteen named hues, sampled off the reference GIFs and locked in `theme/tokens.ts`. Nothing in
          the theme or the component library hardcodes a hex — every color you see anywhere in this system
          traces back to one of these swatches.
        </Prose>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(152px, 1fr))',
            gap: 1.25,
            mt: 2,
          }}
        >
          {hueKeys.map((key) => {
            const hex = t.nerv.hue[key];
            return (
              <Box
                key={key}
                sx={(tt) => ({ border: `1px solid ${tt.nerv.hue.greenDim}`, background: tt.nerv.hue.void })}
              >
                <Box sx={{ height: 56, background: hex }} />
                <Box sx={(tt) => ({ p: '8px 9px', fontFamily: tt.nerv.fonts.mono })}>
                  <Box
                    component="code"
                    sx={(tt) => ({ display: 'block', fontSize: 11, letterSpacing: '0.03em', color: tt.nerv.hue.mint })}
                  >
                    nerv.hue.{key}
                  </Box>
                  <Box
                    component="span"
                    sx={(tt) => ({ display: 'block', fontSize: 10, color: tt.nerv.hue.amber, mt: '2px' })}
                  >
                    {hex}
                  </Box>
                  <Box
                    component="span"
                    sx={(tt) => ({
                      display: 'block',
                      fontSize: 9,
                      lineHeight: 1.5,
                      color: tt.nerv.hue.greenMap,
                      mt: '6px',
                      letterSpacing: '0.04em',
                    })}
                  >
                    {MEANING[key]}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DocSection>

      <DocSection id="tone" title="THE TONE VOCABULARY" aside={`${TONES.length} TONES`}>
        <Prose>
          Components never take a raw hex. They take a semantic <code>tone</code> — <code>mint green amber
          blue red orange paper dim teal</code> — and resolve it through <code>toneHue(theme, tone)</code>,
          which maps each tone to its canonical <code>theme.nerv.hue</code> value. That keeps a component
          colorway-parameterized: the same `Stamp` renders every state without moving a pixel.
        </Prose>
        <DemoStage>
          {TONES.map((tone) => (
            <Stamp key={tone} tone={tone}>
              {tone.toUpperCase()}
            </Stamp>
          ))}
        </DemoStage>
        <CodeBlock
          noCopy
          filename="usage"
          code={`import { Stamp, toneHue } from '@components';\n\n<Stamp tone="mint">SYS:NOMINAL</Stamp>\n\nconst c = toneHue(theme, "red"); // theme.nerv.hue.redHi`}
        />
      </DocSection>

      <DocSection id="filled" title="FILLED MEANS ACTIVE">
        <Prose>
          Idle is an outline on black. Active or selected inverts figure and ground: a solid hue fill with{' '}
          <strong style={{ color: t.nerv.hue.paper }}>black content punched out</strong> — and no glow on
          that content, because the fill itself carries the light.
        </Prose>
        <DemoStage>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Stamp tone="mint">IDLE</Stamp>
            <Typography sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, letterSpacing: '0.1em' })}>
              OUTLINE ON BLACK
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Stamp tone="mint" filled>
              ACTIVE
            </Stamp>
            <Typography sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, letterSpacing: '0.1em' })}>
              FILLED · {t.nerv.hue.void} CONTENT
            </Typography>
          </Box>
        </DemoStage>
      </DocSection>

      <DocSection id="contrast" title="CONTRAST">
        <Prose>
          The black-on-fill inversion is both the brand grammar and the higher-contrast choice — black beats
          white on mint, amber, red, and blue. For text-on-black, <code>greenMap</code> ({t.nerv.hue.greenMap}
          ) clears WCAG AA's 4.5:1 body-text threshold on {t.nerv.hue.void} and is the secondary-ink token
          (<code>theme.palette.text.secondary</code>). <code>greenDim</code> ({t.nerv.hue.greenDim}) sits
          below that bar deliberately — it is exempt because it is only ever used decoratively (idle borders,
          tracks) or for disabled ink, never for content a user must read.
        </Prose>
      </DocSection>

      <DocSection id="bans" title="BANS">
        <Guidance
          tone="red"
          items={[
            'Orange carrying a data value or status — orange is CHROME ONLY. If orange is saying something, it is wrong.',
            'Any surface color other than #0A0A0A (theme.nerv.hue.void) — no lighter "raised" panel, no tint.',
            'A glow on black-on-fill content — the fill carries the light; punched-out content stays crisp.',
            'Color alone carrying meaning without a label — every toned Stamp/state ships a legible caption too.',
          ]}
        />
      </DocSection>
    </>
  );
}
