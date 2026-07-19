/**
 * 08 · ADDITIONS — the components extracted while assembling the dashboard and
 * landing screens (dashboard-0{1,2,3}, landing-0{1,2}). Every one is imported
 * from `@components`, so this section doubles as their usage example. Grouped by
 * kind under zone titles; live/stateful demos are driven locally.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import {
  Stamp,
  Brand,
  DigitalClock,
  SectionHeading,
  DossierSheet,
  GaugeCard,
  TelemetryCard,
  RadialGauge,
  SegmentBar,
  LedColumn,
  MeterBar,
  AgenticLoop,
  TaskCard,
  AgentDot,
  SinkRow,
  RoutineRow,
  ModuleCard,
  MemoryRow,
  FilterChips,
  ConsoleNav,
  YesNoGate,
} from '@components';
import { Section, SpecCard, SpecGrid, ZoneTitle } from '../components/primitives';

const OODA = [
  { jp: '観測', en: 'OBSERVE' },
  { jp: '理解', en: 'UNDERSTAND' },
  { jp: '決定', en: 'DECIDE' },
  { jp: '実行', en: 'EXECUTE' },
  { jp: '学習', en: 'LEARN' },
];

export function Additions() {
  return (
    <Section
      id="additions"
      idx="08"
      kanji="増設"
      title="ADDED COMPONENTS"
      note="Extracted from the dashboard & landing screens and folded back into @components. The boxed Stamp atom, marketing text (SectionHeading, DossierSheet, Brand), telemetry cards & meters, the agentic loop and task card, status rows, and the filter/nav/decision pieces — all reading theme.nerv.* tokens."
    >
      {/* ---------------- atoms & text ---------------- */}
      <ZoneTitle>ATOMS & TEXT</ZoneTitle>
      <SpecGrid cols={3}>
        <SpecCard label="STAMP · OUTLINE / FILL / BLINK" src="<Stamp/>">
          <Stamp tone="mint" glow>SYS:NOMINAL</Stamp>
          <Stamp tone="amber" blink>IMPL</Stamp>
          <Stamp tone="red" filled>DOWN</Stamp>
        </SpecCard>
        <SpecCard label="BRAND LOCKUP" src="<Brand/>" column>
          <Brand name="JAIRUS_OS" version="v2.4.0-STABLE" />
          <Brand name="JAIRUS_OS" version="DESIGN SYSTEM" size="sm" stackVersion />
        </SpecCard>
        <SpecCard label="DIGITAL CLOCK" src="<DigitalClock/>" column>
          <DigitalClock />
          <DigitalClock tone="mint" size={16} />
        </SpecCard>
      </SpecGrid>
      <SpecGrid cols={2}>
        <SpecCard label="SECTION HEADING" src="<SectionHeading/>" column>
          <Box sx={{ width: '100%' }}>
            <SectionHeading index="02" note="LIVE · 1HZ">SYSTEM TELEMETRY</SectionHeading>
          </Box>
        </SpecCard>
        <SpecCard label="DOSSIER SHEET" src="<DossierSheet/>" column>
          <Box sx={{ width: '100%' }}>
            <DossierSheet
              title="J-OS · CORE v2.4.0 — DOSSIER"
              watermark="PRELIMINARY"
              rows={[
                ['Doc', <><b>J-OS/DOSSIER/2024-0512</b> · OPERATOR</>],
                ['Runtime', 'Bun · 32GB · 4 agents'],
              ]}
              signature={{ left: 'OPERATOR SIGNATURE', right: 'DATE : OCT 24 202X', stamp: '◉ NOMINAL' }}
            />
          </Box>
        </SpecCard>
      </SpecGrid>

      {/* ---------------- data & meters ---------------- */}
      <ZoneTitle>DATA & METERS</ZoneTitle>
      <SpecGrid cols={3}>
        <SpecCard label="GAUGE CARD" src="<GaugeCard/>" column>
          <GaugeCard tone="blue" kind="WATCHER · 監視" name="MEDIA WATCHER" readout={<><b>45</b>% BUFFER</>} sub="POLLING: 10S">
            <SegmentBar value={45} tone="blue" segments={18} height={30} sx={{ width: '100%', mt: 1 }} />
          </GaugeCard>
        </SpecCard>
        <SpecCard label="TELEMETRY CARD" src="<TelemetryCard/>" column>
          <TelemetryCard title="◐ VAULT RETENTION" type="ARC" foot={['THRESHOLD 90%', 'STABLE']}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <RadialGauge value={98} label="HELD" size={120} animated={false} />
            </Box>
          </TelemetryCard>
        </SpecCard>
        <SpecCard label="LED COLUMN · HOT UNDER 35" src="<LedColumn/>">
          <LedColumn value={72} tone="mint" />
          <LedColumn value={26} tone="amber" hotBelow={35} />
        </SpecCard>
        <SpecCard label="METER BAR" src="<MeterBar/>" column>
          <Box sx={{ width: '100%' }}>
            <MeterBar label="CPU" value="12.4%" pct={12} sx={{ mb: 1.5 }} />
            <MeterBar label="MEMORY" value="2.1 / 32GB" pct={7} sx={{ mb: 1.5 }} />
            <MeterBar label="VAULT LOAD" value="98.4%" pct={98} warn />
          </Box>
        </SpecCard>
      </SpecGrid>

      {/* ---------------- flow ---------------- */}
      <ZoneTitle>FLOW</ZoneTitle>
      <SpecCard label="AGENTIC LOOP · SELF-CYCLING" src="<AgenticLoop/>" column flush>
        <Box sx={{ p: '20px 18px', width: '100%' }}>
          <AgenticLoop caption="ACTIVE_LOOP : AUTONOMOUS_LEARN" steps={OODA} />
        </Box>
      </SpecCard>
      <SpecCard label="TASK CARD" src="<TaskCard/>" column flush>
        <Box sx={{ p: '20px 18px', width: '100%' }}>
          <TaskCard id="TASK·882" title="OPTIMIZE LATENCY — REFACTOR POOL LOGIC" active={2} pct={62} action={<Stamp tone="mint">LIVE</Stamp>} />
        </Box>
      </SpecCard>

      {/* ---------------- status ---------------- */}
      <ZoneTitle>STATUS</ZoneTitle>
      <SpecGrid cols={3}>
        <SpecCard label="AGENT DOT" src="<AgentDot/>" column>
          <AgentDot>AGENT·01: NOMINAL</AgentDot>
          <AgentDot>AGENT·02: NOMINAL</AgentDot>
          <AgentDot busy>AGENT·03: BUSY</AgentDot>
        </SpecCard>
        <SpecCard label="MODULE CARD · PINNABLE" src="<ModuleCard/>" column flush>
          <Box sx={{ p: '18px', width: '100%' }}>
            <ModuleCard jp="工学" code="SYS·01" codeSub="ENGINEERING" title="ENGINEERING" stamp="NOMINAL" tone="mint" meta="ENG-402">
              Pipelines, tickets, and autonomous debugging — shipped through gates.
            </ModuleCard>
          </Box>
        </SpecCard>
        <SpecCard label="MEMORY ROW" src="<MemoryRow/>" column>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <MemoryRow id="MEM-2024-0512" title="Recursive feedback loop optimization" kind="pattern" />
            <MemoryRow id="MEM-2024-0495" title="Inefficient vector search in ENG-392" kind="mistake" />
          </Box>
        </SpecCard>
      </SpecGrid>
      <SpecGrid cols={2}>
        <SpecCard label="SINK ROW · OFFLINE INVERTS" src="<SinkRow/>" column>
          <Box sx={{ width: '100%' }}>
            <SinkRow name="NTFY GATEWAY" status="ACTIVE" ping={<>PING: 14MS</>} />
            <SinkRow name="SLACK INTERNAL" status="CONNECTED" ping={<>PING: 82MS</>} />
            <SinkRow name="SMTP RELAY" status="OFFLINE" detail="OFFLINE · IDLE" />
          </Box>
        </SpecCard>
        <SpecCard label="ROUTINE ROW · FILTER-DIMMED" src="<RoutineRow/>" column>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <RoutineRow id="RT·02" name="JOURNAL SYNC" kind="CRON" status="SUCCESS" onRun={() => {}} />
            <RoutineRow id="RT·03" name="SYSTEM BACKUP" kind="CRON" status="RETRIED" onRun={() => {}} />
            <RoutineRow id="RT·04" name="MEDIA PIPELINE" kind="WATCHER" status="PENDING" dim onRun={() => {}} />
          </Box>
        </SpecCard>
      </SpecGrid>

      {/* ---------------- navigation & feedback ---------------- */}
      <ZoneTitle>NAVIGATION & FEEDBACK</ZoneTitle>
      <SpecGrid cols={3}>
        <SpecCard label="FILTER CHIPS" src="<FilterChips/>" column>
          <FilterChipsDemo />
        </SpecCard>
        <SpecCard label="CONSOLE NAV · RAIL" src='variant="rail"' column flush>
          <Box sx={{ p: '14px 16px', width: '100%' }}>
            <RailNavDemo />
          </Box>
        </SpecCard>
        <SpecCard label="YES / NO GATE" src="<YesNoGate/>" column>
          <YesNoGate yesResponse="◉ PROTOCOL ACCEPTED" noResponse="✕ DEPLOY DEFERRED" />
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}

/* ---- stateful demos ---- */
function FilterChipsDemo() {
  const [v, setV] = useState('ALL');
  return <FilterChips filters={['ALL', 'CRON', 'WATCHER', 'EVENT']} value={v} onChange={setV} sx={{ flexWrap: 'wrap' }} />;
}
function RailNavDemo() {
  const [v, setV] = useState('eng');
  return (
    <ConsoleNav
      variant="rail"
      value={v}
      onChange={setV}
      ariaLabel="Demo nav"
      items={[
        { value: 'eng', jp: '工', en: 'ENGINEERING' },
        { value: 'know', jp: '記', en: 'KNOWLEDGE' },
        { value: 'auto', jp: '自', en: 'AUTOMATION' },
      ]}
    />
  );
}
