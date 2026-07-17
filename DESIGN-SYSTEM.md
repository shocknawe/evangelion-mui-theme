# NERV / MAGI Design System

Extracted from the 23 reference GIFs in `references-chosen/` (NERV command-center, MAGI deliberation, terminal, map, timer, and alert screens from *Neon Genesis Evangelion*). Every hex value below was sampled programmatically from the frames — these are the actual on-screen colors, not approximations.

The aesthetic in one sentence: **a black CRT void where information glows in phosphor mint, safety orange, and blood red — dense, all-caps, hard-edged, and bilingual (EN + JP), animated in abrupt steps rather than smooth easing.**

---

## 1. Color

### 1.1 Core palette

| Token | Hex | Sampled from | Use |
|---|---|---|---|
| `bg.void` | `#0A0A0A` | universal background | App/screen background. True near-black, never gray. |
| `green.phosphor` | `#52F29A` | council panels, loading bars | Primary "OK / active / data" color. The MAGI mint. |
| `green.phosphorBright` | `#7CF4AB` | panel hot-spots | Hover/peak states, glow cores, filled panels. |
| `green.map` | `#3C9C6C` | map linework | Secondary/dim green — wireframes, gridlines, inactive data. |
| `green.mapDim` | `#246C3C` | map background lines | Tertiary green — dense background linework. |
| `red.nerv` | `#C20C0C` | bar graphs, folder icons | Primary "danger / negative / opposing" data color. |
| `red.bright` | `#E2280F` | DANGER prompt bg, bar peaks | Alert surfaces, flashing states. |
| `red.crimson` | `#E60225` | EMERGENCY stripes | Warning-stripe red (slightly pink-shifted, h≈353). |
| `orange.safety` | `#F26400` | timer digits, frame rules | Chrome color: borders, rules, wireframe boxes, 7-seg digits. |
| `orange.amber` | `#F49F09` | terminal body text | Terminal/log body text (amber CRT). |
| `teal.surface` | `#0C6C80` | header bars, laptop shell | Rare accent surface: header underline bars, hardware bezels. |
| `blue.balthasar` | `#5090D0` | BALTHASAR panel | "Deliberating / pending" state fill. |
| `mint.paper` | `#EDF8D6` | folder glyph fill | Near-white with green cast — max-brightness fill on dark. |

### 1.2 Semantic mapping (for a UI library / MUI palette)

| Semantic | Token | Notes |
|---|---|---|
| `primary` | `green.phosphor #52F29A` | Actions, success, "承認" (approved) |
| `secondary` | `orange.safety #F26400` | Chrome, outlines, focus, labels |
| `error` | `red.bright #E2280F` | "否定" (denied), DANGER |
| `warning` | `orange.safety #F26400` / crimson stripes | CAUTION / EMERGENCY |
| `info` | `blue.balthasar #5090D0` | Pending/processing states |
| `text.primary` | `green.phosphor` or `orange.amber` | context-dependent (data vs. log) |
| `background.default` | `#0A0A0A` | |
| `background.paper` | `#0A0A0A` + 1px orange border | "Paper" is a wireframe box, not a lighter gray. |

**Key rule:** surfaces are never elevated with lighter grays or shadows. Hierarchy comes from **borders, glow, and hue** — a panel is a stroked box on black, or a solid block of phosphor color with black text punched out of it.

### 1.3 The inversion pattern

The most distinctive color move in the set: **states flip figure and ground.**
- Inactive MAGI node: black fill, 1px orange outline, no text.
- Active node: solid `#52F29A` fill, **black** text.
- Denied vote: solid `#C20C0C` fill with black kanji, boxed in red.
- DANGER prompt: entire screen `#E2280F`, with a black band and red display text inside it.

Emulate with a `filled` vs `outlined` variant pair where `filled` uses black (`#0A0A0A`) content on a saturated fill.

### 1.4 Glow

Everything luminous blooms slightly (CRT phosphor). Emulate with:

```css
/* text */    text-shadow: 0 0 4px currentColor, 0 0 12px color-mix(in srgb, currentColor 40%, transparent);
/* borders */ box-shadow: 0 0 6px 0 color-mix(in srgb, var(--edge) 50%, transparent), inset 0 0 6px 0 color-mix(in srgb, var(--edge) 25%, transparent);
```

