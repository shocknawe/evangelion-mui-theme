/**
 * LANDING-01 · COMMAND CENTER — the Jairus OS marketing homepage, ported from
 * sample-layouts/landing-page-01.html. A dashboard-forward brand page assembled
 * from the @components library: SiteHeader (sticky nav), SectionHeading section
 * breaks, ModuleCard system grid, ScanLattice separator, RadialGauge / SegmentBar
 * / LedColumn telemetry, a Terminal live feed, Marquee ticker, and a Y/N deploy
 * gate. Genuinely one-off marketing composition (hero cluster, CTA) stays local.
 */
import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import {
  SiteHeader,
  SectionHeading,
  ModuleCard,
  Marquee,
  ScanLattice,
  Terminal,
  RadialGauge,
  SegmentBar,
  LedColumn,
  TelemetryCard,
  YesNoGate,
  DigitalClock,
  Stamp,
  AgentDot,
  useReducedMotion,
  toneHue,
  type TerminalRow,
  type Tone,
} from '@components';

const WRAP = { maxWidth: 1180, mx: 'auto', px: 3 } as const;

const NAV_LINKS = [
  { label: 'SYSTEMS', href: '#modules' },
  { label: 'TELEMETRY', href: '#telemetry' },
  { label: 'LIVE_FEED', href: '#feed' },
  { label: 'DEPLOY', href: '#deploy' },
];

interface ModuleDef {
  jp: string;
  code: string;
  title: string;
  desc: string;
  stamp: string;
  tone: Tone;
  meta: string;
}
const MODULES: ModuleDef[] = [
  { jp: '工学', code: 'ENGINEERING', title: 'ENGINEERING', tone: 'mint', stamp: 'NOMINAL', meta: 'ENG-402 · ENG-398',
    desc: 'Pipelines, tickets, and autonomous debugging. Ship through approval gates instead of chaos.' },
  { jp: '記憶', code: 'KNOWLEDGE', title: 'KNOWLEDGE', tone: 'mint', stamp: 'NOMINAL', meta: '2,482 NODES',
    desc: 'A memory vault that never forgets — 2,482 nodes of decisions, patterns, and mistakes, linked.' },
  { jp: '自動', code: 'AUTOMATION', title: 'AUTOMATION', tone: 'amber', stamp: 'WORKING', meta: '38 LISTENERS',
    desc: 'Triggers that watch so you don’t. Cron, watchers, events → observe · understand · decide · execute.' },
  { jp: '学習', code: 'LEARNING', title: 'LEARNING', tone: 'mint', stamp: 'NOMINAL', meta: '12 DUE',
    desc: 'Spaced review and live voice sessions. Every mistake becomes recall you keep.' },
  { jp: '制作', code: 'CONTENT', title: 'CONTENT', tone: 'blue', stamp: 'WATCHING', meta: '1 IN QUEUE',
    desc: 'From raw capture to finished reel. The content pipeline runs itself and hands you the cut.' },
  { jp: '個人', code: 'PERSONAL', title: 'PERSONAL', tone: 'mint', stamp: 'NOMINAL', meta: '08 ITEMS',
    desc: 'Morning brief to night sync. Weather, reminders, and inbox — the day, initialized.' },
];

const MARQUEE = [
  'V2.4.0-STABLE DEPLOYED', 'MEMORY VAULT 98.4% RETENTION', '38 LISTENERS UP',
  '6 SYSTEMS ONLINE', 'AGENT_03 BUSY', 'NO ANOMALIES DETECTED',
];

/* Terminal inline emphasis — matches the source's g/o/r spans. */
const G = ({ children }: { children: ReactNode }) => <Box component="span" sx={(t) => ({ color: t.nerv.hue.mint })}>{children}</Box>;
const O = ({ children }: { children: ReactNode }) => <Box component="span" sx={(t) => ({ color: t.nerv.hue.orange })}>{children}</Box>;
const R = ({ children }: { children: ReactNode }) => <Box component="span" sx={(t) => ({ color: t.nerv.hue.redHi })}>{children}</Box>;

const FEED_ROWS: TerminalRow[] = [
  { k: 'exec', ts: '14:22:01', msg: <>Triggered <G>'gitlab-poll'</G> → <G>3 new tickets</G> ingested into KNOWLEDGE_OS</> },
  { k: 'exec', ts: '13:45:12', msg: <>Routine <G>'Daily Cleanup'</G> finished. Cleared <O>424MB</O> cache.</> },
  { k: 'exec', ts: '12:10:45', msg: <>File Watcher detected <O>'Trip_Photos.zip'</O> → Initializing CONTENT pipeline...</> },
  { k: 'exec', ts: '12:10:47', msg: <>{'  └ '}Thread [772] started: decompressing archive...</> },
  { k: 'exec', ts: '10:00:00', msg: <>CRON <G>[OK]</G> System health check passed. <G>No anomalies detected.</G></> },
  { k: 'exec', ts: '09:55:21', msg: <>Executing loop: <G>Observe → Understand → Decide → Execute</G></> },
  { k: 'exec', ts: '09:12:00', msg: <><O>[DECISION]</O> Approved production deploy for J-OS Core v2.4.0 after 12h stability.</> },
  { k: 'exec', ts: '08:40:15', msg: <><R>[MISTAKE]</R> Inefficient vector search in ENG-392 → rectifying via indexing.</> },
];

