/**
 * LANDING-02 · OPERATOR MANIFEST — the Jairus OS homepage framed inside the
 * running OS, ported from sample-layouts/landing-page-02.html. An editorial
 * app-shell with dual sticky rails, assembled from the @components library:
 * ConsoleNav (rail variant), SectionHeading breaks, Waveform separator, LedColumn
 * retention bars, FilterChips + MemoryRow query list, LineChart throughput, and a
 * theme-styled access Dialog. One-off structure (shell, hero, loop, dossier) local.
 */
import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import {
  ConsoleNav,
  SectionHeading,
  Waveform,
  LineChart,
  LedColumn,
  FilterChips,
  MemoryRow,
  useReducedMotion,
  type MemoryKind,
} from '@components';

interface NavDef { value: string; jp: string; en: string; to: string }
const NAV: NavDef[] = [
  { value: 'eng', jp: '工', en: 'ENGINEERING', to: 'top' },
  { value: 'know', jp: '記', en: 'KNOWLEDGE', to: 'vault' },
  { value: 'auto', jp: '自', en: 'AUTOMATION', to: 'loop' },
  { value: 'learn', jp: '学', en: 'LEARNING', to: 'chart' },
  { value: 'content', jp: '制', en: 'CONTENT', to: 'spec' },
  { value: 'personal', jp: '個', en: 'PERSONAL', to: 'top' },
];

const LOOP = [
  { k: '観測', e: 'OBSERVE' },
  { k: '理解', e: 'UNDERSTAND' },
  { k: '決定', e: 'DECIDE' },
  { k: '実行', e: 'EXECUTE' },
  { k: '学習', e: 'LEARN' },
];

interface Mem { id: string; title: string; kind: MemoryKind }
const MEMS: Mem[] = [
  { id: 'MEM-2024-0512', title: 'Recursive feedback loop optimization in Node v1.2', kind: 'pattern' },
  { id: 'MEM-2024-0511', title: 'Switch to Argon2id for vault hashing', kind: 'decision' },
  { id: 'MEM-2024-0508', title: 'Post-mortem: thread starvation in global scheduler', kind: 'mistake' },
  { id: 'MEM-2024-0505', title: 'User preference for high-density UI', kind: 'learning' },
  { id: 'MEM-2024-0501', title: 'Adopt Bun runtime for local CI — 40% faster feedback', kind: 'decision' },
  { id: 'MEM-2024-0498', title: 'Memoization layer prevents redundant agent compute', kind: 'pattern' },
  { id: 'MEM-2024-0495', title: 'Inefficient vector search detected in ENG-392', kind: 'mistake' },
  { id: 'MEM-2024-0491', title: 'Emergent agent collaboration under token pressure', kind: 'learning' },
];
const FILTERS = ['ALL', 'DECISIONS', 'PATTERNS', 'MISTAKES', 'LEARNINGS'];
const FILTER_KIND: Record<string, MemoryKind | 'all'> = {
  ALL: 'all', DECISIONS: 'decision', PATTERNS: 'pattern', MISTAKES: 'mistake', LEARNINGS: 'learning',
};

const RETENTION = [11, 12, 10, 13, 12, 14, 13, 15, 14, 15, 15, 16]; // out of 16 segments

const SPEC_ROWS: [string, ReactNode][] = [
  ['Doc', <><b>J-OS/DOSSIER/2024-0512</b> · classification: OPERATOR</>],
  ['Systems', 'Engineering · Knowledge · Automation · Learning · Content · Personal'],
  ['Loop', 'Observe → Understand → Decide → Execute → Learn (autonomous, gated)'],
  ['Memory', <><b>2,482 nodes</b> · 98.4% retention · Obsidian-compatible export</>],
  ['Integrations', 'GitLab poll · file watchers · ntfy · Slack · Gemini voice'],
  ['Runtime', 'Bun · 32GB budget · 4 agents · uptime 142:22:09'],
];