Glow is strongest on red elements (`LIFE` badge, bar segments), moderate on orange rules, subtle on green.

---

## 2. Typography

Four distinct type roles appear in the references:

| Role | In the show | Web equivalent (Google Fonts) | Treatment |
|---|---|---|---|
| **Display / labels** | Helvetica-style condensed grotesque, all caps ("SOLENOID GRAPH PATTERN", "BALTHASAR·2", "DANGER") | **Oswald** or **Archivo Narrow**; Helvetica Neue Condensed Bold if licensed | ALL CAPS, bold, tracking 0 to −1%, often horizontally scaled ~85–90% |
| **Terminal / data** | Bitmap monospace (amber DOS-style logs, `FILE:MAGI_SYS`) | **Share Tech Mono** (clean) or **VT323** (bitmap feel) | All caps, colon-separated key:value pairs, letter-spacing ~0.05em |
| **Numerals / timers** | 7-segment LED ("2:53:10") | **DSEG7 Classic** (open font) | Italic/slanted variant, orange `#F26400` on black |
| **JP display** | Matisse EB (Mincho) — the iconic Eva typeface ("危険", "非常事態", "決議") | **Shippori Mincho B1** (weight 800) or **Zen Old Mincho** | Large, bold serif kanji used as *graphic elements*, often boxed |

Observed conventions:
- Virtually **no lowercase anywhere**. Labels, buttons, headers, body logs: all caps.
- Names use an interpunct: `BALTHASAR·2`, `CASPER·3`, `MELCHIOR·1`.
- Metadata blocks are typed key/value lists: `CODE:239` / `FILE:MAGI_SYS` / `EXTENTION:4088` / `EX_MODE:OFF` / `PRIORITY:AAA` — monospace, orange or red, left-aligned, tight leading (~1.15).
- Headlines scale enormously relative to body (the "2" on the vote card, "OPEN", "DANGER" fill their containers). Type scale is bimodal: very small (10–12px labels) and very large (48px+ display), little in between.
- English and Japanese are paired: kanji as the big graphic, English as a small caption underneath (`内部` over "INTERNAL").

Suggested scale: `12 / 14 / 16 / 24 / 40 / 64+` px with condensed display at the top end and mono at the bottom.

---

## 3. Shape: borders, radius, corners

### 3.1 Border radius

| Element | Radius |
|---|---|
| Default (panels, boxed labels, buttons) | **0** — hard corners dominate |
| Bar-graph segments, badge boxes (`LIFE`, `ALERT`) | **2–6px** (slightly rounded rect / stadium ends on segments) |
| Everything else | 0 |

MUI mapping: `shape.borderRadius: 0`, with a `2px` radius reserved for small "indicator" chips and meter segments.

### 3.2 The signature shape: chamfered panels

MAGI nodes are not rectangles — they're **octagons/chamfer-cut hexagons** (Balthasar's panel is a rectangle with two corners cut at 45°, Casper/Melchior are irregular clipped polygons). This is the system's signature geometry.

```css
clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px));
```

Use chamfered corners (one or two per panel, cut size ~16–32px) on feature cards; keep ordinary components square.

### 3.3 Border styles

- Weight: **1–2px** for wireframe boxes; **3–4px** for emphasis frames.
- Color: `orange.safety` for structural chrome; the content's own color for semantic boxes (red box around red text: `点検中`, `審議中`).
- **Double borders** on modals/important frames: thin outer line + thicker inner line with a small gap (see `processing.gif` outer frame).
- **Header bars:** kanji headers sit between paired horizontal rules or on top of double teal bars (`提訴`, `決議` with `#0C6C80` double underline).
- Boxed text is everywhere: a label = text + 1px box drawn in the same color, padding ~2–6px.

---

## 4. Spacing & layout

