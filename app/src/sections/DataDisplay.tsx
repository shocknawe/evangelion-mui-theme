/**
 * 04 · DATA DISPLAY — segmented meters, gauges, a trend chart, the diagnostic
 * terminal, separators, the unit roster, an OODA stepper (MUI Stepper) and the
 * status marquee.
 */
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { Section, SpecCard, SpecGrid, ZoneTitle } from '../components/primitives';
import { SegmentedMeter, RadialGauge, BarColumnGauge, NegativeStat } from '../widgets/Meters';
import { LineChart, Waveform, ScanLattice } from '../widgets/Charts';
import { Terminal } from '../widgets/Terminal';
import { Roster } from '../widgets/Roster';
import { Marquee } from '../widgets/Marquee';

const OODA = ['OBSERVE', 'UNDERSTAND', 'DECIDE', 'EXECUTE', 'LEARN'];

export function DataDisplay() {
  return (
    <Section id="data" idx="04" kanji="図表" title="DATA DISPLAY" note="Meters use discrete LED segments (never a continuous fill); thresholds are drawn objects. Terminal is amber at two brightness levels with dot-leader status.">
      <SpecGrid cols={3}>
        <SpecCard label="SEGMENTED METER + THRESHOLD" src="sonnet-12" verdict="keep" verdictText="✅ BAR" column>
          <SegmentedMeter />
        </SpecCard>
        <SpecCard label="RADIAL ARC" src="sonnet-32" verdict="keep" verdictText="✅ GAUGE">
          <RadialGauge />
        </SpecCard>
        <SpecCard label="BAR + COLUMN GAUGE" src="sonnet-32" verdict="keep" verdictText="✅ GAUGE" column>
          <BarColumnGauge />
        </SpecCard>
        <SpecCard label="NEGATIVE-SPACE STAT" src="sonnet-15" verdict="keep" verdictText="✅ SPACE" column flush>
          <NegativeStat />
        </SpecCard>
        <SpecCard label="LINE / TREND CHART" src="sonnet-18 refined" verdict="warn" column flush>
          <LineChart />
        </SpecCard>
        <SpecCard label="TERMINAL / LOG" src="sonnet-20" verdict="keep" verdictText="✅ TERMINAL" column flush>
          <Terminal />
        </SpecCard>
      </SpecGrid>

      <ZoneTitle>SECTION SEPARATORS</ZoneTitle>
      <SpecGrid cols={2}>
        <SpecCard label="WAVEFORM SEPARATOR" src="exp-06 → dashboard-02" verdict="warn" verdictText="⚠️ NO BRICKS" column flush>
          <Waveform />
        </SpecCard>
        <SpecCard label="SCAN-LATTICE SEPARATOR" src="exp-04" verdict="keep" verdictText="✅ SEP" column flush>
          <ScanLattice />
        </SpecCard>
      </SpecGrid>

      <ZoneTitle>ROSTER · MARQUEE · STEPPER</ZoneTitle>
      <SpecGrid cols={2}>
        <SpecCard label="UNIT ROSTER GRID" src="sonnet-37" verdict="keep" verdictText="✅ MUST HAVE" column>
          <Roster />
        </SpecCard>
        <SpecCard label="OODA STEPPER · MARQUEE" src="MuiStepper · sonnet-28" column>
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
