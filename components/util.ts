import type { Theme } from '@mui/material/styles';
import '../theme/augmentation'; // side-effect: theme.nerv / palette.nerv module augmentation

/**
 * Semantic tones — the design system's "color = state" vocabulary, mapped to the
 * canonical hue for each. Components take a `tone` rather than a raw hex so a
 * consumer never hardcodes a color off-token.
 *
 *   mint   nominal / primary / success        green  secondary data / captions
 *   amber  caution / terminal                 blue   pending / in-review
 *   red    critical / error                   orange chrome (borders, chips) — never a data value
 *   paper  max-brightness fill                 dim    idle border / disabled
 */
export type Tone = 'mint' | 'green' | 'amber' | 'blue' | 'red' | 'orange' | 'paper' | 'dim' | 'teal';

/** Resolve a {@link Tone} to its canonical `theme.nerv.hue` value. */
export function toneHue(t: Theme, tone: Tone): string {
  const h = t.nerv.hue;
  switch (tone) {
    case 'mint': return h.mint;
    case 'green': return h.greenMap;
    case 'amber': return h.amber;
    case 'blue': return h.blue;
    case 'red': return h.redHi;
    case 'orange': return h.orange;
    case 'paper': return h.paper;
    case 'dim': return h.greenDim;
    case 'teal': return h.teal;
  }
}

/** The mint-fill focus ring used across interactive console controls. */
export const focusRing = (t: Theme) => ({
  outline: `2px solid ${t.nerv.hue.paper}`,
  outlineOffset: 2,
});
