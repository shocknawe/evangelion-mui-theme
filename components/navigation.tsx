/**
 * Navigation pieces the theme's stock overrides don't cover: the dim-not-hide
 * filter rail and the wiki-style cross-reference link. (Tabs, Pagination,
 * Breadcrumbs and List are stock MUI carrying the theme.)
 */
import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

/* ------------------------------------------------------------------ */
/* FilterRail — filter chips that DIM non-matching rows rather than hide them. */

export interface FilterRow {
  id: string;
  name: string;
  /** The value this row is matched against. */
  kind: string;
}

export interface FilterRailProps {
  /** Filter values. The `allValue` entry clears the filter (shows everything). */
  filters: string[];
  rows: FilterRow[];
  /** Controlled active filter. */
  value?: string;
  /** Uncontrolled initial filter. @default filters[0] */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** The filter meaning "show all". @default filters[0] */
  allValue?: string;
  sx?: SxProps<Theme>;
}

/**
 * A filter rail that *dims and desaturates* non-matching rows instead of hiding
 * them — the operator never loses their place. Uncontrolled by default.
 */
export function FilterRail({ filters, rows, value, defaultValue, onChange, allValue = filters[0], sx }: FilterRailProps) {
  const [internal, setInternal] = useState(defaultValue ?? allValue);
  const active = value ?? internal;
  const setActive = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  return (
    <Box sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', gap: '5px', mb: 1.25 }}>
        {filters.map((k) => {
          const on = active === k;
          return (
            <Box
              key={k}
              component="button"
              aria-pressed={on}
              onClick={() => setActive(k)}
              sx={(t) => ({
                border: `1px solid ${t.nerv.hue.orange}`,
                background: on ? t.nerv.hue.orange : t.nerv.hue.void,
                color: on ? t.nerv.hue.void : t.nerv.hue.orange,
                fontWeight: on ? 700 : 400,
                fontSize: 10,
                p: '5px 11px',
                cursor: 'pointer',
                fontFamily: t.nerv.fonts.mono,
                '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2 },
              })}
            >
              {k}
            </Box>
          );
        })}
      </Box>
      {rows.map((r) => {
        const dim = active !== allValue && r.kind !== active;
        return (
          <Box
            key={r.id}
            sx={(t) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: `1px solid ${t.nerv.hue.greenDim}`,
              p: '7px 10px',
              mb: '6px',
              fontSize: 11,
              opacity: dim ? 0.25 : 1,
              filter: dim ? 'grayscale(.6)' : 'none',
              transition: 'opacity 120ms linear',
            })}
          >
            <Box component="span" sx={(t) => ({ color: t.nerv.hue.amber, whiteSpace: 'nowrap' })}>
              {r.id}
            </Box>
            <Box component="span" sx={(t) => ({ color: t.nerv.hue.paper, flex: 1 })}>
              {r.name}
            </Box>
            <Box component="span" sx={(t) => ({ fontSize: 8, color: t.nerv.hue.greenMap, letterSpacing: '0.1em' })}>
              {r.kind}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* WikiLink — a [[cross-reference]] that inverts on hover. */

export interface WikiLinkProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

/**
 * A `[[wikilink]]`-style cross reference: dashed mint underline that inverts to a
 * solid mint fill with black text on hover. Renders as an anchor when `href` is
 * given, otherwise a button.
 */
export function WikiLink({ children, href, onClick, sx }: WikiLinkProps) {
  return (
    <Box
      component={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      sx={[
        (t) => ({
          color: t.nerv.hue.mintHi,
          border: 0,
          borderBottom: `1px dashed ${t.nerv.hue.mint}`,
          background: 'none',
          cursor: 'pointer',
          font: 'inherit',
          fontFamily: t.nerv.fonts.mono,
          textDecoration: 'none',
          p: 0,
          '&:hover': { background: t.nerv.hue.mint, color: t.nerv.hue.void },
          '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
