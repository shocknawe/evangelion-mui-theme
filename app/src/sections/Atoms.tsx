/**
 * 02 · ATOMS — the smallest reusable pieces. Stamps (MUI Chip) and buttons (MUI
 * Button variants) sit beside library components: StatusLegend, SevenSegClock,
 * MetadataBlock and SectionDivider — each imported from `@components`, so this
 * section doubles as their usage example.
 */
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import {
  StatusLegend,
  SevenSegClock,
  MetadataBlock,
  SectionDivider as SectionDividerBar,
} from '@components';
import { Section, SpecCard, SpecGrid } from '../components/primitives';

export function Atoms() {
  const t = useTheme();

  return (
    <Section id="atoms" idx="02" kanji="原子" title="ATOMS" note="Stamps, buttons, legends, clocks. Everything important is boxed; blinking = in-progress; solid fill = active. Chips and buttons are live MUI components; StatusLegend, SevenSegClock, MetadataBlock and SectionDivider come from @components.">
      <SpecGrid cols={3}>
        {/* stamps */}
        <SpecCard label="STAMP / CHIP" src="MuiChip">
          <Chip label="NOMINAL" color="success" />
          <Chip label="審査中" color="info" sx={{ animation: `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` }} />
          <Chip label="DOWN" variant="stamp" color="error" />
        </SpecCard>

        {/* legend */}
        <SpecCard label="LEGEND" src="<StatusLegend/>" verdict="keep" verdictText="✅ MUST HAVE">
          <StatusLegend
            items={[
              { jp: '正常', en: 'NOMINAL', tone: 'mint' },
              { jp: '注意', en: 'CAUTION', tone: 'amber' },
              { jp: '待機', en: 'PENDING', tone: 'blue' },
              { jp: '阻止', en: 'BLOCKED', tone: 'red', filled: true },
            ]}
          />
        </SpecCard>

        {/* clock */}
        <SpecCard label="7-SEG CLOCK · 2 SKINS" src="<SevenSegClock/>" verdict="keep" verdictText="✅ CLOCK" column>
          <SevenSegClock />
        </SpecCard>

        {/* buttons */}
        <SpecCard label="BUTTON · SELECTED=BLINK" src="exp-01" verdict="keep" verdictText="✅ BUTTONS">
          <Button variant="contained" className="nerv-live">FILE GATE</Button>
          <Button variant="alt">DOCS</Button>
          <Button variant="ghost">RESET</Button>
        </SpecCard>

        {/* metadata */}
        <SpecCard label="METADATA BLOCK" src="<MetadataBlock/>" column>
          <MetadataBlock entries={{ CODE: '0771', FILE: 'GATE_INTAKE', EX_MODE: 'MANUAL', PRIORITY: 'AA-' }} />
        </SpecCard>

        {/* section divider */}
        <SpecCard label="SECTION DIVIDER" src="<SectionDivider/>">
          <SectionDividerBar index="01" jp="個体" title="IDENTITY" />
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
