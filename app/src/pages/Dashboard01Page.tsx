/**
 * DASHBOARD-01 · MORNING BRIEF — a full console screen ported from
 * sample-layouts/dashboard-01.html, assembled entirely from the @components
 * library (ConsoleFrame, ConsoleNav, ProgressMeter, GateRow, GateDecisionDialog,
 * …) carrying the theme. No bespoke app widgets — every piece is reusable.
 */
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  ConsoleFrame,
  ConsoleNav,
  Monogram,
  MetadataBlock,
  HealthColumns,
  SevenSegClock,
  StatusLegend,
  BilingualLabel,
  Stat,
  Stamp,
  ProgressMeter,
  ZoneTitle,
  GateRow,
  RailItem,
  GateDecisionDialog,
  type GatePriority,
  type GateVerdict,
  type GateDecision,
} from '@components';
import { navigate } from '../lib/router';

const NAV = [
  { value: 'eng', jp: '工学', en: 'ENGINEERING' },
  { value: 'know', jp: '知識', en: 'KNOWLEDGE' },
  { value: 'auto', jp: '自動', en: 'AUTOMATION' },
  { value: 'learn', jp: '学習', en: 'LEARNING' },
  { value: 'content', jp: '記録', en: 'CONTENT' },
  { value: 'personal', jp: '個人', en: 'PERSONAL' },
];

