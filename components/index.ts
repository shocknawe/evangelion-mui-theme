/**
 * Phosphor Console — reusable component library.
 *
 * Console-specific React components (NERV/MAGI tactical UI) that MUI has no
 * direct equivalent for, built to pair with the theme in `../theme`. Every
 * component reads `theme.nerv.*` tokens — nothing is hardcoded off-token — so a
 * consumer gets the design language for free:
 *
 *   import { ThemeProvider, CssBaseline } from '@mui/material';
 *   import { theme } from '../theme';
 *   import { StatusLegend, SegmentedMeter } from '../components';
 *
 *   <ThemeProvider theme={theme} defaultMode="dark">
 *     <CssBaseline />
 *     <StatusLegend items={[{ jp: '正常', en: 'NOMINAL', tone: 'mint' }]} />
 *     <SegmentedMeter />
 *   </ThemeProvider>
 *
 * Stock inputs, alerts, dialogs, tabs, lists, etc. are styled by the theme's
 * overrides directly — use them straight from `@mui/material`.
 */

// Shared vocabulary
export { type Tone, type SlotsOf, toneHue } from './util';
export { useReducedMotion, pad2 } from './hooks';

// Text — bimodal / bilingual pairings
export { BilingualLabel, MetadataBlock, SectionDivider, FieldLabel, SectionHeading, DossierSheet } from './text';
export type { BilingualLabelProps, MetadataBlockProps, SectionDividerProps, FieldLabelProps, SectionHeadingProps, DossierSheetProps } from './text';

// Atoms — the boxed stamp
export { Stamp } from './chips';
export type { StampProps } from './chips';

// Layout & structure — the command shell and its scaffolding
export { ConsoleFrame, ZoneTitle, Monogram, Stat, GaugeCard, TelemetryCard } from './layout';
export type { ConsoleFrameProps, ZoneTitleProps, MonogramProps, StatProps, GaugeCardProps, TelemetryCardProps } from './layout';

// Flow — step sequences
export { StepFlow, AgenticLoop, TaskCard } from './flow';
export type { StepFlowProps, StepFlowStep, AgenticLoopProps, AgenticLoopStep, TaskCardProps } from './flow';

// Status
export { StatusLegend, Roster, StatTile, RailItem, GateRow, AgentCard, RecallNote, SinkRow, RoutineRow, ModuleCard, MemoryRow, AgentDot } from './status';
export type {
  StatusLegendProps, LegendItem, RosterProps, RosterUnit, RosterStatus, StatTileProps,
  RailItemProps, GateRowProps, GateRowSlotProps, GatePriority, GateVerdict, AgentCardProps, AgentStatus,
  RecallNoteProps, SinkRowProps, SinkStatus, RoutineRowProps, RoutineRowSlotProps, RowActionProps,
  RoutineStatus, ModuleCardProps, MemoryRowProps, MemoryKind, AgentDotProps,
} from './status';

// Console form controls
export { ChipRadioGroup, NumberStepper, HazardRating, TagInput, DateSegments } from './inputs';
export type {
  ChipRadioGroupProps, ChipRadioOption, NumberStepperProps, HazardRatingProps, TagInputProps, TagInputSlotProps, TagInputTagProps, DateSegmentsProps,
} from './inputs';

// Navigation
export { FilterChips, FilterRail, WikiLink, ConsoleNav, SiteHeader, Brand } from './navigation';
export type {
  FilterChipsProps, FilterRailProps, FilterRailSlotProps, FilterRailRowProps, FilterRow, WikiLinkProps,
  ConsoleNavProps, ConsoleNavItem, SiteHeaderProps, SiteHeaderSlotProps, SiteHeaderBrandProps, SiteHeaderLink, BrandProps,
} from './navigation';

// Feedback
export { HazardPrompt, GateDecisionDialog, ApprovalBar, YesNoGate } from './feedback';
export type { HazardPromptProps, GateDecisionDialogProps, GateDecision, ApprovalBarProps, YesNoGateProps } from './feedback';

// Data-viz — meters & gauges
export { SegmentedMeter, RadialGauge, BarColumnGauge, ProgressMeter, HealthColumns, SegmentBar, LedColumn, MeterBar } from './meters';
export type {
  SegmentedMeterProps, RadialGaugeProps, RadialGaugeSlotProps, RadialGaugeTrackProps, RadialGaugeReadoutProps,
  BarColumnGaugeProps, ProgressMeterProps, HealthColumnsProps, SegmentBarProps, LedColumnProps, MeterBarProps,
} from './meters';

// Data-viz — terminal, clock, marquee, charts
export { Terminal, LogConsole } from './terminal';
export type { TerminalProps, TerminalRow, LogConsoleProps, LogRow, LogTag } from './terminal';
export { SevenSegClock, DigitalClock } from './clock';
export type { SevenSegClockProps, DigitalClockProps } from './clock';
export { Marquee } from './marquee';
export type { MarqueeProps } from './marquee';
export { LineChart, Waveform, ScanLattice } from './charts';
export type { LineChartProps, WaveformProps, ScanLatticeProps } from './charts';
