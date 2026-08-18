/**
 * The live playground: an editable snippet whose JSX is transpiled and rendered
 * on every edit. House components and the themed MUI primitives are in scope.
 * A compile error keeps the last good render on screen with the message beneath;
 * a runtime error is caught by the boundary.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import type * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stamp } from '@components';
import { compile, PreviewBoundary } from './compile';

export interface LivePlaygroundProps {
  /** Initial editor contents — a JSX expression or a body ending in `return`. */
  code: string;
  /** Min height of the preview pane (px). @default 240 */
  previewHeight?: number;
}

export function LivePlayground({ code: initial, previewHeight = 240 }: LivePlaygroundProps) {
  const [code, setCode] = useState(initial);
  const [debounced, setDebounced] = useState(initial);

  // Reseed when navigating to another component page.
  useEffect(() => {
    setCode(initial);
    setDebounced(initial);
  }, [initial]);

  // Debounce so we don't recompile mid-token on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(code), 250);
    return () => clearTimeout(t);
  }, [code]);

  const { Comp, error } = useMemo(() => {
    try {
      return { Comp: compile(debounced), error: null as string | null };
    } catch (e) {
      return { Comp: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [debounced]);

  // Keep the last successful render visible while an edit is mid-flight.
  const lastGood = useRef<React.ComponentType | null>(null);
  if (Comp) lastGood.current = Comp;
  const Active = Comp ?? lastGood.current;

  const dirty = code !== initial;
  const lineCount = code.split('\n').length;

  return (
    <Box>
      <Box
        sx={(t) => ({
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1fr) minmax(0,1fr)' },
          border: `1px solid ${t.nerv.hue.orange}`,
          boxShadow: 'inset 0 0 8px rgba(242,100,0,.1)',
        })}
      >
        <Box
          sx={(t) => ({
            // A local containing block, so any position:fixed/sticky chrome in a
            // demo (headers, rails) is clipped to the preview, not the viewport.
            transform: 'translateZ(0)',
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
            p: 3,
            minHeight: previewHeight,
            maxHeight: 620,
            overflow: 'auto',
            background: t.nerv.hue.void,
            '&::-webkit-scrollbar': { width: 7, height: 7 },
            '&::-webkit-scrollbar-thumb': { background: t.nerv.hue.greenDim },
          })}
        >
          {Active && (
            <PreviewBoundary key={debounced}>
              <Active />
            </PreviewBoundary>
          )}
        </Box>

        <Box
          sx={(t) => ({
            position: 'relative',
            borderLeft: { lg: `1px solid ${t.nerv.hue.greenDim}` },
            borderTop: { xs: `1px solid ${t.nerv.hue.greenDim}`, lg: 0 },
            background: 'rgba(244,159,9,.02)',
          })}
        >
          <Box
            sx={(t) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderBottom: `1px solid ${t.nerv.hue.greenDim}`,
              fontFamily: t.nerv.fonts.mono,
              fontSize: 9,
              letterSpacing: '0.14em',
              color: t.nerv.hue.orange,
            })}
          >
            EDITOR · 編集
            <Box sx={{ ml: 'auto' }}>
              <Stamp tone={dirty ? 'amber' : 'dim'} size="sm" blink={dirty}>
                {dirty ? 'MODIFIED' : 'SEED'}
              </Stamp>
            </Box>
          </Box>

          <Box
            component="textarea"
            spellCheck={false}
            aria-label="Editable component source"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
            rows={Math.max(lineCount + 1, 10)}
            sx={(t) => ({
              display: 'block',
              width: '100%',
              minHeight: previewHeight - 30,
              m: 0,
              p: 1.75,
              border: 0,
              resize: 'vertical',
              outline: 'none',
              background: 'transparent',
              color: t.nerv.hue.mint,
              fontFamily: t.nerv.fonts.mono,
              fontSize: 12,
              lineHeight: 1.65,
              letterSpacing: '0.02em',
              tabSize: 2,
              '&:focus': { boxShadow: 'inset 0 0 0 1px rgba(82,242,154,.5)' },
            })}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          minHeight: 30,
          flexWrap: 'wrap',
        }}
      >
        <Typography
          sx={(t) => ({
            fontFamily: t.nerv.fonts.mono,
            fontSize: 11,
            letterSpacing: '0.04em',
            textTransform: 'none',
            color: error ? t.nerv.hue.redHi : t.nerv.hue.greenMap,
          })}
        >
          {error ?? 'EDIT THE JSX — THE PREVIEW RECOMPILES LIVE.'}
        </Typography>
        <Button variant="ghost" size="small" onClick={() => setCode(initial)} disabled={!dirty}>
          ↺ RESET
        </Button>
      </Box>
    </Box>
  );
}
