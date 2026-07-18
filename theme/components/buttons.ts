/**
 * Buttons & clickable primitives.
 *
 * Grammar: hard-cornered, condensed caps. The default `contained` button is an
 * OUTLINE at rest that fills on hover (mint fill, black content — the inversion).
 * Custom variants:
 *   - `ghost`  quiet secondary (dim outline, mono)
 *   - `alt`    chrome-level action (orange outline)
 *   - `stamp`  boxed status-stamp button; `.Mui-selected` blinks (the live action)
 * The blinking selected-action is the `stamp` + `Mui-selected`, or any primary
 * button given `className="nerv-live"`.
 *
 * Component `variants` live INSIDE the `root` slot's returned CSS object (they
 * close over the slot's `theme`); this is the MUI-typed home for per-prop styles.
 */
import type { Components, Theme } from '@mui/material/styles';
import { KEYFRAMES, v } from './util';

const snap = (theme: Theme) =>
  `background-color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}, ` +
  `color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}, ` +
  `border-color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}, ` +
  `box-shadow ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}`;

export const buttons: Pick<
  Components<Theme>,
  'MuiButtonBase' | 'MuiButton' | 'MuiButtonGroup' | 'MuiIconButton' | 'MuiToggleButton' | 'MuiToggleButtonGroup' | 'MuiFab'
> = {
  MuiButtonBase: {
    defaultProps: { disableRipple: true }, // mechanical, not eased — no ripple
  },

  MuiButton: {
    defaultProps: { disableElevation: true, variant: 'contained' },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.nerv.radius.none,
        minHeight: 40,
        padding: '10px 20px',
        gap: 8,
        transition: snap(theme),
        '&:focus-visible': {
          outline: `2px solid ${theme.nerv.hue.paper}`,
          outlineOffset: 3,
        },
        // The live-action blink: `<Button className="nerv-live">`.
        '&.nerv-live': {
          animation: `${KEYFRAMES.btnBlink} ${theme.nerv.motion.durations.blink}ms ${theme.nerv.motion.snap} infinite`,
        },
        '&.Mui-disabled': {
          color: v(theme).palette.text.disabled,
          borderColor: v(theme).palette.nerv.stroke2,
        },
        variants: [
          {
            props: { variant: 'ghost' },
            style: {
              fontFamily: theme.nerv.fonts.mono,
              fontWeight: 400,
              textTransform: 'uppercase',
              color: v(theme).palette.text.secondary,
              border: `1px solid ${v(theme).palette.nerv.stroke2}`,
              '&:hover': { borderColor: theme.nerv.hue.mint, color: theme.nerv.hue.mint },
            },
          },
          {
            props: { variant: 'alt' },
            style: {
              color: theme.nerv.hue.orange,
              border: `2px solid ${theme.nerv.hue.orange}`,
              '&:hover': { backgroundColor: theme.nerv.hue.orange, color: theme.nerv.hue.void },
            },
          },
          {
            props: { variant: 'stamp' },
            style: {
              fontFamily: theme.nerv.fonts.mono,
              fontWeight: 700,
              fontSize: '0.6875rem',
              minHeight: 0,
              padding: '3px 9px',
              borderRadius: theme.nerv.radius.chip,
              color: theme.nerv.hue.mint,
              border: `1px solid ${theme.nerv.hue.mint}`,
              '&.Mui-selected, &[aria-pressed="true"]': {
                backgroundColor: theme.nerv.hue.mint,
                color: theme.nerv.hue.void,
                animation: `${KEYFRAMES.blink} ${theme.nerv.motion.durations.blink}ms ${theme.nerv.motion.snap} infinite`,
              },
            },
          },
        ],
      }),
      sizeSmall: { minHeight: 32, padding: '6px 14px', fontSize: '0.6875rem' },
      sizeLarge: { minHeight: 48, padding: '13px 26px', fontSize: '0.875rem' },

      // Primary — mint outline at rest, mint fill on hover (inversion).
      contained: ({ theme }) => ({
        backgroundColor: 'transparent',
        color: theme.nerv.hue.mint,
        border: `2px solid ${theme.nerv.hue.mint}`,
        '&:hover': {
          backgroundColor: theme.nerv.hue.mint,
          color: theme.nerv.hue.void,
          boxShadow: v(theme).palette.nerv.glowMint,
        },
        '&.Mui-disabled': { backgroundColor: 'transparent' },
      }),
      // Outlined — chrome orange hairline.
      outlined: ({ theme }) => ({
        color: theme.nerv.hue.orange,
        border: `1px solid ${theme.nerv.hue.orange}`,
        '&:hover': { backgroundColor: theme.nerv.hue.orange, color: theme.nerv.hue.void },
      }),
      // Text — quiet mono action.
      text: ({ theme }) => ({
        color: v(theme).palette.text.secondary,
        '&:hover': { backgroundColor: v(theme).palette.nerv.surface2, color: theme.nerv.hue.mint },
      }),
    },
  },

  // Fused controls sharing hard borders — no rounding between members.
  MuiButtonGroup: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      grouped: { borderRadius: 0 },
      root: ({ theme }) => ({
        '& .MuiButtonGroup-grouped:not(:last-of-type)': {
          borderRightColor: v(theme).palette.nerv.stroke,
        },
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.nerv.radius.none,
        color: v(theme).palette.text.secondary,
        transition: snap(theme),
        '&:hover': { color: theme.nerv.hue.mint, backgroundColor: v(theme).palette.nerv.surface2 },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.amber}`, outlineOffset: 2 },
      }),
    },
  },

  // Segmented toggle group — the mode-rail pattern (STOP/SLOW/NORMAL/RACING).
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({ border: `1px solid ${theme.nerv.hue.orange}`, gap: 0 }),
      grouped: ({ theme }) => ({
        borderRadius: 0,
        border: 0,
        borderRight: `1px solid ${theme.nerv.hue.orange}`,
        '&:last-of-type': { borderRight: 0 },
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: theme.nerv.hue.mint,
        padding: '9px 16px',
        transition: snap(theme),
        '&.Mui-selected': {
          backgroundColor: theme.nerv.hue.mint,
          color: theme.nerv.hue.void,
          '&:hover': { backgroundColor: theme.nerv.hue.mintHi },
        },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.paper}`, outlineOffset: -2 },
      }),
    },
  },

  MuiFab: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.nerv.radius.none,
        backgroundColor: theme.nerv.hue.mint,
        color: theme.nerv.hue.void,
        boxShadow: v(theme).palette.nerv.glowMint,
        '&:hover': { backgroundColor: theme.nerv.hue.mintHi, boxShadow: v(theme).palette.nerv.glowMint },
      }),
    },
  },
};
