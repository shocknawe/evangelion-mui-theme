/**
 * Surfaces — Paper, Card, Accordion, AppBar.
 *
 * No elevation. A surface is a void fill with a 1–2px orange border and a faint
 * inset glow. Paper variants:
 *   - `chamfer` hero/focal panel (one corner cut via clip-path)
 *   - `frame`   double-frame command shell (thick border + inner rule)
 */
import type { Components, Theme } from '@mui/material/styles';
import { v } from './util';

export const surfaces: Pick<
  Components<Theme>,
  | 'MuiPaper'
  | 'MuiCard'
  | 'MuiCardHeader'
  | 'MuiCardContent'
  | 'MuiCardActions'
  | 'MuiAccordion'
  | 'MuiAccordionSummary'
  | 'MuiAccordionDetails'
  | 'MuiAppBar'
  | 'MuiToolbar'
> = {
  MuiPaper: {
    defaultProps: { elevation: 0, square: true },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.paper,
        backgroundImage: 'none', // MUI's default elevation overlay off
        color: v(theme).palette.text.primary,
        border: `1px solid ${v(theme).palette.nerv.stroke}`,
        boxShadow: v(theme).palette.nerv.glowPanel,
        variants: [
          {
            props: { variant: 'chamfer' },
            style: {
              border: `2px solid ${theme.nerv.hue.mint}`,
              boxShadow: v(theme).palette.nerv.glowMint,
              clipPath: theme.nerv.chamfer(theme.nerv.radius.chamfer + 4),
            },
          },
          {
            props: { variant: 'frame' },
            style: {
              border: `3px solid ${theme.nerv.hue.orange}`,
              boxShadow: v(theme).palette.nerv.glowPanelStrong,
              clipPath: theme.nerv.chamfer(28),
              position: 'relative',
              // Inner rule = the second frame line.
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 6,
                border: `1px solid ${theme.nerv.hue.orange}`,
                opacity: 0.4,
                pointerEvents: 'none',
              },
            },
          },
        ],
      }),
      // MUI maps outlined Paper to a divider border — keep it chrome orange.
      outlined: ({ theme }) => ({ border: `1px solid ${v(theme).palette.nerv.stroke}` }),
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.paper,
        backgroundImage: 'none',
        border: `1px solid ${v(theme).palette.nerv.stroke}`,
        borderRadius: theme.nerv.radius.none,
        boxShadow: v(theme).palette.nerv.glowPanel,
      }),
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      title: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: theme.nerv.hue.orange,
      }),
      subheader: ({ theme }) => ({
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.6875rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: v(theme).palette.text.secondary,
      }),
    },
  },
  MuiCardContent: { styleOverrides: { root: { padding: 16 } } },
  MuiCardActions: { styleOverrides: { root: { padding: 16, gap: 8 } } },

  // Accordion — flat rows divided by chrome hairlines, no rounding/shadow.
  MuiAccordion: {
    defaultProps: { disableGutters: true, elevation: 0, square: true },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: 'transparent',
        border: `1px solid ${v(theme).palette.nerv.stroke2}`,
        borderRadius: 0,
        boxShadow: 'none',
        '&:not(:last-of-type)': { borderBottom: 0 },
        '&::before': { display: 'none' },
        '&.Mui-expanded': { borderColor: theme.nerv.hue.orange },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        minHeight: 44,
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        '&.Mui-expanded': { color: theme.nerv.hue.mint },
      }),
      expandIconWrapper: ({ theme }) => ({ color: theme.nerv.hue.orange }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }) => ({ borderTop: `1px solid ${v(theme).palette.nerv.stroke2}`, padding: 16 }),
    },
  },

  // AppBar — sticky chrome-ruled top bar, void fill (no gradient, no shadow).
  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'transparent' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: v(theme).palette.background.default,
        backgroundImage: 'none',
        color: v(theme).palette.text.primary,
        borderBottom: `2px solid ${theme.nerv.hue.orange}`,
        boxShadow: 'none',
      }),
    },
  },
  MuiToolbar: {
    styleOverrides: { root: { minHeight: 56, gap: 16 } },
  },
};
