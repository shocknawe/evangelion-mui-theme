/**
 * Data display — Chip, Avatar, Badge, Table, List, Divider, Tooltip, Typography.
 *
 * The status STAMP is the atom here: text boxed in a 1px border of its own hue.
 * `Chip` default = outline stamp; `variant="stamp"` = solid-fill inverse. Colour
 * a chip via its `color` prop (success/warning/error/info) and it carries the
 * matching state hue automatically.
 */
import type { Components, Theme } from '@mui/material/styles';
import { v } from './util';

export const dataDisplay: Pick<
  Components<Theme>,
  | 'MuiChip'
  | 'MuiAvatar'
  | 'MuiBadge'
  | 'MuiDivider'
  | 'MuiTooltip'
  | 'MuiTable'
  | 'MuiTableCell'
  | 'MuiTableHead'
  | 'MuiTableRow'
  | 'MuiList'
  | 'MuiListItem'
  | 'MuiListItemButton'
  | 'MuiListItemText'
  | 'MuiListSubheader'
  | 'MuiTypography'
> = {
  // Chip = boxed stamp. Default outline; `stamp` variant inverts to a fill.
  MuiChip: {
    defaultProps: { variant: 'outlined', size: 'small' },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.nerv.radius.chip,
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.6875rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        height: 22,
        variants: [
          {
            props: { variant: 'stamp' },
            style: {
              backgroundColor: 'currentColor',
              color: theme.nerv.hue.redHi,
              border: 0,
              '& .MuiChip-label': { color: theme.nerv.hue.void },
            },
          },
        ],
      }),
      outlined: ({ theme }) => ({
        border: '1px solid currentColor',
        color: theme.nerv.hue.mint,
        backgroundColor: 'transparent',
      }),
      // Filled = the inverse stamp (solid hue, void content).
      filled: ({ theme }) => ({
        backgroundColor: theme.nerv.hue.mint,
        color: theme.nerv.hue.void,
        border: 0,
      }),
    },
  },

  // Avatar — square, chrome border, mono initials (no soft circle).
  MuiAvatar: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.nerv.radius.none,
        border: `1px solid ${theme.nerv.hue.orange}`,
        backgroundColor: v(theme).palette.background.default,
        color: theme.nerv.hue.orange,
        fontFamily: theme.nerv.fonts.jp,
        fontWeight: 800,
        fontSize: '0.875rem',
      }),
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: ({ theme }) => ({
        borderRadius: theme.nerv.radius.chip,
        fontFamily: theme.nerv.fonts.mono,
        fontWeight: 700,
        fontSize: '0.5625rem',
        letterSpacing: '0.04em',
      }),
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: v(theme).palette.nerv.stroke2 }),
      // A section rule reads as chrome orange.
      middle: ({ theme }) => ({ borderColor: theme.nerv.hue.orange }),
    },
  },

  // Tooltip — a boxed mono callout, not a rounded bubble.
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.default,
        color: theme.nerv.hue.mint,
        border: `1px solid ${theme.nerv.hue.orange}`,
        borderRadius: 0,
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.6875rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        boxShadow: v(theme).palette.nerv.glowPanelStrong,
      }),
      arrow: ({ theme }) => ({ color: theme.nerv.hue.orange }),
    },
  },

  // Table — dense chrome grid; head row is condensed caps.
  MuiTable: { styleOverrides: { root: { borderCollapse: 'separate', borderSpacing: 0 } } },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiTableCell-head': {
          fontFamily: theme.nerv.fonts.display,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: theme.nerv.hue.orange,
          borderBottom: `2px solid ${theme.nerv.hue.orange}`,
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.75rem',
        letterSpacing: '0.03em',
        borderBottom: `1px solid ${v(theme).palette.nerv.stroke2}`,
        color: v(theme).palette.text.primary,
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        transition: `background-color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}`,
        '&:hover': { backgroundColor: v(theme).palette.nerv.surface2 },
        '&.Mui-selected': {
          backgroundColor: 'transparent',
          boxShadow: `inset 3px 0 0 ${theme.nerv.hue.mint}`,
        },
      }),
    },
  },

  // Lists — boxed nav items; selected uses the mint inversion.
  MuiList: { styleOverrides: { root: { padding: 0 } } },
  MuiListItem: { styleOverrides: { root: { paddingTop: 2, paddingBottom: 2 } } },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${v(theme).palette.nerv.stroke2}`,
        borderRadius: 0,
        marginBottom: 6,
        transition: `border-color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}, background-color ${theme.nerv.motion.durations.fast}ms ${theme.nerv.motion.linear}`,
        '&:hover': { backgroundColor: 'transparent', borderColor: theme.nerv.hue.mint },
        '&.Mui-selected': {
          backgroundColor: theme.nerv.hue.mint,
          borderColor: theme.nerv.hue.mint,
          color: theme.nerv.hue.void,
          '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: theme.nerv.hue.void },
          '&:hover': { backgroundColor: theme.nerv.hue.mintHi },
        },
        '&:focus-visible': { outline: `2px solid ${theme.nerv.hue.amber}`, outlineOffset: 2 },
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontSize: '0.8125rem',
      }),
      secondary: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.625rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: v(theme).palette.text.secondary,
      }),
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontSize: '0.6875rem',
        color: theme.nerv.hue.orange,
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${v(theme).palette.nerv.stroke2}`,
        lineHeight: '32px',
      }),
    },
  },

  // Typography — map the custom variants onto real elements.
  MuiTypography: {
    defaultProps: {
      variantMapping: {
        jp: 'span',
        terminal: 'div',
        stamp: 'span',
        data: 'span',
      },
    },
    styleOverrides: {
      root: ({ theme }) => ({
        '&.MuiTypography-jp': { color: theme.nerv.hue.orange },
        '&.MuiTypography-terminal': { color: v(theme).palette.nerv.termText },
        '&.MuiTypography-data': { color: theme.nerv.hue.mintHi },
      }),
    },
  },
};
