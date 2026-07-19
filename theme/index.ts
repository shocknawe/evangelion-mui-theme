/**
 * Phosphor Console — the production Material UI (v7) theme.
 *
 * A dark-only NERV/MAGI tactical system. Built with `colorSchemes` (a single
 * `dark` scheme) and `cssVariables` so every custom token becomes a `--mui-*`
 * CSS variable. Assembled from focused token/override modules.
 *
 *   import { ThemeProvider, CssBaseline } from '@mui/material';
 *   import { theme } from './theme';
 *   <ThemeProvider theme={theme} defaultMode="dark">
 *     <CssBaseline />
 *     … app …
 *   </ThemeProvider>
 */
import { createTheme } from '@mui/material/styles';
import './augmentation'; // side-effect: module augmentation for custom keys

import { buildPalette } from './palette';
import { typography } from './typography';
import { shape } from './shape';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { components } from './components';
import { fonts, hue, layers, motion, radii, space } from './tokens';

/** clip-path polygon for a chamfered panel (top-right + bottom-left corners cut). */
const chamfer = (cut: number = radii.chamfer) =>
  `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;

/** 45° hazard-stripe background (crimson/black by default). */
const hazard = (a: string = hue.crimson, b = '#000') =>
  `repeating-linear-gradient(-45deg, ${a} 0 12px, ${b} 12px 24px)`;

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class', cssVarPrefix: 'mui' },
  defaultColorScheme: 'dark', // the canonical (and only) Phosphor Console scheme
  colorSchemes: {
    dark: { palette: buildPalette() },
  },

  typography,
  shape,
  spacing,
  shadows,
  components,

  // Structural collapse points (mobile / tablet / desktop from the pages).
  breakpoints: {
    values: { xs: 0, sm: 600, md: 1000, lg: 1280, xl: 1536 },
  },

  // Mechanical motion — linear/stepped only, short durations. No easing curve.
  transitions: {
    easing: {
      easeInOut: motion.linear,
      easeOut: motion.linear,
      easeIn: motion.linear,
      sharp: motion.snap,
    },
    duration: {
      shortest: motion.durations.snap,
      shorter: motion.durations.snap,
      short: motion.durations.fast,
      standard: motion.durations.fast,
      complex: 160,
      enteringScreen: motion.durations.fast,
      leavingScreen: motion.durations.snap,
    },
  },

  // MUI portal stacking — semantic layers from tokens.
  zIndex: {
    appBar: layers.sticky,
    drawer: layers.drawer,
    modal: layers.modal,
    snackbar: layers.snackbar,
    tooltip: layers.tooltip,
  },

  // Structural custom tokens, consumed by overrides and app code.
  nerv: {
    hue,
    radius: radii,
    space,
    fonts,
    motion: {
      linear: motion.linear,
      step: motion.step,
      snap: motion.snap,
      durations: motion.durations,
    },
    layers,
    chamfer,
    hazard,
  },
});

export default theme;
