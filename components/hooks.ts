import { useEffect, useState } from 'react';

/**
 * Live `prefers-reduced-motion` flag. Every animated Phosphor Console component
 * reads this and settles to its final state (no ticking) when it is `true`, so
 * the design system's reduced-motion contract holds automatically.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Zero-pad a number to two digits (`7` → `"07"`). */
export const pad2 = (n: number) => String(n).padStart(2, '0');
