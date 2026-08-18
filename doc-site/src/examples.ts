/**
 * Live-playground seed snippets, one per house component (keyed by slug).
 *
 * Each value is a **template literal string** containing the source of a demo,
 * compiled at runtime with sucrase (`transforms: ['jsx', 'typescript']`,
 * classic JSX runtime — no `import`/`export`, just an expression or a function
 * body). Two shapes are accepted:
 *
 *   1. A bare JSX expression, e.g. `<Stamp tone="mint">OK</Stamp>` — for
 *      components that render fine uncontrolled or with static props.
 *   2. A function body ending in `return (…);` — required whenever the demo
 *      needs `useState` (or another hook) to drive a controlled component
 *      (ChipRadioGroup, NumberStepper, HazardRating, TagInput, ConsoleNav,
 *      FilterChips, GateRow, RoutineRow, ModuleCard, AgentCard,
 *      GateDecisionDialog, ApprovalBar, …) so the preview is actually
 *      clickable, not just a frozen frame.
 *
 * Every snippet runs in a fixed scope only: the React hooks `useState`,
 * `useEffect`, `useMemo`, `useRef` (+ `React`); a handful of stock MUI
 * components (`Box`, `Stack`, `Button`, `Typography`, `TextField`,
 * `OutlinedInput`, `Select`, `MenuItem`, `Checkbox`, `Radio`, `RadioGroup`,
 * `FormControlLabel`, `Switch`, `Slider`, `Chip`, `Divider`, `IconButton`,
 * `Alert`, `Paper`, `LinearProgress`); and every named export of the Phosphor
 * Console component library (`Stamp`, `ConsoleFrame`, …). There are no icon
 * components in scope — glyphs (◈ ◉ ▸ ◐ ✕) stand in for icons. Do not
 * reference anything outside this scope, and do not invent props — every prop
 * used here traces to the `<Name>Props` interface in `components/*.tsx`.
 *
 * Content follows the design grammar: color is state (mint nominal · orange
 * chrome-only · blue pending · amber caution · red critical), UI chrome is
 * ALL CAPS, data is monospace, and ids/metadata use the house idiom
 * (`GATE·04`, `AGENT·ORION`, `KEY:VALUE` blocks, bilingual kanji + caption).
 */
