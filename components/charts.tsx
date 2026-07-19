/**
 * Canvas / SVG data-viz — a sparse trend line, a braided waveform separator, and
 * a static scan-lattice separator. Colors are pulled from theme tokens so the
 * canvas stays on-palette; animation halts (final frame drawn) under reduced
 * motion.
 */
import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { useReducedMotion } from './hooks';

function useCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => void,
  intervalMs: number,
  reduced: boolean,
) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let ctx: CanvasRenderingContext2D | null = null;
    let W = 0, H = 0, frame = 0, raf = 0, id: ReturnType<typeof setInterval> | undefined;
    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = devicePixelRatio || 1;
      cv.width = Math.max(1, r.width * dpr);
      cv.height = Math.max(1, r.height * dpr);
      ctx = cv.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      W = r.width;
      H = r.height;
    };
    size();
    const render = () => {
      if (!W || !H) size();
      if (ctx && W && H) draw(ctx, W, H, frame++);
    };
    render();
    if (!reduced) id = setInterval(() => { raf = requestAnimationFrame(render); }, intervalMs);
    const onResize = () => { size(); render(); };
    addEventListener('resize', onResize);
    return () => { if (id) clearInterval(id); cancelAnimationFrame(raf); removeEventListener('resize', onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
  return ref;
}

/* ------------------------------------------------------------------ */
/* LineChart — a glowing sparse trend line over a dotted field. */

export interface LineChartProps {
  /** Corner caption; the highlighted word is `status`. @default 'RESONANCE' */
  label?: string;
  /** Highlighted status word. @default 'STABLE' */
  status?: string;
  /** Height (px). @default 150 */
  height?: number;
  sx?: SxProps<Theme>;
}

export function LineChart({ label = 'RESONANCE', status = 'STABLE', height = 150, sx }: LineChartProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const data = useRef<number[]>(Array.from({ length: 48 }, (_, i) => 50 + Math.sin(i / 4) * 18));

  const ref = useCanvas((ctx, W, H) => {
    data.current.push(Math.max(12, Math.min(88, data.current[data.current.length - 1] + (Math.random() - 0.5) * 16)));
    data.current.shift();
    const d = data.current;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(60,156,108,.4)';
    for (let x = 30; x < W; x += 60) for (let y = H * 0.25; y < H; y += H * 0.28) ctx.fillRect(x, y, 1.5, 1.5);
    ctx.strokeStyle = 'rgba(36,108,60,.5)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    const stepX = W / (d.length - 1);
    const pts = d.map((v, i) => [i * stepX, H - (v / 100) * H] as const);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(82,242,154,.28)');
    grad.addColorStop(1, 'rgba(82,242,154,0)');
    ctx.beginPath(); ctx.moveTo(0, H); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = t.nerv.hue.mint; ctx.lineWidth = 2; ctx.shadowColor = t.nerv.hue.mint; ctx.shadowBlur = 6;
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.shadowBlur = 0;
    const [lx, ly] = pts[pts.length - 1];
    ctx.fillStyle = t.nerv.hue.mintHi; ctx.beginPath(); ctx.arc(lx - 1, ly, 3, 0, 7); ctx.fill();
  }, 140, reduced);

  return (
    <Box sx={[(th) => ({ position: 'relative', height, border: `1px solid ${th.nerv.hue.greenDim}`, overflow: 'hidden', width: '100%' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <Box sx={{ position: 'absolute', left: 10, top: 8, fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.12em', zIndex: 2, fontFamily: t.nerv.fonts.mono }}>
        {label} · <Box component="b" sx={{ color: t.nerv.hue.mint }}>{status}</Box>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Waveform — a braided oscilloscope separator. */

export interface WaveformProps {
  /** Left caption. @default 'INFERENCE FIELD' */
  label?: React.ReactNode;
  /** Right caption. @default '共振 / RESONANCE' */
  caption?: React.ReactNode;
  /** Height (px or CSS length). @default 96 */
  height?: number | string;
  /** Draw the 1px frame. Set false when embedding in a bordered band. @default true */
  frame?: boolean;
  sx?: SxProps<Theme>;
}

export function Waveform({ label = 'INFERENCE FIELD', caption = '共振 / RESONANCE', height = 96, frame = true, sx }: WaveformProps) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const time = useRef(0);
  const ref = useCanvas((ctx, W, H) => {
    time.current += 0.18;
    const tt = time.current;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(36,108,60,.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    const NL = 10; ctx.lineWidth = 1.2; ctx.shadowColor = t.nerv.hue.mint; ctx.shadowBlur = 4;
    for (let i = 0; i < NL; i++) {
      const ph = (i / NL) * Math.PI * 2;
      ctx.strokeStyle = i % 3 === 0 ? t.nerv.hue.mint : t.nerv.hue.greenMap;
      ctx.globalAlpha = i % 3 === 0 ? 0.9 : 0.45;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const xn = x / W, env = Math.sin(xn * Math.PI);
        const y = H / 2 + Math.sin(xn * 7 + ph + tt) * Math.cos(xn * 2.2 - tt * 0.6) * (H * 0.36) * env;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }, 83, reduced);

  return (
    <Box sx={[(th) => ({ position: 'relative', height, border: frame ? `1px solid ${th.nerv.hue.greenDim}` : 0, overflow: 'hidden', width: '100%' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <Box sx={{ position: 'absolute', left: 12, top: 8, fontSize: 9, color: t.nerv.hue.greenMap, letterSpacing: '0.14em', fontFamily: t.nerv.fonts.mono, '& b': { color: t.nerv.hue.mint, fontWeight: 400 } }}>{label}</Box>
      <Box sx={{ position: 'absolute', right: 12, top: 8, fontSize: 9, color: t.nerv.hue.greenMap, fontFamily: t.nerv.fonts.mono }}>{caption}</Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* ScanLattice — a static schematic grid with a targeting reticle. */

export interface ScanLatticeProps {
  /** Height (px). @default 110 */
  height?: number;
  /** Reticle label. @default 'NODE·0x512' */
  nodeLabel?: string;
  sx?: SxProps<Theme>;
}

export function ScanLattice({ height = 110, nodeLabel = 'NODE·0x512', sx }: ScanLatticeProps) {
  const t = useTheme();
  const cx = 300, cy = 55;
  return (
    <Box sx={[(th) => ({ height, border: `1px solid ${th.nerv.hue.greenDim}`, overflow: 'hidden', width: '100%' }), ...(Array.isArray(sx) ? sx : [sx])]}>
      <svg viewBox="0 0 600 110" preserveAspectRatio="none" width="100%" height="100%" style={{ display: 'block' }}>
        {Array.from({ length: Math.ceil((600 - 20) / 42) }, (_, i) => 20 + i * 42).map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={110} stroke={t.nerv.hue.greenDim} strokeWidth={1} opacity={0.5} />
        ))}
        {Array.from({ length: Math.ceil((110 - 14) / 26) }, (_, i) => 14 + i * 26).map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={600} y2={y} stroke={t.nerv.hue.greenDim} strokeWidth={1} opacity={0.35} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={44 + i * 80} y={26 + (i % 3) * 20} width={34} height={28} rx={5} fill="none" stroke={t.nerv.hue.greenMap} strokeWidth={1.4} opacity={0.8} />
        ))}
        <circle cx={cx} cy={cy} r={24} fill="none" stroke={t.nerv.hue.orange} strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={4} fill={t.nerv.hue.orange} />
        <line x1={cx - 38} y1={cy} x2={cx + 38} y2={cy} stroke={t.nerv.hue.orange} strokeWidth={1} />
        <line x1={cx} y1={cy - 38} x2={cx} y2={cy + 38} stroke={t.nerv.hue.orange} strokeWidth={1} />
        <text x={cx + 30} y={cy - 12} fill={t.nerv.hue.redHi} fontSize={9} fontFamily="monospace">{nodeLabel}</text>
      </svg>
    </Box>
  );
}
