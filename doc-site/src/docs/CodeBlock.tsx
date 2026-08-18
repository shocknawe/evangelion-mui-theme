/**
 * CodeBlock — doc-site page chrome, not a design-system component.
 *
 * A framed monospace listing with an optional filename bar and a copy action.
 * The library has no code-block component (a console has no use for one), so it
 * lives here; every value still resolves from `theme.nerv.*`.
 */
import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Stamp } from '@components';

export interface CodeBlockProps {
  code: string;
  /** Small label in the header bar (e.g. `terminal`, `App.tsx`). */
  filename?: ReactNode;
  /** Hide the copy button (for one-liners already shown elsewhere). */
  noCopy?: boolean;
}

export function CodeBlock({ code, filename, noCopy = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <Box
      sx={(t) => ({
        border: `1px solid ${t.nerv.hue.greenDim}`,
        background: t.nerv.hue.void,
        boxShadow: 'inset 0 0 8px rgba(242,100,0,.06)',
      })}
    >
      {(filename || !noCopy) && (
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
            textTransform: 'uppercase',
          })}
        >
          {filename ?? 'SNIPPET'}
          {!noCopy && (
            <Button
              variant="ghost"
              size="small"
              onClick={copy}
              sx={{ ml: 'auto', minWidth: 0, py: 0.125, px: 1, fontSize: 9 }}
            >
              {copied ? 'COPIED' : 'COPY'}
            </Button>
          )}
        </Box>
      )}
      <Box
        component="pre"
        sx={(t) => ({
          m: 0,
          p: 1.75,
          overflowX: 'auto',
          fontFamily: t.nerv.fonts.mono,
          fontSize: 12,
          lineHeight: 1.65,
          letterSpacing: '0.02em',
          color: t.nerv.hue.mint,
          textTransform: 'none',
          tabSize: 2,
        })}
      >
        <code>{code}</code>
      </Box>
    </Box>
  );
}

/** A single-line import statement — the header of every component page. */
export function ImportLine({ code }: { code: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <Stamp tone="orange" size="sm">
        IMPORT
      </Stamp>
      <Box
        component="code"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.mono,
          fontSize: 12,
          color: t.nerv.hue.mint,
          letterSpacing: '0.02em',
          textTransform: 'none',
        })}
      >
        {code}
      </Box>
    </Box>
  );
}
