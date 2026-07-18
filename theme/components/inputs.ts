/**
 * Inputs & form controls.
 *
 * Grammar: void field, 1px dim-green idle border → mint border + glow ring on
 * focus (no browser outline). Checked/selected states use the mint inversion.
 * Error = red border + red glow. Covers TextField/OutlinedInput/InputBase/
 * InputLabel/FormHelperText/FormControl, Select, Checkbox, Radio, Switch, Slider.
 */
import type { Components, Theme } from '@mui/material/styles';
import { v } from './util';

const fieldBase = (theme: Theme) => ({
  backgroundColor: v(theme).palette.nerv.field,
  color: v(theme).palette.text.primary,
  fontFamily: theme.nerv.fonts.mono,
  borderRadius: theme.nerv.radius.none,
  caretColor: theme.nerv.hue.mint,
});

export const inputs: Pick<
  Components<Theme>,
  | 'MuiTextField'
  | 'MuiOutlinedInput'
  | 'MuiFilledInput'
  | 'MuiInput'
  | 'MuiInputBase'
  | 'MuiInputLabel'
  | 'MuiFormLabel'
  | 'MuiFormHelperText'
  | 'MuiFormControlLabel'
  | 'MuiSelect'
  | 'MuiCheckbox'
  | 'MuiRadio'
  | 'MuiSwitch'
  | 'MuiSlider'
> = {
  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'small' },
  },

  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...fieldBase(theme),
        fontSize: '0.875rem',
        letterSpacing: '0.04em',
      }),
      input: ({ theme }) => ({
        textTransform: 'uppercase',
        '&::placeholder': { color: theme.nerv.hue.greenDim, opacity: 1, textTransform: 'uppercase' },
      }),
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...fieldBase(theme),
        '& .MuiOutlinedInput-notchedOutline': {
          borderRadius: 0,
          borderColor: v(theme).palette.nerv.stroke2,
          transition: `border-color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}`,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.nerv.hue.greenMap },
        '&.Mui-focused': {
          backgroundColor: v(theme).palette.nerv.fieldFocus,
          boxShadow: v(theme).palette.nerv.glowFocus,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.nerv.hue.mint,
          borderWidth: 1,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: theme.nerv.hue.redHi },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: v(theme).palette.nerv.stroke2 },
      }),
    },
  },

  // Labels + helper text in the mono/label voice.
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.625rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: theme.nerv.hue.orange,
        '&.Mui-focused': { color: theme.nerv.hue.mint },
        '&.Mui-error': { color: theme.nerv.hue.redHi },
      }),
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.625rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: theme.nerv.hue.orange,
        '&.Mui-focused': { color: theme.nerv.hue.mint },
      }),
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.625rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginLeft: 0,
        '&.Mui-error': { color: theme.nerv.hue.redHi },
      }),
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.8125rem',
        letterSpacing: '0.02em',
      }),
    },
  },

  MuiSelect: {
    defaultProps: { variant: 'outlined', size: 'small' },
    styleOverrides: {
      icon: ({ theme }) => ({ color: theme.nerv.hue.orange }),
      select: { textTransform: 'uppercase' },
    },
  },

  // Checkbox — hard 18px box, mint fill + check on select.
  MuiCheckbox: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.nerv.hue.greenMap,
        borderRadius: 0,
        '&.Mui-checked': { color: theme.nerv.hue.mint },
        '&.Mui-disabled': { color: v(theme).palette.text.disabled },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.paper}`, outlineOffset: 2 },
      }),
    },
  },

  // Radio — same colorway; use with boxed chip labels for the priority pattern.
  MuiRadio: {
    defaultProps: { disableRipple: true },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.nerv.hue.greenMap,
        '&.Mui-checked': { color: theme.nerv.hue.mint },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.paper}`, outlineOffset: 2 },
      }),
    },
  },

  // Switch — hard-edged track, thumb slides + glows on.
  MuiSwitch: {
    styleOverrides: {
      root: { width: 52, height: 24, padding: 0, display: 'inline-flex' },
      switchBase: ({ theme }) => ({
        padding: 3,
        '&.Mui-checked': {
          transform: 'translateX(28px)',
          color: theme.nerv.hue.mint,
          '& + .MuiSwitch-track': {
            backgroundColor: 'transparent',
            borderColor: theme.nerv.hue.mint,
            opacity: 1,
          },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': { outline: `2px solid ${theme.nerv.hue.paper}`, outlineOffset: 2 },
      }),
      thumb: ({ theme }) => ({
        width: 16,
        height: 16,
        borderRadius: 0,
        boxShadow: 'none',
        backgroundColor: theme.nerv.hue.greenMap,
        '.Mui-checked &': { backgroundColor: theme.nerv.hue.mint, boxShadow: v(theme).palette.nerv.glowMint },
      }),
      track: ({ theme }) => ({
        borderRadius: 0,
        border: `1px solid ${v(theme).palette.nerv.stroke2}`,
        backgroundColor: 'transparent',
        opacity: 1,
      }),
    },
  },

  // Slider — thin hard track, tall thin thumb, mint fill (the memory-budget pattern).
  MuiSlider: {
    styleOverrides: {
      root: ({ theme }) => ({ color: theme.nerv.hue.mint, height: 12, padding: '12px 0' }),
      rail: ({ theme }) => ({
        borderRadius: 0,
        opacity: 1,
        backgroundColor: v(theme).palette.nerv.track,
        border: `1px solid ${v(theme).palette.nerv.stroke2}`,
      }),
      track: ({ theme }) => ({ borderRadius: 0, border: 0, backgroundColor: theme.nerv.hue.mint }),
      thumb: ({ theme }) => ({
        width: 12,
        height: 24,
        borderRadius: 0,
        backgroundColor: theme.nerv.hue.mintHi,
        boxShadow: v(theme).palette.nerv.glowMint,
        '&:hover, &.Mui-focusVisible': { boxShadow: v(theme).palette.nerv.glowMint },
        '&.Mui-focusVisible': { outline: `2px solid ${theme.nerv.hue.paper}`, outlineOffset: 2 },
      }),
      mark: ({ theme }) => ({ backgroundColor: theme.nerv.hue.greenDim, height: 6, width: 1 }),
      markLabel: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.5625rem',
        letterSpacing: '0.08em',
        color: theme.nerv.hue.greenMap,
      }),
      valueLabel: ({ theme }) => ({
        backgroundColor: theme.nerv.hue.void,
        border: `1px solid ${theme.nerv.hue.mint}`,
        borderRadius: 0,
        color: theme.nerv.hue.mint,
        fontFamily: theme.nerv.fonts.mono,
      }),
    },
  },
};
