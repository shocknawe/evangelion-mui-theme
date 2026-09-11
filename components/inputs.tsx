/**
 * Console-specific form controls that MUI has no direct equivalent for: the
 * bilingual radio-chip group, the number stepper, the hazard rating, a tag
 * input, and the segmented date display. Stock inputs (TextField, Select,
 * Checkbox, Switch, Slider, ToggleButtonGroup) are already covered by the theme.
 */
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';
import { type ClassesOf, type RootHTMLAttributes, type SlotsOf, type WithRef, type Tone, focusRing, resolveClasses, resolveSlot, toneHue } from './util';

/* ------------------------------------------------------------------ */
/* ChipRadioGroup — bilingual radio chips with figure/ground inversion. */

export interface ChipRadioOption {
  value: string;
  en: string;
  jp?: string;
  /** Hue when selected. @default 'mint' */
  tone?: Tone;
}

/** `value`/`onChange` are the controlled selection, not the DOM ones. */
export interface ChipRadioGroupProps extends Omit<RootHTMLAttributes, 'value' | 'onChange'>, WithRef {
  options: ChipRadioOption[];
  value: string;
  onChange: (value: string) => void;
  /** Accessible name for the group. */
  ariaLabel?: string;
  /** Class overrides by part: `root` (the group), `option` (a chip button). */
  classes?: ClassesOf<'root' | 'option'>;
  sx?: SxProps<Theme>;
}

/**
 * A single-select group of bilingual chips. Selected = solid tone fill with
 * black content (the inversion) + glow; idle = outline on black.
 *
 * @example
 * <ChipRadioGroup value={p} onChange={setP} ariaLabel="priority" options={[
 *   { value: 'routine',  jp: '通常', en: 'B++', tone: 'green' },
 *   { value: 'critical', jp: '緊急', en: 'AAA', tone: 'red' },
 * ]} />
 */
