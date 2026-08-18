/**
 * PATTERNS / FORMS — a complete, working, stateful NERV intake/dispatch form.
 * The numbered console form is a real sequence, so SectionDivider's index chip
 * is correct here (unlike the page's own DocSection facets, which stay
 * unnumbered). Demonstrates FieldLabel-wrapped stock inputs, the console-
 * specific controls, a live MetadataBlock summary, and an ApprovalBar gate.
 */
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  SectionDivider,
  FieldLabel,
  MetadataBlock,
  ChipRadioGroup,
  NumberStepper,
  HazardRating,
  TagInput,
  DateSegments,
  ApprovalBar,
  pad2,
} from '@components';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

const DEPARTMENTS: Array<[string, string]> = [
  ['ENGINEERING', '工学'],
  ['OPERATIONS', '運用'],
  ['INTELLIGENCE', '諜報'],
];

export default function FormsPattern() {
  const [requester, setRequester] = useState('');
  const [callsign, setCallsign] = useState('UNIT-731');
  const [dept, setDept] = useState('ENGINEERING');
  const [priority, setPriority] = useState('routine');
  const [severity, setSeverity] = useState(2);
  const [urgent, setUrgent] = useState(false);
  const [personnel, setPersonnel] = useState(4);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [tags, setTags] = useState(['SECTOR_7', 'RECON']);
  const [verdict, setVerdict] = useState<{ ok: boolean; text: string } | null>(null);

  const requesterError = requester.trim().length === 0;

  const logged = useMemo(() => {
    const d = new Date();
    return [String(d.getFullYear()), pad2(d.getMonth() + 1), pad2(d.getDate())];
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="PATTERN"
        title="FORMS"
        lede="A NERV-flavoured intake/dispatch form assembled from the field grammar: SectionDivider heads each numbered part, FieldLabel captions every stock input, the console-specific controls handle what MUI has no primitive for, and a live MetadataBlock plus an ApprovalBar gate close it out."
      />

      <DocSection id="overview" title="THE FORM">
        <Prose>
          Four numbered sections make up one dispatch request — identity, classification, resources, and the
          confirmation gate. Each below is built with the same field grammar and shares one state object, so the
          MetadataBlock summary and the ApprovalBar item line update live as you fill it in.
        </Prose>
      </DocSection>

      <DocSection id="identity" title="IDENTITY">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <SectionDivider index="01" jp="個体" title="IDENTITY" />
        </Box>
        <DemoStage column>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FieldLabel jp="申請者" label="REQUESTER NAME" sx={{ maxWidth: 260 }}>
              <TextField
                fullWidth
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                error={requesterError}
                helperText={requesterError ? 'REQUIRED — ENTER REQUESTER NAME' : ' '}
                placeholder="J. ARAGON"
              />
            </FieldLabel>
            <FieldLabel jp="呼称" label="CALLSIGN" sx={{ maxWidth: 260 }}>
              <TextField fullWidth value={callsign} onChange={(e) => setCallsign(e.target.value)} />
            </FieldLabel>
          </Box>
        </DemoStage>
        <CodeBlock
          filename="Identity.tsx"
          code={`<SectionDivider index="01" jp="個体" title="IDENTITY" />

<FieldLabel jp="申請者" label="REQUESTER NAME">
  <TextField
    fullWidth
    value={requester}
    onChange={(e) => setRequester(e.target.value)}
    error={requester.trim().length === 0}
    helperText={requester.trim().length === 0 ? 'REQUIRED — ENTER REQUESTER NAME' : ' '}
  />
</FieldLabel>`}
        />
      </DocSection>

      <DocSection id="classification" title="CLASSIFICATION">
        <Box sx={{ mb: 2 }}>
          <SectionDivider index="02" jp="分類" title="CLASSIFICATION" />
        </Box>
        <DemoStage column>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <FieldLabel jp="部門" label="DEPARTMENT" sx={{ maxWidth: 200 }}>
              <TextField select fullWidth value={dept} onChange={(e) => setDept(e.target.value)}>
                {DEPARTMENTS.map(([en, jp]) => (
                  <MenuItem key={en} value={en}>
                    {en} ({jp})
                  </MenuItem>
                ))}
              </TextField>
            </FieldLabel>
            <FieldLabel jp="優先度" label="PRIORITY">
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
            </FieldLabel>
            <FieldLabel jp="危険度" label="SEVERITY">
              <HazardRating value={severity} onChange={setSeverity} />
            </FieldLabel>
            <FieldLabel jp="緊急" label="ESCALATE">
              <FormControlLabel
                control={<Checkbox checked={urgent} onChange={(_, v) => setUrgent(v)} />}
                label="Notify command immediately"
              />
            </FieldLabel>
          </Box>
        </DemoStage>
        <CodeBlock
          filename="Classification.tsx"
          code={`<SectionDivider index="02" jp="分類" title="CLASSIFICATION" />

<FieldLabel jp="優先度" label="PRIORITY">
  <ChipRadioGroup
    ariaLabel="priority"
    value={priority}
    onChange={setPriority}
    options={[
      { value: 'routine', jp: '通常', en: 'B++', tone: 'green' },
      { value: 'critical', jp: '緊急', en: 'AAA', tone: 'red' },
    ]}
  />
</FieldLabel>
<FieldLabel jp="危険度" label="SEVERITY">
  <HazardRating value={severity} onChange={setSeverity} />
</FieldLabel>
<FieldLabel jp="緊急" label="ESCALATE">
  <FormControlLabel control={<Checkbox checked={urgent} onChange={(_, v) => setUrgent(v)} />} label="Notify command immediately" />
</FieldLabel>`}
        />
      </DocSection>

      <DocSection id="resources" title="RESOURCES">
        <Box sx={{ mb: 2 }}>
          <SectionDivider index="03" jp="資源" title="RESOURCES" />
        </Box>
        <DemoStage column>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <FieldLabel jp="要員" label="PERSONNEL">
              <NumberStepper value={personnel} onChange={setPersonnel} min={1} max={20} />
            </FieldLabel>
            <FieldLabel jp="自動" label="AUTO-DISPATCH">
              <FormControlLabel
                control={<Switch checked={autoDispatch} onChange={(_, v) => setAutoDispatch(v)} />}
                label="Dispatch on approval"
              />
            </FieldLabel>
            <FieldLabel jp="標識" label="TAGS" sx={{ maxWidth: 280 }}>
              <TagInput tags={tags} onChange={setTags} />
            </FieldLabel>
            <FieldLabel jp="記録日" label="LOGGED">
              <DateSegments segments={logged} />
            </FieldLabel>
          </Box>
        </DemoStage>
        <CodeBlock
          filename="Resources.tsx"
          code={`<SectionDivider index="03" jp="資源" title="RESOURCES" />

<FieldLabel jp="要員" label="PERSONNEL">
  <NumberStepper value={personnel} onChange={setPersonnel} min={1} max={20} />
</FieldLabel>
<FieldLabel jp="標識" label="TAGS">
  <TagInput tags={tags} onChange={setTags} />
</FieldLabel>
<FieldLabel jp="記録日" label="LOGGED">
  <DateSegments segments={[year, month, day]} />
</FieldLabel>`}
        />
      </DocSection>

      <DocSection id="confirmation" title="CONFIRMATION">
        <Box sx={{ mb: 2 }}>
          <SectionDivider index="04" jp="確認" title="CONFIRMATION" />
        </Box>
        <DemoStage column>
          <MetadataBlock
            entries={{
              REQUESTER: requester.trim() || '—',
              CALLSIGN: callsign || '—',
              DEPT: dept,
              PRIORITY: priority.toUpperCase(),
              SEVERITY: String(severity),
              ESCALATE: urgent ? 'YES' : 'NO',
              PERSONNEL: String(personnel),
              TAGS: tags.join(', ') || '—',
              LOGGED: logged.join('/'),
            }}
          />
          <ApprovalBar
            label="PENDING DISPATCH ·"
            item={`${callsign || 'UNNAMED'} — ${dept}`}
            onApprove={() => setVerdict({ ok: true, text: '✓ DISPATCHED' })}
            onDeny={() => setVerdict({ ok: false, text: '✕ REJECTED' })}
            verdict={verdict}
          />
        </DemoStage>
        <CodeBlock
          filename="Confirmation.tsx"
          code={`<SectionDivider index="04" jp="確認" title="CONFIRMATION" />

<MetadataBlock entries={{ REQUESTER: requester, DEPT: dept, PRIORITY: priority.toUpperCase() }} />

<ApprovalBar
  label="PENDING DISPATCH ·"
  item={\`\${callsign} — \${dept}\`}
  onApprove={() => setVerdict({ ok: true, text: '✓ DISPATCHED' })}
  onDeny={() => setVerdict({ ok: false, text: '✕ REJECTED' })}
  verdict={verdict}
/>`}
        />
      </DocSection>

      <DocSection id="rules" title="FORM RULES">
        <Guidance
          items={[
            'Number the sections — a form is a real sequence; SectionDivider carries the index chip.',
            'Every field gets a bilingual FieldLabel caption, even the console-specific controls.',
            "Checked/selected states always use the hue inversion — filled means active, never a color swap alone.",
            'Summarize live state in a MetadataBlock so the operator can verify before the gate.',
            'Close every form with a human gate — ApprovalBar or YesNoGate — never a bare submit button.',
          ]}
        />
      </DocSection>

      <DocSection id="bans" title="BANNED PATTERNS">
        <Guidance
          tone="red"
          items={[
            'A restyled Chip standing in for FieldLabel/ChipRadioGroup captions.',
            'Orange used as a selected-state fill — orange is chrome only, never a data value.',
            'An eased or spring transition on validation error — snap the border color, do not animate it.',
            'A submit button with no gate — every dispatch needs an explicit approve/deny response.',
          ]}
        />
      </DocSection>
    </>
  );
}
