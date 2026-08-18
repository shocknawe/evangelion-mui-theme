/**
 * PROCESS — The Phosphor pipeline.
 *
 * How the theme was actually made, in five stages: video references →
 * experiments → sample layouts → design system → MUI theme. Every stage keeps
 * its artefacts — pick a stage, then open the real thing. Ported from the
 * Singularity frontend debrief's pipeline chapter.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import { Stamp } from '@components';
import { PageHeader } from '../docs/chrome';

/** Public assets are served at the Vite base path (`/` in dev, `/evangelion-mui-theme/` on Pages). */
const P = (p: string) => `${import.meta.env.BASE_URL}pipeline/${p}`;

interface PipelineItem {
  label: string;
  img: string;
  src: string;
  kind: 'video' | 'page';
  tag: string;
  at?: number;
  wide?: boolean;
}

interface PipelineStep {
  n: string;
  jp: string;
  title: string;
  done: boolean;
  v: string;
  k: string;
  card: number;
  desc: string;
  items: PipelineItem[];
  here?: boolean;
  swatches?: boolean;
}

const STEPS: PipelineStep[] = [
  {
    n: '01',
    jp: '映像',
    title: 'VIDEO REFERENCES',
    done: true,
    v: '23',
    k: 'CLIPS',
    card: 400,
    desc: "90's-anime references — Evangelion mostly — gathered before writing a single prompt. Phosphor mint on void black, safety orange, blood red: it all comes from here. Six stills below; click one to play the clip it was pulled from.",
    items: [
      { label: 'BORDER LINE', img: P('thumbs/ref-01-border-line.jpg'), src: P('video/T5XfB2K.mp4'), at: 0.05, kind: 'video', tag: 'NGE' },
      { label: 'CIRCUIT MAP', img: P('thumbs/ref-02-circuit.jpg'), src: P('video/UaCQJdl.mp4'), at: 0.05, kind: 'video', tag: 'NGE' },
      { label: 'GAUGE COLUMNS', img: P('thumbs/ref-03-gauges.jpg'), src: P('video/UaCQJdl.mp4'), at: 1.6, kind: 'video', tag: 'NGE' },
      { label: 'CHEVRON GRID', img: P('thumbs/ref-04-chevrons.jpg'), src: P('video/T5XfB2K.mp4'), at: 0.6, kind: 'video', tag: 'NGE' },
      { label: 'GEOFRONT 予想図', img: P('thumbs/ref-05-geofront.jpg'), src: P('video/y4MaTw6.mp4'), at: 0.6, kind: 'video', tag: 'NGE' },
      { label: 'UNIT READOUT', img: P('thumbs/ref-06-unit.jpg'), src: P('video/T5XfB2K.mp4'), at: 1.6, kind: 'video', tag: 'NGE' },
    ],
  },
  {
    n: '02',
    jp: '実験',
    title: 'EXPERIMENTS',
    done: true,
    v: '34',
    k: 'GENERATED',
    card: 250,
    desc: '<code>/frontend-design</code> and <code>/impeccable</code> generate the first UI passes off those references. Most get thrown away — that\'s the point.',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11].map((i) => {
      const s = 'experiment-' + String(i).padStart(2, '0');
      return { label: s.toUpperCase(), img: P(`thumbs/${s}.jpg`), src: P(`${s}.html`), kind: 'page' as const, tag: 'EXP' };
    }),
  },
  {
    n: '03',
    jp: '配置',
    title: 'SAMPLE LAYOUTS',
    done: true,
    v: '08',
    k: 'BUILT OUT',
    card: 320,
    desc: 'Eight layouts, built far enough to see which direction was actually working — dashboards, forms, landing pages, a wiki.',
    items: [
      { label: 'DASHBOARD 01', img: P('thumbs/dashboard-01.jpg'), src: P('dashboard-01.html'), kind: 'page', tag: 'DASH' },
      { label: 'DASHBOARD 02', img: P('thumbs/dashboard-02.jpg'), src: P('dashboard-02.html'), kind: 'page', tag: 'DASH' },
      { label: 'DASHBOARD 03', img: P('thumbs/dashboard-03.jpg'), src: P('dashboard-03.html'), kind: 'page', tag: 'DASH' },
      { label: 'FORM 01', img: P('thumbs/form-01.jpg'), src: P('form-01.html'), kind: 'page', tag: 'FORM' },
      { label: 'FORM 02', img: P('thumbs/form-02.jpg'), src: P('form-02.html'), kind: 'page', tag: 'FORM' },
      { label: 'LANDING PAGE 01', img: P('thumbs/landing-page-01.jpg'), src: P('landing-page-01.html'), kind: 'page', tag: 'LAND' },
      { label: 'LANDING PAGE 02', img: P('thumbs/landing-page-02.jpg'), src: P('landing-page-02.html'), kind: 'page', tag: 'LAND' },
      { label: 'WIKI', img: P('thumbs/wiki.jpg'), src: P('wiki.html'), kind: 'page', tag: 'WIKI' },
    ],
  },
  {
    n: '04',
    jp: '体系',
    title: 'DESIGN SYSTEM',
    done: true,
    v: '92',
    k: 'AUDIT',
    card: 320,
    desc: '<code>/design-system</code> extracts a design-system.html and a DESIGN-SYSTEM.md from whichever layouts survive. Tokens, atoms, patterns — one source, scored 92/100 with zero drift.',
    items: [{ label: 'DESIGN-SYSTEM.HTML', img: P('thumbs/design-system.jpg'), src: P('design-system.html'), kind: 'page', tag: 'SYS', wide: true }],
  },
  {
    n: '05',
    jp: '主題',
    title: 'MUI THEME',
    done: false,
    v: '01',
    k: 'SHIPPED',
    card: 320,
    desc: '<code>/material-ui-theming</code> turns the design system into Phosphor — dark-mode only. These are the tokens that came out the other end.',
    items: [],
    here: true,
    swatches: true,
  },
];

