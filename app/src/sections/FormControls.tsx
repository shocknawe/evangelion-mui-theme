/**
 * 03 · FORM CONTROLS — the MUI input set styled by the theme: TextField, Select,
 * Checkbox, Switch, Slider, ToggleButtonGroup, plus the console-specific
 * patterns (priority chips, number stepper, hazard rating, tag input, date).
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { Section, SpecCard, SpecGrid } from '../components/primitives';
import { pad2 } from '../lib/motion';

const DEPTS = [
  ['ENGINEERING', '工学'],
  ['KNOWLEDGE', '知識'],
  ['AUTOMATION', '自動'],
  ['LEARNING', '学習'],
];
const PRIORITIES: [string, string, string][] = [
  ['通常', 'B++', 'routine'],
  ['優先', 'AA-', 'elevated'],
  ['緊急', 'AAA', 'critical'],
];

function Field({ jp, label, children }: { jp: string; label: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <Box sx={{ width: '100%' }}>
      <Box component="label" sx={{ display: 'flex', alignItems: 'baseline', gap: 1, fontSize: 10, letterSpacing: '0.14em', color: t.nerv.hue.orange, mb: '6px', fontFamily: t.nerv.fonts.mono }}>
        <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 13, color: t.nerv.hue.orange }}>{jp}</Box>
        {label}
      </Box>
      {children}
    </Box>
  );
}

export function FormControls() {
  const t = useTheme();
  const [dept, setDept] = useState('ENGINEERING');
  const [priority, setPriority] = useState('routine');
  const [ram, setRam] = useState(8);
  const [workers, setWorkers] = useState(4);
  const [model, setModel] = useState('CORE');
  const [rating, setRating] = useState(3);
  const [tags, setTags] = useState(['CODE_REVIEW', 'VECTOR_SEARCH']);
  const prColor = { routine: t.nerv.hue.greenMap, elevated: t.nerv.hue.amber, critical: t.nerv.hue.redHi } as const;

  return (
    <Section id="forms" idx="03" kanji="申請" title="FORM CONTROLS" note="Shared field grammar: black field, dim-green idle border → mint glow on focus, checked = colorway inversion. Text, Select, Checkbox, Switch, Slider and ToggleButtonGroup are stock MUI carrying the theme overrides.">
      <SpecGrid cols={3}>
        <SpecCard label="TEXT INPUT" src="MuiTextField" column>
          <Field jp="件名" label="TEXT INPUT">
            <TextField fullWidth placeholder="API SECURITY GATEWAY" defaultValue="API SECURITY GATEWAY" />
          </Field>
        </SpecCard>

        <SpecCard label="TEXTAREA" src="MuiTextField" column>
          <Field jp="理由" label="TEXTAREA">
            <TextField fullWidth multiline minRows={2} placeholder="What happens if nobody decides?" />
          </Field>
        </SpecCard>

        <SpecCard label="SELECT (LISTBOX)" src="MuiSelect" verdict="keep" verdictText="✅ MUI" column>
          <Field jp="部門" label="DROPDOWN">
            <TextField select fullWidth value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPTS.map(([en, jp]) => (
                <MenuItem key={en} value={en} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  {en}
                  <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, color: t.nerv.hue.greenMap }}>{jp}</Box>
                </MenuItem>
              ))}
            </TextField>
          </Field>
        </SpecCard>

        {/* priority radio chips */}
        <SpecCard label="RADIO CHIPS" src="form-01">
          <Box role="radiogroup" aria-label="priority" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {PRIORITIES.map(([jp, en, key]) => {
              const c = prColor[key as keyof typeof prColor];
              const on = priority === key;
              return (
                <Box
                  key={key}
                  component="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPriority(key)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 82,
                    cursor: 'pointer',
                    border: `1px solid ${c}`,
                    color: on ? t.nerv.hue.void : c,
                    background: on ? c : 'transparent',
                    boxShadow: on ? `0 0 9px color-mix(in srgb, ${c} 55%, transparent)` : 'none',
                    p: '6px 12px 5px',
                    borderRadius: `${t.nerv.radius.chip}px`,
                    fontWeight: on ? 700 : 400,
                    '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 2 },
                  }}
                >
                  <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 14, letterSpacing: '0.2em', textIndent: '0.2em' }}>{jp}</Box>
                  <Box component="span" sx={{ fontSize: 9, letterSpacing: '0.14em', mt: '2px', fontFamily: t.nerv.fonts.mono }}>{en}</Box>
                </Box>
              );
            })}
          </Box>
        </SpecCard>

        <SpecCard label="CHECKBOX" src="MuiCheckbox" column>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Auto-approve routine gates" />
            <FormControlLabel control={<Checkbox />} label="Voice interface" />
          </Box>
        </SpecCard>

        <SpecCard label="SWITCH" src="MuiSwitch" column>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel control={<Switch defaultChecked />} label="Push notifications" />
            <FormControlLabel control={<Switch />} label="Silent running" />
          </Box>
        </SpecCard>

        <SpecCard label="SLIDER" src="MuiSlider">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, width: '100%' }}>
            <Slider value={ram} min={1} max={32} onChange={(_, v) => setRam(v as number)} sx={{ flex: 1 }} />
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 18, color: t.nerv.hue.mintHi, minWidth: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pad2(ram)} GB</Box>
          </Box>
        </SpecCard>

        {/* number stepper */}
        <SpecCard label="NUMBER STEPPER" src="form-02">
          <Box sx={{ display: 'flex', alignItems: 'stretch', width: 150, border: `1px solid ${t.nerv.hue.greenDim}` }}>
            <Box component="button" onClick={() => setWorkers((w) => Math.max(1, w - 1))} sx={{ width: 38, background: 'rgba(242,100,0,.1)', border: 0, color: t.nerv.hue.orange, fontSize: 17, cursor: 'pointer', fontFamily: t.nerv.fonts.display, '&:hover': { background: t.nerv.hue.orange, color: t.nerv.hue.void } }}>−</Box>
            <Box component="input" readOnly value={workers} sx={{ border: 0, background: t.nerv.hue.void, color: t.nerv.hue.mint, textAlign: 'center', fontFamily: t.nerv.fonts.mono, width: '100%' }} />
            <Box component="button" onClick={() => setWorkers((w) => Math.min(16, w + 1))} sx={{ width: 38, background: 'rgba(242,100,0,.1)', border: 0, color: t.nerv.hue.orange, fontSize: 17, cursor: 'pointer', fontFamily: t.nerv.fonts.display, '&:hover': { background: t.nerv.hue.orange, color: t.nerv.hue.void } }}>+</Box>
          </Box>
        </SpecCard>

        <SpecCard label="SEGMENTED TOGGLE" src="MuiToggleButtonGroup">
          <ToggleButtonGroup exclusive value={model} onChange={(_, v) => v && setModel(v)} sx={{ width: '100%' }}>
            {['NANO', 'CORE', 'MAX'].map((m) => (
              <ToggleButton key={m} value={m} sx={{ flex: 1 }}>{m}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </SpecCard>

        {/* hazard rating */}
        <SpecCard label="RATING (HAZARD)" src="form-02" column>
          <Box role="radiogroup" aria-label="rating" sx={{ display: 'flex', gap: '5px' }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const lit = n <= rating;
              return (
                <Box key={n} component="button" role="radio" aria-checked={n === rating} aria-label={String(n)} onClick={() => setRating(n)} sx={{ width: 34, height: 28, cursor: 'pointer', border: `1px solid ${lit ? t.nerv.hue.mint : t.nerv.hue.greenDim}`, background: lit ? t.nerv.hue.mint : 'repeating-linear-gradient(-45deg, transparent 0 4px, rgba(255,255,255,.04) 4px 8px)', boxShadow: lit ? '0 0 6px color-mix(in srgb, #52F29A 50%, transparent)' : 'none', '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 2 } }} />
              );
            })}
          </Box>
        </SpecCard>

        {/* tag input — MUI Chip onDelete */}
        <SpecCard label="TAG INPUT" src="MuiChip" column>
          <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, p: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} color="success" onDelete={() => setTags((ts) => ts.filter((x) => x !== tag))} />
            ))}
          </Box>
        </SpecCard>

        {/* date segments */}
        <SpecCard label="DATE SEGMENTS" src="form-02">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['2026', '07', '18'].map((seg, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {i > 0 && <Box component="span" sx={{ color: t.nerv.hue.orange, fontSize: 16 }}>/</Box>}
                <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, background: t.nerv.hue.void, color: t.nerv.hue.mintHi, fontFamily: t.nerv.fonts.mono, fontSize: 16, textAlign: 'center', p: '7px 6px', letterSpacing: '0.14em', textShadow: '0 0 5px rgba(82,242,154,.4)', width: i === 0 ? 66 : 48 }}>{seg}</Box>
              </Box>
            ))}
          </Box>
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
