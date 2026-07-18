/**
 * Phosphor Console palette — one builder, two schemes.
 *
 * Every token resolves from `tokens.ts`. Semantic hues are scheme-invariant
 * (mint = primary, orange = chrome/secondary, red = error, …); the surface,
 * ink, glow, and CRT layers vary by scheme and are attached under `palette.nerv`
 * so `cssVariables` emits a `--mui-palette-nerv-*` var per scheme.
 *
 * The signature move — figure/ground inversion — is enforced through
 * `contrastText: void` on every filled control. Black-on-hue is both the brand
 * grammar AND the higher-contrast choice (black beats white on mint/amber/red/
 * blue), so the aesthetic and WCAG AA agree.
 */
import type { PaletteOptions } from '@mui/material/styles';
import {
  crt,
  glowFx,
  hue,
  ink,
  status,
  surfaces,
  terminal,
  type Scheme,
} from './tokens';

const pick = (t: { light: string; dark: string }, s: Scheme) => t[s];

export function buildPalette(scheme: Scheme): PaletteOptions {
  const isDark = scheme === 'dark';
  /** The content color punched out of a filled control. */
  const inkOnFill = isDark ? hue.void : hue.void; // black on hue in both schemes

  return {
    mode: scheme,

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
      main: pick(status.danger, scheme),
      dark: hue.red,
      contrastText: inkOnFill,
    },
    warning: {
      main: pick(status.warning, scheme),
      contrastText: inkOnFill,
    },
    info: {
      main: pick(status.info, scheme),
      contrastText: inkOnFill,
    },
    success: {
      main: pick(status.success, scheme),
      contrastText: inkOnFill,
    },

    background: {
      default: pick(surfaces.bg, scheme),
      paper: pick(surfaces.paper, scheme),
    },
    text: {
      primary: pick(ink.primary, scheme),
      secondary: pick(ink.secondary, scheme),
      disabled: pick(ink.disabled, scheme),
    },
    // Divider = chrome orange in dark, dark hairline in blueprint.
    divider: pick(surfaces.stroke, scheme),

    action: {
      active: hue.mint,
      hover: pick(surfaces.surface2, scheme),
      selected: hue.mint,
      focus: hue.mint,
      disabled: pick(ink.disabled, scheme),
      disabledBackground: pick(surfaces.track, scheme),
    },

    /* -------- custom scheme-varying token group -------- */
    nerv: {
      surface2: pick(surfaces.surface2, scheme),
      stroke: pick(surfaces.stroke, scheme),
      stroke2: pick(surfaces.stroke2, scheme),
      track: pick(surfaces.track, scheme),
      field: pick(surfaces.field, scheme),
      fieldFocus: pick(surfaces.fieldFocus, scheme),
      termText: pick(terminal.text, scheme),
      termDim: pick(terminal.dim, scheme),
      glowPanel: pick(glowFx.panel, scheme),
      glowPanelStrong: pick(glowFx.panelStrong, scheme),
      glowFocus: pick(glowFx.focus, scheme),
      glowMint: pick(glowFx.mint, scheme),
      crt: pick(crt, scheme),
    },
  };
}
