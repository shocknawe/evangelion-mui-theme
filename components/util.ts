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

/**
 * The `classes` prop for a component whose slot keys are `Keys` (record
 * `notes/2.3-classes-naming-decision.md`).
 *
 * `root` is always the first key and always targets the outermost element, so
 * the type refuses any key set that omits it (that mis-declaration resolves to
 * `never` and fails to typecheck at the component's own props interface).
 * `Partial` means a consumer overrides only the parts they touch; absent keys
 * keep the library default styling.
 *
 *   classes?: ClassesOf<'root' | 'header' | 'foot'>
 */
export type ClassesOf<Keys extends string> = 'root' extends Keys ? Partial<Record<Keys, string>> : never;

/**
 * Append-only class join (a minimal `clsx`). Falsy parts are dropped, never
 * overwrite: the CSS cascade decides precedence, the class list only grows.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * The generated class for one part of one component — `Nerv<ComponentName>-<part>`
 * (record `notes/2.3` §2: PascalCase component name, single hyphen, camelCase
 * part; no per-variant suffixes).
 */
export function nervClass(component: string, part = 'root'): string {
  return `Nerv${component}-${part}`;
}

/**
 * The full class list for one element of a component, in the recorded merge
 * order (`notes/2.3` §5): generated `Nerv<ComponentName>-<part>` →
 * `classes[part]` → any extra classes (on the root element that is the
 * consumer's `className`). Append-only — a supplied class is added to the
 * element's class list, never substituted for the generated one.
 *
 *   <Box {...rest} className={resolveClasses('Stamp', 'root', classes, className)}>
 *   <Box className={resolveClasses('TelemetryCard', 'foot', classes)}>
 */
export function resolveClasses<Keys extends string, Part extends Keys>(
  component: string,
  part: Part,
  classes: Partial<Record<Keys, string>> | undefined,
  ...extra: Array<string | false | null | undefined>
): string {
  return cx(nervClass(component, part), classes?.[part], ...extra);
}

/** The mint-fill focus ring used across interactive console controls. */
export const focusRing = (t: Theme) => ({
  outline: `2px solid ${t.nerv.hue.paper}`,
  outlineOffset: 2,
});
