/**
 * The ⌘K command palette — fuzzy search over components, props, foundations,
 * and pages, off the generated search index.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Stamp } from '@components';
import { searchIndex, type SearchEntry } from '../siteData';

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'keywords', weight: 2 },
    { name: 'description', weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
});

const TONE: Record<SearchEntry['type'], 'mint' | 'blue' | 'amber' | 'orange'> = {
  component: 'mint',
  api: 'blue',
  foundation: 'amber',
  page: 'orange',
};

export interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    // Focus once the dialog transition has mounted the input.
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  const results: SearchEntry[] = useMemo(
    () => (query.trim() ? fuse.search(query).slice(0, 9).map((r) => r.item) : []),
    [query],
  );

  useEffect(() => setCursor(0), [query]);

  const go = (entry: SearchEntry) => {
    onClose();
    window.location.hash = entry.href.replace(/^#/, '');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{ p: 2 }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCursor((c) => Math.min(c + 1, results.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursor((c) => Math.max(c - 1, 0));
          } else if (e.key === 'Enter' && results[cursor]) {
            e.preventDefault();
            go(results[cursor]);
          }
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="SEARCH COMPONENTS, PROPS, FOUNDATIONS…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the documentation"
        />

        {query.trim() && (
          <Box sx={{ mt: 1.5, display: 'grid', gap: 0.5 }}>
            {results.map((r, i) => (
              <Box
                key={r.href}
                component="button"
                type="button"
                onClick={() => go(r)}
                onMouseEnter={() => setCursor(i)}
                sx={(t) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  p: '8px 10px',
                  background: i === cursor ? 'rgba(82,242,154,.08)' : 'transparent',
                  border: `1px solid ${i === cursor ? t.nerv.hue.mint : 'transparent'}`,
                  borderRadius: 0,
                  fontFamily: t.nerv.fonts.mono,
                })}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box
                    sx={(t) => ({
                      fontSize: 12.5,
                      letterSpacing: '0.05em',
                      color: t.nerv.hue.mintHi,
                    })}
                  >
                    {r.name}
                  </Box>
                  {r.description && (
                    <Box
                      sx={(t) => ({
                        fontSize: 10.5,
                        lineHeight: 1.45,
                        mt: 0.25,
                        color: t.nerv.hue.greenMap,
                        textTransform: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      })}
                    >
                      {r.description}
                    </Box>
                  )}
                </Box>
                <Stamp tone={TONE[r.type]} size="sm">
                  {r.type}
                </Stamp>
              </Box>
            ))}

            {results.length === 0 && (
              <Typography
                sx={(t) => ({
                  px: 1.25,
                  py: 2,
                  fontFamily: t.nerv.fonts.mono,
                  fontSize: 12,
                  color: t.nerv.hue.amber,
                  textTransform: 'none',
                })}
              >
                NO MATCHES FOR “{query}”.
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={(t) => ({
            mt: 1.5,
            pt: 1,
            borderTop: `1px solid ${t.nerv.hue.greenDim}`,
            display: 'flex',
            gap: 1.5,
            fontFamily: t.nerv.fonts.mono,
            fontSize: 9,
            letterSpacing: '0.12em',
            color: t.nerv.hue.greenDim,
          })}
        >
          <span>↑↓ MOVE</span>
          <span>⏎ OPEN</span>
          <span>ESC CLOSE</span>
        </Box>
      </Box>
    </Dialog>
  );
}
