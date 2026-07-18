/**
 * TypeScript module augmentation for the Phosphor Console theme.
 *
 * Scheme-varying custom tokens (surfaces, ink, glow, CRT, terminal) live on
 * `palette.nerv` so `cssVariables` emits a light + dark value per token that
 * auto-switches with the color scheme. Scheme-invariant tokens (hues, radii,
 * spacing, fonts, motion, z-layers, helpers) live on the top-level `nerv` key.
 */
import type { CSSProperties } from 'react';

/** Scheme-varying tokens — one CSS var per scheme. */
interface NervPaletteTokens {
  /** Recessed inner surface (hover, terminal field). */
  surface2: string;
  /** Structural chrome border (orange in dark, dark hairline in blueprint). */
  stroke: string;
  /** Idle / divider border. */
  stroke2: string;
  /** Meter / progress track. */
  track: string;
  /** Input field background. */
  field: string;
  /** Focused field background. */
  fieldFocus: string;
  /** Terminal text (bright) + dim (AA-safe secondary). */
  termText: string;
  termDim: string;
  /** Glow strings — flatten to `none` in blueprint. */
  glowPanel: string;
  glowPanelStrong: string;
  glowFocus: string;
  glowMint: string;
  /** CRT scanline+vignette overlay (`none` in blueprint). */
  crt: string;
}

/** Scheme-invariant tokens + helpers. */
interface NervTokens {
  hue: {
    void: string;
    mint: string;
    mintHi: string;
    greenMap: string;
    greenDim: string;
    paper: string;
    orange: string;
    amber: string;
    amberDim: string;
    red: string;
    redHi: string;
    crimson: string;
    teal: string;
    blue: string;
    blueprint: string;
  };
  radius: { none: number; chip: number; seg: number; chamfer: number };
  space: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
  fonts: { display: string; mono: string; jp: string };
  motion: {
    linear: string;
    step: string;
    snap: string;
    durations: { snap: number; fast: number; blink: number };
  };
  layers: Record<
    'base' | 'crt' | 'raised' | 'dropdown' | 'sticky' | 'drawer' | 'backdrop' | 'modal' | 'snackbar' | 'tooltip',
    number
  >;
  /** clip-path polygon for a chamfered panel — `cut` px on the requested corners. */
  chamfer: (cut?: number) => string;
  /** 45° hazard-stripe background (crimson/black by default). */
  hazard: (a?: string, b?: string) => string;
}

declare module '@mui/material/styles' {
  interface Palette {
    nerv: NervPaletteTokens;
  }
  interface PaletteOptions {
    nerv?: NervPaletteTokens;
  }

  interface Theme {
    nerv: NervTokens;
  }
  interface ThemeOptions {
    nerv?: NervTokens;
  }

  /** Custom typography variants. */
  interface TypographyVariants {
    /** Large Mincho kanji graphic (pair with a small caption). */
    jp: CSSProperties;
    /** Monospace terminal / log line. */
    terminal: CSSProperties;
    /** Boxed status-stamp text. */
    stamp: CSSProperties;
    /** Tabular numeric data readout. */
    data: CSSProperties;
  }
  interface TypographyVariantsOptions {
    jp?: CSSProperties;
    terminal?: CSSProperties;
    stamp?: CSSProperties;
    data?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    jp: true;
    terminal: true;
    stamp: true;
    data: true;
  }
}

/* ---- Custom component variants ---- */
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    /** Quiet secondary — dim outline in the mono face. */
    ghost: true;
    /** Chrome-level action — orange outline. */
    alt: true;
    /** Boxed status-stamp button (blinking-selected capable via `.Mui-selected`). */
    stamp: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    /** Solid-fill inverse stamp (black content on hue). */
    stamp: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    /** Chamfered hero/focal panel (one or two corners cut). */
    chamfer: true;
    /** Double-frame command shell (thin outer + thick inner rule). */
    frame: true;
  }
}
