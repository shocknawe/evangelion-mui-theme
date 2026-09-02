/**
 * The landing page — the whole library on one screen.
 *
 * Every export that has a playground seed renders live here, grouped by family,
 * each tile linking to its full page. The groups come from the generated site
 * data, so a new export appears here the moment it has a seed in `examples.ts`.
 */
import Box from '@mui/material/Box';
import { BilingualLabel, Marquee, Monogram, Stamp, StatusLegend } from '@components';
import { DocSection, PageHeader, Prose } from '../docs/chrome';
import { CodeBlock } from '../docs/CodeBlock';
import { ComponentPreview } from '../components/ComponentPreview';
import { examples } from '../examples';
import { allComponents, groups, pkgName, version } from '../siteData';

const INSTALL = `npm install ${pkgName} @mui/material @emotion/react @emotion/styled`;

const MOUNT = `import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '${pkgName}';
import { Stamp } from '${pkgName}/components';

export function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      {/* CssBaseline is required — it installs the CRT pass,
          the blink keyframes, and the reduced-motion guard. */}
      <CssBaseline />
      <Stamp tone="mint" glow>SYS:NOMINAL</Stamp>
    </ThemeProvider>
  );
}`;

/** Component families, limited to the entries that have a live preview seed. */
const PREVIEW_GROUPS = groups
  .map((g) => ({ title: g.title, items: g.items.filter((c) => examples[c.slug]) }))
  .filter((g) => g.items.length);

/**
 * Families for the browse grid. Each card deep-links to its first component, so
 * a group with no items has nothing to point at — drop it rather than throw.
 */
const FAMILY_CARDS = groups.filter((g) => g.items.length);

const previewCount = PREVIEW_GROUPS.reduce((n, g) => n + g.items.length, 0);
const propCount = allComponents.reduce((n, c) => n + c.props.length, 0);

