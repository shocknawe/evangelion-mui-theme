/**
 * 07 · PATTERNS — full-screen assemblies (previewed as mini schematics). One
 * chamfered frame per screen; internal zones divided by rules, not floating cards.
 */
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Section, SpecCard, SpecGrid } from '../components/primitives';

export function Patterns() {
  const t = useTheme();
  const chamfer = t.nerv.chamfer(10);

  return (
    <Section id="patterns" idx="07" kanji="構造" title="PATTERNS" note="Whole-screen layouts built from the atoms above. See the shipped reference pages (dashboard-01, dashboard-03, form-02, wiki) for the full assemblies.">
      <SpecGrid cols={4}>
        <SpecCard label="MORNING BRIEF" src="dashboard-01" column>
          <Box sx={{ border: `2px solid ${t.nerv.hue.orange}`, height: 70, width: '100%', display: 'grid', gridTemplateColumns: '20px 1fr 24px', gridTemplateRows: '14px 1fr', gap: '2px', p: '2px', clipPath: chamfer }}>
            <Box sx={{ gridColumn: '1 / -1', background: 'rgba(242,100,0,.25)' }} />
            <Box sx={{ background: 'rgba(82,242,154,.15)' }} />
            <Box sx={{ background: 'rgba(82,242,154,.05)' }} />
            <Box sx={{ background: 'rgba(80,144,208,.15)' }} />
          </Box>
        </SpecCard>

        <SpecCard label="AUTOMATION" src="dashboard-03" column>
          <Box sx={{ border: `2px solid ${t.nerv.hue.orange}`, height: 70, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px', p: '4px', clipPath: chamfer }}>
            <Box sx={{ background: 'rgba(82,242,154,.15)' }} />
            <Box sx={{ background: 'rgba(80,144,208,.15)' }} />
            <Box sx={{ background: 'rgba(244,159,9,.15)' }} />
          </Box>
        </SpecCard>

        <SpecCard label="PROVISION FORM" src="form-02" column>
          <Box sx={{ border: `1px solid ${t.nerv.hue.orange}`, height: 70, width: '100%', p: '5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Box sx={{ height: 8, background: 'rgba(242,100,0,.3)', width: '60%' }} />
            <Box sx={{ height: 6, border: `1px solid ${t.nerv.hue.greenDim}` }} />
            <Box sx={{ height: 6, border: `1px solid ${t.nerv.hue.greenDim}` }} />
            <Box sx={{ height: 8, background: t.nerv.hue.mint, width: '40%' }} />
          </Box>
        </SpecCard>

        <SpecCard label="WIKI ARTICLE" src="wiki" column>
          <Box sx={{ height: 70, width: '100%', display: 'grid', gridTemplateColumns: '14px 1fr 14px', gap: '3px' }}>
            <Box sx={{ background: 'rgba(242,100,0,.2)' }} />
            <Box sx={{ borderLeft: `3px solid ${t.nerv.hue.mint}`, background: 'rgba(82,242,154,.06)' }} />
            <Box sx={{ background: 'rgba(242,100,0,.2)' }} />
          </Box>
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