export function ChipRadioGroup({ options, value, onChange, ariaLabel, classes, className, sx, ...rest }: ChipRadioGroupProps) {
  return (
    <Box role="radiogroup" aria-label={ariaLabel} {...rest} className={resolveClasses('ChipRadioGroup', 'root', classes, className)} sx={[{ display: 'flex', gap: 1, flexWrap: 'wrap' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {options.map((opt) => {
        const on = value === opt.value;
        return (
          <Box
            key={opt.value}
            component="button"
            role="radio"
            className={resolveClasses('ChipRadioGroup', 'option', classes)}
            aria-checked={on}
            onClick={() => onChange(opt.value)}
            sx={(t) => {
              const c = toneHue(t, opt.tone ?? 'mint');
              return {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 82,
                cursor: 'pointer',
                border: `1px solid ${c}`,
                color: on ? t.nerv.hue.void : c,
                background: on ? c : 'transparent',
                boxShadow: on ? `0 0 9px color-mix(in srgb, ${c} 55%, transparent)` : 'none',
                p: '6px 12px 5px',
                borderRadius: `${t.nerv.radius.chip}px`,
                fontWeight: on ? 700 : 400,
                '&:focus-visible': focusRing(t),
              };
            }}
          >
            {opt.jp && (
              <Box component="span" sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 14, letterSpacing: '0.2em', textIndent: '0.2em' })}>
                {opt.jp}
              </Box>
            )}
            <Box component="span" sx={(t) => ({ fontSize: 9, letterSpacing: '0.14em', mt: '2px', fontFamily: t.nerv.fonts.mono })}>
              {opt.en}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* NumberStepper — −/value/+ with orange chrome controls. */

/** `value`/`onChange` are the controlled count, not the DOM ones. */
export interface NumberStepperProps extends Omit<RootHTMLAttributes, 'value' | 'onChange'>, WithRef {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Width of the whole control (px). @default 150 */
  width?: number;
  /** Class overrides by part: `root` (the stepper). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * An integer stepper: orange chrome buttons flanking a monospace readout.
 *
 * @example <NumberStepper value={n} onChange={setN} min={1} max={16} />
 */
export function NumberStepper({ value, onChange, min = 0, max = 99, step = 1, width = 150, classes, className, sx, ...rest }: NumberStepperProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const btn = (t: Theme) => ({
    width: 38,
    background: 'rgba(242,100,0,.1)',
    border: 0,
    color: t.nerv.hue.orange,
    fontSize: 17,
    cursor: 'pointer',
    fontFamily: t.nerv.fonts.display,
    '&:hover': { background: t.nerv.hue.orange, color: t.nerv.hue.void },
    '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: -2 },
  });
  return (
    <Box {...rest} className={resolveClasses('NumberStepper', 'root', classes, className)} sx={[(t) => ({ display: 'flex', alignItems: 'stretch', width, border: `1px solid ${t.nerv.hue.greenDim}` }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box component="button" aria-label="decrement" onClick={() => onChange(clamp(value - step))} sx={btn}>
        −
      </Box>
      <Box
        component="input"
        readOnly
        value={value}
        aria-label="value"
        sx={(t) => ({ border: 0, background: t.nerv.hue.void, color: t.nerv.hue.mint, textAlign: 'center', fontFamily: t.nerv.fonts.mono, width: '100%' })}
      />
      <Box component="button" aria-label="increment" onClick={() => onChange(clamp(value + step))} sx={btn}>
        +
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* HazardRating — lit segments on a hazard-hatched track. */

/** `value`/`onChange` are the controlled rating, not the DOM ones. */
export interface HazardRatingProps extends Omit<RootHTMLAttributes, 'value' | 'onChange'>, WithRef {
  value: number;
  onChange: (value: number) => void;
  /** Number of segments. @default 5 */
  max?: number;
  /** Class overrides by part: `root`, `segment` (a rating cell). */
  classes?: ClassesOf<'root' | 'segment'>;
  sx?: SxProps<Theme>;
}

/**
 * A discrete rating: lit mint segments over a hazard-hatched track. Segments are
 * drawn objects, never a continuous fill.
 */
export function HazardRating({ value, onChange, max = 5, classes, className, sx, ...rest }: HazardRatingProps) {
  return (
    <Box role="radiogroup" aria-label="rating" {...rest} className={resolveClasses('HazardRating', 'root', classes, className)} sx={[{ display: 'flex', gap: '5px' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const lit = n <= value;
        return (
          <Box
            key={n}
            component="button"
            role="radio"
            className={resolveClasses('HazardRating', 'segment', classes)}
            aria-checked={n === value}
            aria-label={String(n)}
            onClick={() => onChange(n)}
            sx={(t) => ({
              width: 34,
              height: 28,
              cursor: 'pointer',
              border: `1px solid ${lit ? t.nerv.hue.mint : t.nerv.hue.greenDim}`,
              background: lit ? t.nerv.hue.mint : `repeating-linear-gradient(-45deg, transparent 0 4px, ${t.palette.nerv.overlayFaint} 4px 8px)`,
              boxShadow: lit ? `0 0 6px color-mix(in srgb, ${t.nerv.hue.mint} 50%, transparent)` : 'none',
              '&:focus-visible': focusRing(t),
            })}
          />
        );
      })}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* TagInput — deletable chips + type-to-add. */

/** Props the `tag` slot receives (notes/2.2 §3). */
export interface TagInputTagProps extends RootHTMLAttributes<'div'> {
  /** The tag text. */
  label?: ReactNode;
  /** Removes this tag from the field. */
  onDelete?: () => void;
}

export interface TagInputSlotProps {
  /** Props merged onto the tag part (default: an MUI `Chip color="success"`). */
  tag?: TagInputTagProps;
}

/** `onChange` is the tag-list callback, not the DOM `onChange`. */
export interface TagInputProps extends Omit<RootHTMLAttributes, 'onChange'>, WithRef {
  tags: string[];
  onChange: (tags: string[]) => void;
  /** Placeholder for the add-field. @default 'ADD TAG…' */
  placeholder?: string;
  /** Uppercase new tags on add. @default true */
  uppercase?: boolean;
  /** Replace an internal part: `tag` (a tag chip — default an MUI `Chip`). */
  slots?: SlotsOf<'tag'>;
  /** Props merged onto each part, consumer props winning. */
  slotProps?: TagInputSlotProps;
  /** Class overrides by part: `root` (the field), `tag` (a tag chip), `input` (the add-field). */
  classes?: ClassesOf<'root' | 'tag' | 'input'>;
  sx?: SxProps<Theme>;
}

/**
 * A tag field: mint stamp chips (deletable) with an inline input that adds a tag
 * on Enter and removes the last on Backspace.
 */
export function TagInput({ tags, onChange, placeholder = 'ADD TAG…', uppercase = true, slots, slotProps, classes, className, sx, ...rest }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = (uppercase ? draft.toUpperCase() : draft).trim().replace(/\s+/g, '_');
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setDraft('');
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };
  return (
    <Box
      {...rest}
      className={resolveClasses('TagInput', 'root', classes, className)}
      sx={[
        (t) => ({ border: `1px solid ${t.nerv.hue.greenDim}`, p: '6px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', width: '100%' }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {tags.map((tag) => {
        const onDelete = () => onChange(tags.filter((x) => x !== tag));
        // `tag` slot (notes/2.2 §3): the only stock-MUI part in the library —
        // the canonical swap-to-`Stamp` case. The custom slot gets the tag's
        // contract (`label` + `onDelete`); `color: 'success'` is the Chip's own.
        const [TagSlot, tagProps] = resolveSlot(slots?.tag, Chip, {
          contract: { label: tag, onDelete },
          defaults: { label: tag, onDelete, color: 'success' as const },
          slotProps: slotProps?.tag,
          className: resolveClasses('TagInput', 'tag', classes),
        });
        return <TagSlot key={tag} {...tagProps} />;
      })}
      <Box
        component="input"
        className={resolveClasses('TagInput', 'input', classes)}
        value={draft}
        placeholder={placeholder}
        aria-label="add tag"
        onChange={(e) => setDraft((e.target as HTMLInputElement).value)}
        onKeyDown={onKey}
        onBlur={add}
        sx={(t) => ({
          flex: 1,
          minWidth: 90,
          border: 0,
          background: 'transparent',
          color: t.nerv.hue.mint,
          fontFamily: t.nerv.fonts.mono,
          fontSize: 12,
          '&::placeholder': { color: t.nerv.hue.greenDim, letterSpacing: '0.1em' },
          '&:focus-visible': { outline: 'none' },
        })}
      />
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* DateSegments — glowing monospace date readout. */

export interface DateSegmentsProps extends RootHTMLAttributes, WithRef {
  /** Ordered segments, largest-first (e.g. `['2026', '07', '18']`). */
  segments: string[];
  /** Separator glyph between segments. @default '/' */
  separator?: string;
  /** Class overrides by part: `root` (the display). */
  classes?: ClassesOf<'root'>;
  sx?: SxProps<Theme>;
}

/**
 * A read-only segmented date/number display — glowing mint monospace digits in
 * bordered cells, joined by an orange separator.
 */
export function DateSegments({ segments, separator = '/', classes, className, sx, ...rest }: DateSegmentsProps) {
  return (
    <Box {...rest} className={resolveClasses('DateSegments', 'root', classes, className)} sx={[{ display: 'flex', alignItems: 'center', gap: '6px' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {segments.map((seg, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {i > 0 && (
            <Box component="span" sx={(t) => ({ color: t.nerv.hue.orange, fontSize: 16 })}>
              {separator}
            </Box>
          )}
          <Box
            sx={(t) => ({
              border: `1px solid ${t.nerv.hue.greenDim}`,
              background: t.nerv.hue.void,
              color: t.nerv.hue.mintHi,
              fontFamily: t.nerv.fonts.mono,
              fontSize: 16,
              textAlign: 'center',
              p: '7px 6px',
              letterSpacing: '0.14em',
              textShadow: '0 0 5px rgba(82,242,154,.4)',
              minWidth: seg.length > 2 ? 66 : 48,
            })}
          >
            {seg}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