const TOKENS: [string, string][] = [
  ['BG / VOID', '#0A0A0A'],
  ['MINT', '#52F29A'],
  ['MINT-HI', '#7CF4AB'],
  ['GREEN-MAP', '#3C9C6C'],
  ['GREEN-DIM', '#246C3C'],
  ['PAPER', '#EDF8D6'],
  ['ORANGE', '#F26400'],
  ['AMBER', '#F49F09'],
  ['AMBER-DIM', '#9C3C24'],
  ['RED', '#C20C0C'],
  ['RED-HI', '#E2280F'],
  ['CRIMSON', '#E60225'],
  ['TEAL', '#0C6C80'],
  ['BLUE', '#5090D0'],
];

/** Render a stage description, turning `<code>…</code>` spans into mono chips. */
function Desc({ text }: { text: string }) {
  const t = useTheme();
  const parts = text.split(/<code>(.*?)<\/code>/g);
  return (
    <Box component="p" sx={{ color: t.nerv.hue.greenMap, mt: 1, lineHeight: 1.65, maxWidth: '88ch' }}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Box component="code" key={i} sx={{ color: t.nerv.hue.mint, fontFamily: t.nerv.fonts.mono }}>
            {part}
          </Box>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Box>
  );
}

/* ── the five-stage track ─────────────────────────────────────────── */

function Track({ step, onSelect }: { step: number; onSelect: (i: number) => void }) {
  const t = useTheme();
  return (
    <Box
      role="tablist"
      aria-label="Five-stage design pipeline"
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' },
        gap: { xs: 0.5, md: 1.25 },
        mb: 4,
      }}
    >
      {/* connecting rule — horizontal on md+, vertical on xs */}
      <Box aria-hidden sx={{ position: 'absolute', zIndex: 0, background: t.nerv.hue.greenDim, display: { xs: 'none', md: 'block' }, top: 39, left: '10%', right: '10%', height: 2 }} />
      <Box aria-hidden sx={{ position: 'absolute', zIndex: 0, background: t.nerv.hue.greenDim, display: { xs: 'block', md: 'none' }, left: 38, top: 36, bottom: 36, width: 2 }} />
      {STEPS.map((s, i) => (
        <StepButton key={s.n} s={s} i={i} selected={i === step} onSelect={onSelect} />
      ))}
    </Box>
  );
}

