/**
 * Navigation — Tabs, Drawer, Menu, Breadcrumbs, Pagination, Stepper, Link.
 *
 * Selected/current states use the mint inversion or a mint indicator; the
 * stepper renders chamfered OODA-style nodes (done = mint fill, active = blink).
 */
import type { Components, Theme } from '@mui/material/styles';
import { KEYFRAMES, snapForAnimation, v } from './util';

export const navigation: Pick<
  Components<Theme>,
  | 'MuiTabs'
  | 'MuiTab'
  | 'MuiDrawer'
  | 'MuiMenu'
  | 'MuiMenuItem'
  | 'MuiMenuList'
  | 'MuiPopover'
  | 'MuiBreadcrumbs'
  | 'MuiLink'
  | 'MuiPagination'
  | 'MuiPaginationItem'
  | 'MuiStepper'
  | 'MuiStep'
  | 'MuiStepLabel'
  | 'MuiStepIcon'
  | 'MuiStepConnector'
> = {
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }) => ({ minHeight: 40, borderBottom: `1px solid ${v(theme).palette.nerv.stroke2}` }),
      indicator: ({ theme }) => ({ height: 2, backgroundColor: theme.nerv.hue.mint }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 40,
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: v(theme).palette.text.secondary,
        '&.Mui-selected': { color: theme.nerv.hue.mint },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.amber}`, outlineOffset: -2 },
      }),
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.default,
        backgroundImage: 'none',
        borderRight: `2px solid ${theme.nerv.hue.orange}`,
        boxShadow: v(theme).palette.nerv.glowPanel,
      }),
    },
  },

  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }) => ({
        border: `1px solid ${theme.nerv.hue.mint}`,
        boxShadow: v(theme).palette.nerv.glowPanelStrong,
        clipPath: theme.nerv.chamfer(12),
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.default,
        border: `1px solid ${theme.nerv.hue.mint}`,
        boxShadow: v(theme).palette.nerv.glowPanelStrong,
      }),
      list: { padding: 4 },
    },
  },
  MuiMenuList: { styleOverrides: { root: { padding: 4 } } },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderRadius: 0,
        '&:hover': { backgroundColor: v(theme).palette.nerv.surface2, color: theme.nerv.hue.mint },
        '&.Mui-selected': {
          backgroundColor: theme.nerv.hue.mint,
          color: theme.nerv.hue.void,
          '&:hover': { backgroundColor: theme.nerv.hue.mintHi },
        },
      }),
    },
  },

  MuiBreadcrumbs: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.6875rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }),
      separator: ({ theme }) => ({ color: theme.nerv.hue.orange }),
      li: ({ theme }) => ({ '& > *:last-child': { color: theme.nerv.hue.mintHi } }),
    },
  },
  MuiLink: {
    defaultProps: { underline: 'none' },
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.nerv.hue.mint,
        textDecorationColor: theme.nerv.hue.greenDim,
        transition: `color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}`,
        '&:hover': { color: theme.nerv.hue.mintHi, textDecoration: 'underline' },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.amber}`, outlineOffset: 2 },
      }),
    },
  },

  MuiPagination: { styleOverrides: { ul: { gap: 4 } } },
  MuiPaginationItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        borderRadius: 0,
        border: `1px solid ${v(theme).palette.nerv.stroke2}`,
        color: v(theme).palette.text.secondary,
        '&:hover': { borderColor: theme.nerv.hue.mint, backgroundColor: 'transparent', color: theme.nerv.hue.mint },
        '&.Mui-selected': {
          backgroundColor: theme.nerv.hue.mint,
          borderColor: theme.nerv.hue.mint,
          color: theme.nerv.hue.void,
          '&:hover': { backgroundColor: theme.nerv.hue.mintHi },
        },
      }),
    },
  },

  // Stepper — chamfered nodes; done = mint fill, active = blinking blue.
  MuiStepper: { styleOverrides: { root: { padding: 0 } } },
  MuiStep: { styleOverrides: { root: {} } },
  MuiStepConnector: {
    styleOverrides: {
      line: ({ theme }) => ({ borderColor: theme.nerv.hue.greenDim, borderTopWidth: 2 }),
    },
  },
  MuiStepLabel: {
    styleOverrides: {
      label: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.5625rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: v(theme).palette.text.secondary,
        '&.Mui-active': { color: theme.nerv.hue.blue, fontWeight: 700 },
        '&.Mui-completed': { color: theme.nerv.hue.mint },
      }),
    },
  },
  MuiStepIcon: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: 'transparent',
        border: `2px solid ${theme.nerv.hue.greenDim}`,
        borderRadius: 0,
        clipPath: theme.nerv.chamfer(7),
        '&.Mui-completed': {
          color: theme.nerv.hue.mint,
          borderColor: theme.nerv.hue.mint,
          '& path': { display: 'none' },
        },
        '&.Mui-active': {
          color: theme.nerv.hue.blue,
          borderColor: theme.nerv.hue.blue,
          // Longhands — `steps(1, jump-none)` (motion.snap) is rejected inside
          // the `animation` SHORTHAND; see theme/components/buttons.ts.
          animationName: KEYFRAMES.blink,
          animationDuration: `${theme.nerv.motion.durations.blink}ms`,
          animationTimingFunction: snapForAnimation(theme),
          animationIterationCount: 'infinite',
        },
      }),
      text: ({ theme, ownerState }) => ({
        fill: ownerState.active ? theme.nerv.hue.void : theme.nerv.hue.greenMap,
        fontFamily: theme.nerv.fonts.mono,
      }),
    },
  },
};