export const examples: Record<string, string> = {
  /* ------------------------------------------------------------- Atoms */
  stamp: `<Stack direction="row" spacing={1.5} flexWrap="wrap">
  <Stamp tone="mint" glow>SYS:NOMINAL</Stamp>
  <Stamp tone="amber" blink>IMPL</Stamp>
  <Stamp tone="red" filled>DOWN</Stamp>
</Stack>`,

  /* -------------------------------------------------------------- Text */
  'bilingual-label': `<Stack spacing={2}>
  <BilingualLabel jp="内部" en="INTERNAL" tone="mint" />
  <BilingualLabel jp="警戒" en="CAUTION" tone="amber" captionTone="amber" size={30} layout="column" />
</Stack>`,

  'metadata-block': `<MetadataBlock entries={{ CODE: '0771', FILE: 'GATE_INTAKE', EXTENTION: '.LOG', EX_MODE: 'MANUAL' }} />`,

  'section-divider': `<SectionDivider index="01" jp="個体" title="IDENTITY" />`,

  'field-label': `<FieldLabel jp="件名" label="TEXT INPUT">
  <TextField fullWidth size="small" placeholder="AGENT·ORION" />
</FieldLabel>`,

  'section-heading': `<SectionHeading index="02" note="LIVE · 1HZ">SYSTEM TELEMETRY</SectionHeading>`,

  'dossier-sheet': `<DossierSheet
  title="MAGI · CORE v2.4.0 — OPERATOR DOSSIER"
  rows={[
    ['CODE', '0771'],
    ['STATUS', <b>承認 APPROVED</b>],
    ['PRIORITY', 'AAA'],
  ]}
  watermark="PRELIMINARY"
  signature={{ left: 'ISSUED BY: MAGI·01', right: 'DATE: 2026-08-18', stamp: '認可 CLEARED' }}
/>`,

  /* ------------------------------------------------------- Layout & shell */
  'console-frame': `const [tab, setTab] = useState('eng');
return (
  <Box sx={{ width: '100%', height: 420 }}>
    <ConsoleFrame
      header={<Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}><Typography variant="stamp">NERV · MAGI</Typography></Box>}
      sidebar={
        <Box sx={{ p: 1.5 }}>
          <ConsoleNav
            variant="rail"
            value={tab}
            onChange={setTab}
            items={[
              { value: 'eng', jp: '工学', en: 'ENGINEERING' },
              { value: 'ops', jp: '運用', en: 'OPERATIONS' },
            ]}
          />
        </Box>
      }
      rail={<Box sx={{ p: 1.5 }}><Stat label="NODES" value="2,482" tone="mint" /></Box>}
      sidebarWidth={140}
      railWidth={140}
      headerHeight={48}
    >
      <Box sx={{ p: 1.5 }}><Typography variant="terminal">MAIN COLUMN · {tab.toUpperCase()}</Typography></Box>
    </ConsoleFrame>
  </Box>
);`,

  'zone-title': `<ZoneTitle aside="04 DUE">TASK QUEUE</ZoneTitle>`,

  monogram: `<Stack direction="row" spacing={2}>
  <Monogram jp="磁" label="MAGI" tone="orange" />
  <Monogram jp="統制" label="COMMAND" tone="mint" size={20} />
</Stack>`,

  stat: `<Stack direction="row" spacing={3}>
  <Stat label="UPTIME" value="128D" tone="mint" />
  <Stat label="LOAD" value="62%" tone="amber" />
</Stack>`,

  'gauge-card': `<Box sx={{ width: 200 }}>
  <GaugeCard tone="blue" kind="WATCHER · 監視" name="MEDIA WATCHER" readout={<><b>45</b>% BUFFER</>} sub="POLLING: 10S">
    <SegmentBar value={45} tone="blue" height={36} />
  </GaugeCard>
</Box>`,

  'telemetry-card': `<Box sx={{ width: 240 }}>
  <TelemetryCard title="◐ VAULT RETENTION" type="ARC" foot={['THRESHOLD 90%', 'STABLE']}>
    <RadialGauge value={98} label="HELD" size={120} />
  </TelemetryCard>
</Box>`,

  /* -------------------------------------------------------------- Flow */
  'step-flow': `<StepFlow
  active={2}
  steps={[
    { short: 'OBS', label: 'OBSERVE' },
    { short: 'UND', label: 'UNDERSTAND' },
    { short: 'DEC', label: 'DECIDE' },
    { short: 'EXE', label: 'EXECUTE' },
    { short: 'LRN', label: 'LEARN' },
  ]}
/>`,

  'agentic-loop': `<AgenticLoop
  caption="ACTIVE_LOOP : AUTONOMOUS_LEARN"
  steps={[
    { jp: '観測', en: 'OBSERVE' },
    { jp: '理解', en: 'UNDERSTAND' },
    { jp: '裁定', en: 'DECIDE' },
    { jp: '実行', en: 'EXECUTE' },
  ]}
/>`,

  'task-card': `<TaskCard
  id="TASK·882"
  title="RECALIBRATE VEGA·1"
  active={2}
  pct={62}
  action={<Stamp tone="blue" blink>IN_PROGRESS</Stamp>}
/>`,

  /* ------------------------------------------------------------ Status */
  'status-legend': `<StatusLegend items={[
  { jp: '正常', en: 'NOMINAL', tone: 'mint' },
  { jp: '警戒', en: 'CAUTION', tone: 'amber' },
  { jp: '阻止', en: 'BLOCKED', tone: 'red', filled: true },
]} />`,

  roster: `<Roster columns={4} units={[
  { id: 'UNIT-07', status: 'NOMINAL' },
  { id: 'LYRA·4', status: 'CAUTION' },
  { id: 'CYGNUS·7', status: 'STANDBY' },
  { id: 'AQUILA·11', status: 'OFFLINE' },
]} />`,

  'stat-tile': `<Box sx={{ width: 220 }}>
  <StatTile label="MEMORY NODES" value="2,482" footer="98.4% RETENTION · STABLE" tone="mint" />
</Box>`,

  'rail-item': `<Stack spacing={0}>
  <RailItem title="REVIEW GATE·04" sub="DECISION QUEUE" when="09:00" />
  <RailItem title="SYNC VEGA·1 LOGS" done />
</Stack>`,

  'gate-row': `const [verdict, setVerdict] = useState(null);
return (
  <GateRow
    id="GATE·04"
    title="DEPLOY V2.4.0"
    sub="OWNER: ORION"
    priority="critical"
    verdict={verdict}
    onReview={() => setVerdict('approve')}
  />
);`,

  'agent-card': `const [selected, setSelected] = useState(false);
return (
  <Box sx={{ width: 220 }}>
    <AgentCard name="AGENT·ORION" status="ACTIVE" task="RECALIBRATE VEGA·1" selected={selected} onSelect={() => setSelected((s) => !s)} />
  </Box>
);`,

  'recall-note': `<RecallNote id="DECISION_LOG_32" tone="teal">
  PUMP·B RETIRED AFTER THIRD VIBRATION FLAG — REPLACE, DO NOT RECALIBRATE.
</RecallNote>`,

  'sink-row': `<Stack spacing={0}>
  <SinkRow name="NTFY GATEWAY" status="ACTIVE" ping="42MS" />
  <SinkRow name="SLACK WEBHOOK" status="OFFLINE" />
</Stack>`,

  'routine-row': `const [status, setStatus] = useState('PENDING');
return <RoutineRow id="RT·01" name="NIGHTLY REVIEW" kind="CRON" status={status} onRun={() => setStatus('SUCCESS')} />;`,

  'module-card': `const [selected, setSelected] = useState(false);
return (
  <Box sx={{ width: 240 }}>
    <ModuleCard
      jp="監"
      code="SYS·01"
      codeSub="WATCHER"
      title="MEDIA WATCHER"
      stamp="NOMINAL"
      meta="2,482 NODES"
      tone="mint"
      selected={selected}
      onSelect={() => setSelected((s) => !s)}
    >
      Polls the intake queue and flags anomalies before they reach the gate.
    </ModuleCard>
  </Box>
);`,

  'memory-row': `<Stack spacing={1}>
  <MemoryRow id="MEM-2024-0512" title="RETRY POLICY REVISED AFTER GATE·04 FAILURE" kind="learning" />
  <MemoryRow id="MEM-2024-0498" title="PUMP·B SECONDARY DRIVE FLAGGED" kind="mistake" />
</Stack>`,

  'agent-dot': `<Stack direction="row" spacing={2}>
  <AgentDot>AGENT·01: NOMINAL</AgentDot>
  <AgentDot busy>AGENT·02: BUSY</AgentDot>
</Stack>`,

  /* ------------------------------------------------------------ Inputs */
  'chip-radio-group': `const [p, setP] = useState('routine');
return (
  <ChipRadioGroup
    value={p}
    onChange={setP}
    ariaLabel="priority"
    options={[
      { value: 'routine', jp: '通常', en: 'B++', tone: 'green' },
      { value: 'elevated', jp: '注意', en: 'AA-', tone: 'amber' },
      { value: 'critical', jp: '緊急', en: 'AAA', tone: 'red' },
    ]}
  />
);`,

  'number-stepper': `const [n, setN] = useState(4);
return <NumberStepper value={n} onChange={setN} min={1} max={16} />;`,

  'hazard-rating': `const [v, setV] = useState(3);
return <HazardRating value={v} onChange={setV} max={5} />;`,

  'tag-input': `const [tags, setTags] = useState(['ANOMALY', 'GATE·04']);
return <TagInput tags={tags} onChange={setTags} />;`,

  'date-segments': `<DateSegments segments={['2026', '08', '18']} />`,

  /* --------------------------------------------------------- Navigation */
  'filter-chips': `const [scope, setScope] = useState('ALL');
return <FilterChips filters={['ALL', 'DECISION', 'PATTERN', 'MISTAKE']} value={scope} onChange={setScope} ariaLabel="memory scope" />;`,

  'filter-rail': `<FilterRail
  filters={['ALL', 'CRON', 'WATCHER']}
  allValue="ALL"
  rows={[
    { id: 'RT·01', name: 'NIGHTLY REVIEW', kind: 'CRON' },
    { id: 'RT·02', name: 'MEDIA WATCHER', kind: 'WATCHER' },
  ]}
/>`,

  'wiki-link': `<Typography variant="terminal">
  SEE <WikiLink href="#">[[GATE·04 PROTOCOL]]</WikiLink> FOR ESCALATION RULES.
</Typography>`,

  'console-nav': `const [tab, setTab] = useState('eng');
return (
  <ConsoleNav
    value={tab}
    onChange={setTab}
    ariaLabel="sections"
    items={[
      { value: 'eng', jp: '工学', en: 'ENGINEERING' },
      { value: 'ops', jp: '運用', en: 'OPERATIONS' },
    ]}
  />
);`,

  'site-header': `<Box sx={{ width: '100%' }}>
  <SiteHeader
    name="JAIRUS_OS"
    version="V2.4.0"
    links={[{ label: 'SYSTEMS', href: '#' }, { label: 'TELEMETRY', href: '#' }]}
    actions={<Stamp tone="mint" glow>LIVE</Stamp>}
  />
</Box>`,

  brand: `<Brand name="JAIRUS_OS" version="V2.4.0" />`,

  /* ----------------------------------------------------------- Feedback */
  'hazard-prompt': `<HazardPrompt jp="裁定" en="DECIDE" onDecide={() => {}} height={150} />`,

  'gate-decision-dialog': `const [open, setOpen] = useState(false);
return (
  <>
    <Button variant="contained" onClick={() => setOpen(true)}>OPEN GATE</Button>
    <GateDecisionDialog open={open} item="GATE·04" onDecide={() => setOpen(false)} onClose={() => setOpen(false)} />
  </>
);`,

  'approval-bar': `const [verdict, setVerdict] = useState(null);
return (
  <ApprovalBar
    item="DEPLOY V2.4.0 TO PROD"
    verdict={verdict}
    onApprove={() => setVerdict({ ok: true, text: '承認 APPROVED' })}
    onDeny={() => setVerdict({ ok: false, text: '否認 DENIED' })}
  />
);`,

  'yes-no-gate': `<YesNoGate yesResponse="◉ ACCEPTED" noResponse="✕ DEFERRED" onDecide={() => {}} />`,

  /* ----------------------------------------------------------- Data viz */
  'segmented-meter': `<SegmentedMeter />`,

  'radial-gauge': `<RadialGauge value={72} label="ARMED" />`,

  'bar-column-gauge': `<BarColumnGauge />`,

  'progress-meter': `<ProgressMeter value={62} threshold={{ pct: 90, label: 'GATE' }} readout="ETA 00:04:12" />`,

  'health-columns': `<HealthColumns />`,

  'segment-bar': `<Stack direction="row" alignItems="center" spacing={1.5}>
  <Typography variant="terminal">PROGRESS</Typography>
  <SegmentBar value={62} tone="mint" />
</Stack>`,

  'led-column': `<Stack direction="row" spacing={2}>
  <LedColumn value={72} tone="amber" />
  <LedColumn value={18} tone="mint" hotBelow={25} />
</Stack>`,

  'meter-bar': `<Stack spacing={1.5} sx={{ width: 220 }}>
  <MeterBar label="CPU" value="12.4%" pct={12} tone="mint" />
  <MeterBar label="MEM" value="88%" pct={88} warn />
</Stack>`,

  terminal: `<Terminal
  title="STDOUT // DIAGNOSTIC"
  rows={[
    { k: 'line', t: 'KESTREL·4 DIAGNOSTIC MODULE REV 4.02' },
    { k: 'chk', l: 'CONTROL BUS LINK', ok: true },
    { k: 'chk', l: 'PUMP·B SECONDARY DRIVE', ok: false },
    { k: 'sum', t: '2 CHECKS · 1 PASS · 1 FLAGGED' },
  ]}
/>`,

  'log-console': `<Box sx={{ height: 200 }}>
  <LogConsole
    title="STDOUT // AGENT·ORION"
    status="TAILING"
    rows={[
      { ts: '14:02:51', tag: 'info', msg: 'GATE·04 QUEUED FOR REVIEW' },
      { ts: '14:02:55', tag: 'gate', msg: 'AWAITING APPROVAL' },
      { ts: '14:03:02', tag: 'warn', msg: 'RETRY LIMIT NEAR' },
    ]}
    prompt="AUTOMATION>"
  />
</Box>`,

  'seven-seg-clock': `<SevenSegClock variant="both" />`,

  'digital-clock': `<DigitalClock tone="mint" size={24} />`,

  marquee: `<Marquee items={['V2.4.0-STABLE DEPLOYED', '38 LISTENERS UP', 'NO ANOMALIES']} />`,

  'line-chart': `<LineChart label="RESONANCE" status="STABLE" height={150} />`,

  waveform: `<Waveform label="INFERENCE FIELD" caption="共振 / RESONANCE" height={96} />`,

  'scan-lattice': `<ScanLattice height={110} nodeLabel="NODE·0x512" />`,
};
