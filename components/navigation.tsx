/**
 * Navigation pieces the theme's stock overrides don't cover: the dim-not-hide
 * filter rail and the wiki-style cross-reference link. (Tabs, Pagination,
 * Breadcrumbs and List are stock MUI carrying the theme.)
 */
import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';
import { type RootHTMLAttributes } from './util';

/* ------------------------------------------------------------------ */
/* FilterChips — a row of orange scope chips (active = solid inversion). */

/** `value`/`onChange` are the controlled filter, not the DOM ones. */
export interface FilterChipsProps extends Omit<RootHTMLAttributes, 'value' | 'onChange'> {
  /** Chip values. */
  filters: string[];
  /** The active chip. */
  value: string;
  onChange?: (value: string) => void;
  /** Accessible name for the group. */
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

/**
 * A scope-filter chip row: orange outline chips where the active one inverts to a
 * solid orange fill with black content. The chrome half of a filter — pair it
 * with your own rows (dimming non-matches) or use {@link FilterRail} for the
 * bundled list.
 */
export function FilterChips({ filters, value, onChange, ariaLabel, sx, ...rest }: FilterChipsProps) {
  return (
    <Box role="group" aria-label={ariaLabel} {...rest} sx={[{ display: 'flex', gap: '5px' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {filters.map((k) => {
        const on = value === k;
        return (
          <Box
            key={k}
            component="button"
            aria-pressed={on}
            onClick={() => onChange?.(k)}
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
  );
}

/* ------------------------------------------------------------------ */
/* FilterRail — filter chips that DIM non-matching rows rather than hide them. */

export interface FilterRow {
  id: string;
  name: string;
  /** The value this row is matched against. */
  kind: string;
}

/** `value`/`onChange` are the controlled filter, not the DOM ones. */
export interface FilterRailProps extends Omit<RootHTMLAttributes, 'value' | 'onChange'> {
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
export function FilterRail({ filters, rows, value, defaultValue, onChange, allValue = filters[0], sx, ...rest }: FilterRailProps) {
  const [internal, setInternal] = useState(defaultValue ?? allValue);
  const active = value ?? internal;
  const setActive = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  return (
    <Box {...rest} sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <FilterChips filters={filters} value={active} onChange={setActive} sx={{ mb: 1.25 }} />
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
              transition: `opacity ${t.nerv.motion.durations.fast}ms linear`,
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
/* ConsoleNav — a stacked boxed bilingual nav with figure/ground inversion. */

export interface ConsoleNavItem {
  value: string;
  /** Kanji label (top line). */
  jp: string;
  /** English label (bottom line). */
  en: string;
}

/** `value`/`onChange` are the controlled nav selection, not the DOM ones. */
export interface ConsoleNavProps extends Omit<RootHTMLAttributes<'nav'>, 'value' | 'onChange'> {
  items: ConsoleNavItem[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the nav. */
  ariaLabel?: string;
  /**
   * `boxed` (default) = stacked boxed buttons, current inverted to a mint fill.
   * `rail` = compact app-shell links (kanji + label on one line) with a mint
   * left-edge indicator on the current item.
   */
  variant?: 'boxed' | 'rail';
  sx?: SxProps<Theme>;
}

/**
 * The sidebar navigation used across console screens. `boxed` stacks bilingual
 * buttons and inverts the current one to a solid mint fill with black content;
 * `rail` renders quieter one-line links (kanji glyph + label) with a mint
 * left-edge indicator — the app-shell sidebar grammar.
 *
 * @example
 * <ConsoleNav value={s} onChange={setS} items={[{ value: 'eng', jp: '工学', en: 'ENGINEERING' }]} />
 * <ConsoleNav variant="rail" value={s} onChange={setS} items={items} />
 */
export function ConsoleNav({ items, value, onChange, ariaLabel, variant = 'boxed', sx, ...rest }: ConsoleNavProps) {
  const rail = variant === 'rail';
  return (
    <Box
      component="nav"
      aria-label={ariaLabel}
      {...rest}
      sx={[{ display: 'flex', flexDirection: 'column', gap: rail ? '3px' : '6px', minHeight: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {items.map((item) => {
        const on = value === item.value;
        if (rail)
          return (
            <Box
              key={item.value}
              component="button"
              aria-current={on}
              onClick={() => onChange(item.value)}
              sx={(t) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textAlign: 'left',
                cursor: 'pointer',
                background: on ? 'rgba(82,242,154,.08)' : 'transparent',
                border: 0,
                borderLeft: `2px solid ${on ? t.nerv.hue.mint : 'transparent'}`,
                boxShadow: on ? 'inset 0 0 12px rgba(82,242,154,.08)' : 'none',
                color: on ? t.nerv.hue.mintHi : t.nerv.hue.mint,
                opacity: on ? 1 : 0.72,
                fontSize: 12,
                letterSpacing: '0.05em',
                p: '9px 10px',
                fontFamily: t.nerv.fonts.mono,
                '&:hover': on ? null : { opacity: 1, background: 'rgba(82,242,154,.06)', borderLeftColor: t.nerv.hue.greenDim },
                '&:focus-visible': { outline: `2px solid ${t.nerv.hue.amber}`, outlineOffset: 2 },
              })}
            >
              <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontSize: 14, textTransform: 'none', opacity: 0.8, width: 16, flex: 'none' })}>{item.jp}</Box>
              {item.en}
            </Box>
          );
        return (
          <Box
            key={item.value}
            component="button"
            aria-current={on}
            onClick={() => onChange(item.value)}
            sx={(t) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
              textAlign: 'left',
              cursor: 'pointer',
              p: '7px 10px',
              background: on ? t.nerv.hue.mint : t.nerv.hue.void,
              border: `1px solid ${on ? t.nerv.hue.mint : t.nerv.hue.greenDim}`,
              color: on ? t.nerv.hue.void : t.nerv.hue.mint,
              fontWeight: on ? 700 : 400,
              '&:hover': on ? null : { borderColor: t.nerv.hue.mint },
              '&:focus-visible': { outline: `2px solid ${t.nerv.hue.amber}`, outlineOffset: 2 },
            })}
          >
            <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 16, lineHeight: 1, letterSpacing: '0.14em' })}>
              {item.jp}
            </Box>
            <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', opacity: on ? 1 : 0.85 })}>
              {item.en}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Brand — the diamond mark + wordmark + version lockup. */

export interface BrandProps extends RootHTMLAttributes {
  /** Wordmark (e.g. `JAIRUS_OS`). */
  name: ReactNode;
  /** Version / tag (orange chrome). */
  version?: ReactNode;
  /** `md` (nav bars) or `sm` (rails). @default 'md' */
  size?: 'sm' | 'md';
  /** Put the version on its own line under the wordmark. @default false (inline) */
  stackVersion?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * The Jairus OS brand lockup: a glowing mint diamond mark, the wordmark in
 * condensed caps, and an optional orange version tag (inline or stacked). The
 * shared masthead mark for the site header and the app-shell rails.
 */
export function Brand({ name, version, size = 'md', stackVersion = false, sx, ...rest }: BrandProps) {
  const mk = size === 'sm' ? 15 : 16;
  const word = size === 'sm' ? 18 : 20;
  return (
    <Box {...rest} sx={[{ display: 'flex', minWidth: 0, flexDirection: stackVersion ? 'column' : 'row', alignItems: stackVersion ? 'flex-start' : 'baseline' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, fontFamily: (t) => t.nerv.fonts.display, fontWeight: 700 }}>
        <Box sx={(t) => ({ width: mk, height: mk, flex: 'none', background: t.nerv.hue.mint, boxShadow: `0 0 8px ${t.nerv.hue.mint}`, transform: 'rotate(45deg)' })} />
        {/* The wordmark is the only elastic part of the lockup: it truncates
            rather than forcing the bar wider than its container. `py`/`my`
            cancel out — they only widen the clip box so the phosphor glow
            isn't shaved off the top and bottom of the caps. */}
        <Box component="b" sx={(t) => ({ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', py: '5px', my: '-5px', fontSize: word, color: t.nerv.hue.mintHi, textShadow: '0 0 6px rgba(82,242,154,.6)', letterSpacing: '0.04em' })}>{name}</Box>
        {version && !stackVersion && <Box component="span" sx={(t) => ({ flex: 'none', ml: 1, fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.14em' })}>{version}</Box>}
      </Box>
      {version && stackVersion && <Box component="span" sx={(t) => ({ fontSize: 9, color: t.nerv.hue.orange, letterSpacing: '0.14em', pl: '22px', mt: '2px' })}>{version}</Box>}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* SiteHeader — a sticky brand nav bar for landing / marketing pages. */

export interface SiteHeaderLink {
  label: string;
  /** In-page `#anchor` (smooth-scrolled) or a full URL. */
  href: string;
}

export interface SiteHeaderProps extends RootHTMLAttributes<'header'> {
  /** Brand wordmark (e.g. `JAIRUS_OS`). */
  name: ReactNode;
  /** Small version/tag after the wordmark (orange chrome). */
  version?: ReactNode;
  /** Nav links, pushed to the right. */
  links?: SiteHeaderLink[];
  /** Right-most slot (clock, status chip, CTA). */
  actions?: ReactNode;
  /** Max content width (px). @default 1180 */
  maxWidth?: number;
  sx?: SxProps<Theme>;
}

/**
 * The sticky top bar for a landing page: the diamond brand mark + wordmark +
 * version, a row of nav links, and a right-hand actions slot. In-page `#anchor`
 * links smooth-scroll to their target (instant under reduced motion); other hrefs
 * behave normally.
 */
export function SiteHeader({ name, version, links = [], actions, maxWidth = 1180, sx, ...rest }: SiteHeaderProps) {
  const reduced = useReducedMotion();
  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <Box
      component="header"
      {...rest}
      sx={[
        (t) => ({
          position: 'sticky',
          top: 0,
          zIndex: t.zIndex.appBar,
          background: 'rgba(10,10,10,.94)',
          borderBottom: `2px solid ${t.nerv.hue.orange}`,
          boxShadow: '0 0 14px rgba(242,100,0,.25)',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* The bar is a hard container: the brand shrinks, the rest holds its
          size, and `overflow: hidden` guarantees no consumer can push the
          page wider than the viewport. (A header's own box-shadow paints
          outside its box, so the orange glow below is untouched.) */}
      <Box
        sx={{
          maxWidth,
          mx: 'auto',
          px: { xs: 1.5, sm: 3 },
          height: 60,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 3 },
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Brand name={name} version={version} sx={{ flexShrink: 1 }} />
        {links.length > 0 && (
          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 2.5, ml: 'auto', minWidth: 0, fontSize: 11, letterSpacing: '0.12em' }}>
            {links.map((l) => (
              <Box
                key={l.href}
                component="a"
                href={l.href}
                onClick={(e) => onLink(e, l.href)}
                sx={(t) => ({
                  color: t.nerv.hue.mint,
                  opacity: 0.7,
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                  pb: '2px',
                  fontFamily: t.nerv.fonts.mono,
                  '&:hover': { opacity: 1, borderBottomColor: t.nerv.hue.mint },
                  '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2, opacity: 1 },
                })}
              >
                {l.label}
              </Box>
            ))}
          </Box>
        )}
        {actions && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              flexShrink: 0,
              // Below `md` the nav is hidden, so its `ml: 'auto'` is gone —
              // the actions take over pushing themselves to the right edge.
              ml: { xs: 'auto', md: links.length ? 0 : 'auto' },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* WikiLink — a [[cross-reference]] that inverts on hover. */

/** `href`/`onClick` are the link target/handler the component itself renders;
 *  `children` is the link text. Root is an `<a>` when `href` is given, else a
 *  `<button>`. */
export interface WikiLinkProps extends Omit<RootHTMLAttributes<'a'>, 'href' | 'onClick'> {
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
export function WikiLink({ children, href, onClick, sx, ...rest }: WikiLinkProps) {
  return (
    <Box
      component={href ? 'a' : 'button'}
      href={href}
      onClick={onClick}
      {...rest}
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
