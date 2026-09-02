/**
 * Text primitives — the bimodal, bilingual type pairings the design system uses
 * everywhere: one giant element (kanji / numeral) beside a tiny caption, plus
 * the KEY:VALUE metadata block and the numbered section divider.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { type ClassesOf, type RootHTMLAttributes, type WithRef, type Tone, resolveClasses, toneHue } from './util';

/* ------------------------------------------------------------------ */
/* BilingualLabel — large kanji + small English caption (the bimodal pair). */

export interface BilingualLabelProps extends RootHTMLAttributes, WithRef {
  /** The large graphic term (kanji, numeral, or heading). */
  jp: string;
  /** The small caption pinned to it. Required by the "bilingual pairing" rule. */
  en?: string;
  /** Hue of the large term. @default 'mint' */
  tone?: Tone;
  /** Hue of the caption. @default 'green' */
  captionTone?: Tone;
  /** Font size (px) of the large term. @default 40 */
  size?: number;
  /** Caption beside (row) or beneath (column) the term. @default 'row' */
  layout?: 'row' | 'column';
  /** Class overrides by part: `root` (the pairing). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * The signature bimodal pair — a big Mincho graphic term carrying a tiny
 * monospace caption. Satisfies the "large kanji always carries a small English
 * caption" rule for you.
 *
 * @example
 * <BilingualLabel jp="内部" en="INTERNAL" tone="mint" />
 */
export function BilingualLabel({
  jp,
  en,
  tone = 'mint',
  captionTone = 'green',
  size = 40,
  layout = 'row',
  classes,
  className,
  sx,
  ...rest
}: BilingualLabelProps) {
  return (
    <Box
      {...rest}
      className={resolveClasses('BilingualLabel', 'root', classes, className)}
      sx={[
        {
          display: 'inline-flex',
          flexDirection: layout,
          alignItems: layout === 'row' ? 'baseline' : 'flex-start',
          gap: layout === 'row' ? 1 : 0.25,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.jp,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: '0.08em',
          color: toneHue(t, tone),
        })}
      >
        {jp}
      </Box>
      {en && (
        <Box
          component="span"
          sx={(t) => ({
            fontFamily: t.nerv.fonts.mono,
            fontSize: Math.max(8, Math.round(size * 0.26)),
            letterSpacing: '0.2em',
            color: toneHue(t, captionTone),
          })}
        >
          {layout === 'row' ? `/ ${en}` : en}
        </Box>
      )}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* MetadataBlock — the KEY:VALUE spec block (CODE:, FILE:, EX_MODE:, …). */

export interface MetadataBlockProps extends RootHTMLAttributes, WithRef {
  /** Key/value pairs, in order. Keys are shown verbatim (already ALL CAPS). */
  entries: Record<string, string> | Array<[string, string]>;
  /** Hue of the keys. @default 'orange' */
  keyTone?: Tone;
  /** Class overrides by part: `root` (the block). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A monospace `KEY:VALUE` metadata block. Keys read as chrome; values are the
 * dim rust ink the terminal uses for non-text chrome.
 *
 * @example
 * <MetadataBlock entries={{ CODE: '0771', FILE: 'GATE_INTAKE', EX_MODE: 'MANUAL' }} />
 */
export function MetadataBlock({ entries, keyTone = 'orange', classes, className, sx, ...rest }: MetadataBlockProps) {
  const rows = Array.isArray(entries) ? entries : Object.entries(entries);
  return (
    <Box
      {...rest}
      className={resolveClasses('MetadataBlock', 'root', classes, className)}
      sx={[
        (t) => ({
          fontFamily: t.nerv.fonts.mono,
          fontSize: 11,
          lineHeight: 1.6,
          letterSpacing: '0.05em',
          color: toneHue(t, keyTone),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {rows.map(([k, val]) => (
        <Box key={k}>
          {k}:
          <Box component="b" sx={(t) => ({ color: t.nerv.hue.amberDim, fontWeight: 400 })}>
            {val}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* SectionDivider — index chip · kanji · title · gradient rule. */

export interface SectionDividerProps extends RootHTMLAttributes, WithRef {
  /** Sequence number/label shown in the solid chip (e.g. `"01"`). */
  index: string;
  /** Large kanji term. */
  jp: string;
  /** English title. */
  title: string;
  /** Class overrides by part: `root` (the divider row). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A numbered section divider: a filled index chip, the bilingual heading, and a
 * fading orange rule. Number a sequence only when it *is* one.
 *
 * @example
 * <SectionDivider index="01" jp="個体" title="IDENTITY" />
 */
export function SectionDivider({ index, jp, title, classes, className, sx, ...rest }: SectionDividerProps) {
  return (
    <Box
      {...rest}
      className={resolveClasses('SectionDivider', 'root', classes, className)}
      sx={[
        { display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 13,
          color: t.nerv.hue.void,
          background: t.nerv.hue.orange,
          p: '2px 8px',
        })}
      >
        {index}
      </Box>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.jp,
          fontWeight: 800,
          fontSize: 18,
          color: t.nerv.hue.orange,
          letterSpacing: '0.1em',
        })}
      >
        {jp}
      </Box>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 15,
          color: t.nerv.hue.paper,
          letterSpacing: '0.1em',
        })}
      >
        {title}
      </Box>
      <Box sx={(t) => ({ flex: 1, height: 2, background: `linear-gradient(90deg, ${t.nerv.hue.orange}, transparent)` })} />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* FieldLabel — the bilingual label that captions a form control. */

export interface FieldLabelProps extends RootHTMLAttributes, WithRef {
  /** Kanji tag (e.g. `件名`). */
  jp: string;
  /** English label (ALL CAPS). */
  label: string;
  /** The control this labels. */
  children: ReactNode;
  /** Rendered `htmlFor` target if the child input has an id. */
  htmlFor?: string;
  /** Class overrides by part: `root` (the label + control wrapper). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * The shared field grammar: a bilingual caption above its control.
 *
 * @example
 * <FieldLabel jp="件名" label="TEXT INPUT"><TextField fullWidth /></FieldLabel>
 */
export function FieldLabel({ jp, label, children, htmlFor, classes, className, sx, ...rest }: FieldLabelProps) {
  return (
    <Box {...rest} className={resolveClasses('FieldLabel', 'root', classes, className)} sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box
        component="label"
        htmlFor={htmlFor}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          fontSize: 10,
          letterSpacing: '0.14em',
          color: t.nerv.hue.orange,
          mb: '6px',
          fontFamily: t.nerv.fonts.mono,
        })}
      >
        <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 13, color: t.nerv.hue.orange })}>
          {jp}
        </Box>
        {label}
      </Box>
      {children}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHeading — a marketing section head: index chip · heading · rule · note. */

export interface SectionHeadingProps extends RootHTMLAttributes, WithRef {
  /** Sequence number shown in the solid chip (e.g. `"01"`). */
  index: string;
  /** The heading text (condensed caps). */
  children: ReactNode;
  /** Right-aligned note after the fading rule (orange chrome). */
  note?: ReactNode;
  /** Class overrides by part: `root` (the heading row). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A numbered landing-section header: a filled orange index chip, a large
 * condensed heading, a fading orange rule, and an optional right-aligned note.
 * Bigger and looser than {@link SectionDivider} (which is for numbered form
 * sequences); use this for marketing section breaks. Number a sequence only when
 * it *is* one.
 *
 * @example
 * <SectionHeading index="02" note="LIVE · 1HZ">SYSTEM TELEMETRY</SectionHeading>
 */
export function SectionHeading({ index, children, note, classes, className, sx, ...rest }: SectionHeadingProps) {
  return (
    <Box {...rest} className={resolveClasses('SectionHeading', 'root', classes, className)} sx={[{ display: 'flex', alignItems: 'center', gap: 1.75, width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box
        component="span"
        sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 13, color: t.nerv.hue.void, background: t.nerv.hue.orange, p: '3px 8px', letterSpacing: '0.1em', flex: 'none' })}
      >
        {index}
      </Box>
      <Box
        component="h2"
        sx={(t) => ({
          m: 0,
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 'clamp(22px, 3vw, 34px)',
          color: t.nerv.hue.mintHi,
          letterSpacing: '0.03em',
          textShadow: '0 0 8px rgba(82,242,154,.3)',
          textTransform: 'uppercase',
        })}
      >
        {children}
      </Box>
      <Box sx={(t) => ({ flex: 1, height: 2, background: `linear-gradient(90deg, ${t.nerv.hue.orange}, transparent)` })} />
      {note && <Box component="span" sx={(t) => ({ fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.12em', whiteSpace: 'nowrap', flex: 'none', fontFamily: t.nerv.fonts.mono })}>{note}</Box>}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* DossierSheet — a spec/dossier block: teal-ruled heading · KEY/VALUE rows ·
   signature footer, with an optional rotated watermark stamp. */

/** `title` is the sheet's display heading, not the DOM `title`. */
export interface DossierSheetProps extends Omit<RootHTMLAttributes, 'title'>, WithRef {
  /** Heading (e.g. `JAIRUS_OS · CORE v2.4.0 — OPERATOR DOSSIER`). */
  title: ReactNode;
  /** Key/value spec rows. Values may be rich (bold via `<b>`). */
  rows: Array<[ReactNode, ReactNode]>;
  /** Rotated corner watermark (e.g. `PRELIMINARY`). */
  watermark?: ReactNode;
  /** Signature footer: two ruled lines + a stamp. */
  signature?: { left: ReactNode; right: ReactNode; stamp: ReactNode };
  /** Class overrides by part: `root` (the sheet), `watermark`, `signature` (the footer row). */
  classes?: ClassesOf<'root' | 'watermark' | 'signature'>;
  sx?: SxProps<Theme>;
}

/**
 * A dossier / deployment-spec block: a mint heading over a teal double-rule, a
 * grid of KEY/VALUE rows on dashed separators, and an optional signature footer —
 * plus an optional rotated red watermark (`PRELIMINARY`). The editorial "official
 * document" surface.
 */
export function DossierSheet({ title, rows, watermark, signature, classes, className, sx, ...rest }: DossierSheetProps) {
  return (
    <Box {...rest} className={resolveClasses('DossierSheet', 'root', classes, className)} sx={[(t) => ({ border: `1px solid ${t.nerv.hue.greenDim}`, background: t.nerv.hue.void, p: '26px 30px', position: 'relative', overflow: 'hidden' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      {watermark && (
        <Box component="span" className={resolveClasses('DossierSheet', 'watermark', classes)} sx={(t) => ({ position: 'absolute', top: 14, right: -2, transform: 'rotate(4deg)', border: `2px solid ${t.nerv.hue.redHi}`, color: t.nerv.hue.redHi, fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 13, p: '3px 12px', letterSpacing: '0.14em', opacity: 0.85 })}>{watermark}</Box>
      )}
      <Box sx={(t) => ({ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 20, color: t.nerv.hue.mintHi, letterSpacing: '0.03em', borderBottom: `2px solid ${t.nerv.hue.teal}`, pb: 1.25, mb: 0.75 })}>{title}</Box>
      <Box sx={(t) => ({ borderBottom: `2px solid ${t.nerv.hue.teal}`, width: '60%', height: 2, mb: 2.25 })} />
      {rows.map(([k, v], i) => (
        <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 1.25, fontSize: 11, py: '7px', borderBottom: '1px dashed rgba(60,156,108,.25)', textTransform: 'none' }}>
          <Box component="span" sx={(t) => ({ color: t.nerv.hue.orange, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10, fontFamily: t.nerv.fonts.mono })}>{k}</Box>
          <Box component="span" sx={(t) => ({ color: t.nerv.hue.mint, opacity: 0.85, fontFamily: t.nerv.fonts.mono, '& b': { color: t.nerv.hue.mintHi, fontWeight: 400 } })}>{v}</Box>
        </Box>
      ))}
      {signature && (
        <Box className={resolveClasses('DossierSheet', 'signature', classes)} sx={{ mt: 2.75, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2.5 }}>
          <Box sx={(t) => ({ flex: 1, borderTop: `1px solid ${t.nerv.hue.greenMap}`, pt: 0.75, fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono })}>{signature.left}</Box>
          <Box sx={(t) => ({ flex: 1, borderTop: `1px solid ${t.nerv.hue.greenMap}`, pt: 0.75, fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono })}>{signature.right}</Box>
          <Box component="span" sx={(t) => ({ border: `1px solid ${t.nerv.hue.mint}`, color: t.nerv.hue.mint, fontSize: 10, p: '4px 10px', letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono })}>{signature.stamp}</Box>
        </Box>
      )}
    </Box>
  );
}
