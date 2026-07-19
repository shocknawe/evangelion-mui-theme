/**
 * DASHBOARD-02 · PROJECT DEEP DIVE — a full console screen ported from
 * sample-layouts/dashboard-02.html, assembled from the @components library:
 * ConsoleFrame (with a wave band), RecallNote, StepFlow, SegmentBar, AgentCard,
 * LogConsole and ApprovalBar — the live agent-console view of one sprint.
 */
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  ConsoleFrame,
  Waveform,
  HealthColumns,
  SevenSegClock,
  ZoneTitle,
  RecallNote,
  StepFlow,
  SegmentBar,
  StatusLegend,
  AgentCard,
  LogConsole,
  ApprovalBar,
  useReducedMotion,
  type AgentStatus,
  type LogRow,
  type LogTag,
} from '@components';
import { navigate } from '../lib/router';

const OODA = [
  { short: 'OBS', label: 'OBSERVE' },
  { short: 'UND', label: 'UNDERSTAND' },
  { short: 'DEC', label: 'DECIDE' },
  { short: 'EXE', label: 'EXECUTE' },
  { short: 'LRN', label: 'LEARN' },
];

const pad2 = (n: number) => String(n).padStart(2, '0');
const nowts = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad2).join(':');
};

interface AgentDef {
  name: string;
  status: AgentStatus;
  task: string;
  seed: [LogTag, string][];
  pool: [LogTag, string][];
  latest?: boolean;
}
const AGENT_DEFS: AgentDef[] = [
  { name: 'AGENT·ORION', status: 'ACTIVE', task: 'REFACTOR AUTH FLOW',
    seed: [['info', 'Reading auth middleware /api/v3/session.'], ['warn', 'N+1 query found in token refresh.']],
    pool: [['git', 'commit -m "fix: batch token lookups"'], ['info', 'Auth suite green — 214 tests.'], ['info', 'Rate limiter tuned to 60 rpm.']] },
  { name: 'AGENT·LYRA', status: 'REVIEWING', task: 'REVIEW PR·442',
    seed: [['info', 'Opened PR-442 — optimization pack.'], ['git', 'running eslint + typecheck…']],
    pool: [['info', '3 review comments posted.'], ['warn', 'Coverage dropped 1.2% on pool.ts.'], ['info', 'Holding for human gate on merge.']] },
  { name: 'AGENT·VEGA', status: 'ACTIVE', task: 'INDEX VECTOR STORE',
    seed: [['info', 'Scrubbing vector index shard 4/8.'], ['info', '2,482 nodes verified stable.']],
    pool: [['git', 'push origin chore/index-rebuild'], ['info', 'Recall latency 48ms p95.'], ['info', 'Shard 6/8 rebuilt.']] },
  { name: 'AGENT·CYGNUS', status: 'IDLE', task: 'STANDBY',
    seed: [['info', 'Heartbeat OK — awaiting dispatch.']],
    pool: [['info', 'Heartbeat OK.']] },
  { name: 'AGENT·DRACO', status: 'ACTIVE', task: 'PORT CI RUNNERS', latest: true,
    seed: [['info', 'Porting GitHub Actions → Bun runners.'], ['info', 'Bun runner warm — cold start 118ms.']],
    pool: [['warn', 'Retry storm on relay K-22 suppressed.'], ['git', 'rebase feature/ci-migration onto main'], ['info', 'Pipeline green on bun-1.1.']] },
];

interface AgentState extends AgentDef {
  log: LogRow[];
}
const seedAgents = (): AgentState[] =>
  AGENT_DEFS.map((a) => ({ ...a, log: a.seed.map(([tag, msg]) => ({ ts: nowts(), tag, msg })) }));

