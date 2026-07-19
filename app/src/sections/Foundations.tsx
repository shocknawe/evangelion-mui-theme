/**
 * 01 · FOUNDATIONS — the token layer: color swatches (read live from
 * theme.nerv.hue), the three type roles, and the border/chamfer/glow vocabulary.
 */
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type Theme } from '@mui/material/styles';
import { Section, ZoneTitle, SpecCard, SpecGrid } from '../components/primitives';

type HueKey = keyof Theme['nerv']['hue'];

const SWATCHES: [HueKey, string][] = [
  ['void', 'BG / VOID'],
  ['mint', 'MINT · PRIMARY'],
  ['mintHi', 'MINT-HI'],
  ['greenMap', 'GREEN-MAP'],
  ['greenDim', 'GREEN-DIM'],
  ['paper', 'PAPER'],
  ['orange', 'ORANGE · CHROME'],
  ['amber', 'AMBER · TERM'],
  ['amberDim', 'AMBER-DIM'],
  ['red', 'RED'],
  ['redHi', 'RED-HI · ERROR'],
  ['crimson', 'CRIMSON · STRIPE'],
  ['teal', 'TEAL'],
  ['blue', 'BLUE · PENDING'],
];

function TypeRow({ tag, children }: { tag: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, borderBottom: `1px dotted ${t.nerv.hue.greenDim}`, py: 1.5 }}>
      <Box component="span" sx={{ fontSize: 9, color: t.nerv.hue.greenMap, width: 120, flex: 'none', letterSpacing: '0.08em', fontFamily: t.nerv.fonts.mono }}>{tag}</Box>
      <span>{children}</span>
    </Box>
  );
}

export function Foundations() {
  const t = useTheme();
  return (
    <Section id="foundations" idx="01" kanji="基盤" title="FOUNDATIONS" note="Tokens live in theme/tokens.ts and reach components as theme.nerv.* and CSS variables. Color = state, orange = chrome, black is the only surface.">
      <ZoneTitle>COLOR TOKENS</ZoneTitle>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 1.25 }}>
        {SWATCHES.map(([key, name]) => {
          const hex = t.nerv.hue[key];
          return (
            <Box key={key} sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, overflow: 'hidden' }}>
              <Box sx={{ height: 52, background: hex, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)' }} />
              <Box sx={{ p: '6px 8px', fontSize: 9, lineHeight: 1.5, color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>
                <Box component="b" sx={{ display: 'block', color: t.nerv.hue.mint, fontSize: 11, letterSpacing: '0.04em', fontWeight: 400 }}>{name}</Box>
                <Box component="code" sx={{ color: t.nerv.hue.amber, fontSize: 9 }}>{hex} · nerv.hue.{key}</Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <ZoneTitle>TYPE ROLES</ZoneTitle>
      <Box>
        <TypeRow tag="DISPLAY · COND">
          <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 34, color: t.nerv.hue.paper, textTransform: 'uppercase' }}>TACTICAL DISPLAY 0847</Box>
        </TypeRow>
        <TypeRow tag="MONO · DATA">
          <Box component="span" sx={{ fontFamily: t.nerv.fonts.mono, fontSize: 15, color: t.nerv.hue.mint }}>CODE:0771 · FILE:GATE_INTAKE · OK</Box>
        </TypeRow>
        <TypeRow tag="JP · MINCHO 800">
          <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 30, color: t.nerv.hue.orange, letterSpacing: '0.1em' }}>警戒 起動 承認</Box>
        </TypeRow>
        <TypeRow tag="BIMODAL PAIR">
          <span>
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 40, color: t.nerv.hue.mint }}>内部</Box>{' '}
            <Box component="span" sx={{ fontSize: 10, color: t.nerv.hue.greenMap, letterSpacing: '0.2em' }}>/ INTERNAL</Box>
          </span>
        </TypeRow>
      </Box>

      <ZoneTitle>BORDERS · CHAMFER · GLOW</ZoneTitle>
      <SpecGrid cols={4}>
        <SpecCard label="1PX IDLE" src="greenDim">
          <Box sx={{ width: 80, height: 56, border: `1px solid ${t.nerv.hue.greenDim}` }} />
        </SpecCard>
        <SpecCard label="2PX + GLOW" src="orange">
          <Box sx={{ width: 80, height: 56, border: `2px solid ${t.nerv.hue.orange}`, boxShadow: '0 0 8px rgba(242,100,0,.4)' }} />
        </SpecCard>
        <SpecCard label="CHAMFER" src="nerv.chamfer()">
          <Box sx={{ width: 80, height: 56, border: `2px solid ${t.nerv.hue.orange}`, clipPath: t.nerv.chamfer(16) }} />
        </SpecCard>
        <SpecCard label="TEAL DOUBLE-RULE" src="header">
          <Box sx={{ width: 96, height: 10, borderTop: `3px solid ${t.nerv.hue.teal}`, borderBottom: `3px solid ${t.nerv.hue.teal}` }} />
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
