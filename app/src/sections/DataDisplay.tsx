/**
 * 04 · DATA DISPLAY — the data-viz library components (segmented meters, gauges,
 * a trend chart, the diagnostic terminal, separators, the unit roster, a stat
 * tile and the status marquee), all from `@components`, plus a stock MUI Stepper.
 */
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import {
  SegmentedMeter,
  RadialGauge,
  BarColumnGauge,
  StatTile,
  LineChart,
  Waveform,
  ScanLattice,
  Terminal,
  Roster,
  Marquee,
} from '@components';
import { Section, SpecCard, SpecGrid, ZoneTitle } from '../components/primitives';

const OODA = ['OBSERVE', 'UNDERSTAND', 'DECIDE', 'EXECUTE', 'LEARN'];

export function DataDisplay() {
  return (
    <Section id="data" idx="04" kanji="図表" title="DATA DISPLAY" note="Meters use discrete LED segments (never a continuous fill); thresholds are drawn objects. Terminal is amber at two brightness levels with dot-leader status. Every piece here is a @components import.">
      <SpecGrid cols={3}>
        <SpecCard label="SEGMENTED METER + THRESHOLD" src="<SegmentedMeter/>" verdict="keep" verdictText="✅ BAR" column>
          {/* self-driving demo: `role="img"` is the stopgap (the value is not exposed
              to AT — recorded as a gap in src/a11y/aria-patterns.ts) */}
          <SegmentedMeter role="img" aria-label="ANIMATED LEVEL DEMO · A B C D" />
        </SpecCard>
        <SpecCard label="RADIAL ARC" src="<RadialGauge/>" verdict="keep" verdictText="✅ GAUGE">
          <RadialGauge role="img" aria-label="ANIMATED ARC DEMO" />
        </SpecCard>
        <SpecCard label="BAR + COLUMN GAUGE" src="<BarColumnGauge/>" verdict="keep" verdictText="✅ GAUGE" column>
          <BarColumnGauge role="img" aria-label="ANIMATED BAR + COLUMN DEMO" />
        </SpecCard>
        <SpecCard label="NEGATIVE-SPACE STAT" src="<StatTile/>" verdict="keep" verdictText="✅ SPACE" column flush>
          <StatTile label="MEMORY NODES" value="2,482" footer="98.4% RETENTION · STABLE" />
        </SpecCard>
        <SpecCard label="LINE / TREND CHART" src="<LineChart/>" verdict="warn" column flush>
          <LineChart />
        </SpecCard>
        <SpecCard label="TERMINAL / LOG" src="<Terminal/>" verdict="keep" verdictText="✅ TERMINAL" column flush>
          <Terminal />
        </SpecCard>
      </SpecGrid>

      <ZoneTitle>SECTION SEPARATORS</ZoneTitle>
      <SpecGrid cols={2}>
        <SpecCard label="WAVEFORM SEPARATOR" src="<Waveform/>" verdict="warn" verdictText="⚠️ NO BRICKS" column flush>
          <Waveform />
        </SpecCard>
        <SpecCard label="SCAN-LATTICE SEPARATOR" src="<ScanLattice/>" verdict="keep" verdictText="✅ SEP" column flush>
          <ScanLattice />
        </SpecCard>
      </SpecGrid>

      <ZoneTitle>ROSTER · MARQUEE · STEPPER</ZoneTitle>
      <SpecGrid cols={2}>
        <SpecCard label="UNIT ROSTER GRID" src="<Roster/>" verdict="keep" verdictText="✅ MUST HAVE" column>
          <Roster />
        </SpecCard>
        <SpecCard label="OODA STEPPER · MARQUEE" src="MuiStepper · <Marquee/>" column>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stepper activeStep={2} alternativeLabel>
              {OODA.map((s) => (
                <Step key={s}>
                  <StepLabel>{s}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Marquee />
          </Box>
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
