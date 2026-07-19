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
export { type Tone, toneHue } from './util';
export { useReducedMotion, pad2 } from './hooks';

// Text — bimodal / bilingual pairings
export { BilingualLabel, MetadataBlock, SectionDivider, FieldLabel } from './text';
export type { BilingualLabelProps, MetadataBlockProps, SectionDividerProps, FieldLabelProps } from './text';

// Status
export { StatusLegend, Roster, StatTile } from './status';
export type { StatusLegendProps, LegendItem, RosterProps, RosterUnit, RosterStatus, StatTileProps } from './status';

// Console form controls
export { ChipRadioGroup, NumberStepper, HazardRating, TagInput, DateSegments } from './inputs';
export type {
  ChipRadioGroupProps, ChipRadioOption, NumberStepperProps, HazardRatingProps, TagInputProps, DateSegmentsProps,
} from './inputs';

// Navigation
export { FilterRail, WikiLink } from './navigation';
export type { FilterRailProps, FilterRow, WikiLinkProps } from './navigation';

// Feedback
export { HazardPrompt } from './feedback';
export type { HazardPromptProps } from './feedback';

// Data-viz — meters & gauges
export { SegmentedMeter, RadialGauge, BarColumnGauge } from './meters';
export type { SegmentedMeterProps, RadialGaugeProps, BarColumnGaugeProps } from './meters';

// Data-viz — terminal, clock, marquee, charts
export { Terminal } from './terminal';
export type { TerminalProps, TerminalRow } from './terminal';
export { SevenSegClock } from './clock';
export type { SevenSegClockProps } from './clock';
export { Marquee } from './marquee';
export type { MarqueeProps } from './marquee';
export { LineChart, Waveform, ScanLattice } from './charts';
export type { LineChartProps, WaveformProps, ScanLatticeProps } from './charts';
