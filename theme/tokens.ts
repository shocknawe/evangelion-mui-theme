/**
 * Phosphor Console — raw design tokens
 *
 * Single source of truth, extracted verbatim from the design docs at the repo
 * root (DESIGN.md front-matter, design-system.md token tables, design-system.html
 * living reference). Nothing in the theme should hardcode a hex/size that isn't
 * traceable to a token here.
 *
 * The theme is dark-only — the canonical Phosphor Console: a black CRT command
 * deck where depth is border + glow + hue, never elevation. There is no light
 * mode.
 */

/* ------------------------------------------------------------------ *
 * Brand hues. `void` is the only surface.
 * These are the sampled on-screen colors from the reference GIFs.
 * ------------------------------------------------------------------ */
export const hue = {
  void: '#0A0A0A', // the only surface; also the "content" punched out of a fill
  mint: '#52F29A', // primary · nominal · success · approved (承認)
  mintHi: '#7CF4AB', // hover / peak / glow-core
  greenMap: '#3C9C6C', // secondary data · dim labels · captions
  greenDim: '#246C3C', // idle borders · tracks · disabled
  paper: '#EDF8D6', // max-brightness fill (headlines on black, clock chip face)
  orange: '#F26400', // CHROME: borders, rules, dividers, axes, section numbers
  amber: '#F49F09', // terminal / log text (bright level)
  amberDim: '#9C3C24', // terminal chrome / dotted leaders (NON-text; see terminal.dim)
  red: '#C20C0C', // danger data
  redHi: '#E2280F', // alert surfaces · strobes · error
  crimson: '#E60225', // hazard stripes only
  teal: '#0C6C80', // header double-rules · hardware bezel
  blue: '#5090D0', // pending / deliberating / in-review
  /* ---- augment / hazard accents (not sampled from the references) ---- */
  orangeHi: '#FF8A3C', // chrome-orange peak (hover; palette secondary.light)
  orangeDeep: '#C25400', // chrome-orange pressed (palette secondary.dark)
  hazardBg: '#170303', // hazard ticker field (status-marquee background)
  black: '#000', // pure black — hazard stripes & hazard fields only
  white: '#fff', // hazard-field content (corner chips on the red field)
} as const;

/* ------------------------------------------------------------------ *
 * Semantic status — the same hue means the same state everywhere.
 * ------------------------------------------------------------------ */
export const status = {
  success: hue.mint,
  info: hue.blue,
  warning: hue.amber,
  danger: hue.redHi,
} as const;

/* ------------------------------------------------------------------ *
 * Surfaces & ink — black command deck. Depth is border + glow, not tone.
 * ------------------------------------------------------------------ */
export const surfaces = {
  /** Page field. */
  bg: hue.void,
  /** Paper — flat on black; depth comes from the frame + glow, not a lift. */
  paper: hue.void,
  /** Recessed inner surface (hover, footers, terminal field). */
  surface2: 'rgba(244,159,9,.02)',
  /** Structural chrome border. */
  stroke: hue.orange,
  /** Idle / divider border. */
  stroke2: hue.greenDim,
  /** Track behind meters / progress. */
  track: hue.greenDim,
  /** Input / field background. */
  field: hue.void,
  /** Field background once focused. */
  fieldFocus: hue.void,
  /** Neutral overlay over black — meter / progress track. */
  overlay: 'rgba(255,255,255,.06)',
  /** Fainter neutral overlay — hazard hatch fill. */
  overlayFaint: 'rgba(255,255,255,.04)',
  /** Modal backdrop — dimmed to black, no blur. */
  backdrop: 'rgba(0,0,0,0.82)',
} as const;

export const ink = {
  /** Primary readable text — mint on black. */
  primary: hue.mint,
  /** Secondary text — clears AA 4.5:1 on black. */
  secondary: hue.greenMap,
  /** Disabled (exempt from AA). */
  disabled: hue.greenDim,
} as const;

