/**
 * A landing-page preview tile: renders a component's seed snippet live inside a
 * clipped frame, with a footer that links to its full page.
 *
 * The render is deferred until the tile scrolls near the viewport — there are
 * ~60 of these and several drive canvases or interval timers — and any render
 * error is contained to the tile.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { compile, PreviewBoundary } from '../playground/compile';

export interface ComponentPreviewProps {
  slug: string;
  name: string;
  /** Seed snippet to render (from `examples.ts`). */
  code: string;
}

export function ComponentPreview({ slug, name, code }: ComponentPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  const Comp = useMemo(() => {
    if (!visible) return null;
    try {
      return compile(code);
    } catch {
      return null;
    }
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
        {Comp && (
          <PreviewBoundary key={slug}>
            <Comp />
          </PreviewBoundary>
        )}
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
