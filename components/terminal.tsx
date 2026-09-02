/**
 * Terminal / diagnostic log — amber ink at two brightness levels, dot-leader
 * check rows, and a blinking cursor when the stream ends. Rows type in sequence;
 * reduced-motion prints the whole log at once.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';
import { type RootHTMLAttributes, type Tone, toneHue } from './util';

/**
 * A single terminal row. `chk` renders a dot-leader `LABEL ···· OK/FAIL`; `exec`
 * renders a dim timestamp before a rich (colored) message.
 */
export type TerminalRow =
  | { k: 'line' | 'rule' | 'note' | 'sum'; t: string }
  | { k: 'chk'; l: string; ok: boolean }
  | { k: 'exec'; ts: string; msg: ReactNode };

/** `title` is the terminal's header caption, not the DOM `title`. */
export interface TerminalProps extends Omit<RootHTMLAttributes, 'title'> {
  /** Log rows, top→bottom. Defaults to a sample diagnostic. */
  rows?: TerminalRow[];
  /** Header caption. @default 'STDOUT // DIAGNOSTIC' */
  title?: string;
  /** Type rows in one at a time. @default true */
  typewriter?: boolean;
  /** Interval between typed rows (ms). @default 130 */
  speed?: number;
  /** Min height of the scrolling body (px). @default 150 */
  minBodyHeight?: number;
  /** Max height of the body before it scrolls (px, or `'none'` to grow). @default 190 */
  maxBodyHeight?: number | 'none';
  sx?: SxProps<Theme>;
}

const DEFAULT_ROWS: TerminalRow[] = [
  { k: 'line', t: 'KESTREL·4 DIAGNOSTIC MODULE REV 4.02' },
  { k: 'rule', t: '---- SYSTEM CONFIGURATION ----' },
  { k: 'chk', l: 'CONTROL BUS LINK', ok: true },
  { k: 'chk', l: 'NVRAM CHECKSUM', ok: true },
  { k: 'chk', l: 'VEGA·1 UPLINK', ok: true },
  { k: 'chk', l: 'PUMP·B SECONDARY DRIVE', ok: false },
  { k: 'note', t: '» VIBRATION 3.8G — EXCEEDS TOLERANCE' },
  { k: 'chk', l: 'THERMAL SENSOR RING', ok: true },
  { k: 'chk', l: 'RESERVOIR LEVEL 88%', ok: true },
  { k: 'sum', t: '7 CHECKS · 6 PASS · 1 FLAGGED' },
];