export default function Landing() {
  return (
    <Box>
      <PageHeader
        eyebrow="NERV/MAGI TACTICAL DESIGN SYSTEM"
        title="PHOSPHOR CONSOLE"
        tags={
          <>
            <Stamp tone="mint" size="sm" glow>
              v{version}
            </Stamp>
            <Stamp tone="orange" size="sm">
              MUI v7+
            </Stamp>
          </>
        }
        lede="A black CRT command deck where information glows in phosphor mint, safety orange, and blood red — dense, all-caps, bilingual, animated in abrupt mechanical steps. A Material UI theme that dresses every stock component, plus the console-specific pieces MUI has no primitive for. Everything below is live: edit any of it in the playground."
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 4 }}>
        <Monogram jp="燐" label="PHOSPHOR" tone="orange" size={34} />
        <BilingualLabel jp="管制" en="COMMAND DECK" size={34} />
        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', ml: 'auto' }}>
          <Stat n={String(allComponents.length)} label="EXPORTS" />
          <Stat n={String(propCount)} label="DOCUMENTED PROPS" />
          <Stat n={String(previewCount)} label="LIVE PREVIEWS" />
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Marquee />
      </Box>

      <Box sx={{ display: 'grid', gap: 5 }}>
        <DocSection id="install" title="INSTALL · 導入">
          {/* `minmax(0, …)` on every track: the install line is one unbreakable
              76-char string under `white-space: pre`, and a bare `1fr` floors a
              track at its content width — which pushes the whole page wide.
              `alignItems: start` keeps the one-liner from stretching to match
              the mount snippet. */}
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              alignItems: 'start',
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <CodeBlock code={INSTALL} filename="terminal" />
            <CodeBlock code={MOUNT} filename="App.tsx" />
          </Box>
        </DocSection>

        <DocSection id="states" title="COLOR IS STATE · 状態">
          <Prose>
            The same hue means the same thing everywhere. Mint is nominal, blue is pending, amber is caution, red is
            critical — and orange is chrome only: borders, rules, axes and labels, never a data value.
          </Prose>
          <Box sx={{ mt: 2 }}>
            <StatusLegend
              items={[
                { jp: '正常', en: 'NOMINAL', tone: 'mint' },
                { jp: '待機', en: 'PENDING', tone: 'blue' },
                { jp: '注意', en: 'CAUTION', tone: 'amber' },
                { jp: '危険', en: 'CRITICAL', tone: 'red' },
                { jp: '阻止', en: 'BLOCKED', tone: 'red', filled: true },
              ]}
            />
          </Box>
        </DocSection>

        <DocSection
          id="components"
          title="COMPONENT PREVIEWS · 部品"
          aside={`${previewCount} LIVE`}
        >
          <Prose>
            A live look at every house component, by family. Open one to edit it in its playground.
          </Prose>

          {PREVIEW_GROUPS.map((g) => (
            <Box key={g.title} sx={{ mt: 3.5 }}>
              <Box
                component="h3"
                sx={(t) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mt: 0,
                  mb: 1.5,
                  fontFamily: t.nerv.fonts.display,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  color: t.nerv.hue.orange,
                  textTransform: 'uppercase',
                })}
              >
                {g.title}
                {/* `height: '1px'` as a string, not `1` — a numeric `height` in
                    `sx` where 0 < n <= 1 is a *percentage*, and 100% against
                    this row's indefinite height computes to 0. */}
                <Box sx={(t) => ({ flex: 1, height: '1px', background: t.nerv.hue.greenDim })} />
                <Stamp tone="dim" size="sm">
                  {g.items.length}
                </Stamp>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    xl: 'repeat(3, minmax(0, 1fr))',
                  },
                }}
              >
                {g.items.map((c) => (
                  <ComponentPreview key={c.slug} slug={c.slug} name={c.name} code={examples[c.slug]} />
                ))}
              </Box>
            </Box>
          ))}
        </DocSection>

        <DocSection id="families" title="BROWSE BY FAMILY · 分類">
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
            }}
          >
            {FAMILY_CARDS.map((g) => (
              <Box
                key={g.title}
                component="a"
                href={`#/components/${g.items[0].slug}`}
                sx={(t) => ({
                  display: 'block',
                  p: 2,
                  textDecoration: 'none',
                  border: `1px solid ${t.nerv.hue.greenDim}`,
                  background: t.nerv.hue.void,
                  transition: `border-color ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}`,
                  '&:hover': { borderColor: t.nerv.hue.orange, boxShadow: '0 0 12px rgba(242,100,0,.12)' },
                  '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2 },
                })}
              >
                <Box
                  sx={(t) => ({
                    fontFamily: t.nerv.fonts.display,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.1em',
                    color: t.nerv.hue.mintHi,
                    textTransform: 'uppercase',
                  })}
                >
                  {g.title}
                </Box>
                <Box
                  sx={(t) => ({
                    mt: 0.75,
                    fontFamily: t.nerv.fonts.mono,
                    fontSize: 10.5,
                    lineHeight: 1.5,
                    letterSpacing: '0.04em',
                    color: t.nerv.hue.greenMap,
                  })}
                >
                  {g.items.length} · {g.items.slice(0, 3).map((c) => c.name).join(' · ')}
                  {g.items.length > 3 ? ' …' : ''}
                </Box>
              </Box>
            ))}
          </Box>
        </DocSection>
      </Box>
    </Box>
  );
}

/** A headline count for the masthead strip. */
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <Box>
      <Box
        sx={(t) => ({
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1,
          color: t.nerv.hue.paper,
          textShadow: '0 0 6px rgba(82,242,154,.35)',
        })}
      >
        {n}
      </Box>
      <Box
        sx={(t) => ({
          mt: 0.5,
          fontFamily: t.nerv.fonts.mono,
          fontSize: 9,
          letterSpacing: '0.14em',
          color: t.nerv.hue.orange,
        })}
      >
        {label}
      </Box>
    </Box>
  );
}
