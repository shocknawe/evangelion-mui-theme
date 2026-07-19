/**
 * Shadows — there is no elevation in this system. MUI requires a 25-slot array
 * (indices 0–24), so we replace the entire drop-shadow vocabulary with GLOW:
 * an emitted orange halo whose intensity rises with the elevation index. Any
 * component that reads `theme.shadows[n]` by number therefore glows instead of
 * casting a shadow, on-brand for the dark console.
 *
 * Prefer the `palette.nerv.glowPanel*` tokens for panel halos; the numbered
 * array exists so any component that reads `theme.shadows[n]` still glows
 * on-brand rather than casting a shadow. See surfaces.ts overrides.
 */
import type { Shadows } from '@mui/material/styles';

const glow = (px: number, alpha: number) =>
  `0 0 ${px}px rgba(242,100,0,${alpha}), inset 0 0 ${Math.round(px * 0.7)}px rgba(242,100,0,${alpha * 0.35})`;

export const shadows: Shadows = [
  'none',
  glow(4, 0.28),
  glow(5, 0.3),
  glow(6, 0.32),
  glow(7, 0.34),
  glow(8, 0.36),
  glow(9, 0.38),
  glow(10, 0.4),
  glow(11, 0.42),
  glow(12, 0.44),
  glow(13, 0.46),
  glow(14, 0.48),
  glow(15, 0.5),
  glow(16, 0.5),
  glow(17, 0.5),
  glow(18, 0.52),
  glow(19, 0.52),
  glow(20, 0.54),
  glow(21, 0.54),
  glow(22, 0.56),
  glow(23, 0.56),
  glow(24, 0.58),
  glow(26, 0.6),
  glow(28, 0.6),
  glow(30, 0.62),
] as Shadows;
