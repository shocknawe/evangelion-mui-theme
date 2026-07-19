/**
 * Phosphor Console palette — dark-only.
 *
 * Every token resolves from `tokens.ts`. Semantic hues (mint = primary,
 * orange = chrome/secondary, red = error, …) and the surface, ink, glow, and
 * CRT layers are all attached; the custom group lives under `palette.nerv` so
 * `cssVariables` emits a `--mui-palette-nerv-*` var per token.
 *
 * The signature move — figure/ground inversion — is enforced through
 * `contrastText` = black (`hue.void`) on every filled control. Black-on-hue is
 * both the brand grammar AND the higher-contrast choice (black beats white on
 * mint/amber/red/blue), so the aesthetic and WCAG AA agree.
 */
import type { PaletteOptions } from '@mui/material/styles';
import { crt, glowFx, hue, ink, status, surfaces, terminal } from './tokens';

export function buildPalette(): PaletteOptions {
  /** The content color punched out of a filled control — black on hue. */
  const inkOnFill = hue.void;

  return {
    mode: 'dark',

    // Primary = Phosphor Mint. Filled → black content (the inversion signature).
    primary: {
      main: hue.mint,
      light: hue.mintHi,
      dark: hue.greenMap,
      contrastText: inkOnFill,
    },
    // Secondary = Safety Orange. Chrome hue; also the "alt action" fill.
    secondary: {
      main: hue.orange,
      light: '#FF8A3C',
      dark: '#C25400',
      contrastText: inkOnFill,
    },
    error: {
      main: status.danger,
      dark: hue.red,
      contrastText: inkOnFill,
    },
    warning: {
      main: status.warning,
      contrastText: inkOnFill,
    },
    info: {
      main: status.info,
      contrastText: inkOnFill,
    },
    success: {
      main: status.success,
      contrastText: inkOnFill,
    },

    background: {
      default: surfaces.bg,
      paper: surfaces.paper,
    },
    text: {
      primary: ink.primary,
      secondary: ink.secondary,
      disabled: ink.disabled,
    },
    // Divider = chrome orange.
    divider: surfaces.stroke,

    action: {
      active: hue.mint,
      hover: surfaces.surface2,
      selected: hue.mint,
      focus: hue.mint,
      disabled: ink.disabled,
      disabledBackground: surfaces.track,
    },

    /* -------- custom token group (emitted as CSS vars) -------- */
    nerv: {
      surface2: surfaces.surface2,
      stroke: surfaces.stroke,
      stroke2: surfaces.stroke2,
      track: surfaces.track,
      field: surfaces.field,
      fieldFocus: surfaces.fieldFocus,
      termText: terminal.text,
      termDim: terminal.dim,
      glowPanel: glowFx.panel,
      glowPanelStrong: glowFx.panelStrong,
      glowFocus: glowFx.focus,
      glowMint: glowFx.mint,
      crt,
    },
  };
}