function StepButton({ s, i, selected, onSelect }: { s: PipelineStep; i: number; selected: boolean; onSelect: (i: number) => void }) {
  const t = useTheme();
  const nodeBorder = selected ? t.nerv.hue.mint : s.done ? t.nerv.hue.mint : t.nerv.hue.orange;
  const nodeBg = s.done ? t.nerv.hue.mint : t.nerv.hue.void;
  const nodeColor = s.done ? t.nerv.hue.void : t.nerv.hue.orange;
  return (
    <Box
      component="button"
      type="button"
      role="tab"
      onClick={() => onSelect(i)}
      aria-selected={selected}
      sx={{
        position: 'relative',
        zIndex: 2,
        display: { xs: 'grid', md: 'block' },
        gridTemplateColumns: { xs: '78px 1fr' },
        alignItems: 'center',
        gap: '0 14px',
        p: { xs: '6px 0', md: '0 8px' },
        textAlign: { xs: 'left', md: 'center' },
        cursor: 'pointer',
        background: 'transparent',
        border: 0,
        font: 'inherit',
        color: selected ? t.nerv.hue.mintHi : t.nerv.hue.greenMap,
        '&:hover': { color: t.nerv.hue.mintHi },
        '&:focus-visible': { outline: `2px solid ${t.nerv.hue.paper}`, outlineOffset: 3 },
      }}
    >
      {s.here && (
        <Stamp
          tone="mint"
          blink
          size="sm"
          sx={{
            position: { xs: 'static', md: 'absolute' },
            top: -14,
            left: '50%',
            transform: { xs: 'none', md: 'translateX(-50%)' },
            zIndex: 3,
            background: t.nerv.hue.void,
            gridColumn: { xs: '1 / -1', md: 'auto' },
            justifySelf: { xs: 'start', md: 'auto' },
            mb: { xs: 0.5, md: 0 },
          }}
        >
          YOU ARE HERE
        </Stamp>
      )}
      <Box
        sx={{
          width: 78,
          height: 78,
          margin: { xs: 0, md: '0 auto 12px' },
          background: nodeBg,
          border: `2px solid ${nodeBorder}`,
          color: nodeColor,
          display: 'grid',
          placeItems: 'center',
          fontFamily: t.nerv.fonts.display,
          fontWeight: 700,
          fontSize: 22,
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          boxShadow: selected ? '0 0 12px rgba(82,242,154,.4)' : 'none',
        }}
      >
        {s.n}
      </Box>
      <Box component="span" sx={{ display: 'block', gridColumn: { xs: 2, md: 'auto' }, fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 16, color: 'inherit' }}>
        {s.jp}
      </Box>
      <Box component="span" sx={{ display: 'block', gridColumn: { xs: 2, md: 'auto' }, fontSize: 8.5, letterSpacing: '0.13em', mt: { xs: 0, md: 0.4 }, textTransform: 'uppercase', color: 'inherit' }}>
        {s.title}
      </Box>
      <Box component="span" sx={{ display: 'block', gridColumn: { xs: 2, md: 'auto' }, mt: { xs: 0.5, md: 1 }, fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 20, lineHeight: 1, color: t.nerv.hue.mintHi, fontVariantNumeric: 'tabular-nums' }}>
        {s.v}
        <Box component="small" sx={{ display: 'block', fontFamily: t.nerv.fonts.mono, fontWeight: 400, fontSize: 7.5, letterSpacing: '0.12em', color: t.nerv.hue.amber, mt: 0.4 }}>
          {s.k}
        </Box>
      </Box>
    </Box>
  );
}

/* ── stagebar + gallery ───────────────────────────────────────────── */

