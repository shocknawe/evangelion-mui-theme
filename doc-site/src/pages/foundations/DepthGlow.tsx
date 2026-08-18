/**
 * FOUNDATIONS — Depth & glow.
 *
 * There is no elevation in this system. `theme.shadows` replaces the entire
 * drop-shadow vocabulary with glow, and every "raised" surface is really just
 * three flat materials: border, glow, hue. The glow strings live on
 * `theme.palette.nerv.*` (reachable via `theme.vars.palette.nerv.*` — see
 * `theme/palette.ts` / `theme/shadows.ts`), so every swatch below reads them
 * live rather than hardcoding a boxShadow string.
 */
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

export default function DepthGlow() {
  const t = useTheme();
  const nervPalette = (t.vars ?? t).palette.nerv;

  return (
    <>
      <PageHeader
        eyebrow="FOUNDATIONS"
        title="DEPTH & GLOW"
        lede="There is no elevation. Depth is built from three flat materials only — border, glow, and hue — never a lifted card or a cast shadow."
      />

      <DocSection id="no-elevation" title="THERE IS NO ELEVATION" aside="theme.shadows">
        <Prose>
          MUI requires a 25-slot `theme.shadows` array. This theme's index 0 is `'none'`; every other index
          is replaced with an emitted orange <em>glow</em> string (see `theme/shadows.ts`) instead of a cast
          drop-shadow, so any stock component that reads `theme.shadows[n]` by number glows on-brand rather
          than lifting off the page. In practice, nothing in this system reaches past index 0 or the named{' '}
          <code>glowFx</code> tokens below — a panel is a stroked box with a faint inset halo, never a
          Material "card."
        </Prose>
        <DemoStage>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Box sx={(tt) => ({ width: 108, height: 68, border: `1px solid ${tt.nerv.hue.greenDim}` })} />
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}>
              BORDER · 1PX IDLE
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Box
              sx={(tt) => ({
                width: 108,
                height: 68,
                border: `2px solid ${tt.nerv.hue.orange}`,
                boxShadow: nervPalette.glowPanelStrong,
              })}
            />
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.orange, fontFamily: tt.nerv.fonts.mono })}>
              GLOW · CHROME FRAME
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
            <Box
              sx={(tt) => ({
                width: 108,
                height: 68,
                border: `2px solid ${tt.nerv.hue.mint}`,
                boxShadow: nervPalette.glowMint,
              })}
            />
            <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.mint, fontFamily: tt.nerv.fonts.mono })}>
              HUE · MINT EMPHASIS
            </Box>
          </Box>
        </DemoStage>
      </DocSection>

      <DocSection id="glow-tokens" title="THE GLOW TOKENS" aside="theme.palette.nerv.*">
        <Prose>
          `glowFx` in `theme/tokens.ts` defines four halos — `panel`, `panelStrong`, `focus`, `mint` — luminance
          only, never a cast shadow. They ship on `theme.palette.nerv.glowPanel` / `glowPanelStrong` /{' '}
          `glowFocus` / `glowMint` (emitted as `--mui-palette-nerv-*` CSS vars since `cssVariables` is on), and
          every demo on this page reads its `boxShadow` from there.
        </Prose>
        <DemoStage>
          {(
            [
              ['panel', nervPalette.glowPanel],
              ['panelStrong', nervPalette.glowPanelStrong],
              ['focus', nervPalette.glowFocus],
              ['mint', nervPalette.glowMint],
            ] as const
          ).map(([name, glow]) => (
            <Box key={name} sx={{ display: 'grid', gap: 0.75, justifyItems: 'center' }}>
              <Box sx={(tt) => ({ width: 88, height: 56, border: `1px solid ${tt.nerv.hue.orange}`, boxShadow: glow })} />
              <Box component="code" sx={(tt) => ({ fontSize: 9, color: tt.nerv.hue.greenMap, fontFamily: tt.nerv.fonts.mono })}>
                glow{name.charAt(0).toUpperCase()}{name.slice(1)}
              </Box>
            </Box>
          ))}
        </DemoStage>
        <CodeBlock
          noCopy
          filename="usage"
          code={`sx={(t) => ({\n  boxShadow: (t.vars ?? t).palette.nerv.glowPanel,\n})}`}
        />
      </DocSection>

      <DocSection id="crt" title="THE CRT PASS" aside="theme.palette.nerv.crt">
        <Prose>
          Every dark screen carries a fixed scanline + vignette overlay on `body::before`, installed once by{' '}
          `CssBaseline` from `palette.nerv.crt` — you're looking at it right now on this very page. It is a
          composited overlay, not a per-component effect, so it never needs re-adding.
        </Prose>
        <CodeBlock noCopy filename="theme/tokens.ts" code={nervPalette.crt} />
      </DocSection>

      <DocSection id="bans" title="BANS">
        <Guidance
          tone="red"
          items={[
            'A drop shadow anywhere — depth reads as border + glow + hue, never a cast shadow.',
            'A lighter-gray "raised" surface — every panel is theme.nerv.hue.void; depth never lifts the tone.',
            'Glassmorphism or backdrop-filter — the console has no translucent glass layer.',
            'A colored border-left/border-right accent stripe over 1px — use a full border, a tint, or a Stamp.',
          ]}
        />
      </DocSection>
    </>
  );
}
