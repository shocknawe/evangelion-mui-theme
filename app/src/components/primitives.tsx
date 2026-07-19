/**
 * Style-guide scaffolding primitives — the frame around each live demo.
 * These are page chrome for the living reference, not design-system components;
 * every value still resolves from theme tokens (theme.nerv.*).
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/** Responsive spec-card grid. `cols` collapses 4/3 → 2 at md, → 1 at sm. */
export function SpecGrid({ cols = 3, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: cols === 2 ? 'repeat(2, 1fr)' : cols === 3 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          md: `repeat(${cols}, 1fr)`,
        },
      }}
    >
      {children}
    </Box>
  );
}

type Verdict = 'keep' | 'warn';

/** A bordered demo cell with a caption footer and optional verdict badge. */
export function SpecCard({
  label,
  src,
  verdict,
  verdictText,
  column,
  flush,
  children,
}: {
  label: string;
  src: string;
  verdict?: Verdict;
  verdictText?: string;
  /** stack demo content vertically */
  column?: boolean;
  /** remove demo padding (for edge-to-edge widgets) */
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      sx={(t) => ({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${t.nerv.hue.greenDim}`,
        backgroundColor: t.nerv.hue.void,
        transition: `border-color ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}, box-shadow ${t.nerv.motion.durations.fast}ms ${t.nerv.motion.linear}`,
        '&:hover': { borderColor: t.nerv.hue.orange, boxShadow: '0 0 12px rgba(242,100,0,.12)' },
      })}
    >
      {verdict && (
        <Box
          component="span"
          sx={(t) => ({
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            fontSize: 8,
            letterSpacing: '0.08em',
            padding: '1px 6px',
            fontFamily: t.nerv.fonts.mono,
            border: `1px solid ${verdict === 'warn' ? t.nerv.hue.amber : t.nerv.hue.mint}`,
            color: verdict === 'warn' ? t.nerv.hue.amber : t.nerv.hue.mint,
          })}
        >
          {verdictText ?? (verdict === 'warn' ? '⚠️ REFINED' : '✅ KEEP')}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 96,
          display: 'flex',
          flexDirection: column ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: column ? 'stretch' : 'center',
          justifyContent: 'center',
          padding: flush ? 0 : '20px 18px',
        }}
      >
        {children}
      </Box>

      <Box
        sx={(t) => ({
          borderTop: `1px solid ${t.nerv.hue.greenDim}`,
          padding: '7px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 1,
          fontFamily: t.nerv.fonts.mono,
          fontSize: 9,
          letterSpacing: '0.08em',
          color: t.nerv.hue.greenMap,
        })}
      >
        <Box component="b" sx={(t) => ({ color: t.nerv.hue.mint, fontWeight: 400, letterSpacing: '0.04em' })}>
          {label}
        </Box>
        <Box component="span" sx={(t) => ({ color: t.nerv.hue.amber, opacity: 0.8 })}>
          {src}
        </Box>
      </Box>
    </Box>
  );
}

/** Section header: index chip · kanji · title · gradient rule. */
export function SectionHead({ idx, kanji, title }: { idx: string; kanji: string; title: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 1 }}>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.1em',
          color: t.nerv.hue.void,
          backgroundColor: t.nerv.hue.orange,
          padding: '3px 9px',
        })}
      >
        {idx}
      </Box>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.jp,
          fontWeight: 800,
          fontSize: 20,
          color: t.nerv.hue.orange,
          textShadow: '0 0 4px currentColor',
        })}
      >
        {kanji}
      </Box>
      <Typography
        variant="h2"
        sx={(t) => ({
          fontSize: 'clamp(20px, 2.6vw, 30px)',
          color: t.nerv.hue.mintHi,
          textShadow: '0 0 8px rgba(82,242,154,.28)',
        })}
      >
        {title}
      </Typography>
      <Box
        sx={(t) => ({ flex: 1, height: 2, background: `linear-gradient(90deg, ${t.nerv.hue.orange}, transparent)` })}
      />
    </Box>
  );
}

/** Zone sub-title inside a section. */
export function ZoneTitle({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={(t) => ({
        fontFamily: t.nerv.fonts.display,
        fontWeight: 700,
        fontSize: 12,
        color: t.nerv.hue.orange,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        borderBottom: `1px solid ${t.nerv.hue.greenDim}`,
        pb: 0.5,
        mt: 3.25,
        mb: 1.75,
      })}
    >
      {children}
    </Box>
  );
}

/** Section note (prose caption under the header). */
export function SecNote({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={(t) => ({
        fontFamily: t.nerv.fonts.mono,
        fontSize: 11,
        color: t.nerv.hue.greenMap,
        letterSpacing: '0.06em',
        textTransform: 'none',
        maxWidth: '80ch',
        lineHeight: 1.6,
        mb: 2.75,
      })}
    >
      {children}
    </Typography>
  );
}

/** A titled section wrapper with scroll-margin for the sticky TOC. */
export function Section({
  id,
  idx,
  kanji,
  title,
  note,
  children,
}: {
  id: string;
  idx: string;
  kanji: string;
  title: string;
  note: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box component="section" id={id} sx={{ pt: 5.5, pb: 1, scrollMarginTop: '12px' }}>
      <SectionHead idx={idx} kanji={kanji} title={title} />
      <SecNote>{note}</SecNote>
      {children}
    </Box>
  );
}