function Stagebar({ s }: { s: PipelineStep }) {
  const t = useTheme();
  return (
    <Box sx={{ border: `1px solid ${t.nerv.hue.orange}`, p: 0.5, mb: 2.5 }}>
      <Box
        sx={{
          border: `2px solid ${t.nerv.hue.orange}`,
          p: { xs: 2, md: 3 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto' },
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: { xs: 40, md: 48 }, color: t.nerv.hue.orange, textAlign: 'center', lineHeight: 1, whiteSpace: 'nowrap', textShadow: '0 0 5px currentColor' }}>
          {s.jp}
        </Box>
        <Box>
          <Box component="h3" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, color: t.nerv.hue.paper, fontSize: 'clamp(17px, 2vw, 24px)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {s.n} · {s.title}
          </Box>
          <Desc text={s.desc} />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, fontSize: 9, color: t.nerv.hue.amber, lineHeight: 1.7, textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <Box component="b" sx={{ color: t.nerv.hue.orange, fontWeight: 400 }}>
            CLICK A CARD
          </Box>
          <br />
          OPENS THE LIVE ARTEFACT
        </Box>
      </Box>
    </Box>
  );
}

function Gallery({ s, onOpen }: { s: PipelineStep; onOpen: (i: number) => void }) {
  const t = useTheme();
  if (s.swatches) return <Swatches />;
  return (
    <Box role="tabpanel" aria-label="Artefacts for the selected stage" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 265px), 1fr))', gap: 1.5, alignContent: 'start' }}>
      {s.items.map((it, j) => (
        <Box
          key={it.label}
          component="button"
          type="button"
          onClick={() => onOpen(j)}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
            overflow: 'hidden',
            cursor: 'pointer',
            background: '#050505',
            border: `1px solid ${t.nerv.hue.greenDim}`,
            p: 0,
            font: 'inherit',
            gridColumn: it.wide ? '1 / -1' : 'auto',
            maxWidth: it.wide ? 900 : 'none',
            '&:hover, &:focus-visible': { borderColor: t.nerv.hue.mint, boxShadow: '0 0 12px rgba(82,242,154,.2)' },
            '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: -2 },
            '&:hover b': { color: t.nerv.hue.mintHi },
            '&:hover .open': { color: t.nerv.hue.mint },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              aspectRatio: it.wide ? '16 / 9' : '16 / 10',
              overflow: 'hidden',
              background: '#000',
              borderBottom: `1px solid ${t.nerv.hue.greenDim}`,
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0 1px, transparent 1px 3px)',
              },
            }}
          >
            <Box component="img" src={it.img} alt={`${it.label} — screenshot`} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', filter: 'saturate(1.05) contrast(1.03)' }} />
            <Box sx={{ position: 'absolute', top: 6, left: 6, zIndex: 2, background: 'rgba(10,10,10,.85)', fontSize: 8, letterSpacing: '0.1em', p: '1px 6px', border: '1px solid currentColor', textTransform: 'uppercase', color: it.kind === 'video' ? t.nerv.hue.amber : t.nerv.hue.mint }}>
              {it.tag}
            </Box>
            {it.kind === 'video' && (
              <Box sx={{ position: 'absolute', zIndex: 2, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, display: 'grid', placeItems: 'center', border: `1px solid ${t.nerv.hue.mint}`, color: t.nerv.hue.mint, background: 'rgba(10,10,10,.65)', fontSize: 15, textShadow: '0 0 6px currentColor' }}>
                ▶
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '7px 9px', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.nerv.hue.greenMap }}>
            <Box component="b" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', color: t.nerv.hue.paper, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {it.label}
            </Box>
            <Box component="span" className="open" sx={{ color: t.nerv.hue.greenDim, flex: 'none' }}>
              {it.kind === 'video' ? 'PLAY ›' : 'OPEN ›'}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function Swatches() {
  const t = useTheme();
  return (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      <Box sx={{ border: `1px solid ${t.nerv.hue.orange}`, p: 2, display: 'flex', gap: 2, alignItems: 'center', background: 'rgba(242,100,0,.05)' }}>
        <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 32, color: t.nerv.hue.orange, textShadow: '0 0 6px currentColor', flex: 'none' }}>
          主
        </Box>
        <Box sx={{ color: t.nerv.hue.greenMap, fontSize: 13, lineHeight: 1.6 }}>
          You are looking at the output.{' '}
          <Box component="b" sx={{ color: t.nerv.hue.mint, fontWeight: 400 }}>
            This page renders in the Phosphor token set
          </Box>{' '}
          — same variables, same CRT overlay, same chamfered frames the MUI theme ships to the Singularity UI.
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 1 }}>
        {TOKENS.map(([name, hex]) => (
          <Box key={name} sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, pb: 0.75 }}>
            <Box sx={{ height: 52, borderBottom: `1px solid ${t.nerv.hue.greenDim}`, background: hex }} />
            <Box component="span" sx={{ display: 'block', p: '6px 9px 0', fontSize: 9, letterSpacing: '0.09em', color: t.nerv.hue.paper, textTransform: 'uppercase' }}>
              {name}
            </Box>
            <Box component="span" sx={{ display: 'block', p: '2px 9px 0', fontSize: 9, color: t.nerv.hue.greenMap }}>
              {hex}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ── lightbox ─────────────────────────────────────────────────────── */

function LbButton({ children, onClick, href }: { children: ReactNode; onClick?: () => void; href?: string }) {
  const t = useTheme();
  const sx = {
    minWidth: 0,
    p: '3px 11px',
    fontSize: 9,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: t.nerv.hue.greenMap,
    border: `1px solid ${t.nerv.hue.greenDim}`,
    borderRadius: 0,
    '&:hover': { borderColor: t.nerv.hue.mint, color: t.nerv.hue.mint, background: 'transparent' },
  };
  if (href) {
    return (
      <Button component="a" href={href} target="_blank" rel="noopener" sx={sx}>
        {children}
      </Button>
    );
  }
  return (
    <Button onClick={onClick} sx={sx}>
      {children}
    </Button>
  );
}

function Lightbox({ lb, onClose, onStep }: { lb: { step: number; item: number } | null; onClose: () => void; onStep: (d: number) => void }) {
  const t = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const step = lb ? STEPS[lb.step] : null;
  const item = lb && step ? step.items[lb.item] : null;

  // Arrow keys browse the current stage's artefacts.
  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb, onStep]);

  return (
    <Dialog
      open={!!lb}
      onClose={onClose}
      fullScreen
      slotProps={{
        paper: {
          sx: {
            background: t.nerv.hue.void,
            border: `2px solid ${t.nerv.hue.orange}`,
            clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
            boxShadow: '0 0 30px rgba(242,100,0,.28)',
          },
        },
      }}
    >
      {lb && step && item && (
        <Box sx={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '9px 22px', borderBottom: `1px solid ${t.nerv.hue.greenDim}` }}>
            <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 17, color: t.nerv.hue.orange, flex: 'none' }}>
              {step.jp}
            </Box>
            <Box component="h2" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 'clamp(13px, 1.5vw, 19px)', color: t.nerv.hue.paper, letterSpacing: '0.06em', textTransform: 'uppercase', flex: 'none' }}>
              {item.label}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, fontSize: 10, color: t.nerv.hue.greenMap, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.src}
            </Box>
            <Stamp tone="amber" size="sm">
              {lb.item + 1} / {step.items.length}
            </Stamp>
          </Box>
          <Box sx={{ position: 'relative', minHeight: 0, background: '#000', display: 'grid', placeItems: 'stretch' }}>
            {item.kind === 'video' ? (
              <video
                ref={videoRef}
                src={item.src}
                autoPlay
                loop
                muted
                controls
                playsInline
                onLoadedMetadata={() => {
                  if (item.at != null && videoRef.current) videoRef.current.currentTime = item.at;
                }}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              />
            ) : (
              <iframe src={item.src} title={item.label} style={{ width: '100%', height: '100%', border: 0, background: '#000' }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '7px 22px', borderTop: `2px solid ${t.nerv.hue.orange}`, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.nerv.hue.greenMap }}>
            <LbButton onClick={() => onStep(-1)}>‹ PREV</LbButton>
            <LbButton onClick={() => onStep(1)}>NEXT ›</LbButton>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>ESC TO CLOSE · ← → TO BROWSE</Box>
            <LbButton href={item.src}>OPEN DIRECTLY ↗</LbButton>
            <LbButton onClick={onClose}>CLOSE ✕</LbButton>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}

/* ── page ─────────────────────────────────────────────────────────── */

export default function PipelinePage() {
  const [step, setStep] = useState(0);
  const [lb, setLb] = useState<{ step: number; item: number } | null>(null);

  const open = (item: number) => setLb({ step, item });
  const close = () => setLb(null);
  const stepItem = useCallback((d: number) => {
    setLb((prev) => {
      if (!prev) return prev;
      const items = STEPS[prev.step].items;
      return { step: prev.step, item: ((prev.item + d) % items.length + items.length) % items.length };
    });
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="PROCESS"
        title="THE PHOSPHOR PIPELINE"
        lede="From an Evangelion mood board to a production dark theme, in five stages. Every stage below still has its artefacts — pick a stage, then open the real thing."
      />
      <Track step={step} onSelect={setStep} />
      <Stagebar s={STEPS[step]} />
      <Gallery s={STEPS[step]} onOpen={open} />
      <Lightbox lb={lb} onClose={close} onStep={stepItem} />
    </>
  );
}