export function Terminal({ rows = DEFAULT_ROWS, title = 'STDOUT // DIAGNOSTIC', typewriter = true, speed = 130, minBodyHeight = 150, maxBodyHeight = 190, sx, ...rest }: TerminalProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const still = reduced || !typewriter;
  const [count, setCount] = useState(still ? rows.length : 0);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (still) {
      setCount(rows.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= rows.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [still, rows, speed]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [count]);

  const dim = t.palette.nerv.termDim;
  return (
    <Box {...rest} sx={[(th) => ({ border: `1px solid ${th.nerv.hue.amberDim}`, background: 'rgba(244,159,9,.02)', width: '100%' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '6px 12px', borderBottom: `1px solid ${t.nerv.hue.amberDim}`, fontSize: 9, color: t.nerv.hue.amber, letterSpacing: '0.1em', fontFamily: t.nerv.fonts.mono }}>
        {title}
        <Box sx={{ display: 'flex', gap: '5px', ml: 'auto' }}>
          {[t.nerv.hue.redHi, t.nerv.hue.amber, t.nerv.hue.mint].map((c, i) => (
            <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
        </Box>
      </Box>
      <Box ref={bodyRef} sx={{ p: '12px 14px', fontSize: 12, lineHeight: 1.5, minHeight: minBodyHeight, maxHeight: maxBodyHeight === 'none' ? undefined : maxBodyHeight, overflowY: 'auto', fontFamily: t.nerv.fonts.mono }}>
        {rows.slice(0, count).map((r, i) => {
          if (r.k === 'exec')
            return (
              <Box key={i} sx={{ whiteSpace: 'pre-wrap', textTransform: 'none', letterSpacing: '0.02em' }}>
                <Box component="span" sx={{ color: t.nerv.hue.amberDim }}>{r.ts}</Box>{' '}
                <Box component="span" sx={{ color: t.nerv.hue.amber }}>{r.msg}</Box>
              </Box>
            );
          if (r.k === 'chk')
            return (
              <Box key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 1, whiteSpace: 'nowrap' }}>
                <Box component="span" sx={{ color: t.nerv.hue.amber }}>{r.l}</Box>
                <Box sx={{ flex: 1, borderBottom: `1px dotted ${t.nerv.hue.amberDim}`, height: 0, mb: '4px', minWidth: 12 }} />
                <Box component="span" sx={{ fontWeight: 700, color: r.ok ? t.nerv.hue.amber : t.nerv.hue.redHi, textShadow: r.ok ? 'none' : '0 0 4px currentColor' }}>
                  {r.ok ? 'OK' : 'FAIL'}
                </Box>
              </Box>
            );
          const color = r.k === 'rule' ? dim : r.k === 'note' ? t.nerv.hue.redHi : r.k === 'sum' ? t.nerv.hue.mint : t.nerv.hue.amber;
          return (
            <Box key={i} sx={{ color, fontSize: r.k === 'note' ? 11 : 12 }}>
              {r.t}
            </Box>
          );
        })}
        {count >= rows.length && (
          <Box component="span" sx={{ display: 'inline-block', width: 8, height: 13, background: t.nerv.hue.amber, verticalAlign: '-2px', animation: reduced ? 'none' : `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` }} />
        )}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* LogConsole — a live tagged, timestamped log view with a status bar. */

export type LogTag = 'info' | 'warn' | 'git' | 'gate';

export interface LogRow {
  /** Timestamp string (e.g. `14:02:51`). */
  ts: string;
  /** Tag chip (`[INFO]` etc.). Omit for a tagless feed row colored by `tone`. */
  tag?: LogTag;
  /** Message color when the row has no `tag`. @default 'amber' */
  tone?: Tone;
  msg: ReactNode;
}

/** `title` is the console's header caption, not the DOM `title`. */
export interface LogConsoleProps extends Omit<RootHTMLAttributes, 'title'> {
  /** Header caption. @default 'STDOUT' */
  title?: ReactNode;
  /** Rows, oldest→newest. The view auto-scrolls to the newest. */
  rows: LogRow[];
  /** Connection state shown at right. @default true */
  connected?: boolean;
  /** Overrides the connection label at right (e.g. `TAILING` / `PAUSED`). */
  status?: ReactNode;
  /** A prompt line under the body (e.g. `AUTOMATION>`); hosts the cursor. */
  prompt?: ReactNode;
  /** Blinking cursor after the last row (or in the prompt row). @default true */
  cursor?: boolean;
  sx?: SxProps<Theme>;
}

const TAG_TONE: Record<LogTag, keyof Theme['nerv']['hue']> = {
  info: 'amber',
  warn: 'redHi',
  git: 'greenMap',
  gate: 'mint',
};

/**
 * A streaming agent console: an amber-framed log of timestamped, tagged rows
 * (`[INFO]` amber · `[WARN]` red · `[GIT]` green · `[GATE]` mint) under a title +
 * connection status bar. Presentational — feed it `rows`; it auto-scrolls to the
 * newest and can host an approval bar beneath it.
 */
export function LogConsole({ title = 'STDOUT', rows, connected = true, status, prompt, cursor = true, sx, ...rest }: LogConsoleProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [rows]);

  const blink = { animation: reduced ? 'none' : `nervBlink ${t.nerv.motion.durations.blink}ms ${t.nerv.motion.snap} infinite` } as const;
  const Cursor = () => <Box component="span" sx={{ display: 'inline-block', width: 7, height: 11, background: t.nerv.hue.amber, verticalAlign: '-1px', ...blink }} />;

  return (
    <Box {...rest} sx={[{ display: 'flex', flexDirection: 'column', minHeight: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: t.nerv.hue.amber, letterSpacing: '0.12em', border: `1px solid ${t.nerv.hue.amberDim}`, borderBottom: 'none', p: '6px 12px', fontFamily: t.nerv.fonts.mono }}>
        <span>{title}</span>
        {status !== undefined ? (
          <Box component="span" sx={{ color: t.nerv.hue.mint }}>{status}</Box>
        ) : (
          <Box component="span" sx={{ color: connected ? t.nerv.hue.mint : t.nerv.hue.redHi }}>
            {connected ? 'CONNECTED: OK' : 'CONNECTION LOST'}
          </Box>
        )}
      </Box>
      <Box
        ref={bodyRef}
        role="log"
        aria-live="polite"
        sx={{ flex: 1, overflowY: 'auto', border: `1px solid ${t.nerv.hue.amberDim}`, p: '10px 14px', background: 'rgba(244,159,9,.02)', fontSize: 12, lineHeight: 1.5, fontFamily: t.nerv.fonts.mono }}
      >
        {rows.map((r, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.25, whiteSpace: 'nowrap' }}>
            <Box component="span" sx={{ color: t.nerv.hue.amberDim, flex: 'none' }}>{r.ts}</Box>
            {r.tag && (
              <Box component="span" sx={{ flex: 'none', fontWeight: 700, color: t.nerv.hue[TAG_TONE[r.tag]], textShadow: r.tag === 'warn' || r.tag === 'gate' ? '0 0 4px currentColor' : 'none' }}>
                [{r.tag.toUpperCase()}]
              </Box>
            )}
            <Box component="span" sx={{ color: r.tag ? t.nerv.hue.amber : toneHue(t, r.tone ?? 'amber'), textTransform: 'none', whiteSpace: 'normal' }}>{r.msg}</Box>
          </Box>
        ))}
        {cursor && !prompt && <Cursor />}
      </Box>
      {prompt && (
        <Box sx={{ border: `1px solid ${t.nerv.hue.amberDim}`, borderTop: 'none', color: t.nerv.hue.amber, fontSize: 11, p: '6px 12px', fontFamily: t.nerv.fonts.mono }}>
          {prompt} {cursor && <Cursor />}
        </Box>
      )}
    </Box>
  );
}