/* ------------------------------------------------------------------ *
 * Terminal ink — two brightness levels = two hierarchy levels.
 * `dim` is a lighter rust (≈ AA 4.5:1) for actual secondary log text; the
 * raw `hue.amberDim` stays for NON-text chrome (dotted leaders, borders) only.
 * ------------------------------------------------------------------ */
export const terminal = {
  text: hue.amber,
  dim: '#C67A5A',
} as const;

/* ------------------------------------------------------------------ *
 * Glow — the ONLY "elevation" material. Luminance, never a cast shadow.
 * ------------------------------------------------------------------ */
export const glowFx = {
  /** Faint inset chrome-panel halo. */
  panel: 'inset 0 0 8px rgba(242,100,0,.1)',
  /** Emphasis frame halo (outer + inset). */
  panelStrong: '0 0 10px rgba(242,100,0,.4), inset 0 0 12px rgba(242,100,0,.14)',
  /** Focused-input ring — replaces the browser outline. */
  focus: '0 0 8px rgba(82,242,154,.35), inset 0 0 6px rgba(82,242,154,.12)',
  /** Mint fill glow (primary hover / active meter). */
  mint: '0 0 12px rgba(82,242,154,.4)',
} as const;

/** CRT overlay — scanline + vignette on `body::before`. */
export const crt =
  'repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px), ' +
  'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)';

/* ------------------------------------------------------------------ *
 * Shape — radius 0 by default; chips/segments get 2–4px; heroes chamfer.
 * ------------------------------------------------------------------ */
export const radii = {
  none: 0,
  chip: 2, // stamps, chips, badges
  seg: 4, // meter / gauge segments, small tiles
  chamfer: 16, // hero-panel corner cut (via clip-path, not border-radius)
} as const;

/* ------------------------------------------------------------------ *
 * Spacing — 4 / 8 / 16 / 24 / 32 base rhythm (px).
 * ------------------------------------------------------------------ */
export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/* ------------------------------------------------------------------ *
 * Typography — condensed display + monospace data + Mincho JP graphic.
 * System stacks (self-contained, no network). Web-font upgrade targets in
 * comments: Oswald / Share Tech Mono / Shippori Mincho B1.
 * ------------------------------------------------------------------ */
export const fonts = {
  /** Display — condensed grotesque, ALL CAPS. Target: Oswald / Archivo Narrow. */
  display: '"Arial Narrow", "Avenir Next Condensed", "Helvetica Neue", Arial, sans-serif',
  /** Body / data / UI. Target: Share Tech Mono / VT323. */
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  /** JP display graphic. Target: Shippori Mincho B1 (≈ Matisse EB). */
  jp: '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif',
} as const;

/** Fluid hero size — the single sanctioned clamp() exception. */
export const fluid = {
  hero: 'clamp(1.5rem, 4vw, 3.4rem)',
} as const;

/* ------------------------------------------------------------------ *
 * Motion — mechanical only. Linear or steps(); never eased/spring/bounce.
 * ------------------------------------------------------------------ */
export const motion = {
  /** Default timing function — no easing curve. */
  linear: 'linear',
  /** Stepped timing for segmented / discrete transitions. */
  step: 'steps(4, jump-none)',
  /** Hard on/off snap for state changes. */
  snap: 'steps(1, jump-none)',
  durations: {
    snap: 80, // state snap
    fast: 120, // hover / focus
    blink: 1000, // 1 Hz blink loop
    complex: 160, // MUI "complex" structural transition
    slide: 300, // continuous meter fill
  },
} as const;

/* ------------------------------------------------------------------ *
 * Z-index — semantic layers (dropdown → sticky → backdrop → modal → …).
 * Mirrors MUI's portal stack so custom layers slot in cleanly.
 * ------------------------------------------------------------------ */
export const layers = {
  base: 0,
  crt: 1, // the scanline overlay (pointer-events:none)
  raised: 2,
  dropdown: 1000,
  sticky: 1100,
  drawer: 1200,
  backdrop: 1290,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const;
