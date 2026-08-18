/**
 * Getting started — install, mount, and the rules a consumer has to know before
 * building anything on the system.
 */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Stamp } from '@components';
import { DocSection, Guidance, PageHeader, Prose } from '../docs/chrome';
import { CodeBlock } from '../docs/CodeBlock';
import { pkgName, version } from '../siteData';

const INSTALL = `npm install ${pkgName}
npm install @mui/material @emotion/react @emotion/styled`;

const MOUNT = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '${pkgName}';

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <YourApp />
    </ThemeProvider>
  );
}`;

const IMPORTS = `// The theme
import { theme } from '${pkgName}';

// The console components
import { Stamp, ConsoleFrame, LogConsole, SegmentedMeter } from '${pkgName}/components';

// Stock MUI — already themed, no extra setup
import { Button, TextField, Alert } from '@mui/material';`;

const TOKENS = `// Structural tokens, in an sx callback — the everyday path
<Box sx={(t) => ({
  color: t.nerv.hue.mint,                  // hue.{void,mint,mintHi,greenMap,greenDim,paper,
                                           //   orange,amber,amberDim,red,redHi,crimson,teal,blue}
  fontFamily: t.nerv.fonts.mono,           // fonts.{display, mono, jp}
  borderRadius: \`\${t.nerv.radius.chip}px\`, // radius.{none:0, chip:2, seg:4, chamfer:16}
  padding: t.nerv.space.md,                // space.{xs:4, sm:8, md:16, lg:24, xl:32}
  clipPath: t.nerv.chamfer(28),            // chamfered corners for hero panels
})} />

// The same palette hues as live CSS variables
theme.vars.palette.nerv.mint`;

const TONE = `// In your own components, take a semantic tone — never a raw hex
import { toneHue, type Tone } from '${pkgName}/components';

function Readout({ tone = 'mint' }: { tone?: Tone }) {
  return <Box sx={(t) => ({ color: toneHue(t, tone) })}>…</Box>;
}`;

export default function GettingStarted() {
  return (
    <Box>
      <PageHeader
        eyebrow="OVERVIEW"
        title="GETTING STARTED"
        tags={
          <Stamp tone="mint" size="sm">
            v{version}
          </Stamp>
        }
        lede="Install two packages, wrap your app once, and every Material UI component you already use resolves to the tactical identity. The console-specific pieces come from the paired component library."
      />

      <Stack spacing={5}>
        <DocSection id="install" title="INSTALL · 導入">
          <Prose>
            Material UI v7 or newer, React 18 or newer, and Emotion are peer dependencies — the theme brings no runtime
            of its own.
          </Prose>
          <Box sx={{ mt: 2 }}>
            <CodeBlock code={INSTALL} filename="terminal" />
          </Box>
        </DocSection>

        <DocSection id="mount" title="MOUNT THE THEME · 設置">
          <CodeBlock code={MOUNT} filename="App.tsx" />
          <Box sx={{ mt: 2.5 }}>
            <Prose>
              <strong>CssBaseline is required, not optional.</strong> It installs the CRT scanline and vignette overlay
              on <code>body::before</code>, the <code>nervBlink</code> / <code>nervBtnBlink</code> keyframes the
              component overrides depend on, and the global reduced-motion guard. Drop it and stamps stop blinking and
              every screen loses its CRT pass.
            </Prose>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Prose>
              <code>defaultMode="dark"</code> because there is no other mode. The Phosphor Console is a single dark
              scheme by definition — a black command deck, not a themeable light/dark pair. <code>cssVariables</code> is
              on, so every token is also emitted as a <code>--mui-*</code> variable reachable through{' '}
              <code>theme.vars</code>.
            </Prose>
          </Box>
        </DocSection>

        <DocSection id="imports" title="WHAT TO IMPORT · 引用">
          <CodeBlock code={IMPORTS} filename="imports.ts" />
          <Box sx={{ mt: 2.5 }}>
            <Guidance
              items={[
                'Stock MUI components need no wrapper and no sx restyling — the theme already dresses them. Reach for sx to lay them out, not to change how they look.',
                'The component library covers only what MUI has no primitive for: bilingual stamps, segmented meters, the diagnostic terminal, the command frame.',
                'If you are about to heavily sx-override a stock component, a house component probably already does it.',
              ]}
            />
          </Box>
        </DocSection>

        <DocSection id="tokens" title="TOKENS · 記号">
          <Prose>
            Never hardcode a hex or a size. Everything traces to the token module, reachable two ways: structural tokens
            on <code>theme.nerv.*</code>, and the palette hues as live CSS variables on{' '}
            <code>theme.vars.palette.nerv.*</code>.
          </Prose>
          <Box sx={{ mt: 2 }}>
            <CodeBlock code={TOKENS} filename="tokens.tsx" />
          </Box>
          <Box sx={{ mt: 2.5 }}>
            <CodeBlock code={TONE} filename="tone.tsx" />
          </Box>
        </DocSection>

        <DocSection id="rules" title="THE RULES · 規則">
          <Prose>
            These are load-bearing. Break them and the UI stops reading as the system even when every value is close.
          </Prose>
          <Box sx={{ mt: 2 }}>
            <Guidance
              items={[
                'Black #0A0A0A is the only surface. Depth is built from three flat materials: border, glow, and hue.',
                'Color is state, not brand. Mint nominal · orange CHROME ONLY · blue pending · amber caution · red critical.',
                'Filled means active: idle is an outline on black, active is a solid hue fill with black content punched out.',
                'Everything important is boxed. Blinking means in progress; a solid fill means recorded.',
                'Type is bimodal and bilingual: one giant element plus tiny captions, and a large kanji always carries a small Latin caption.',
                'Motion is mechanical — steps() or linear, never eased or springy — and always ships a reduced-motion path.',
                'Number a sequence only when it genuinely is one.',
              ]}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <Guidance
              tone="red"
              items={[
                'Elevation shadows, glassmorphism, or a lighter-gray "raised" card.',
                'Orange carrying a data value or a status — orange is chrome.',
                'Glow on black-on-fill content: the fill carries the light.',
                'Side-stripe accent borders wider than 1px, gradient text, and lowercase UI chrome.',
                'Easing, spring, or bounce on any transition.',
              ]}
            />
          </Box>
        </DocSection>
      </Stack>
    </Box>
  );
}
