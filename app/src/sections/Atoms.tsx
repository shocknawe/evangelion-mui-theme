/**
 * 02 · ATOMS — the smallest reusable pieces: stamps (MUI Chip), legend,
 * clock, buttons (MUI Button variants), metadata block, section divider.
 */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { Section, SpecCard, SpecGrid } from '../components/primitives';
import { SevenSegClock } from '../widgets/SevenSegClock';

const LEGEND: [string, string, 'nominal' | 'caution' | 'pending' | 'blocked'][] = [
  ['正常', 'NOMINAL', 'nominal'],
  ['注意', 'CAUTION', 'caution'],
  ['待機', 'PENDING', 'pending'],
  ['阻止', 'BLOCKED', 'blocked'],
];

export function Atoms() {
  const t = useTheme();
  const legendColor = { nominal: t.nerv.hue.mint, caution: t.nerv.hue.amber, pending: t.nerv.hue.blue, blocked: t.nerv.hue.redHi };

  return (
    <Section id="atoms" idx="02" kanji="原子" title="ATOMS" note="Stamps, buttons, legends, clocks. Everything important is boxed; blinking = in-progress; solid fill = active. Chips and buttons are live MUI components carrying theme variants.">
      <SpecGrid cols={3}>
        {/* stamps */}
        <SpecCard label="STAMP / CHIP" src="MuiChip">
          <Chip label="NOMINAL" color="success" />
          <Chip label="審査中" color="info" sx={{ animation: `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` }} />
          <Chip label="DOWN" variant="stamp" color="error" />
        </SpecCard>

        {/* legend */}
        <SpecCard label="LEGEND" src="sonnet-37" verdict="keep" verdictText="✅ MUST HAVE">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {LEGEND.map(([jp, en, kind]) => {
              const c = legendColor[kind];
              const filled = kind === 'blocked';
              return (
                <Box key={en} sx={{ border: `1px solid ${c}`, background: filled ? c : 'transparent', color: filled ? t.nerv.hue.void : c, p: '2px 9px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 54, borderRadius: `${t.nerv.radius.chip}px` }}>
                  <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 13, lineHeight: 1.2, letterSpacing: '0.2em', textIndent: '0.2em' }}>{jp}</Box>
                  <Box component="span" sx={{ fontSize: 8, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono }}>{en}</Box>
                </Box>
              );
            })}
          </Box>
        </SpecCard>

        {/* clock */}
        <SpecCard label="7-SEG CLOCK · 2 SKINS" src="exp-01" verdict="keep" verdictText="✅ CLOCK" column>
          <SevenSegClock />
        </SpecCard>

        {/* buttons */}
        <SpecCard label="BUTTON · SELECTED=BLINK" src="exp-01" verdict="keep" verdictText="✅ BUTTONS">
          <Button variant="contained" className="nerv-live">FILE GATE</Button>
          <Button variant="alt">DOCS</Button>
          <Button variant="ghost">RESET</Button>
        </SpecCard>

        {/* metadata */}
        <SpecCard label="METADATA BLOCK" src="universal" column>
          <Box sx={{ fontSize: 11, lineHeight: 1.6, color: t.nerv.hue.orange, letterSpacing: '0.05em', fontFamily: t.nerv.fonts.mono, '& b': { color: t.nerv.hue.amberDim, fontWeight: 400 } }}>
            <div>CODE:<b>0771</b></div>
            <div>FILE:<b>GATE_INTAKE</b></div>
            <div>EX_MODE:<b>MANUAL</b></div>
            <div>PRIORITY:<b>AA-</b></div>
          </Box>
        </SpecCard>

        {/* section divider */}
        <SpecCard label="SECTION DIVIDER" src="form-02">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 13, color: t.nerv.hue.void, background: t.nerv.hue.orange, p: '2px 8px' }}>01</Box>
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 18, color: t.nerv.hue.orange, letterSpacing: '0.1em' }}>個体</Box>
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 15, color: t.nerv.hue.paper, letterSpacing: '0.1em' }}>IDENTITY</Box>
            <Box sx={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${t.nerv.hue.orange}, transparent)` }} />
          </Box>
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
