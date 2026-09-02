/**
 * 03 · FORM CONTROLS — the MUI input set styled by the theme (TextField, Select,
 * Checkbox, Switch, Slider, ToggleButtonGroup) beside the console-specific
 * controls from `@components`: FieldLabel, ChipRadioGroup, NumberStepper,
 * HazardRating, TagInput and DateSegments.
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
import { useTheme } from '@mui/material/styles';
import {
  FieldLabel,
  ChipRadioGroup,
  NumberStepper,
  HazardRating,
  TagInput,
  DateSegments,
} from '@components';
import { Section, SpecCard, SpecGrid } from '../components/primitives';
import { pad2 } from '../lib/motion';

const DEPTS = [
  ['ENGINEERING', '工学'],
  ['KNOWLEDGE', '知識'],
  ['AUTOMATION', '自動'],
  ['LEARNING', '学習'],
];

export function FormControls() {
  const t = useTheme();
  const [dept, setDept] = useState('ENGINEERING');
  const [priority, setPriority] = useState('routine');
  const [ram, setRam] = useState(8);
  const [workers, setWorkers] = useState(4);
  const [model, setModel] = useState('CORE');
  const [rating, setRating] = useState(3);
  const [tags, setTags] = useState(['CODE_REVIEW', 'VECTOR_SEARCH']);

  return (
    <Section id="forms" idx="03" kanji="申請" title="FORM CONTROLS" note="Shared field grammar: black field, dim-green idle border → mint glow on focus, checked = colorway inversion. Text, Select, Checkbox, Switch, Slider and ToggleButtonGroup are stock MUI carrying the theme overrides; the bilingual field wrapper and console controls are @components.">
      <SpecGrid cols={3}>
        <SpecCard label="TEXT INPUT" src="MuiTextField · <FieldLabel/>" column>
          <FieldLabel jp="件名" label="TEXT INPUT" htmlFor="field-text">
            <TextField fullWidth id="field-text" placeholder="API SECURITY GATEWAY" defaultValue="API SECURITY GATEWAY" />
          </FieldLabel>
        </SpecCard>

        <SpecCard label="TEXTAREA" src="MuiTextField · <FieldLabel/>" column>
          <FieldLabel jp="理由" label="TEXTAREA" htmlFor="field-textarea">
            <TextField fullWidth multiline id="field-textarea" minRows={2} placeholder="What happens if nobody decides?" />
          </FieldLabel>
        </SpecCard>

        <SpecCard label="SELECT (LISTBOX)" src="MuiSelect · <FieldLabel/>" verdict="keep" verdictText="✅ MUI" column>
          <FieldLabel jp="部門" label="DROPDOWN" htmlFor="field-dept">
            <TextField select fullWidth id="field-dept" slotProps={{ htmlInput: { 'aria-label': 'DROPDOWN · 部門' } }} value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPTS.map(([en, jp]) => (
                <MenuItem key={en} value={en} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  {en}
                  <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, color: t.nerv.hue.greenMap }}>{jp}</Box>
                </MenuItem>
              ))}
            </TextField>
          </FieldLabel>
        </SpecCard>

        {/* priority radio chips */}
        <SpecCard label="RADIO CHIPS" src="<ChipRadioGroup/>">
          <ChipRadioGroup
            ariaLabel="priority"
            value={priority}
            onChange={setPriority}
            options={[
              { value: 'routine', jp: '通常', en: 'B++', tone: 'green' },
              { value: 'elevated', jp: '優先', en: 'AA-', tone: 'amber' },
              { value: 'critical', jp: '緊急', en: 'AAA', tone: 'red' },
            ]}
          />
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
            <Slider value={ram} min={1} max={32} aria-label="MEMORY ALLOCATION" onChange={(_, v) => setRam(v as number)} sx={{ flex: 1 }} />
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 18, color: t.nerv.hue.mintHi, minWidth: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pad2(ram)} GB</Box>
          </Box>
        </SpecCard>

        {/* number stepper */}
        <SpecCard label="NUMBER STEPPER" src="<NumberStepper/>">
          <NumberStepper value={workers} onChange={setWorkers} min={1} max={16} />
        </SpecCard>

        <SpecCard label="SEGMENTED TOGGLE" src="MuiToggleButtonGroup">
          <ToggleButtonGroup exclusive value={model} onChange={(_, v) => v && setModel(v)} sx={{ width: '100%' }}>
            {['NANO', 'CORE', 'MAX'].map((m) => (
              <ToggleButton key={m} value={m} sx={{ flex: 1 }}>{m}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </SpecCard>

        {/* hazard rating */}
        <SpecCard label="RATING (HAZARD)" src="<HazardRating/>" column>
          <HazardRating value={rating} onChange={setRating} />
        </SpecCard>

        {/* tag input */}
        <SpecCard label="TAG INPUT" src="<TagInput/>" column>
          <TagInput tags={tags} onChange={setTags} />
        </SpecCard>

        {/* date segments */}
        <SpecCard label="DATE SEGMENTS" src="<DateSegments/>">
          <DateSegments segments={['2026', '07', '18']} />
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