export function Landing01Page() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState<number | null>(null);
  const [load, setLoad] = useState(42);
  const [cols, setCols] = useState<number[]>([4, 6, 5, 7, 6, 8]);
  const [tput, setTput] = useState('1.4K/S');

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  // Live telemetry drift.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setLoad(() => 38 + Math.floor(Math.random() * 14));
      setCols(() => Array.from({ length: 6 }, () => 3 + Math.floor(Math.random() * 7)));
      setTput(`${(1.0 + Math.random() * 0.9).toFixed(1)}K/S`);
    }, 900);
    return () => clearInterval(id);
  }, [reduced]);

  const loadState = load > 80 ? 'CAUTION' : 'NOMINAL';

  return (
    <Box sx={{ color: t.nerv.hue.mint, fontFamily: t.nerv.fonts.mono, textTransform: 'uppercase', letterSpacing: '0.03em', pb: 0, overflowX: 'hidden' }}>
      <SiteHeader
        name="JAIRUS_OS"
        version="v2.4.0-STABLE"
        links={NAV_LINKS}
        actions={
          <>
            <DigitalClock sx={{ display: { xs: 'none', sm: 'block' } }} />
            <Stamp tone="mint">◉ INTEGRITY: NOMINAL</Stamp>
          </>
        }
      />

      {/* ============ HERO ============ */}
      <Box component="section" sx={{ ...WRAP, pt: 8, pb: 5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.15fr .85fr' }, gap: 5, alignItems: 'center' }}>
          <Box>
            <Box sx={{ fontSize: 11, letterSpacing: '0.24em', color: t.nerv.hue.orange, mb: 2.25 }}>◈ PERSONAL AGENTIC OPERATING SYSTEM</Box>
            <Box component="h1" sx={{ m: 0, fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 'clamp(38px, 6vw, 76px)', lineHeight: 0.94, color: t.nerv.hue.mintHi, textShadow: '0 0 12px rgba(82,242,154,.35)', letterSpacing: '0.01em' }}>
              RUN YOUR LIFE FROM ONE{' '}
              <Box component="em" sx={{ fontStyle: 'normal', color: t.nerv.hue.orange, textShadow: '0 0 12px rgba(242,100,0,.4)' }}>COMMAND CENTER</Box>
            </Box>
            <Box component="p" sx={{ mt: 2.75, mb: 0, fontSize: 14, lineHeight: 1.7, color: t.nerv.hue.mint, opacity: 0.78, maxWidth: '44ch', letterSpacing: '0.04em', textTransform: 'none' }}>
              Six systems — engineering, knowledge, automation, learning, content, and personal — under a single operator console. Jairus OS observes, decides, and acts, and never ships past a gate you didn't approve.
            </Box>
            <Box sx={{ display: 'flex', gap: 1.75, mt: 3.75, flexWrap: 'wrap' }}>
              <Button variant="contained" className="nerv-live" onClick={() => scrollTo('deploy')}>INITIALIZE PROTOCOL</Button>
              <Button variant="alt" onClick={() => scrollTo('modules')}>VIEW SYSTEMS ▾</Button>
            </Box>
          </Box>
          <Cluster />
        </Box>
      </Box>

      {/* ============ MARQUEE ============ */}
      <Marquee items={MARQUEE} speedSec={26} />

      {/* ============ MODULES ============ */}
      <Box component="section" id="modules" sx={{ ...WRAP, py: 8.25 }}>
        <SectionHeading index="01" note="SELECT TO PIN">SIX SYSTEMS, ONE OPERATOR</SectionHeading>
        <Box sx={{ display: 'flex', gap: 2.25, flexWrap: 'wrap', alignItems: 'center', border: `1px solid ${t.nerv.hue.greenDim}`, p: '9px 14px', fontSize: 10, letterSpacing: '0.1em', color: t.nerv.hue.mint, mt: 3.5, mb: 2.25 }}>
          <Box component="b" sx={{ color: t.nerv.hue.orange, mr: 1.25 }}>LEGEND</Box>
          <LegendSwatch tone="mint" label="NOMINAL" />
          <LegendSwatch tone="amber" label="WORKING" />
          <LegendSwatch tone="blue" label="WATCHING" />
          <Box component="span" sx={{ ml: 'auto', color: t.nerv.hue.orange }}>6 / 6 ONLINE</Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {MODULES.map((m, i) => (
            <ModuleCard
              key={m.code}
              jp={m.jp}
              code={`SYS·0${i + 1}`}
              codeSub={m.code}
              title={m.title}
              stamp={m.stamp}
              tone={m.tone}
              meta={m.meta}
              selected={pinned === i}
              onSelect={() => setPinned((p) => (p === i ? null : i))}
            >
              {m.desc}
            </ModuleCard>
          ))}
        </Box>
      </Box>

      {/* ============ SEPARATOR ============ */}
      <Box sx={{ ...WRAP, py: 2.5 }}>
        <ScanLattice height={110} nodeLabel="NODE·0x512" />
      </Box>

      {/* ============ TELEMETRY ============ */}
      <Box component="section" id="telemetry" sx={{ ...WRAP, py: 8.25 }}>
        <SectionHeading index="02" note="LIVE · 1HZ">SYSTEM TELEMETRY</SectionHeading>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.25, mt: 3.5 }}>
          <TelemetryCard title="◐ VAULT RETENTION" type="ARC" foot={['THRESHOLD 90%', 'STABLE']}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.75 }}>
              <RadialGauge value={98.4} label="HELD" size={150} animated={false} />
            </Box>
            <GLabel>MEMORY HELD ACROSS 2,482 NODES</GLabel>
          </TelemetryCard>

          <TelemetryCard title="▮ ENGINE LOAD" type="BAR" foot={['CEILING 80%', loadState]}>
            <GVal>{Math.round(load)}%</GVal>
            <GLabel>AGENT COMPUTE · 4 CORES</GLabel>
            <SegmentBar value={load} tone={load > 80 ? 'amber' : 'mint'} segments={20} height={26} sx={{ my: 1 }} />
          </TelemetryCard>

          <TelemetryCard title="▊ THROUGHPUT" type="COL" foot={['WINDOW 6', 'RISING']}>
            <Box sx={{ display: 'flex', gap: 1, height: 120, alignItems: 'flex-end', my: 0.75 }}>
              {cols.map((v, i) => (
                <LedColumn key={i} value={v * 10} segments={10} tone="mint" height={120} sx={{ flex: 1, width: 'auto', minWidth: 0 }} />
              ))}
            </Box>
            <GVal sx={{ fontSize: 24 }}>{tput}</GVal>
            <GLabel>TICKETS INGESTED PER CYCLE</GLabel>
          </TelemetryCard>
        </Box>
      </Box>

      {/* ============ LIVE FEED ============ */}
      <Box component="section" id="feed" sx={{ ...WRAP, py: 8.25 }}>
        <SectionHeading index="03" note="LIVE_EXEC_FEED">WATCH IT THINK</SectionHeading>
        <Box sx={{ mt: 3.5, border: `2px solid ${t.nerv.hue.orange}`, boxShadow: '0 0 18px rgba(242,100,0,.2)' }}>
          <Terminal
            title="STDOUT : /var/log/jairus/automation.log"
            rows={FEED_ROWS}
            speed={130}
            minBodyHeight={280}
            maxBodyHeight="none"
            sx={{ border: 'none' }}
          />
        </Box>
      </Box>

      {/* ============ DEPLOY CTA ============ */}
      <Box component="section" id="deploy" sx={{ borderTop: `2px solid ${t.nerv.hue.orange}`, background: t.nerv.hue.void, pt: 10, pb: 3.75, position: 'relative', overflow: 'hidden' }}>
        <Box sx={WRAP}>
          <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 'clamp(70px, 17vw, 220px)', lineHeight: 0.8, color: t.nerv.hue.redHi, textTransform: 'none', textShadow: '0 0 30px rgba(226,40,15,.35)', opacity: 0.9, letterSpacing: '-0.02em', transform: 'translateX(-2%)' }}>
            開始<Box component="span" sx={{ display: 'inline-block', transform: 'translateY(-14%)' }}>。</Box>
          </Box>
          <Box sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 'clamp(26px, 4vw, 46px)', color: t.nerv.hue.mintHi, mt: 0.75, letterSpacing: '0.02em' }}>
            DEPLOY JAIRUS OS TO YOUR STACK?
          </Box>
          <Box component="p" sx={{ fontSize: 13, color: t.nerv.hue.mint, opacity: 0.75, textTransform: 'none', mt: 1.75, mb: 0, maxWidth: '52ch' }}>
            One operator. Every system. Approve the first gate and the console initializes — no card required for the pilot.
          </Box>
          <YesNoGate
            sx={{ mt: 3.75 }}
            yesResponse="◉ PROTOCOL ACCEPTED — INITIALIZING OPERATOR SESSION..."
            noResponse="✕ DEPLOY DEFERRED — THE CONSOLE WILL BE HERE WHEN YOU RETURN, OPERATOR."
          />
        </Box>
      </Box>

      {/* ============ FOOTER ============ */}
      <Box component="footer" sx={{ borderTop: `2px solid ${t.nerv.hue.orange}`, background: 'rgba(10,10,10,.96)' }}>
        <Box sx={{ ...WRAP, display: 'flex', flexWrap: 'wrap', gap: 2.25, alignItems: 'center', py: 1.5, fontSize: 10, color: t.nerv.hue.greenMap, letterSpacing: '0.08em' }}>
          <AgentDot>AGENT_01: NOMINAL</AgentDot>
          <AgentDot>AGENT_02: NOMINAL</AgentDot>
          <AgentDot busy>AGENT_03: BUSY</AgentDot>
          <Box component="span" sx={{ ml: 'auto' }}>CPU 12.4%</Box>
          <Box component="span">MEM 2.1GB/32GB</Box>
          <Box component="span" sx={{ color: t.nerv.hue.mint }}>SYNC_OK</Box>
          <Box component="span">© JAIRUS_OS · KESTREL·4</Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---- hero live command cluster (page-specific composition) ---- */
