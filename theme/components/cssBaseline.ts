/**
 * CssBaseline — the console's base layer.
 *
 *  - Loads the CRT scanline + vignette pass on a fixed `body::before` overlay
 *    (via `palette.nerv.crt`).
 *  - Registers the global `nervBlink` / `nervBtnBlink` keyframes used across
 *    overrides for the in-progress and selected-action signals.
 *  - Sets base body type/colour and a mint text-selection.
 *  - Honors `prefers-reduced-motion`: kills every blink/strobe and renders the
 *    settled state. Non-negotiable (DESIGN.md).
 */
import type { Components, Theme } from '@mui/material/styles';
import { v } from './util';

export const cssBaseline: Pick<Components<Theme>, 'MuiCssBaseline'> = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      ':root': {
        colorScheme: theme.palette.mode,
      },

      body: {
        backgroundColor: v(theme).palette.background.default,
        color: v(theme).palette.text.primary,
        fontFamily: theme.nerv.fonts.mono,
        letterSpacing: '0.03em',
        WebkitFontSmoothing: 'antialiased',
      },

      // CRT pass — scanlines + vignette, above content, non-interactive.
      'body::before': {
        content: '""',
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: theme.nerv.layers.crt,
        background: v(theme).palette.nerv.crt,
      },

      '::selection': {
        background: theme.nerv.hue.mint,
        color: theme.nerv.hue.void,
      },

      // Scrollbar — chrome-orange thumb on void track.
      '*::-webkit-scrollbar': { width: 10, height: 10 },
      '*::-webkit-scrollbar-thumb': {
        background: theme.nerv.hue.greenDim,
        border: `2px solid ${v(theme).palette.background.default}`,
      },
      '*::-webkit-scrollbar-thumb:hover': { background: theme.nerv.hue.orange },
      '*::-webkit-scrollbar-track': { background: 'transparent' },

      // In-progress blink (1 Hz hard on/off).
      '@keyframes nervBlink': {
        '0%,49%': { opacity: 1 },
        '50%,100%': { opacity: 0 },
      },
      // Selected primary action — invert between filled and outlined.
      '@keyframes nervBtnBlink': {
        '0%,74%': {
          backgroundColor: theme.nerv.hue.mint,
          color: theme.nerv.hue.void,
        },
        '75%,100%': {
          backgroundColor: 'transparent',
          color: theme.nerv.hue.mint,
        },
      },

      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.001ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.001ms !important',
        },
      },
    }),
  },
};
