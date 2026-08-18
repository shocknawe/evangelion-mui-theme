/**
 * A landing-page preview tile: renders a component's seed snippet live inside a
 * clipped frame, with a footer that links to its full page.
 *
 * The preview mounts only while the tile is near the viewport — there are ~60
 * of these and several drive canvases or interval timers — and unmounts again
 * when it scrolls away, so offscreen tiles stop ticking. The transpiled body is
 * cached per seed, so scrolling back doesn't recompile.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { transpile, SandboxPreview } from '../playground/compile';

export interface ComponentPreviewProps {
  slug: string;
  name: string;
  /** Seed snippet to render (from `examples.ts`). */
  code: string;
}

export function ComponentPreview({ slug, name, code }: ComponentPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Track both entry and exit: mount the preview near the viewport, unmount it
  // when it scrolls away so its timers/canvas loops stop.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: '240px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Transpile lazily on first visibility, then cache per seed so scrolling back
  // doesn't recompile.
  const cacheRef = useRef<Map<string, string | null>>(new Map());
  const js = useMemo(() => {
    if (!visible) return null;
    if (cacheRef.current.has(code)) return cacheRef.current.get(code);
    let out: string | null = null;
    try {
      out = transpile(code);
    } catch {
      out = null;
    }
    cacheRef.current.set(code, out);
    return out;
  }, [visible, code]);

  return (
    <Box
      sx={(t) => ({
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: `1px solid ${t.nerv.hue.greenDim}`,
        background: t.nerv.hue.void,
        transition: `border-color ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}, box-shadow ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}`,
        '&:hover': { borderColor: t.nerv.hue.orange, boxShadow: '0 0 12px rgba(242,100,0,.14)' },
      })}
    >
      <Box
        ref={ref}
        sx={(t) => ({
          // Local containing block so a demo's fixed/sticky chrome is clipped to
          // the tile rather than escaping to the viewport.
          transform: 'translateZ(0)',
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          p: 2,
          height: 208,
          overflow: 'hidden',
          borderBottom: `1px solid ${t.nerv.hue.greenDim}`,
        })}
      >
        {js && <SandboxPreview js={js} />}
      </Box>

      <Box
        component="a"
        href={`#/components/${slug}`}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 1.5,
          py: 1,
          textDecoration: 'none',
          fontFamily: t.nerv.fonts.mono,
          fontSize: 11,
          letterSpacing: '0.06em',
          color: t.nerv.hue.mint,
          transition: `background ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}`,
          '&:hover': { background: 'rgba(82,242,154,.06)', color: t.nerv.hue.mintHi },
          '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: -2 },
        })}
      >
        <Typography component="span" sx={{ fontSize: 'inherit', fontFamily: 'inherit', letterSpacing: 'inherit' }}>
          {name}
        </Typography>
        <Box component="span" sx={(t) => ({ color: t.nerv.hue.orange })}>
          →
        </Box>
      </Box>
    </Box>
  );
}
