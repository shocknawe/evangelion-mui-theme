/**
 * DASHBOARD-03 · AUTOMATION CENTRAL — a full console screen ported from
 * sample-layouts/dashboard-03.html, assembled from the @components library:
 * ConsoleFrame (with a footer status bar + alarm state), GaugeCard framing a
 * RadialGauge / SegmentBar / LedColumn trigger bank, SinkRow delivery sinks, a
 * live LogConsole exec feed, and a FilterChips-scoped RoutineRow manager.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import {
  ConsoleFrame,
  ZoneTitle,
  GaugeCard,
  RadialGauge,
  SegmentBar,
  LedColumn,
  StatusLegend,
  SinkRow,
  RoutineRow,
  FilterChips,
  LogConsole,
  SevenSegClock,
  useReducedMotion,
  pad2,
  type LogRow,
  type Tone,
  type RoutineStatus,
} from '@components';
import { navigate } from '../lib/router';

const nowts = () => {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map(pad2).join(':');
};

/* Inline feed emphasis — mint for identifiers, paper for filenames. */
const Hi = ({ children }: { children: ReactNode }) => (
  <Box component="b" sx={(t) => ({ color: t.nerv.hue.mint, fontWeight: 400 })}>{children}</Box>
);
const FileRef = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={(t) => ({ color: t.nerv.hue.paper })}>{children}</Box>
);

