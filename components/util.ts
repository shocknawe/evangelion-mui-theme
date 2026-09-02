import type { ComponentPropsWithoutRef, Ref } from 'react';
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

/**
 * Native attributes for a component's root element (`div` unless noted).
 *
 * Extend a component's props interface with this — omitting any key the
 * component declares itself, so a consumer prop can never be silently captured
 * by a like-named display prop — and spread the leftover props onto the root
 * element. That is what lets `data-testid`, `aria-*`, `onClick`, `className`
 * and `style` reach the DOM. `children` is always omitted here: components
 * declare it explicitly or not at all.
 *
 *   interface StampProps extends RootHTMLAttributes<'span'> { … }
 *   <Box {...rest} sx={…}>
 */
export type RootHTMLAttributes<Tag extends keyof HTMLElementTagNameMap = 'div'> = Omit<
  ComponentPropsWithoutRef<Tag>,
  'children'
>;

/**
 * The React 19 `ref` prop for a component's root element, typed against the
 * same tag as {@link RootHTMLAttributes}. The library deliberately does not use
 * `forwardRef`: every component is a plain function component (React 19 passes
 * `ref` through as an ordinary prop), and every component already spreads its
 * leftover props onto the root element — so `ref` rides the same `...rest`
 * spread and lands on the outermost DOM node.
 *
 *   interface StampProps extends RootHTMLAttributes<'span'>, WithRef<'span'> { … }
 *   <Box component="span" {...rest} sx={…}>          // `ref` flows in `rest`
 *
 * Components whose root element is *not* the spread target (portals, dual
 * button/a roots) destructure `ref` first and attach it deliberately.
 */
export type WithRef<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  ref?: Ref<HTMLElementTagNameMap[Tag]> | undefined;
};

/** The mint-fill focus ring used across interactive console controls. */
export const focusRing = (t: Theme) => ({
  outline: `2px solid ${t.nerv.hue.paper}`,
  outlineOffset: 2,
});
