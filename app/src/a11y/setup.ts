/**
 * jsdom shims for the axe harness.
 *
 * jsdom implements no layout engine and no real CSS cascade, so a handful of
 * browser APIs that MUI (and the theme) rely on are missing. Each shim here is a
 * no-op stub — enough for React to mount the live examples, never enough to
 * fake a pass/fail for axe (rules that need layout are disabled in axe-config.ts
 * instead, where the gap is explicit).
 */

// React 19 + @testing-library/react act() environment.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// MUI useMediaQuery / useReducedMotion. Tests can opt into reduced motion before
// mounting a fixture; the default remains the browser's normal no-preference.
let reducedMotion = false;

export function setReducedMotion(value: boolean): void {
  reducedMotion = value;
}

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// MUI Popover / Menu / Tabs / Slider measure their trigger.
class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  (window as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver =
    ResizeObserverStub;
  (globalThis as unknown as { ResizeObserver?: typeof ResizeObserverStub }).ResizeObserver =
    ResizeObserverStub;
}

// MUI Menu/Select scroll an item into view on keyboard focus.
if (typeof window !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView(): void {};
}

// jsdom has no window.scrollTo; landing pages scroll on nav.
if (typeof window !== 'undefined' && typeof window.scrollTo !== 'function') {
  window.scrollTo = () => {};
}