interface FeedLine {
  msg: ReactNode;
  tone?: Tone;
}
const FEED: FeedLine[] = [
  { msg: <>Triggered <Hi>'gitlab-poll'</Hi> → 3 new tickets ingested into Knowledge OS.</> },
  { msg: <>Routine 'Daily Cleanup' finished. Cleared 424MB cache.</>, tone: 'green' },
  { msg: <>File watcher detected <FileRef>'Trip_Photos.zip'</FileRef> → initializing content pipeline…</> },
  { msg: <>└─ Thread [772] started: decompressing archive…</> },
  { msg: <>CRON [OK] System health check passed. No anomalies detected.</>, tone: 'green' },
  { msg: <>Executing loop: Observe → Understand → Decide…</>, tone: 'green' },
  { msg: <>Webhook received from GitHub: PR #442 merged.</> },
  { msg: <>ntfy push delivered in 14ms.</> },
  { msg: <>SMTP relay unreachable — queued 2 messages.</>, tone: 'red' },
  { msg: <>Media watcher: buffer at threshold, flushing to vault.</> },
];

interface Routine {
  id: string;
  name: string;
  kind: 'CRON' | 'WATCHER' | 'EVENT';
  status: RoutineStatus;
}
const INITIAL_ROUTINES: Routine[] = [
  { id: 'RT·01', name: 'NIGHTLY ROUTINE', kind: 'CRON', status: 'PENDING' },
  { id: 'RT·02', name: 'JOURNAL SYNC', kind: 'CRON', status: 'SUCCESS' },
  { id: 'RT·03', name: 'SYSTEM BACKUP', kind: 'CRON', status: 'RETRIED' },
  { id: 'RT·04', name: 'MEDIA PIPELINE', kind: 'WATCHER', status: 'SUCCESS' },
  { id: 'RT·05', name: 'TICKET INGEST', kind: 'EVENT', status: 'SUCCESS' },
  { id: 'RT·06', name: 'CACHE CLEANUP', kind: 'WATCHER', status: 'PENDING' },
  { id: 'RT·07', name: 'PR AUTO-LABEL', kind: 'EVENT', status: 'SUCCESS' },
];

const SCOPES = ['ALL', 'CRON', 'WATCHER', 'EVENT'];

export function Dashboard03Page() {
  const t = useTheme();
  const reduced = useReducedMotion();

  const [uptime, setUptime] = useState(142 * 3600 + 22 * 60 + 9);
  const [paused, setPaused] = useState(false);
  const [listeners, setListeners] = useState(38);

  const [cronPct, setCronPct] = useState(98);
  const [watchPct, setWatchPct] = useState(45);
  const [fresh, setFresh] = useState(100);
  const [lastPoll, setLastPoll] = useState(60);

  const [feed, setFeed] = useState<LogRow[]>([
    { ts: nowts(), tone: 'green', msg: 'Automation engine attached. Tailing /var/log/jairus/automation.log' },
    { ts: nowts(), msg: '38 listeners up. 3 sinks registered (1 offline).' },
  ]);
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [scope, setScope] = useState('ALL');

  const [cpu, setCpu] = useState('12.4%');
  const [mem, setMem] = useState('2.1GB/32GB');
  const [ntfyPing, setNtfyPing] = useState(14);
  const [slackPing, setSlackPing] = useState(82);
  const [busy, setBusy] = useState(2);

  const alarm = routines.some((r) => r.status === 'RETRIED');

  const log = (msg: ReactNode, tone?: Tone) =>
    setFeed((prev) => [...prev, { ts: nowts(), tone, msg }].slice(-60));

  const uptimeDigits = pad2(Math.floor(uptime / 3600) % 100) + pad2(Math.floor(uptime / 60) % 60) + pad2(uptime % 60);
  const lastPollLabel = lastPoll < 60 ? `${lastPoll}S AGO` : `${Math.floor(lastPoll / 60)}M AGO`;

  // Engine uptime clock.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, [reduced]);

  // Live exec feed — cycles the pool while the engine runs.
  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const id = setInterval(() => {
      if (paused) return;
      const f = FEED[i % FEED.length];
      i += 1;
      log(f.msg, f.tone);
    }, 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, paused]);

  // Ambient gauge + listener drift; GitLab poll occasionally refreshes freshness.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (paused) return;
      setCronPct((v) => Math.min(100, v + (Math.random() < 0.3 ? 1 : 0)));
      setWatchPct((v) => Math.max(5, Math.min(96, v + (Math.random() - 0.45) * 9)));
      setListeners(36 + Math.floor(Math.random() * 4));
      if (Math.random() < 0.18) {
        setFresh(100);
        setLastPoll(0);
        log('GitLab poll complete — index fresh.', 'green');
      } else {
        setFresh((v) => Math.max(4, v - 2.5));
        setLastPoll((v) => v + 2);
      }
    }, 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, paused]);

  // Footer vitals.
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setCpu(`${(9 + Math.random() * 9).toFixed(1)}%`);
      setMem(`${(1.8 + Math.random() * 0.7).toFixed(1)}GB/32GB`);
      setNtfyPing(10 + Math.floor(Math.random() * 12));
      setSlackPing(70 + Math.floor(Math.random() * 30));
      setBusy(Math.random() < 0.5 ? 2 : Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(id);
  }, [reduced]);

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    log(next ? 'Engine paused — triggers held.' : 'Engine resumed — listeners re-armed.', next ? 'red' : 'green');
  };
  const forceReload = () => {
    log('Force reload: re-reading trigger manifest…');
    setTimeout(() => log('Manifest reloaded. 38 listeners re-armed.', 'green'), 700);
  };
  const setScopeFiltered = (k: string) => {
    setScope(k);
    log(`Filter scope set: ${k}`, 'green');
  };
  const runRoutine = (id: string) => {
    const r = routines.find((x) => x.id === id);
    if (!r) return;
    setRoutines((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'PENDING' } : x)));
    log(`Manual dispatch: '${r.name.toLowerCase()}' queued.`);
    setTimeout(() => {
      const ok = Math.random() < 0.85;
      setRoutines((prev) => prev.map((x) => (x.id === id ? { ...x, status: ok ? 'SUCCESS' : 'RETRIED' } : x)));
      log(`Routine '${r.name.toLowerCase()}' ${ok ? 'finished.' : 'failed — retry scheduled.'}`, ok ? 'green' : 'red');
    }, 1800 + Math.random() * 1800);
  };

  /* ---- header ---- */
  const engineTone = paused ? t.nerv.hue.amber : t.nerv.hue.mint;
  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.25, height: '100%', p: '10px 22px' }}>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: 10, letterSpacing: '0.18em', color: t.nerv.hue.amber, fontFamily: t.nerv.fonts.mono }}>
          AUTOMATION / ENGINE ROOM · 自動化中枢
        </Box>
        <Typography variant="h1" sx={{ fontSize: 28, color: t.nerv.hue.paper, letterSpacing: '0.02em', textShadow: '0 0 4px currentColor, 0 0 12px rgba(82,242,154,.3)' }}>
          AUTOMATION CENTRAL
        </Typography>
      </Box>
      <Box
        component="span"
        sx={{
          border: `1px solid ${engineTone}`,
          color: engineTone,
          borderRadius: `${t.nerv.radius.chip}px`,
          p: '2px 8px',
          fontSize: 11,
          fontFamily: t.nerv.fonts.mono,
          animation: reduced ? 'none' : `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite`,
        }}
      >
        ● {paused ? 'ENGINE PAUSED' : 'ENGINE ACTIVE'}
      </Box>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button variant="outlined" size="small" onClick={togglePause}>{paused ? 'RESUME ALL' : 'PAUSE ALL'}</Button>
        <Button variant="contained" className="nerv-live" size="small" onClick={forceReload}>FORCE RELOAD</Button>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <SevenSegClock variant="chip" digits={uptimeDigits} />
          <Box sx={{ fontSize: 9, color: t.nerv.hue.amber, letterSpacing: '0.16em', fontFamily: t.nerv.fonts.mono }}>ENGINE UPTIME</Box>
        </Box>
      </Box>
    </Box>
  );

  /* ---- rail (sinks + routines) ---- */
  const visible = (kind: string) => scope !== 'ALL' && kind !== scope;
  const rail = (
    <Box sx={{ p: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2, height: { xs: 'auto', md: '100%' }, minHeight: 0 }}>
      <Box component="section">
        <ZoneTitle>NOTIF SINKS · 送達</ZoneTitle>
        <SinkRow name="NTFY GATEWAY" status="ACTIVE" ping={<>PING: {ntfyPing}MS</>} />
        <SinkRow name="SLACK INTERNAL" status="CONNECTED" ping={<>PING: {slackPing}MS</>} />
        <SinkRow name="SMTP RELAY" status="OFFLINE" detail="OFFLINE · IDLE" />
      </Box>
      <Box component="section" sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
        <ZoneTitle>ROUTINE MANAGER · 手順</ZoneTitle>
        <FilterChips ariaLabel="Filter routines by trigger type" filters={SCOPES} value={scope} onChange={setScopeFiltered} sx={{ mb: 1.125 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: { xs: 'visible', md: 'auto' }, flex: 1, minHeight: 0 }}>
          {routines.map((r) => (
            <RoutineRow key={r.id} id={r.id} name={r.name} kind={r.kind} status={r.status} dim={visible(r.kind)} onRun={() => runRoutine(r.id)} />
          ))}
        </Box>
      </Box>
    </Box>
  );

  /* ---- footer status bar ---- */
  const footer = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, px: '22px', height: '100%', fontSize: 10, letterSpacing: '0.1em', color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>
      {[0, 1, 2].map((i) => {
        const on = busy === i;
        return (
          <Box key={i} component="span" sx={{ display: 'flex', alignItems: 'center', color: on ? t.nerv.hue.amber : 'inherit' }}>
            <Box component="i" sx={{ width: 7, height: 7, borderRadius: '50%', background: on ? t.nerv.hue.amber : t.nerv.hue.mint, mr: '6px' }} />
            AGENT·0{i + 1}: {on ? 'BUSY' : 'NOMINAL'}
          </Box>
        );
      })}
      <Box sx={{ flex: 1 }} />
      <Box component="span">CPU: <Box component="b" sx={{ color: t.nerv.hue.mint, fontWeight: 400 }}>{cpu}</Box></Box>
      <Box component="span">MEM: <Box component="b" sx={{ color: t.nerv.hue.mint, fontWeight: 400 }}>{mem}</Box></Box>
      <Box component="span" sx={{ color: t.nerv.hue.mint }}>SYNC OK</Box>
    </Box>
  );

  const legendAside = useMemo(
    () => <Box component="span" sx={{ color: t.nerv.hue.mint }}>{listeners} LISTENERS UP</Box>,
    [listeners, t],
  );

  return (
    <Box sx={{ height: { xs: 'auto', md: '100vh' }, overflow: { xs: 'visible', md: 'hidden' } }}>
      <ConsoleFrame
        headerHeight={86}
        railWidth={330}
        alarm={alarm}
        header={header}
        rail={rail}
        footer={footer}
      >
        <Box sx={{ p: '12px 20px', display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0, height: { xs: 'auto', md: '100%' } }}>
          {/* active triggers — three gauge geometries */}
          <Box component="section">
            <ZoneTitle aside={legendAside}>ACTIVE TRIGGERS · 発動</ZoneTitle>
            <StatusLegend
              sx={{ mb: 1.5 }}
              items={[
                { jp: '定時', en: 'CRON', tone: 'mint' },
                { jp: '監視', en: 'WATCHER', tone: 'blue' },
                { jp: '事象', en: 'EVENT', tone: 'amber' },
              ]}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.75 }}>
              <GaugeCard tone="mint" kind="CRON · 定時" name="NIGHTLY REVIEW" sub="NEXT: 02:00:00">
                <RadialGauge value={cronPct} label="ARMED" />
              </GaugeCard>
              <GaugeCard
                tone="blue"
                kind="WATCHER · 監視"
                name="MEDIA WATCHER"
                readout={<><b>{Math.round(watchPct)}</b>% BUFFER</>}
                sub="POLLING: 10S"
              >
                <SegmentBar value={watchPct} tone="blue" segments={18} height={36} sx={{ width: '100%', mt: 1 }} />
              </GaugeCard>
              <GaugeCard
                tone="amber"
                kind="EVENT · 事象"
                name="GITLAB POLL"
                readout={<><b>{Math.round(fresh)}</b>% FRESH</>}
                sub={`LAST: ${lastPollLabel}`}
              >
                <LedColumn value={fresh} tone="amber" hotBelow={35} segments={14} sx={{ mt: 1 }} />
              </GaugeCard>
            </Box>
          </Box>

          {/* live execution feed */}
          <Box component="section" sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 220 }}>
            <LogConsole
              sx={{ flex: 1 }}
              title="STDOUT: /VAR/LOG/JAIRUS/AUTOMATION.LOG"
              status={paused ? 'PAUSED' : 'TAILING'}
              rows={feed}
              prompt="AUTOMATION>"
            />
          </Box>

          <Box
            component="a"
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            sx={{ fontSize: 10, color: t.nerv.hue.mint, textDecoration: 'none', letterSpacing: '0.08em', fontFamily: t.nerv.fonts.mono, borderBottom: `1px dashed ${t.nerv.hue.mint}`, alignSelf: 'flex-start', '&:hover': { background: t.nerv.hue.mint, color: t.nerv.hue.void } }}
          >
            ← DESIGN SYSTEM
          </Box>
        </Box>
      </ConsoleFrame>
    </Box>
  );
}