function Cluster() {
  const t = useTheme();
  const bar = (pct: number) => (
    <Box sx={{ width: 74, height: 6, background: 'rgba(255,255,255,.06)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: t.nerv.hue.mint, boxShadow: `0 0 6px ${t.nerv.hue.mint}` }} />
    </Box>
  );
  const pct = (v: string) => <Box component="span" sx={{ width: 34, textAlign: 'right', color: t.nerv.hue.mint, fontVariantNumeric: 'tabular-nums' }}>{v}</Box>;
  const rowSx = { display: 'flex', alignItems: 'center', gap: 1.25, py: '7px', fontSize: 11, borderBottom: '1px dashed rgba(60,156,108,.25)' } as const;
  const nameSx = { flex: 1, color: t.nerv.hue.mint, letterSpacing: '0.06em' } as const;

  return (
    <Box
      role="group"
      aria-label="live system cluster"
      sx={{
        border: `2px solid ${t.nerv.hue.orange}`,
        background: t.nerv.hue.void,
        p: '18px',
        boxShadow: '0 0 16px rgba(242,100,0,.25), inset 0 0 22px rgba(242,100,0,.06)',
        clipPath: t.nerv.chamfer(22),
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.1em', borderBottom: `1px solid ${t.nerv.hue.greenDim}`, pb: 1, mb: 1.5 }}>
        <span>ACTIVE_PIPELINE</span>
        <Box component="span" sx={{ color: t.nerv.hue.mint }}>UPTIME 142:22:09</Box>
      </Box>
      <Box sx={rowSx}><Box component="span" sx={nameSx}>ENG-398 // CORE</Box>{bar(62)}{pct('62%')}</Box>
      <Box sx={rowSx}><Box component="span" sx={nameSx}>MEMORY INGEST</Box><Stamp tone="amber" size="sm">IMPL</Stamp>{pct('88%')}{bar(88)}</Box>
      <Box sx={rowSx}><Box component="span" sx={nameSx}>ARCH_GATE_04</Box><Stamp tone="red" size="sm">BLOCKED</Stamp></Box>
      <Box sx={{ ...rowSx, borderBottom: 0 }}><Box component="span" sx={nameSx}>VISUAL REGRESSION</Box><Stamp tone="mint" size="sm">PASS</Stamp></Box>
      <Box sx={{ mt: 1.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${t.nerv.hue.mint}`, p: '8px 10px' }}>
        <span>SYSTEM INTEGRITY</span>
        <Box component="b" sx={{ color: t.nerv.hue.mintHi, fontFamily: t.nerv.fonts.display, fontSize: 16 }}>NOMINAL</Box>
      </Box>
    </Box>
  );
}

/* ---- telemetry readouts (big value + small caption) local to this screen ---- */
function GVal({ children, sx }: { children: ReactNode; sx?: object }) {
  const t = useTheme();
  return <Box sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 34, color: t.nerv.hue.mintHi, textShadow: '0 0 10px rgba(82,242,154,.35)', lineHeight: 1, ...sx }}>{children}</Box>;
}
function GLabel({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Box sx={{ fontSize: 10, color: t.nerv.hue.mint, opacity: 0.6, mt: 0.5, letterSpacing: '0.1em' }}>{children}</Box>;
}

/* ---- module legend swatch ---- */
function LegendSwatch({ tone, label }: { tone: Tone; label: string }) {
  const t = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 10, height: 10, background: toneHue(t, tone), border: `1px solid ${toneHue(t, tone)}` }} />
      {label}
    </Box>
  );
}