export function Dashboard02Page() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const [agents, setAgents] = useState<AgentState[]>(seedAgents);
  const [sel, setSel] = useState(() => {
    const i = AGENT_DEFS.findIndex((a) => a.latest);
    return i < 0 ? AGENT_DEFS.length - 1 : i;
  });
  const [uptime, setUptime] = useState(51.2 * 3600);
  const [healthWord, setHealthWord] = useState('OPTIMAL');
  const [archApproved, setArchApproved] = useState(false);
  const [gate, setGate] = useState<{ ok: boolean; text: string } | null>(null);

  const uptimeStr = `${pad2(Math.floor(uptime / 3600))}:${pad2(Math.floor(uptime / 60) % 60)}:${pad2(Math.floor(uptime % 60))}`;

  const pushLog = (idx: number, tag: LogTag, msg: string) =>
    setAgents((prev) => prev.map((a, i) => (i === idx ? { ...a, log: [...a.log, { ts: nowts(), tag, msg }].slice(-44) } : a)));

  // Uptime clock.
  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Live agent feed + status churn (paused under reduced motion).
  useEffect(() => {
    if (reduced) return;
    const feed = setInterval(() => {
      setAgents((prev) => {
        const active = prev.map((a, i) => ({ a, i })).filter(({ a }) => a.status !== 'IDLE');
        if (!active.length) return prev;
        const { i } = active[Math.floor(Math.random() * active.length)];
        const p = prev[i].pool[Math.floor(Math.random() * prev[i].pool.length)];
        return prev.map((a, x) => (x === i ? { ...a, log: [...a.log, { ts: nowts(), tag: p[0], msg: p[1] }].slice(-44) } : a));
      });
    }, 2400);
    const churn = setInterval(() => {
      setAgents((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const roll = Math.random();
        const next: AgentStatus = roll < 0.6 ? 'ACTIVE' : roll < 0.85 ? 'REVIEWING' : 'IDLE';
        return prev.map((a, x) => (x === i ? { ...a, status: next, task: next === 'IDLE' ? 'STANDBY' : a.task } : a));
      });
    }, 3600);
    return () => { clearInterval(feed); clearInterval(churn); };
  }, [reduced]);

  const approveArch = () => {
    setArchApproved(true);
    pushLog(sel, 'gate', 'Architecture gate cleared for TASK-882 (DECIDE → EXECUTE).');
  };
  const decideGate = (ok: boolean) => {
    if (gate) return;
    setGate({ ok, text: ok ? '承認 · MERGED TO MAIN' : '否認 · RETURNED TO AGENT' });
    setSel(1); // surface AGENT·LYRA, owner of PR-442
    pushLog(1, 'gate', ok ? 'Human approval granted — merging PR-442 to main.' : 'Merge denied — PR-442 returned to Agent_Lyra.');
    if (ok) setTimeout(() => pushLog(1, 'git', 'merge PR-442 → main (fast-forward)'), 900);
  };

  const zoneAside = useMemo(() => `[ ${agents.filter((a) => a.status !== 'IDLE').length} EXECUTING ]`, [agents]);

  /* ---- header ---- */
  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.25, flexWrap: 'wrap', height: '100%', p: '10px 22px' }}>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: 10, letterSpacing: '0.18em', color: t.nerv.hue.amber, fontFamily: t.nerv.fonts.mono }}>
          ENGINEERING / ACTIVE SPRINT / PRJ·402 · 深掘
        </Box>
        <Typography variant="h1" sx={{ fontSize: 27, color: t.nerv.hue.paper, letterSpacing: '0.02em', mt: '2px', textShadow: '0 0 4px currentColor, 0 0 12px rgba(82,242,154,.3)' }}>
          NEURAL PIPELINE V3
        </Typography>
      </Box>
      <Box component="span" sx={{ border: `1px solid ${t.nerv.hue.mint}`, color: t.nerv.hue.mint, borderRadius: `${t.nerv.radius.chip}px`, p: '2px 8px', fontSize: 11, fontFamily: t.nerv.fonts.mono }}>[ ACTIVE_SPRINT ]</Box>
      <Box component="span" sx={{ fontSize: 10, letterSpacing: '0.12em', color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono, '& b': { color: t.nerv.hue.mint, fontWeight: 400 } }}>
        UPTIME <b>{uptimeStr}</b> · <b>98.2%</b>
      </Box>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <HealthColumns onSummary={(lit, total) => setHealthWord(lit >= total * 0.64 ? 'OPTIMAL' : 'STABLE')} />
        <Box sx={{ textAlign: 'right', fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono }}>
          SYSTEM HEALTH
          <Box component="b" sx={{ display: 'block', color: t.nerv.hue.mint, fontFamily: t.nerv.fonts.display, fontSize: 14, letterSpacing: '0.06em' }}>{healthWord}</Box>
        </Box>
        <SevenSegClock variant="chip" />
      </Box>
    </Box>
  );

  /* ---- sidebar (left rail) ---- */
  const sidebar = (
    <Box sx={{ p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2, height: { xs: 'auto', md: '100%' } }}>
      <Box component="section">
        <ZoneTitle>ARCHITECTURE RECALL · 記憶</ZoneTitle>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <RecallNote id="DECISION_LOG_32">Use Bun runtime for CI pipelines to reduce overhead by 40%.</RecallNote>
          <RecallNote id="PATTERN_REF_11">Unified error handling: standard Result wrapper for all async agents.</RecallNote>
          <RecallNote id="MEMORY_FRAGMENT">Avoid direct database writes from edge agents; route through the central Sync Gate.</RecallNote>
        </Box>
      </Box>
      <Box
        component="a"
        href="/"
        onClick={(e) => { e.preventDefault(); navigate('/'); }}
        sx={{ mt: 'auto', fontSize: 10, color: t.nerv.hue.mint, textDecoration: 'none', letterSpacing: '0.08em', fontFamily: t.nerv.fonts.mono, borderBottom: `1px dashed ${t.nerv.hue.mint}`, alignSelf: 'flex-start', '&:hover': { background: t.nerv.hue.mint, color: t.nerv.hue.void } }}
      >
        ← DESIGN SYSTEM
      </Box>
    </Box>
  );

  const current = agents[sel];

  return (
    <Box sx={{ height: { xs: 'auto', md: '100vh' }, overflow: { xs: 'visible', md: 'hidden' } }}>
      <ConsoleFrame
        headerHeight={84}
        bandHeight={96}
        header={header}
        band={<Waveform frame={false} height="100%" label={<>INFERENCE FIELD · <b>RESONANCE STABLE</b></>} caption="共振 / RESONANCE" />}
        sidebar={sidebar}
        sidebarWidth={280}
      >
        <Box sx={{ p: '14px 20px', display: 'flex', flexDirection: 'column', gap: 1.75, minHeight: 0 }}>
          {/* loop synchronizer */}
          <Box component="section">
            <ZoneTitle aside={<Box component="span" sx={{ color: t.nerv.hue.mint }}>{zoneAside}</Box>}>LOOP SYNCHRONIZER · 環</ZoneTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Task
                id="TASK·882"
                title="OPTIMIZE LATENCY — REFACTOR POSTGRES CONNECTION POOL LOGIC"
                active={archApproved ? 3 : 2}
                pct={62}
                action={
                  <Button variant="contained" className="nerv-live" size="small" disabled={archApproved} onClick={approveArch}>
                    {archApproved ? 'ARCH APPROVED' : 'APPROVE ARCH'}
                  </Button>
                }
              />
              <Task
                id="TASK·884"
                title="CI/CD MIGRATION — PORT GITHUB ACTIONS TO BUN-BASED RUNNERS"
                active={0}
                pct={8}
                action={<Box component="span" sx={{ border: `1px solid ${t.nerv.hue.amber}`, color: t.nerv.hue.amber, borderRadius: `${t.nerv.radius.chip}px`, p: '2px 8px', fontSize: 11, whiteSpace: 'nowrap', fontFamily: t.nerv.fonts.mono }}>[ GATE: START ]</Box>}
              />
            </Box>
          </Box>

          {/* active agents */}
          <Box component="section">
            <ZoneTitle aside={<Box component="span" sx={{ color: t.nerv.hue.greenMap }}>SELECT TO VIEW CONSOLE</Box>}>ACTIVE AGENTS · 部隊</ZoneTitle>
            <StatusLegend
              sx={{ mb: 1.25 }}
              items={[
                { jp: '稼働', en: 'ACTIVE', tone: 'mint' },
                { jp: '審査', en: 'REVIEW', tone: 'blue' },
                { jp: '待機', en: 'IDLE', tone: 'dim' },
              ]}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 1 }}>
              {agents.map((a, i) => (
                <AgentCard key={a.name} name={a.name} status={a.status} task={a.status === 'IDLE' ? 'STANDBY' : a.task} selected={sel === i} onSelect={() => setSel(i)} />
              ))}
            </Box>
          </Box>

          {/* selected agent console + human gate */}
          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', minHeight: 300 }}>
            <LogConsole sx={{ flex: 1 }} title={`STDOUT // ${current.name}`} rows={current.log} />
            <ApprovalBar
              item="MERGE [PR·442] — OPTIMIZATION PACK"
              approveLabel="APPROVE GATE · 承認"
              denyLabel="DENY · 否認"
              verdict={gate}
              onApprove={() => decideGate(true)}
              onDeny={() => decideGate(false)}
            />
          </Box>
        </Box>
      </ConsoleFrame>
    </Box>
  );
}

/* A loop-synchronizer task card: id · title · action, an OODA stepper, and a
   progress row. Local to this screen's composition. */
function Task({ id, title, active, pct, action }: { id: string; title: string; active: number; pct: number; action: React.ReactNode }) {
  const t = useTheme();
  return (
    <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, p: '10px 14px' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
        <Box component="span" sx={{ color: t.nerv.hue.amber, fontSize: 11, whiteSpace: 'nowrap', fontFamily: t.nerv.fonts.mono }}>{id}</Box>
        <Box component="span" sx={{ color: t.nerv.hue.paper, fontSize: 13, fontFamily: t.nerv.fonts.mono }}>{title}</Box>
        <Box sx={{ ml: 'auto' }}>{action}</Box>
      </Box>
      <StepFlow sx={{ mt: 1.5 }} active={active} steps={OODA} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 1.25, fontSize: 10, color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>
        <span>PROGRESS</span>
        <SegmentBar value={pct} />
        <Box component="b" sx={{ color: t.nerv.hue.mint, fontWeight: 400 }}>{pct}%</Box>
      </Box>
    </Box>
  );
}