- **Density is the point.** Screens are packed; margins are small (8–16px). Whitespace is black space and it's used for drama (the vote card centers a small cluster in a large void), not for breathing room between controls.
- Grid: loose 8px base works (`4 / 8 / 16 / 24 / 32`), but alignment is often diagonal/rotated — panels tilt 3–15°, hazard stripes run 45°, the loading "gene tree" bars run at ~45° chevrons.
- Layouts are **diagrammatic**: nodes connected by 1–2px lines (MAGI trio joined by a Y of lines to a central "MAGI" label; loading screens are literal node-link trees). Connectors are part of the design language.
- Data blocks anchor to corners (metadata top-left, status stamp top-right/bottom-right), center stage holds the single big figure.

---

## 5. Motion

The animation grammar (from the GIFs) — abrupt, mechanical, frame-quantized:

| Pattern | Where seen | Emulation |
|---|---|---|
| **Stepped fills** — meters fill segment-by-segment, no tween | bar graph, loading trees, multi-item charging | `steps(n, end)` timing or discrete segment toggling; segments appear at ~10–15/sec |
| **Hard blink** — on/off, no fade | ALERT badges, `点検中` stamp, cursor | `animation: blink 1s steps(2, jump-none) infinite` (~1–2 Hz) |
| **State snap** — panels flip color in one frame | council vote (outline → filled green/red) | no transition, or `transition: none`; optionally 2–3 rapid flickers before settling |
| **Typing/teletype** — text appears in chunks | terminal logs, DELETED cascade | typewriter reveal, whole-row chunks, not per-character smoothness |
| **Cascade** — same element repeats/propagates across a grid | DELETED wall, folder-icon grid | staggered `animation-delay` in row-major order |
| **Countdown** | 7-seg timers | 1s ticks, no easing |

Durations: fast (100–300ms) for state snaps; loops at 0.5–1s periods. **Never use ease-in-out spring animations** — everything is linear or stepped. Respect `prefers-reduced-motion` by keeping the final states without blink loops.

---

## 6. Component recipes (per reference GIF)

| GIF | Component | Recipe |
|---|---|---|
| `council*.gif` | **Status card / vote panel** | Chamfered polygon; states: idle = 1px orange outline on black; approved = solid `#52F29A` fill, black condensed-caps label; denied = solid `#C20C0C` + black kanji chip; pending = `#5090D0`. Nodes joined by 1px orange connectors to a central mono label. |
| `processing.gif` | **Modal / deliberation card** | Black bg, double orange frame, kanji headers with teal double-bars top-left/top-right, mono metadata block, giant centered numeral on a mint panel, rotated empty outline panels, blinking red boxed stamp (`審議中`). |
| `bar graph.gif` | **Segmented meter** | Vertical stack of glowing `#E2280F` rounded-rect segments (radius ~4px, gap ~4px) over black; orange axis with tick marks; a horizontal 2px yellow-orange **threshold line** with a boxed label (`SAFETY LINE ±0`); rounded-box `LIFE` badge with heavy red glow. |
| `2-graphs.gif` | **Comparison chart panel** | Two mirrored panels (green vs red), condensed-caps title bar, `OBJECT:` mono subtitle, orange crosshair grid `+` marks, center axis with `FIELD NEGATIVE/POSITIVE` scale. |
| `prompt.gif` | **Danger prompt** | Full-bleed `#E2280F`; full-width black band; "DANGER" in red condensed caps inside the band; white boxed `ALERT` labels in opposite corners; boxed kanji `危険` above/below. Flashes. |
| `prompt-error.gif` / `prompt-warning.gif` | **Caution / emergency banner** | 45° hazard chevrons red/black; horizontal red bands; small mono `CAUTION` title; or black bg + crimson `#E60225` stripe field with orange `EMERGENCY` display text and boxed kanji `非常事態`. |
| `terminal-prompt.gif` | **Terminal / log** | Black bg, amber `#F49F09` (dim `#9C3C24`) mono text, ALL CAPS, dot-leader tables, `OK` status column, section rules from dashes. |
| `terminal-color.gif` | **Log with destructive state** | Same terminal + rows replaced by glowing red boxed `DELETED` stamps cascading across the buffer; boxed timestamp chip (`06:00AM`) black-on-mint. |
| `map*.gif` | **Map / radar view** | Dense `#246C3C`/`#3C9C6C` linework on black (streets = rounded-diamond city blocks), orange `#F26400` crosshair target, red boxed callouts with mono ID text (`DDG·173 KONGO`), stamped kanji plate bottom-right (`作戦行動予定図` + EN caption). |
| `loading-animation-*.gif` | **Loading / progress trees** | Node-link tree of 45° chevron bars; green = complete, red = failed/opposing; bars pop in stepped sequence; orange connector lines; mono IDs (`A0131`, `MT-01351`) at joints; red `BORDER-LINE` diagonal warning plate. |
| `timer*.gif` | **Countdown display** | Black plate, orange 7-seg digits (`2:53:10`), blinking colons, kanji + EN caption plates (`内部 / INTERNAL`), mode row of boxed labels (`STOP SLOW NORMAL RACING`) with active one highlighted, hazard-stripe corner accent. |
| `2-states.gif` | **Status readout** | Black inset screen; mint `#52F29A` glowing caps text; giant single-word state (`OPEN`) with small instruction lines above/below; header/footer rules. |
| `folder*.gif` | **File/asset grid overlay** | Repeating grid of icon+label units: mint bars with binary/mono labels + red outlined folder glyphs; red variant for alert state; semi-transparent overlay over content. |
| `multi-item-charging?.gif` | **Distribution/fan-out diagram** | The one light-mode screen: pale gray `#B4B4B4` bg, hairline red connectors fanning from a black label chip to columns of solid red cells. Use as an optional "print/blueprint" theme variant. |
| `modal.gif` | **Backdrop wall** | Giant green data-texture wall (map/molecule) behind silhouetted UI — i.e., background imagery is data itself; use noisy green texture as hero backdrop. |

