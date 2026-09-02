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

/**
 * `motion.snap` as an `animation-timing-function`.
 *
 * Chromium rejects `steps(1, jump-none)` for timing functions entirely —
 * `jump-none` needs n >= 2, so the value fails `CSS.supports` for BOTH
 * `animation-timing-function` and `transition-timing-function`, and it is
 * dropped from the `animation:` shorthand *and* the longhand (which silently
 * dropped every blink declaration that interpolated the token into the
 * shorthand). `steps(1, end)` parses in both contexts and is the nearest
 * parseable hard snap: the 1 Hz keyframes hold their values on both sides of
 * the 1%-wide transition window, so the difference from the token's midpoint
 * step is <5ms. The token itself is unchanged.
 */
export const snapForAnimation = (theme: Theme): string =>
  theme.nerv.motion.snap.replace('jump-none', 'end');
