import type { Theme } from '@mui/material/styles';

/**
 * Resolve palette access through CSS variables when `cssVariables` is on,
 * falling back to raw values otherwise. Lets overrides reference the custom
 * `palette.nerv.*` tokens as `--mui-*` CSS vars.
 */
export const v = (theme: Theme) => theme.vars ?? theme;

/** Global keyframe names injected by CssBaseline. */
export const KEYFRAMES = {
  /** Hard on/off, 1 Hz — the "in-progress" signal. */
  blink: 'nervBlink',
  /** Selected primary action — inverts between filled and outlined. */
  btnBlink: 'nervBtnBlink',
} as const;

/**
 * The boxed-stamp fragment: text inside a 1px border of its own color.
 * `fill` = the inverse (solid hue, black content).
 */
export const stampBox = (theme: Theme, opts?: { fill?: boolean }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid currentColor',
  borderRadius: theme.nerv.radius.chip,
  padding: '2px 8px',
  ...(opts?.fill
    ? { backgroundColor: 'currentColor', '& > *': { color: v(theme).palette.background.default } }
    : null),
});
