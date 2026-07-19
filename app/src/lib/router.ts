/**
 * Minimal path router — no dependency, no hash (the design-system page owns the
 * URL hash for its scroll-spy TOC, so page routing stays on `pathname`).
 * Vite's SPA fallback serves index.html for every path in dev, preview and build.
 */
import { useEffect, useState } from 'react';

const listeners = new Set<() => void>();

/** Navigate to a path, updating history and notifying `useRoute` subscribers. */
export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState({}, '', to);
  listeners.forEach((l) => l());
}

/** Current `location.pathname`, re-rendering on navigation or back/forward. */
export function useRoute(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    listeners.add(on);
    window.addEventListener('popstate', on);
    return () => {
      listeners.delete(on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  return path;
}