export function Landing02Page() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [section, setSection] = useState('eng');
  const [filter, setFilter] = useState('ALL');
  const [loopStep, setLoopStep] = useState(0);
  const [cpu, setCpu] = useState('12.4%');
  const [mem, setMem] = useState('2.1 / 32GB');
  const [memPct, setMemPct] = useState(7);
  const [cpuPct, setCpuPct] = useState(12);
  const [modalOpen, setModalOpen] = useState(false);
  const [handle, setHandle] = useState('');
  const [mResp, setMResp] = useState<{ ok: boolean; text: string } | null>(null);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  const navTo = (value: string) => {
    setSection(value);
    const item = NAV.find((n) => n.value === value);
    if (item) scrollTo(item.to);
  };

  // Agentic loop ignition — one node lit at a time.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setLoopStep((s) => (s + 1) % LOOP.length), 900);
    return () => clearInterval(id);
  }, [reduced]);

  // Right-rail live vitals.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      const c = 9 + Math.random() * 8;
      const m = 1.8 + Math.random() * 0.8;
      setCpu(`${c.toFixed(1)}%`);
      setCpuPct(c);
      setMem(`${m.toFixed(1)} / 32GB`);
      setMemPct((m / 32) * 100);
    }, 1500);
    return () => clearInterval(id);
  }, [reduced]);

  const shown = MEMS.filter((m) => FILTER_KIND[filter] === 'all' || m.kind === FILTER_KIND[filter]);

  const openModal = () => { setMResp(null); setModalOpen(true); };
  const submitGate = () => {
    if (!handle.trim()) { setMResp({ ok: false, text: '✕ HANDLE REQUIRED — GATE HELD.' }); return; }
    setMResp({ ok: true, text: '◉ GATE QUEUED — WELCOME ABOARD, OPERATOR.' });
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '230px 1fr 268px' }, minHeight: '100vh', color: t.nerv.hue.mint, fontFamily: t.nerv.fonts.mono, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {/* ===== LEFT RAIL ===== */}
      <Box
        component="aside"
        aria-label="module navigation"
        sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'rgba(10,10,10,.96)', borderRight: `2px solid ${t.nerv.hue.orange}`, boxShadow: '2px 0 14px rgba(242,100,0,.15)', p: '18px 16px' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Box sx={{ width: 15, height: 15, background: t.nerv.hue.mint, boxShadow: `0 0 8px ${t.nerv.hue.mint}`, transform: 'rotate(45deg)' }} />
          <Box component="b" sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 18, color: t.nerv.hue.mintHi, textShadow: '0 0 6px rgba(82,242,154,.6)' }}>JAIRUS_OS</Box>
        </Box>
        <Box sx={{ fontSize: 9, color: t.nerv.hue.orange, letterSpacing: '0.14em', mb: 3.25, pl: '22px' }}>v2.4.0-STABLE</Box>
        <ConsoleNav variant="rail" ariaLabel="Systems" value={section} onChange={navTo} items={NAV.map(({ value, jp, en }) => ({ value, jp, en }))} />
        <Box sx={{ mt: 'auto' }}>
          <Button fullWidth onClick={openModal} sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, letterSpacing: '0.12em', background: t.nerv.hue.mint, color: t.nerv.hue.void, border: 0, boxShadow: '0 0 12px rgba(82,242,154,.4)', '&:hover': { background: t.nerv.hue.mintHi } }}>+ NEW_GATE</Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', mt: 1.75, fontSize: 11, color: t.nerv.hue.greenMap }}>
            <Box component="a" href="#spec" onClick={(e) => { e.preventDefault(); scrollTo('spec'); }} sx={{ p: '5px 10px', textDecoration: 'none', color: 'inherit', '&:hover': { color: t.nerv.hue.mint } }}>⚙ SETTINGS</Box>
            <Box component="a" href="#spec" onClick={(e) => { e.preventDefault(); scrollTo('spec'); }} sx={{ p: '5px 10px', textDecoration: 'none', color: 'inherit', '&:hover': { color: t.nerv.hue.mint } }}>🗎 LOGS</Box>
          </Box>
        </Box>
      </Box>

      {/* ===== CENTER ===== */}
      <Box component="main" id="top" sx={{ minWidth: 0, px: 'clamp(20px, 4vw, 56px)' }}>
        <Box sx={{ maxWidth: 820, mx: 'auto' }}>
          {/* HERO */}
          <Box component="section" sx={{ pt: 9, pb: 5 }}>
            <Box sx={{ fontSize: 11, letterSpacing: '0.24em', color: t.nerv.hue.orange, mb: 2.5 }}>◈ THE OPERATOR MANIFEST · SYSTEM INTEGRITY NOMINAL</Box>
            <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 'clamp(56px, 10vw, 120px)', lineHeight: 0.82, color: t.nerv.hue.mintHi, textTransform: 'none', textShadow: '0 0 24px rgba(82,242,154,.3)', letterSpacing: '0.02em' }}>
              記憶する
              <Box component="small" sx={{ display: 'block', fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 'clamp(28px, 4.4vw, 52px)', color: t.nerv.hue.orange, textTransform: 'uppercase', letterSpacing: '0.02em', textShadow: '0 0 14px rgba(242,100,0,.35)', mt: 1.25 }}>
                AN OS THAT REMEMBERS WHY
              </Box>
            </Box>
            <Box component="p" sx={{ mt: 3.25, mb: 0, fontSize: 15, lineHeight: 1.75, color: t.nerv.hue.mint, opacity: 0.8, maxWidth: '60ch', textTransform: 'none', '& b': { color: t.nerv.hue.mintHi, fontWeight: 400 } }}>
              Jairus OS runs your work as one loop — <b>observe, understand, decide, execute, learn</b> — and writes every decision, pattern, and mistake into a memory vault that outlives the task. You stay the operator. The system keeps the receipts.
            </Box>
            <Box sx={{ display: 'flex', gap: 1.75, mt: 3.5, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={openModal}>REQUEST ACCESS</Button>
              <Button variant="alt" onClick={() => scrollTo('vault')}>READ THE VAULT ▾</Button>
            </Box>

            {/* agentic loop */}
            <Box id="loop" sx={{ mt: 6, border: `1px solid ${t.nerv.hue.greenDim}`, p: '26px 20px 20px', position: 'relative' }}>
              <Box component="span" sx={{ position: 'absolute', top: -9, left: 16, background: t.nerv.hue.void, px: 1, fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.14em' }}>ACTIVE_LOOP : AUTONOMOUS_LEARN</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                {LOOP.map((n, i) => (
                  <Box key={n.e} sx={{ display: 'contents' }}>
                    {i > 0 && <Box component="span" sx={{ color: t.nerv.hue.orange, fontSize: 14, flex: '0 0 auto' }}>→</Box>}
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        border: `1px solid ${loopStep === i ? t.nerv.hue.mint : t.nerv.hue.greenDim}`,
                        boxShadow: loopStep === i ? '0 0 14px rgba(82,242,154,.4)' : 'none',
                        p: '14px 6px',
                        background: t.nerv.hue.void,
                        transition: 'border-color 120ms linear, box-shadow 120ms linear',
                      }}
                    >
                      <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 22, lineHeight: 1, textTransform: 'none', color: loopStep === i ? t.nerv.hue.mintHi : t.nerv.hue.greenMap, textShadow: loopStep === i ? '0 0 10px rgba(82,242,154,.5)' : 'none' }}>{n.k}</Box>
                      <Box sx={{ fontSize: 9, letterSpacing: '0.08em', mt: '6px', color: t.nerv.hue.mint, opacity: loopStep === i ? 1 : 0.6 }}>{n.e}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* WAVE SEPARATOR */}
          <Box sx={{ py: 3.25 }}>
            <Waveform frame={false} height={90} label="" caption="" />
          </Box>

          {/* MEMORY VAULT */}
          <Box component="section" id="vault" sx={{ py: 5 }}>
            <SectionHeading index="01" sx={{ mb: 2.75 }}>THE MEMORY VAULT</SectionHeading>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.25 }}>
              {/* negative-space card */}
              <Box sx={{ border: `1px solid ${t.nerv.hue.orange}`, background: t.nerv.hue.void, p: '22px', minHeight: 230, display: 'flex', flexDirection: 'column', clipPath: t.nerv.chamfer(20) }}>
                <Box sx={{ fontSize: 9, color: t.nerv.hue.orange, letterSpacing: '0.1em', lineHeight: 1.5 }}>MEMORY_VAULT<br />SOURCE : /systems/knowledge<br />MODULE : OS_CORE</Box>
                <Box sx={{ mt: 'auto', fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 64, color: t.nerv.hue.mintHi, lineHeight: 0.9, textShadow: '0 0 14px rgba(82,242,154,.3)' }}>
                  2,482<Box component="small" sx={{ fontSize: 22, color: t.nerv.hue.orange }}> NODES</Box>
                </Box>
                <Box sx={{ fontSize: 11, color: t.nerv.hue.mint, opacity: 0.7, textTransform: 'none', mt: 1, maxWidth: '26ch' }}>Decisions, patterns, and mistakes — linked, queryable, and never overwritten.</Box>
              </Box>
              {/* retention bar graph */}
              <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, background: t.nerv.hue.void, p: '18px', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.1em', mb: 1.75, display: 'flex', justifyContent: 'space-between' }}>
                  <span>RETENTION / 12 CYCLES</span><span>98.4%</span>
                </Box>
                <Box sx={{ display: 'flex', gap: '6px', alignItems: 'flex-end', flex: 1, minHeight: 150 }}>
                  {RETENTION.map((h, i) => (
                    <LedColumn key={i} value={(h / 16) * 100} segments={16} tone="mint" height={150} sx={{ flex: 1, width: 'auto', minWidth: 0, gap: '2px' }} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: '6px', mt: 1, fontSize: 8, color: t.nerv.hue.greenMap }}>
                  {['-11', '-8', '-5', '-2', 'NOW'].map((x) => (<Box key={x} component="span" sx={{ flex: 1, textAlign: 'center' }}>{x}</Box>))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* QUERY MEMORY */}
          <Box component="section" sx={{ py: 5 }}>
            <SectionHeading index="02" sx={{ mb: 2.75 }}>QUERY MEMORY STORAGE</SectionHeading>
            <FilterChips ariaLabel="Memory filters" filters={FILTERS} value={filter} onChange={setFilter} sx={{ mb: 2, flexWrap: 'wrap' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {shown.map((m) => (<MemoryRow key={m.id} id={m.id} title={m.title} kind={m.kind} />))}
            </Box>
            <Box sx={{ fontSize: 10, color: t.nerv.hue.orange, mt: 1.5, letterSpacing: '0.1em' }}>SHOWING {shown.length} / {MEMS.length} NODES</Box>
          </Box>

          {/* THROUGHPUT CHART */}
          <Box component="section" id="chart" sx={{ py: 5 }}>
            <SectionHeading index="03" sx={{ mb: 2.75 }}>THROUGHPUT SIGNAL</SectionHeading>
            <Box sx={{ border: `1px solid ${t.nerv.hue.orange}`, background: t.nerv.hue.void, p: '18px' }}>
              <Box sx={{ fontSize: 10, color: t.nerv.hue.orange, letterSpacing: '0.1em', mb: 0.75, display: 'flex', justifyContent: 'space-between' }}>
                <span>◑ TASK CHAINS / HOUR</span><span>OBJECT : CORE_DISPATCHER</span>
              </Box>
              <Box sx={{ fontSize: 10, color: t.nerv.hue.mint, opacity: 0.6, textTransform: 'none', mb: 1.5 }}>field negative ← baseline → field positive · window 48h</Box>
              <LineChart height={220} label="TASK CHAINS" status="+34% PEAK" />
            </Box>
          </Box>

          {/* DEPLOYMENT SPEC / DOSSIER */}
          <Box component="section" id="spec" sx={{ py: 5 }}>
            <SectionHeading index="04" sx={{ mb: 2.75 }}>DEPLOYMENT SPEC</SectionHeading>
            <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, background: t.nerv.hue.void, p: '26px 30px', position: 'relative', overflow: 'hidden' }}>
              <Box component="span" sx={{ position: 'absolute', top: 14, right: -2, transform: 'rotate(4deg)', border: `2px solid ${t.nerv.hue.redHi}`, color: t.nerv.hue.redHi, fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 13, p: '3px 12px', letterSpacing: '0.14em', opacity: 0.85 }}>PRELIMINARY</Box>
              <Box sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 20, color: t.nerv.hue.mintHi, letterSpacing: '0.03em', borderBottom: `2px solid ${t.nerv.hue.teal}`, pb: 1.25, mb: 0.75 }}>JAIRUS_OS · CORE v2.4.0 — OPERATOR DOSSIER</Box>
              <Box sx={{ borderBottom: `2px solid ${t.nerv.hue.teal}`, width: '60%', height: 2, mb: 2.25 }} />
              {SPEC_ROWS.map(([k, v]) => (
                <Box key={k} sx={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 1.25, fontSize: 11, py: '7px', borderBottom: '1px dashed rgba(60,156,108,.25)', textTransform: 'none' }}>
                  <Box component="span" sx={{ color: t.nerv.hue.orange, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10 }}>{k}</Box>
                  <Box component="span" sx={{ color: t.nerv.hue.mint, opacity: 0.85, '& b': { color: t.nerv.hue.mintHi, fontWeight: 400 } }}>{v}</Box>
                </Box>
              ))}
              <Box sx={{ mt: 2.75, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2.5 }}>
                <Box sx={{ flex: 1, borderTop: `1px solid ${t.nerv.hue.greenMap}`, pt: 0.75, fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em' }}>OPERATOR SIGNATURE</Box>
                <Box sx={{ flex: 1, borderTop: `1px solid ${t.nerv.hue.greenMap}`, pt: 0.75, fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em' }}>DATE : OCT 24 202X</Box>
                <Box component="span" sx={{ border: `1px solid ${t.nerv.hue.mint}`, color: t.nerv.hue.mint, fontSize: 10, p: '4px 10px', letterSpacing: '0.1em' }}>◉ NOMINAL</Box>
              </Box>
            </Box>
          </Box>

          {/* FOOTER */}
          <Box component="footer" sx={{ borderTop: `2px solid ${t.nerv.hue.orange}`, mt: 5, py: '22px', pb: 5, fontSize: 10, color: t.nerv.hue.greenMap, display: 'flex', flexWrap: 'wrap', gap: 2, letterSpacing: '0.08em' }}>
            <Box component="span" sx={{ color: t.nerv.hue.mint }}>◉ AGENT_01 NOMINAL</Box>
            <Box component="span" sx={{ color: t.nerv.hue.mint }}>◉ AGENT_02 NOMINAL</Box>
            <Box component="span" sx={{ color: t.nerv.hue.amber }}>◉ AGENT_03 BUSY</Box>
            <Box component="span" sx={{ ml: 'auto' }}>© JAIRUS_OS</Box>
            <Box component="span">KESTREL·4</Box>
            <Box component="span" sx={{ color: t.nerv.hue.mint }}>SYNC_OK</Box>
          </Box>
        </Box>
      </Box>

      {/* ===== RIGHT RAIL ===== */}
      <Box
        component="aside"
        aria-label="live system status"
        sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'rgba(10,10,10,.96)', borderLeft: `2px solid ${t.nerv.hue.orange}`, boxShadow: '-2px 0 14px rgba(242,100,0,.15)', p: '18px 16px' }}
      >
        <RLabel>◉ SYSTEM STATUS</RLabel>
        <Rmeter label="CPU" value={cpu} pct={cpuPct} />
        <Rmeter label="MEMORY" value={mem} pct={memPct} />
        <Rmeter label="VAULT LOAD" value="98.4%" pct={98} warn />
        <RLabel>◉ GLOBAL MEMORY FEED</RLabel>
        <Box sx={{ fontSize: 10, lineHeight: 1.6, color: t.nerv.hue.amber, textTransform: 'none', letterSpacing: '0.02em', border: `1px solid ${t.nerv.hue.greenDim}`, p: '9px', mt: '6px', '& .t': { color: t.nerv.hue.amberDim }, '& .d': { color: t.nerv.hue.orange }, '& .m': { color: t.nerv.hue.redHi }, '& .g': { color: t.nerv.hue.mint } }}>
          <Box><span className="t">14:22</span> <span className="d">[DEC]</span> Bun runtime for local CI</Box>
          <Box><span className="t">12:10</span> <span className="m">[MIS]</span> Vector search in ENG-392</Box>
          <Box><span className="t">10:05</span> <span className="g">[LRN]</span> Emergent agent collab</Box>
          <Box><span className="t">09:12</span> <span className="d">[DEC]</span> Deploy J-OS core v2.4.0</Box>
          <Box><span className="t">08:40</span> <span className="g">[LRN]</span> High-density UI preferred</Box>
        </Box>
        <Box sx={{ mt: 'auto', fontSize: 10, color: t.nerv.hue.greenMap, letterSpacing: '0.06em', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>OBSERVE ✓  UNDERSTAND ✓</span>
          <span>DECIDE ✓  <Box component="span" sx={{ color: t.nerv.hue.amber }}>LEARN ⟳ ACTIVE</Box></span>
          <Box component="span" sx={{ color: t.nerv.hue.orange, mt: 1 }}>LAST_SYNC : NOW</Box>
        </Box>
      </Box>

      {/* ===== ACCESS MODAL ===== */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-label="request access"
        slotProps={{ paper: { sx: { border: `2px solid ${t.nerv.hue.orange}`, background: t.nerv.hue.void, boxShadow: '0 0 30px rgba(242,100,0,.3)', maxWidth: 440, width: '100%', m: 2.5 } } }}
      >
        <Box sx={{ border: `1px solid ${t.nerv.hue.orange}`, m: '6px', p: '26px 24px' }}>
          <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 38, color: t.nerv.hue.mintHi, textTransform: 'none', lineHeight: 1, textShadow: '0 0 14px rgba(82,242,154,.4)', borderBottom: `2px solid ${t.nerv.hue.teal}`, pb: 1.5, mb: 0.5 }}>
            審査
            <Box component="small" sx={{ display: 'block', fontFamily: t.nerv.fonts.display, fontSize: 12, color: t.nerv.hue.orange, textTransform: 'uppercase', letterSpacing: '0.14em', mt: 0.75 }}>ACCESS REQUEST</Box>
          </Box>
          <Box sx={{ fontSize: 9, color: t.nerv.hue.orange, letterSpacing: '0.08em', lineHeight: 1.5, my: 2 }}>GATE : ENROLLMENT_01<br />PRIORITY : AAA · EX_MODE : PILOT</Box>
          <Box component="span" sx={{ display: 'inline-block', border: `1px solid ${t.nerv.hue.redHi}`, color: t.nerv.hue.redHi, fontSize: 9, p: '2px 7px', letterSpacing: '0.1em', mb: 1.75, animation: reduced ? 'none' : `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` }}>◉ AWAITING OPERATOR</Box>
          <Box sx={{ mb: 1.5 }}>
            <Box component="label" htmlFor="opmail" sx={{ display: 'block', fontSize: 9, color: t.nerv.hue.mint, letterSpacing: '0.1em', mb: '5px' }}>OPERATOR HANDLE</Box>
            <TextField id="opmail" fullWidth size="small" autoComplete="off" placeholder="operator@station" value={handle} onChange={(e) => setHandle(e.target.value)} sx={{ '& .MuiInputBase-input': { textTransform: 'none' } }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.25, mt: 0.75 }}>
            <Button onClick={submitGate} fullWidth sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, letterSpacing: '0.1em', background: t.nerv.hue.mint, color: t.nerv.hue.void, border: 0, '&:hover': { background: t.nerv.hue.mintHi, boxShadow: '0 0 12px rgba(82,242,154,.5)' } }}>SUBMIT GATE</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)} fullWidth sx={{ '&:hover': { borderColor: t.nerv.hue.redHi, color: t.nerv.hue.redHi } }}>DISMISS</Button>
          </Box>
          {mResp && <Box aria-live="polite" sx={{ fontSize: 10, letterSpacing: '0.06em', mt: 1.5, textTransform: 'none', color: mResp.ok ? t.nerv.hue.mint : t.nerv.hue.redHi }}>{mResp.text}</Box>}
        </Box>
      </Dialog>
    </Box>
  );
}

/* ---- right-rail section label ---- */
function RLabel({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Box sx={{ fontSize: 9, color: t.nerv.hue.orange, letterSpacing: '0.14em', m: '6px 0 10px', borderBottom: `1px solid ${t.nerv.hue.greenDim}`, pb: 0.75 }}>{children}</Box>;
}

/* ---- right-rail vitals meter (thin continuous bar) ---- */
function Rmeter({ label, value, pct, warn = false }: { label: string; value: ReactNode; pct: number; warn?: boolean }) {
  const t = useTheme();
  const c = warn ? t.nerv.hue.amber : t.nerv.hue.mint;
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.nerv.hue.mint, mb: '4px', '& b': { color: t.nerv.hue.mintHi, fontWeight: 400 } }}>
        <span>{label}</span><Box component="b">{value}</Box>
      </Box>
      <Box sx={{ height: 5, background: 'rgba(255,255,255,.06)', position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, pct)}%`, background: c, boxShadow: `0 0 6px ${c}`, transition: 'width 300ms linear' }} />
      </Box>
    </Box>
  );
}
