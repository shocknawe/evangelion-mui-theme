/**
 * Phosphor Console — component overrides, separately importable.
 *
 * Thin re-export of the `theme/components` assembly so a consumer can take just
 * the override map (and spread it into their own `createTheme`) without pulling
 * in the full theme assembly:
 *
 *   import { createTheme } from '@mui/material/styles';
 *   import { components } from 'phosphor-console-theme/overrides';
 *   const theme = createTheme({ components });
 *
 * Keep this module free of any side effects or `createTheme` call — it must
 * stay import-safe on its own, exactly like `theme/tokens.ts`.
 */
export { components } from './components';