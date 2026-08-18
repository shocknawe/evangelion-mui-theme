/**
 * FOUNDATIONS — Typography.
 *
 * Three faces (display / mono / jp), a bimodal scale (tiny cluster + the one
 * hero clamp), every MUI + custom variant as a live specimen, and the
 * bilingual-pairing rule demoed through `BilingualLabel` / `Monogram`.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { BilingualLabel, Monogram } from '@components';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';

/** Every rendered MUI + custom variant, in the theme's declared order. */
const VARIANTS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'subtitle1', 'subtitle2',
  'body1', 'body2',
  'button', 'caption', 'overline',
  'jp', 'terminal', 'stamp', 'data',
] as const;

type SpecimenVariant = (typeof VARIANTS)[number];

const SAMPLE: Record<SpecimenVariant, string> = {
  h1: 'PHOSPHOR CONSOLE',
  h2: 'MAGI SYSTEM',
  h3: 'DECISION GATE',
  h4: 'ROUTINE MONITOR',
  h5: 'ZONE STATUS',
  h6: 'SECTION LABEL',
  subtitle1: 'CODE:0771 · GATE_INTAKE',
  subtitle2: 'FILE:0847-B',
  body1: 'Operators read status in a single glance across the deck.',
  body2: 'Dense telemetry rows favor this size over body1.',
  button: 'EXECUTE',
  caption: 'FIELD LABEL',
  overline: 'SECTION OVERLINE',
  jp: '警戒 起動 承認',
  terminal: 'STDOUT :: PROC 0847 NOMINAL',
  stamp: 'SYS:NOMINAL',
  data: '098.421',
};

/** Convert a theme font-size (rem / px / the one clamp()) to a px number for the bar chart. */
function toPx(size: string | number | undefined): number {
  if (typeof size === 'number') return size;
  if (!size) return 0;
  if (size.endsWith('rem')) return parseFloat(size) * 16;
  if (size.endsWith('px')) return parseFloat(size);
  if (size.startsWith('clamp(')) {
    const bounds = size.slice(6, -1).split(',').map((s) => s.trim());
    return toPx(bounds[bounds.length - 1]);
  }
  return 0;
}

function FaceSpecimen({ label, family, children }: { label: string; family: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: 0.75 }}>
      <Box>{children}</Box>
      <Box
        component="code"
        sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 10, color: t.nerv.hue.greenMap, letterSpacing: '0.03em' })}
      >
        {label} · {family}
      </Box>
    </Box>
  );
}

