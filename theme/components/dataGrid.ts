/**
 * DataGrid overrides — OPT-IN.
 *
 * `@mui/x-data-grid` is a separate package and may not be installed, so these
 * overrides are NOT merged into the base theme automatically (that would require
 * importing the package's component types). Merge them yourself when you use the
 * grid:
 *
 *   import { createTheme } from '@mui/material/styles';
 *   import { theme } from './theme';
 *   import { dataGrid } from './theme/components/dataGrid';
 *   export const withGrid = createTheme(theme, { components: dataGrid });
 *
 * Typed loosely (`Record<string, unknown>`) so this file compiles without the
 * x-data-grid dependency present.
 */
import type { Theme } from '@mui/material/styles';

export const dataGrid: Record<string, unknown> = {
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        border: `1px solid ${theme.nerv.hue.orange}`,
        borderRadius: 0,
        fontFamily: theme.nerv.fonts.mono,
        fontSize: '0.75rem',
        color: theme.palette.text.primary,
        '--DataGrid-rowBorderColor': theme.palette.nerv.stroke2,
        '--DataGrid-containerBackground': theme.palette.background.default,
      }),
      columnHeaders: ({ theme }: { theme: Theme }) => ({
        borderBottom: `2px solid ${theme.nerv.hue.orange}`,
      }),
      columnHeaderTitle: ({ theme }: { theme: Theme }) => ({
        fontFamily: theme.nerv.fonts.display,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: theme.nerv.hue.orange,
      }),
      cell: ({ theme }: { theme: Theme }) => ({
        borderBottom: `1px solid ${theme.palette.nerv.stroke2}`,
      }),
      row: ({ theme }: { theme: Theme }) => ({
        '&:hover': { backgroundColor: theme.palette.nerv.surface2 },
        '&.Mui-selected': {
          backgroundColor: 'transparent',
          boxShadow: `inset 3px 0 0 ${theme.nerv.hue.mint}`,
          '&:hover': { backgroundColor: theme.palette.nerv.surface2 },
        },
      }),
      footerContainer: ({ theme }: { theme: Theme }) => ({
        borderTop: `1px solid ${theme.nerv.hue.orange}`,
      }),
    },
  },
};
