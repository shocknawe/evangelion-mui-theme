/**
 * PATTERNS / SCREENS — the ConsoleFrame shell: a full-width header over a
 * sidebar · main · rail grid, plus optional band / footer rows and the alarm
 * boolean. Documents anatomy, a live scaled-down working frame, responsive
 * stacking, and the props.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  ConsoleFrame,
  ConsoleNav,
  Monogram,
  BilingualLabel,
  Stat,
  Stamp,
  RailItem,
  MetadataBlock,
} from '@components';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

const NAV = [
  { value: 'eng', jp: '工学', en: 'ENGINEERING' },
  { value: 'ops', jp: '運用', en: 'OPERATIONS' },
  { value: 'intel', jp: '諜報', en: 'INTELLIGENCE' },
];

/** A single labelled anatomy cell — layout-only sx, colored by region. */
function Region({ area, label }: { area: string; label: string }) {
  return (
    <Box
      sx={(t) => ({
        gridArea: area,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${t.nerv.hue.greenDim}`,
        minHeight: 0,
      })}
    >
      <Stamp tone="orange" size="sm">
        {label}
      </Stamp>
    </Box>
  );
}

function AnatomyDiagram() {
  return (
    <Box
      sx={(t) => ({
        display: 'grid',
        width: '100%',
        gridTemplateColumns: '120px 1fr 150px',
        gridTemplateRows: '64px 48px 1fr 40px',
        gridTemplateAreas: `"head head head" "band band band" "side main rail" "foot foot foot"`,
        gap: '3px',
        minHeight: 300,
        border: `2px solid ${t.nerv.hue.orange}`,
        background: t.nerv.hue.void,
        p: '3px',
      })}
    >
      <Region area="head" label="HEADER" />
      <Region area="band" label="BAND (OPTIONAL)" />
      <Region area="side" label="SIDEBAR" />
      <Region area="main" label="MAIN (CHILDREN)" />
      <Region area="rail" label="RAIL" />
      <Region area="foot" label="FOOTER (OPTIONAL)" />
    </Box>
  );
}

function DemoHeader() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%', p: '8px 14px' }}>
      <Monogram jp="統制" label="COMMAND" size={18} />
      <Typography sx={(t) => ({ fontSize: 13, color: t.nerv.hue.paper })}>SECTOR COMMAND</Typography>
      <Stamp tone="mint" size="sm" sx={{ ml: 'auto' }} glow>
        SYS:NOMINAL
      </Stamp>
    </Box>
  );
}

function DemoSidebar({ section, onSection }: { section: string; onSection: (v: string) => void }) {
  return (
    <Box sx={{ p: '10px 8px' }}>
      <ConsoleNav ariaLabel="Sections" variant="rail" items={NAV} value={section} onChange={onSection} />
    </Box>
  );
}

function DemoMain() {
  return (
    <Box sx={{ p: '12px 14px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <BilingualLabel jp="起動" en="INITIALIZATION" tone="mint" size={30} />
      <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
        <Stat label="GATES WAITING" value={3} />
        <Stat label="MEMORY NODES" value="2,482" />
      </Box>
    </Box>
  );
}

function DemoRail() {
  return (
    <Box sx={{ p: '10px 12px' }}>
      <RailItem title="RENEW SERVER CERTS" sub="SYSTEM" when="14:00" />
      <RailItem title="NOON SYNC" sub="ENGINEERING" when="12:00" done />
    </Box>
  );
}

function DemoFooter() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%', p: '0 14px' }}>
      <MetadataBlock entries={{ CODE: '0902', EX_MODE: 'MANUAL' }} />
    </Box>
  );
}

export default function ScreensPattern() {
  const [section, setSection] = useState('eng');
  const [alarm, setAlarm] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="PATTERN"
        title="SCREENS"
        lede="ConsoleFrame is the single chamfered shell a whole screen sits on: a full-width header over a sidebar · main · rail grid, with optional band and footer rows and an alarm boolean that flips the frame red. It supplies the orange double-frame, glow, and CRT pass; you supply the regions."
      />

      <DocSection id="anatomy" title="ANATOMY">
        <Prose>
          Six named regions, three required. <code>header</code> and <code>children</code> (main) are required;{' '}
          <code>sidebar</code>, <code>rail</code>, <code>band</code>, and <code>footer</code> are each omitted by
          leaving the prop out — the grid collapses that column/row rather than leaving a gap.
        </Prose>
        <DemoStage flush minHeight={0}>
          <AnatomyDiagram />
        </DemoStage>
      </DocSection>

      <DocSection id="live" title="LIVE FRAME">
        <Prose>
          A working, scaled-down ConsoleFrame — real header, sidebar nav, main content, rail, and footer built
          from house components. Toggle the alarm to see the frame recolor red with the hazard stripe.
        </Prose>
        <DemoStage flush column minHeight={0}>
          <Box sx={{ mb: 1.5 }}>
            <Button variant={alarm ? 'alt' : 'ghost'} onClick={() => setAlarm((v) => !v)}>
              {alarm ? 'CLEAR ALARM' : 'TRIGGER ALARM'}
            </Button>
          </Box>
          <Box sx={{ width: '100%', height: 460 }}>
            <ConsoleFrame
              header={<DemoHeader />}
              sidebar={<DemoSidebar section={section} onSection={setSection} />}
              rail={<DemoRail />}
              footer={<DemoFooter />}
              alarm={alarm}
              sidebarWidth={140}
              railWidth={170}
              headerHeight={48}
              footerHeight={30}
              sx={{ m: 0, height: '100%', minHeight: 0 }}
            >
              <DemoMain />
            </ConsoleFrame>
          </Box>
        </DemoStage>
        <CodeBlock
          filename="ConsoleFrameSkeleton.tsx"
          code={`<ConsoleFrame
  header={<Header />}
  sidebar={<ConsoleNav variant="rail" items={sections} value={section} onChange={setSection} />}
  rail={<Rail />}
  footer={<StatusBar />}
  alarm={anyGateBlocked}
>
  <MainColumn />
</ConsoleFrame>`}
        />
      </DocSection>

      <DocSection id="responsive" title="RESPONSIVE BEHAVIOUR">
        <Prose>
          Below the <code>md</code> breakpoint the grid collapses to a single column and the regions stack in
          document order — head, band, sidebar, main, rail, foot — with the page scrolling as one instead of each
          region scrolling independently. On desktop, header/band/footer stay full-width fixed rows and only the
          sidebar/main/rail track height, each scrolling in place inside the fixed-height frame.
        </Prose>
      </DocSection>

      <DocSection id="props" title="PROPS">
        <DemoStage flush minHeight={0}>
          <Table size="small" sx={{ minWidth: 420 }}>
            <TableHead>
              <TableRow>
                <TableCell>PROP</TableCell>
                <TableCell>DEFAULT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(
                [
                  ['sidebarWidth', '198px'],
                  ['railWidth', '292px'],
                  ['headerHeight', '100px'],
                  ['bandHeight', '96px'],
                  ['footerHeight', '44px'],
                  ['alarm', 'false'],
                ] as Array<[string, string]>
              ).map(([prop, def]: [string, string]) => (
                <TableRow key={prop}>
                  <TableCell>{prop}</TableCell>
                  <TableCell>{def}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DemoStage>
      </DocSection>

      <DocSection id="reference-screens" title="REFERENCE SCREENS">
        <Prose>Full assemblies of ConsoleFrame ship in the repo, each ported from a matching static HTML layout.</Prose>
        <Guidance
          items={[
            'app/ /dashboard-01 — from sample-layouts/dashboard-01.html (morning brief, gate queue).',
            'app/ /dashboard-02 — from sample-layouts/dashboard-02.html.',
            'app/ /dashboard-03 — from sample-layouts/dashboard-03.html.',
            'app/ /landing-01 — from sample-layouts/landing-page-01.html.',
            'app/ /landing-02 — from sample-layouts/landing-page-02.html.',
          ]}
        />
      </DocSection>
    </>
  );
}