export default function TypographyPage() {
  const t = useTheme();

  const scale = VARIANTS.map((v) => ({ v, px: toPx(t.typography[v].fontSize) })).sort((a, b) => a.px - b.px);
  const maxPx = Math.max(...scale.map((s) => s.px));

  return (
    <>
      <PageHeader
        eyebrow="FOUNDATIONS"
        title="TYPOGRAPHY"
        lede="Three faces on real contrast axes — condensed display caps, monospace data, and a Mincho kanji graphic — set on a bimodal scale that clusters tiny and jumps large, never generic mid-size."
      />

      <DocSection id="faces" title="THE THREE FACES" aside="theme.nerv.fonts">
        <Prose>
          Every heading, button, and numeral in the system draws from one of three stacks — never a fourth
          typeface, never a system default slipping through unstyled.
        </Prose>
        <DemoStage column>
          <FaceSpecimen label="display" family={t.nerv.fonts.display}>
            <Box
              component="span"
              sx={(tt) => ({
                fontFamily: tt.nerv.fonts.display,
                fontWeight: 700,
                fontSize: 34,
                color: tt.nerv.hue.paper,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              })}
            >
              TACTICAL DISPLAY 0847
            </Box>
          </FaceSpecimen>
          <FaceSpecimen label="mono" family={t.nerv.fonts.mono}>
            <Box component="span" sx={(tt) => ({ fontFamily: tt.nerv.fonts.mono, fontSize: 15, color: tt.nerv.hue.mint })}>
              CODE:0771 · FILE:GATE_INTAKE · OK
            </Box>
          </FaceSpecimen>
          <FaceSpecimen label="jp" family={t.nerv.fonts.jp}>
            <Box
              component="span"
              sx={(tt) => ({ fontFamily: tt.nerv.fonts.jp, fontWeight: 800, fontSize: 30, color: tt.nerv.hue.orange, letterSpacing: '0.1em' })}
            >
              警戒 起動 承認
            </Box>
          </FaceSpecimen>
        </DemoStage>
      </DocSection>

      <DocSection id="scale" title="THE BIMODAL SCALE" aside={`${VARIANTS.length} VARIANTS`}>
        <Prose>
          Sizes cluster at the tiny end — 10–14px for labels, data, and UI chrome — then step up through the
          condensed heading ladder to the one sanctioned <code>clamp()</code> hero. Nothing sits in a
          generic 18–20px "body copy" middle for long; mid-sizes read as templated defaults, so this system
          avoids them.
        </Prose>
        <Box sx={{ display: 'grid', gap: 0.5, mt: 2 }}>
          {scale.map(({ v, px }) => (
            <Box key={v} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                component="code"
                sx={(tt) => ({ width: 78, flex: 'none', fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}
              >
                {v}
              </Box>
              <Box
                sx={(tt) => ({
                  height: 10,
                  width: `${Math.max(4, (px / maxPx) * 100)}%`,
                  background: tt.nerv.hue.mint,
                })}
              />
              <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.amber, fontFamily: tt.nerv.fonts.mono })}>
                {Math.round(px)}px
              </Box>
            </Box>
          ))}
        </Box>
      </DocSection>

      <DocSection id="specimens" title="TYPE SPECIMENS">
        <Prose>Every MUI variant plus the four custom ones (`jp`, `terminal`, `stamp`, `data`), rendered live.</Prose>
        <Box>
          {VARIANTS.map((v) => (
            <Box
              key={v}
              sx={(tt) => ({
                display: 'flex',
                alignItems: 'baseline',
                gap: 2,
                py: 1.25,
                borderBottom: `1px dotted ${tt.nerv.hue.greenDim}`,
              })}
            >
              <Box
                sx={(tt) => ({
                  width: 130,
                  flex: 'none',
                  fontFamily: tt.nerv.fonts.mono,
                  fontSize: 9,
                  letterSpacing: '0.06em',
                  color: tt.nerv.hue.greenMap,
                })}
              >
                <Box component="code" sx={(tt2) => ({ color: tt2.nerv.hue.mint, display: 'block' })}>
                  {v}
                </Box>
                {String(t.typography[v].fontSize)}
              </Box>
              <Typography variant={v} sx={{ minWidth: 0, overflowWrap: 'break-word' }}>
                {SAMPLE[v]}
              </Typography>
            </Box>
          ))}
        </Box>
      </DocSection>

      <DocSection id="bilingual" title="BILINGUAL PAIRING">
        <Prose>
          A large kanji graphic never stands alone — it always carries a small Latin caption. `BilingualLabel`
          and `Monogram` bake this pairing in so it can't be dropped by accident.
        </Prose>
        <DemoStage>
          <BilingualLabel jp="内部" en="INTERNAL" tone="mint" size={48} />
          <Monogram jp="統制" label="COMMAND" tone="orange" />
        </DemoStage>
      </DocSection>

      <DocSection id="bans" title="BANS">
        <Guidance
          tone="red"
          items={[
            'Lowercase UI chrome — labels, buttons, and stamps are ALL CAPS, always.',
            'The Mincho JP face on labels, buttons, or data — jp is a graphic term only, never body/UI text.',
            'background-clip: text gradient text — emphasize with weight, size, or glow, never a gradient fill.',
          ]}
        />
      </DocSection>
    </>
  );
}