---

## 7. MUI theme skeleton

```ts
import { createTheme } from '@mui/material/styles';

export const nervTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0A0A0A', paper: '#0A0A0A' },
    primary:   { main: '#52F29A', light: '#7CF4AB', dark: '#3C9C6C', contrastText: '#0A0A0A' },
    secondary: { main: '#F26400', contrastText: '#0A0A0A' },
    error:     { main: '#E2280F', dark: '#C20C0C', contrastText: '#0A0A0A' },
    warning:   { main: '#F26400', dark: '#E60225', contrastText: '#0A0A0A' },
    info:      { main: '#5090D0', contrastText: '#0A0A0A' },
    success:   { main: '#52F29A', contrastText: '#0A0A0A' },
    text: { primary: '#52F29A', secondary: '#F49F09', disabled: '#246C3C' },
    divider: '#F26400',
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: '"Share Tech Mono", monospace',
    h1: { fontFamily: '"Oswald", sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em' },
    // h2–h6 likewise; body/caption stay mono, uppercase for labels
    button: { fontFamily: '"Oswald", sans-serif', fontWeight: 600, textTransform: 'uppercase' },
  },
  transitions: {
    // state snaps: near-zero durations
    duration: { shortest: 50, shorter: 80, short: 100, standard: 120, complex: 150, enteringScreen: 100, leavingScreen: 80 },
    easing: { easeInOut: 'steps(3, end)', easeOut: 'linear', easeIn: 'linear', sharp: 'linear' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #F26400',
          boxShadow: '0 0 6px rgba(242,100,0,0.4), inset 0 0 6px rgba(242,100,0,0.15)',
        },
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 0 } } },
    MuiChip:   { styleOverrides: { root: { borderRadius: 2 } } },
  },
});
```

Fonts to load: `Oswald` (or Archivo Narrow), `Share Tech Mono` (or VT323), `DSEG7 Classic`, `Shippori Mincho B1`.

---

## 8. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Black background everywhere; hierarchy via border + glow + hue | Gray elevation surfaces, soft drop shadows |
| ALL CAPS condensed labels, mono key:value metadata | Lowercase UI copy, humanist body text |
| Solid color fills with black text for active states | Tinted/translucent hover states |
| Hard corners; chamfer one or two corners on hero panels | Global 8–12px rounded corners, pill buttons |
| Stepped/instant animation, hard blinks | Eased springs, fades, blurs |
| Boxed text stamps (label inside a 1px same-color box) | Floating unboxed badges |
| Pair kanji display type with small EN captions | Kanji as untranslated decoration in functional UI |
| Diagonal energy: rotated plates, 45° chevrons, hazard stripes | Everything axis-aligned and static |
