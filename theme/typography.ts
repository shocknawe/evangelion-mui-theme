/**
 * Typography — three faces on real contrast axes:
 *   display  (condensed grotesque, ALL CAPS)  — headings, buttons, big numerals
 *   mono     (monospace)                        — body, data, labels, terminal
 *   jp       (Mincho serif)                     — the large kanji graphic
 *
 * Bimodal scale: cluster at the tiny end (labels/data 10–14px) and the large end
 * (headings 22px → hero clamp). Mid-sizes are avoided — they read generic.
 *
 * Per the product register, headings use a fixed rem scale (they live in dense
 * UI); only the hero (`h1`) uses the one sanctioned clamp().
 */
import type { TypographyVariantsOptions } from '@mui/material/styles';
import { fluid, fonts } from './tokens';

const CAPS = {
  fontFamily: fonts.display,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  lineHeight: 1.05,
};

export const typography: TypographyVariantsOptions = {
  fontFamily: fonts.mono,
  fontSize: 13, // base data/UI size
  htmlFontSize: 16,
  fontWeightLight: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 700,
  fontWeightBold: 700,

  // Display — condensed caps. h1 is the one clamp() (hero) exception.
  h1: { ...CAPS, fontSize: fluid.hero, letterSpacing: '0.02em' },
  h2: { ...CAPS, fontSize: '1.75rem', letterSpacing: '0.02em' },
  h3: { ...CAPS, fontSize: '1.375rem', letterSpacing: '0.03em' },
  h4: { ...CAPS, fontSize: '1.125rem', letterSpacing: '0.04em' },
  h5: { ...CAPS, fontSize: '1rem', letterSpacing: '0.06em' },
  h6: { ...CAPS, fontSize: '0.8125rem', letterSpacing: '0.12em' }, // zone titles

  // Subtitles ride the mono face (metadata / KEY:VALUE blocks).
  subtitle1: {
    fontFamily: fonts.mono,
    fontSize: '0.8125rem',
    fontWeight: 400,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
  subtitle2: {
    fontFamily: fonts.mono,
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },

  // Body — monospace. body1 for reading prose (cap line length at 65–75ch in
  // layout), body2 for dense data.
  body1: {
    fontFamily: fonts.mono,
    fontSize: '0.875rem',
    letterSpacing: '0.02em',
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: fonts.mono,
    fontSize: '0.8125rem',
    letterSpacing: '0.03em',
    lineHeight: 1.5,
  },

  // Buttons — condensed caps.
  button: {
    fontFamily: fonts.display,
    fontWeight: 700,
    fontSize: '0.8125rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    lineHeight: 1,
  },

  // Caption / overline — the label role (wide-tracked mono caps).
  caption: {
    fontFamily: fonts.mono,
    fontSize: '0.625rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
  overline: {
    fontFamily: fonts.mono,
    fontSize: '0.625rem',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },

  /* -------- custom variants (see augmentation.ts) -------- */

  // Large kanji graphic. Mincho, weight 800, no transform, wide tracking with a
  // matching text-indent so the glyph re-centers.
  jp: {
    fontFamily: fonts.jp,
    fontWeight: 800,
    fontSize: '2.5rem',
    lineHeight: 1,
    letterSpacing: '0.1em',
    textIndent: '0.1em',
    textTransform: 'none',
  },
  // Terminal / log line.
  terminal: {
    fontFamily: fonts.mono,
    fontSize: '0.75rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    lineHeight: 1.5,
  },
  // Boxed status-stamp text.
  stamp: {
    fontFamily: fonts.mono,
    fontSize: '0.6875rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
  // Tabular numeric readout.
  data: {
    fontFamily: fonts.mono,
    fontSize: '0.8125rem',
    letterSpacing: '0.04em',
    lineHeight: 1.3,
    fontVariantNumeric: 'tabular-nums',
  },
};
