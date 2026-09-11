/**
 * Feedback — Alert, Snackbar, Dialog, Progress, Skeleton, Backdrop.
 *
 * Alerts are boxed and colored by state (never a soft tinted card). The Dialog
 * is the double-frame modal shell. Progress is a stepped/segmented read where
 * possible; MUI's continuous bars are recolored to the mint/track grammar.
 */
import type { Components, Theme } from '@mui/material/styles';
import { v } from './util';

export const feedback: Pick<
  Components<Theme>,
  | 'MuiAlert'
  | 'MuiAlertTitle'
  | 'MuiSnackbar'
  | 'MuiSnackbarContent'
  | 'MuiDialog'
  | 'MuiDialogTitle'
  | 'MuiDialogContent'
  | 'MuiDialogActions'
  | 'MuiBackdrop'
  | 'MuiLinearProgress'
  | 'MuiCircularProgress'
  | 'MuiSkeleton'
> = {
  MuiAlert: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 0,
        border: '1px solid currentColor',
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        alignItems: 'center',
        // The `severity` prop sets the state hue as the root `color`; the border
        // and (for filled) the fill both track it via currentColor.
        '&.MuiAlert-colorSuccess': { color: theme.nerv.hue.mint },
        '&.MuiAlert-colorInfo': { color: theme.nerv.hue.blue },
        '&.MuiAlert-colorWarning': { color: theme.nerv.hue.amber },
        '&.MuiAlert-colorError': { color: theme.nerv.hue.redHi },
        // Outline / standard = hairline stamp on void.
        '&.MuiAlert-outlined, &.MuiAlert-standard': {
          backgroundColor: v(theme).palette.background.default,
        },
        // Filled = the inverse (solid state hue, void content).
        '&.MuiAlert-filled': {
          backgroundColor: 'currentColor',
          '& .MuiAlertTitle-root': { color: theme.nerv.hue.void },
        },
      }),
      message: ({ theme, ownerState }) =>
        ownerState.variant === 'filled' ? { color: theme.nerv.hue.void } : {},
      icon: ({ theme, ownerState }) => ({
        opacity: 1,
        ...(ownerState.variant === 'filled' ? { color: theme.nerv.hue.void } : null),
      }),
      action: ({ theme, ownerState }) =>
        ownerState.variant === 'filled' ? { color: theme.nerv.hue.void } : {},
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }),
    },
  },

  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.default,
        color: theme.nerv.hue.mint,
        border: `1px solid ${theme.nerv.hue.orange}`,
        borderRadius: 0,
        boxShadow: v(theme).palette.nerv.glowPanelStrong,
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.75rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }),
    },
  },

  // Dialog — the double-frame command modal.
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.default,
        backgroundImage: 'none',
        border: `3px solid ${theme.nerv.hue.orange}`,
        borderRadius: 0,
        boxShadow: v(theme).palette.nerv.glowPanelStrong,
        clipPath: theme.nerv.chamfer(28),
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 6,
          border: `1px solid ${theme.nerv.hue.orange}`,
          opacity: 0.4,
          pointerEvents: 'none',
        },
      }),
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: theme.nerv.hue.paper,
        borderBottom: `2px solid ${theme.nerv.hue.orange}`,
      }),
    },
  },
  MuiDialogContent: { styleOverrides: { root: { paddingTop: 16 } } },
  MuiDialogActions: { styleOverrides: { root: { padding: 16, gap: 8 } } },

  MuiBackdrop: {
    styleOverrides: {
      // dim to black, no blur
      root: ({ theme }) => ({ backgroundColor: v(theme).palette.nerv.backdrop }),
    },
  },

  // Progress — mint fill on a dim track, hard corners.
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({ borderRadius: 0, height: 8, backgroundColor: v(theme).palette.nerv.track }),
      bar: ({ theme }) => ({ borderRadius: 0, backgroundColor: theme.nerv.hue.mint }),
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: ({ theme }) => ({ color: theme.nerv.hue.mint }),
      circle: { strokeLinecap: 'butt' }, // hard cap, not rounded
    },
  },

  MuiSkeleton: {
    defaultProps: { animation: 'wave' },
    styleOverrides: {
      root: ({ theme }) => ({ borderRadius: 0, backgroundColor: v(theme).palette.nerv.track }),
    },
  },
};
