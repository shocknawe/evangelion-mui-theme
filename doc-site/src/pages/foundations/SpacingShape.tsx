/**
 * FOUNDATIONS — Spacing & shape.
 *
 * The 4/8/16/24/32 spacing rhythm, the radius vocabulary (0 by default), the
 * chamfer helper (a clip-path, never border-radius), and the hazard stripe.
 */
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

type SpaceKey = keyof Theme['nerv']['space'];
type RadiusKey = keyof Theme['nerv']['radius'];

const RADIUS_NOTE: Record<RadiusKey, string> = {
  none: 'DEFAULT — EVERYTHING IS HARD-CORNERED',
  chip: 'STAMPS · CHIPS · BADGES',
  seg: 'METER / GAUGE SEGMENTS, SMALL TILES',
  chamfer: 'HERO-PANEL CORNER CUT — VIA CLIP-PATH, NOT THIS PROPERTY',
};

export default function SpacingShape() {
  const t = useTheme();
  const spaceKeys = Object.keys(t.nerv.space) as SpaceKey[];
  const radiusKeys = Object.keys(t.nerv.radius) as RadiusKey[];
  const maxSpace = Math.max(...spaceKeys.map((k) => t.nerv.space[k]));

  return (
    <>
      <PageHeader
        eyebrow="FOUNDATIONS"
        title="SPACING & SHAPE"
        lede="A 4/8/16/24/32 rhythm and a hard-cornered shape vocabulary — radius is 0 by default, small tokens get 2–4px, and hero panels chamfer through clip-path rather than rounding."
      />

      <DocSection id="space" title="THE SPACE SCALE" aside="theme.nerv.space">
        <Prose>
          `theme.spacing()`'s base unit (8px) lines up with the `sm` step, so `theme.spacing(n)` and the named
          scale stay in lockstep: <code>spacing(0.5)=4=xs</code>, <code>spacing(1)=8=sm</code>,{' '}
          <code>spacing(2)=16=md</code>, <code>spacing(3)=24=lg</code>, <code>spacing(4)=32=xl</code>.
        </Prose>
        <Box sx={{ display: 'grid', gap: 1, mt: 2 }}>
          {spaceKeys.map((key) => {
            const px = t.nerv.space[key];
            return (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="code"
                  sx={(tt) => ({ width: 96, flex: 'none', fontSize: 10, color: tt.nerv.hue.mint, fontFamily: tt.nerv.fonts.mono })}
                >
                  nerv.space.{key}
                </Box>
                <Box sx={(tt) => ({ height: 14, width: `${(px / maxSpace) * 220}px`, background: tt.nerv.hue.orange })} />
                <Box component="code" sx={(tt) => ({ fontSize: 10, color: tt.nerv.hue.amber, fontFamily: tt.nerv.fonts.mono })}>
                  {px}px
                </Box>
              </Box>
            );
          })}
        </Box>
      </DocSection>

      <DocSection id="radius" title="RADIUS" aside="theme.nerv.radius">
        <Prose>
          Radius is 0 everywhere by default (<code>theme.shape.borderRadius</code>) — the system reads as
          hard-cornered and mechanical. Chips and meter segments get a 2–4px softening; hero panels never get
          a large border-radius at all — they chamfer a corner via <code>clip-path</code> instead.
        </Prose>
        <DemoStage>
          {radiusKeys.map((key) => (
            <Box key={key} sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
              <Box
                sx={(tt) => ({
                  width: 84,
                  height: 60,
                  border: `1px solid ${tt.nerv.hue.mint}`,
                  borderRadius: `${tt.nerv.radius[key]}px`,
                })}
              />
              <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.mint, fontFamily: tt.nerv.fonts.mono })}>
                {key} · {t.nerv.radius[key]}px
              </Box>
              <Box
                component="span"
                sx={(tt) => ({ fontSize: 8, color: tt.nerv.hue.greenMap, textAlign: 'center', maxWidth: 100, letterSpacing: '0.03em' })}
              >
                {RADIUS_NOTE[key]}
              </Box>
            </Box>
          ))}
        </DemoStage>
      </DocSection>

      <DocSection id="chamfer" title="CHAMFER" aside="theme.nerv.chamfer()">
        <Prose>
          `theme.nerv.chamfer(cut)` returns a `clip-path: polygon(...)` string that cuts two opposing corners
          of a panel — the hero-frame silhouette. `Paper variant="chamfer"` and `variant="frame"` wrap it for
          you; a hand-rolled box can call the helper directly.
        </Prose>
        <DemoStage>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Paper variant="chamfer" sx={{ width: 120, height: 70, display: 'grid', placeItems: 'center' }}>
              <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.mint })}>
                variant="chamfer"
              </Box>
            </Paper>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Paper variant="frame" sx={{ width: 120, height: 70, display: 'grid', placeItems: 'center' }}>
              <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.orange })}>
                variant="frame"
              </Box>
            </Paper>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Box
              sx={(tt) => ({
                width: 120,
                height: 70,
                border: `2px solid ${tt.nerv.hue.blue}`,
                clipPath: tt.nerv.chamfer(18),
                display: 'grid',
                placeItems: 'center',
              })}
            >
              <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.blue })}>
                chamfer(18)
              </Box>
            </Box>
          </Box>
        </DemoStage>
        <CodeBlock noCopy filename="usage" code={`clipPath: theme.nerv.chamfer(20) // cut two opposing corners 20px`} />
      </DocSection>

      <DocSection id="hazard" title="HAZARD STRIPE" aside="theme.nerv.hazard()">
        <Prose>
          `theme.nerv.hazard(a, b)` returns a 45° repeating stripe background (crimson/black by default) —
          reserved for alarm chrome, never a general decoration.
        </Prose>
        <DemoStage>
          <Box sx={(tt) => ({ width: 220, height: 28, background: tt.nerv.hazard() })} />
        </DemoStage>
      </DocSection>

      <DocSection id="bans" title="BANS">
        <Guidance
          tone="red"
          items={[
            'A large border-radius on a hero panel — chamfer via clip-path (theme.nerv.chamfer), never round it.',
            'An off-scale gap value — reach for xs/sm/md/lg/xl (or theme.spacing) instead of an arbitrary px.',
            'The hazard stripe used as decoration — it signals alarm state only.',
          ]}
        />
      </DocSection>
    </>
  );
}