interface Gate {
  id: string;
  title: string;
  sub: string;
  priority: GatePriority;
  verdict?: GateVerdict;
}
const INITIAL_GATES: Gate[] = [
  { id: 'GATE·04', title: 'API SECURITY GATEWAY', sub: 'ARCHITECTURE · 3 PRS WAITING', priority: 'critical' },
  { id: 'GATE·07', title: 'INITIALIZATION PROTOCOL 03', sub: 'START · READY FOR REVIEW', priority: 'routine' },
  { id: 'GATE·11', title: 'MEMORY INGESTION SCHEMA', sub: 'KNOWLEDGE · MIGRATION PLAN', priority: 'elevated' },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function Dashboard01Page() {
  const t = useTheme();
  const [section, setSection] = useState('eng');
  const [gates, setGates] = useState<Gate[]>(INITIAL_GATES);
  const [active, setActive] = useState<number | null>(null);
  const [caution, setCaution] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const waiting = gates.filter((g) => !g.verdict).length;
  const dateline = useMemo(() => {
    const d = new Date();
    return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')} ${d.getFullYear()}`;
  }, []);

  // Live system integrity — an occasional caution blip (matches the source).
  useEffect(() => {
    const id = setInterval(() => setCaution(Math.random() < 0.08), 7000);
    return () => clearInterval(id);
  }, []);

  const decide = (kind: GateDecision) => {
    if (active === null) return;
    setGates((gs) => gs.map((g, i) => (i === active ? { ...g, verdict: kind } : g)));
    setActive(null);
  };

  /* ---- header ---- */
  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', height: '100%', p: '10px 20px' }}>
      <Monogram jp="統制" label="COMMAND" />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h1" sx={{ fontSize: 24, color: t.nerv.hue.paper, letterSpacing: '0.02em', textShadow: '0 0 4px currentColor, 0 0 12px rgba(82,242,154,.3)' }}>
          WELCOME BACK, OPERATOR.
        </Typography>
        <Box sx={{ fontSize: 10, letterSpacing: '0.2em', color: t.nerv.hue.amber, mt: '3px', fontFamily: t.nerv.fonts.mono }}>
          STATUS: MORNING INITIALIZATION · 朝礼
        </Box>
      </Box>
      <MetadataBlock sx={{ ml: 'auto', textAlign: 'right' }} entries={{ CODE: '0902', FILE: 'MORNING_BRIEF', EX_MODE: 'MANUAL', PRIORITY: 'AA-' }} />
      <Stamp tone={caution ? 'amber' : 'mint'} glow>{caution ? 'SYS:CAUTION' : 'SYS:NOMINAL'}</Stamp>
      <Box sx={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
        <HealthColumns />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
          <SevenSegClock variant="countdown" />
          <Box sx={{ fontSize: 10, color: t.nerv.hue.amber, letterSpacing: '0.14em', fontFamily: t.nerv.fonts.mono }}>{dateline}</Box>
        </Box>
      </Box>
    </Box>
  );

  /* ---- sidebar ---- */
  const sidebar = (
    <Box sx={{ p: '16px 14px', display: 'flex', flexDirection: 'column', gap: 1, height: { xs: 'auto', md: '100%' }, minHeight: 0 }}>
      <ConsoleNav ariaLabel="Sections" items={NAV} value={section} onChange={setSection} sx={{ flex: 1, overflowY: { xs: 'visible', md: 'auto' } }} />
      <Button variant="alt" fullWidth>INITIALIZE PROTOCOL</Button>
      <Box sx={{ display: 'flex', gap: 1.25, fontSize: 10, color: t.nerv.hue.greenMap, mt: 1, fontFamily: t.nerv.fonts.mono, letterSpacing: '0.08em' }}>
        <span>SETTINGS</span>
        <span>SUPPORT</span>
        <Box
          component="a"
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          sx={{ ml: 'auto', color: t.nerv.hue.mint, textDecoration: 'none', borderBottom: `1px dashed ${t.nerv.hue.mint}`, '&:hover': { background: t.nerv.hue.mint, color: t.nerv.hue.void } }}
        >
          ← DESIGN SYSTEM
        </Box>
      </Box>
    </Box>
  );

  /* ---- right rail ---- */
  const rail = (
    <Box sx={{ p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box component="section">
        <ZoneTitle aside="2 DUE">VAULT REMINDERS</ZoneTitle>
        <RailItem title="RENEW SERVER CLUSTER CERTS" sub="SYSTEM · NODE 01-09" when="14:00" />
        <RailItem title="COFFEE WITH UNIT·731" sub="PERSONAL" when="08:30" done />
        <RailItem title="NOON SYNC — PIPELINE V3" sub="ENGINEERING" when="12:00" />
      </Box>
      <Box component="section">
        <ZoneTitle aside="8 ITEMS">INBOX (K-OS)</ZoneTitle>
        <RailItem title="THE FUTURE OF RISC-V ORBITS" sub="LINK · UNREAD" when="2H" />
        <RailItem title="WHITEPAPER: LLAMA CONSENSUS" sub="DOC · UNREAD" when="6H" />
        <RailItem title="PR-442 REVIEW THREAD" sub="GIT · 3 REPLIES" when="9H" />
      </Box>
      <Box component="section">
        <ZoneTitle aside="12 DUE">LEARNING REVIEW</ZoneTitle>
        <Box sx={{ border: `1px solid ${t.nerv.hue.greenDim}`, p: '10px 12px' }}>
          <Box sx={{ fontSize: 9, color: t.nerv.hue.amber, letterSpacing: '0.14em', fontFamily: t.nerv.fonts.mono }}>TOPIC: KUBERNETES OPERATORS</Box>
          <Box sx={{ fontSize: 11, color: t.nerv.hue.paper, lineHeight: 1.55, textTransform: 'none', m: '6px 0 10px', fontFamily: t.nerv.fonts.mono }}>
            Explain the reconciliation loop pattern in custom controllers.
          </Box>
          {revealed && (
            <Box sx={{ fontSize: 11, color: t.nerv.hue.mint, lineHeight: 1.5, textTransform: 'none', mb: 1.25, fontFamily: t.nerv.fonts.mono }}>
              Observe cluster state, diff against the declared spec, then act to converge — repeating until observed == desired. The controller never assumes success; it re-reads and re-diffs every cycle.
            </Box>
          )}
          <Button variant="ghost" size="small" onClick={() => setRevealed((v) => !v)}>{revealed ? 'HIDE ANSWER' : 'SHOW ANSWER'}</Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: { xs: 'auto', md: '100vh' }, overflow: { xs: 'visible', md: 'hidden' } }}>
      <ConsoleFrame header={header} sidebar={sidebar} rail={rail}>
        <Box sx={{ p: '14px 20px', display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}>
          <StatusLegend
            items={[
              { jp: '正常', en: 'NOMINAL', tone: 'mint' },
              { jp: '注意', en: 'CAUTION', tone: 'amber' },
              { jp: '待機', en: 'PENDING', tone: 'blue' },
              { jp: '阻止', en: 'BLOCKED', tone: 'red', filled: true },
            ]}
          />

          {/* hero — system state */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.25, border: `1px solid ${t.nerv.hue.greenDim}`, p: '16px 22px', minHeight: 132, flexWrap: 'wrap' }}>
            <BilingualLabel jp="起動" en="INITIALIZATION" tone="mint" size={72} layout="column" captionTone="green" />
            <Box sx={{ display: 'flex', gap: 4.25, ml: 'auto', flexWrap: 'wrap' }}>
              <Stat label="SYSTEM INTEGRITY" value={caution ? 'CAUTION' : 'NOMINAL'} tone={caution ? 'amber' : 'mint'} />
              <Stat label="GATES WAITING" value={waiting} />
              <Stat label="MEMORY NODES" value="2,482" />
            </Box>
          </Box>

          {/* primary objective */}
          <Paper variant="chamfer" sx={{ p: '14px 18px' }}>
            <Box sx={{ fontSize: 10, letterSpacing: '0.2em', color: t.nerv.hue.mint, fontFamily: t.nerv.fonts.mono }}>PRIMARY OBJECTIVE · 主目標</Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.75, mt: 0.5 }}>
              <Typography variant="h2" sx={{ fontSize: 21, color: t.nerv.hue.paper, letterSpacing: '0.02em' }}>
                ARCHITECTURE REFACTOR: NEURAL PIPELINE V3
              </Typography>
              <Stamp tone="orange">JRS·902</Stamp>
            </Box>
            <Box sx={{ my: 1.5 }}>
              <ProgressMeter value={68} threshold={{ pct: 80, label: 'REVIEW GATE · 80' }} readout="REVIEW OPENS AT 80% · ETA NOON SYNC" />
            </Box>
            <Typography sx={{ fontSize: 11, lineHeight: 1.6, color: t.nerv.hue.greenMap, textTransform: 'none', maxWidth: '64ch', m: '10px 0 12px', fontFamily: t.nerv.fonts.mono, '& b': { color: t.nerv.hue.mint, fontWeight: 400 } }}>
              CURRENT STATE: MODULARIZING THE INFERENCE ENGINE FOR DISTRIBUTED LOW-LATENCY NODES. FOCUS ON THE <b>COREDISPATCHER</b> INTERFACE LOGIC BEFORE NOON SYNC.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.25 }}>
              <Button variant="contained" className="nerv-live">RESUME SESSION</Button>
              <Button variant="alt">TECHNICAL DOCS</Button>
            </Box>
          </Paper>

          {/* blocked on you */}
          <Box component="section">
            <ZoneTitle>BLOCKED ON YOU · 裁定待ち</ZoneTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {gates.map((g, i) => (
                <GateRow key={g.id} id={g.id} title={g.title} sub={g.sub} priority={g.priority} verdict={g.verdict} onReview={() => setActive(i)} />
              ))}
            </Box>
          </Box>
        </Box>
      </ConsoleFrame>

      <GateDecisionDialog
        open={active !== null}
        item={active !== null ? `${gates[active].id} — ${gates[active].title}` : undefined}
        onDecide={decide}
        onClose={() => decide('defer')}
      />
    </Box>
  );
}
