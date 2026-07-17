# Experiment Build Spec — `experiment-NN.html`

How the tactical-UI experiments in this repo are designed, built, and verified. Written so a future session can produce `experiment-12.html` and beyond that are indistinguishable in method and quality from the existing set.

## 1. Context — what these experiments are

- The repo goal is an **Evangelion-inspired MUI theme / UI library**. Source research lives in:
  - [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — sampled palette (pixel-clustered from the GIFs), type roles, MUI mapping, `createTheme` skeleton.
  - [REFERENCE-ANALYSIS.md](REFERENCE-ANALYSIS.md) — per-GIF breakdown of all 23 references (`references-chosen/`) + synthesized **12 design principles, token sheet, 15 component rules**. This is the authority; when in doubt, re-read §A–C.
- The experiments are **original tactical sci-fi interfaces** that apply those principles. They are studies for what the eventual UI library components must be able to do — each experiment isolates one component family from the reference set.
- **Content rule: capture the grammar, never the source material.** No NERV, MAGI, EVA-01, Balthasar/Casper/Melchior, no copied screen text. Invent original fiction (existing set uses an orbital station "KESTREL·4", consensus cores named after stars: VEGA/ALTAIR/DENEB, LYRA/CYGNUS/AQUILA, units like UNIT-07). Kanji is fine — use *generic vocabulary* (危険-class words like 衝撃/注意/退避/過負荷/密閉/審査中), never franchise-specific strings.

## 2. Hard constraints

1. ONE standalone `.html` file per experiment, numbered `experiment-NN.html` at repo root.
2. No build tools, no frameworks, no libraries, no CDN — HTML + CSS + vanilla JS only.
3. **Zero network dependencies**: no web fonts, no images. Typography via system stacks; graphics via CSS, inline SVG, or canvas. 7-segment digits are drawn as inline SVG polygons (copy `SEGMAP`/`SEGPTS` from experiment-01/07).
4. Must render correctly by double-clicking the file (works over `file://`).
5. `<title>EXPERIMENT-NN · NAME</title>`, `lang="en"`, viewport meta.

## 3. Design tokens (paste-ready)

Every experiment defines tokens as CSS custom properties in `:root`. Canonical values (from the sampled palette — do not eyeball new ones):

```css
:root{
  --bg:#0A0A0A;            /* true near-black; NEVER gray surfaces */
  --mint:#52F29A;          /* primary/OK/active data (bright: #7CF4AB) */
  --green-map:#3C9C6C;     /* dim wireframes;   dimmer: #246C3C */
  --paper:#EDF8D6;         /* max-brightness fill (near-white mint) */
  --red:#C20C0C;           /* danger data */
  --red-hi:#E2280F;        /* alert surfaces, strobes, stamps */
  --crimson:#E60225;       /* hazard stripes only */
  --orange:#F26400;        /* CHROME: borders, rules, digits, markers */
  --amber:#F49F09;         /* terminal text; dim step: #9C3C24 */
  --teal:#0C6C80;          /* header double-bars, hardware bezels */
  --blue:#5090D0;          /* pending/deliberating state */
  --blueprint:#B4B4B4;     /* light theme bg (experiment-09 only) */
}
```

Font stacks (system-only equivalents of the researched faces):

```css
--cond:"Arial Narrow","Avenir Next Condensed","Helvetica Neue",Arial,sans-serif; /* display, ALL CAPS 700 */
--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;                          /* data/labels, +.04–.08em tracking */
--jp:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif;                   /* kanji display, weight 800 */
```

(If the project later ships real fonts: Oswald / Share Tech Mono / DSEG7 / Shippori Mincho B1 are the researched targets.)

## 4. Non-negotiable style rules (from REFERENCE-ANALYSIS §A)

- `text-transform:uppercase` on `body`; no lowercase anywhere in UI chrome.
- Hierarchy from **borders + glow + hue**, never elevation: no gray panels, no drop shadows for depth. Panel = black fill + 1–2px orange border (+ faint inset glow).
- **Boxed stamps**: any status word sits inside a 1px border of its own color, radius 0–3px, padding 2–8px. Blinking = in progress; solid-fill inverse (black text on color) = active/record.
- **Figure/ground inversion for activation**: idle = outline on black; active = solid semantic fill with `--bg`-colored content.
- **Bimodal type scale**: one giant element (word/numeral/waveform, 40px–17vw) + tiny captions (10–13px); avoid mid sizes.
- **EN+JP pairing**: big Mincho kanji always carries a small Latin caption (`内部` → INTERNAL pattern).
- Metadata blocks: mono `KEY:VALUE` lists (`CODE:`, `FILE:`, `EXTENTION:` *(sic — the reference spelling)*, `EX_MODE:`, `PRIORITY:`), corner-pinned, leading ≈1.2–1.35.
- Interpunct in designations: `VEGA·1`, `BORDER·LINE`.
- Radius 0 default; 2–6px only on chips/segments; hero panels get **chamfered corners** via `clip-path` (16–32px, 45°).
- Thresholds are drawn objects: 2px rule + boxed label riding the line, or a rotated bordered plate with hazard-striped end caps.
- Diagonal energy where urgency lives: rotated plates (3–15°), 45° chevrons/stripes (`repeating-linear-gradient(-45deg, …)`).
- CRT pass on every dark experiment (skip on blueprint):

```css
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:99;
  background:
    repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px),
    radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)}
```

- Glow: `text-shadow:0 0 4px currentColor,0 0 12px <hue>@40%`; box glow outer+inset. Intensity red > orange > green. **No glow** on black-on-fill content.

## 5. Motion grammar (mechanical, never eased)

- All animation driven by `setInterval` ticks or CSS `steps()` — **never** `ease`/`cubic-bezier`/springs, no opacity fades for state.
- Canonical rates: blink `1s steps(1)` (urgent: `.5s`); segment fills 8–15 steps/s (interval 80–160ms); teletype rows ~110–150ms; cascade stagger 30–80ms/unit; countdown 1s ticks with blinking colons; canvas redraw ≤12fps (83ms) for the hand-cranked feel.
- State changes **snap**, optionally with a 2–3 frame flicker before settling (see `runVote`/`apply` implementations: apply → hide 60ms → show 120ms).
- Loaders/processes end by **reverse cascade to black**, not fading.
- `prefers-reduced-motion`: kill blinks/strobes/marquees via media query AND check `matchMedia(...)` in JS (`const REDUCED = …`) to skip flickers and auto-dismiss overlays on a timer. Final states must remain readable.
- Keep data ticking (clocks, counters) even when "idle" — the screens are alive.

## 6. JS architecture conventions

- Single `<script>` at end of `<body>`, `"use strict"`, no modules.
- Plain `setInterval`/`setTimeout`; no rAF loops (mechanical cadence is the aesthetic).
- Procedural graphics: build SVG via a helper
  `const el=(n,a,p=svg)=>{...createElementNS...}` (see experiments 04/05/09); canvas for dense line work (06); DOM grids for units/segments (01/08).
- Interactivity is welcome but optional: mode rails as `<button>` groups with `.active` inversion, keyboard shortcuts, click-to-acknowledge overlays. Buttons get `:focus-visible` outlines in a contrasting token.
- **Init-order rule (a real bug happened here):** function declarations may be hoisted, but they capture `const`s in TDZ — never *call* anything until every top-level `const` it touches is declared. Structure: helpers → state → wiring → a final `/* ---- START ---- */` section that kicks off the first render/vote/loop.
- **Zero-size viewport guard (a real bug happened here):** anything reading `innerWidth/innerHeight/clientWidth` at load must start with:

```js
/* if loaded in a hidden/zero-size viewport, re-init once it has real size */
if(innerWidth<2||innerHeight<2){
  const _p=setInterval(()=>{if(innerWidth>1&&innerHeight>1){clearInterval(_p);location.reload();}},250);
}
```

  (The Claude Code browser pane loads files in background 0×0 tabs; without this, SVG viewBoxes become `0 0 0 0` and nothing renders. Harmless no-op in normal browsers.)
- **Repeating-trigger guard:** any "when X exceeds Y, start a one-shot sequence" check inside an interval needs a phase/lock flag, or it re-fires every tick and spawns overlapping timers (experiment-09 drain bug).
- Randomness is used for liveliness (vote outcomes, walk targets, IDs) — always biased so the nominal state dominates (~72–94% success rates).

## 7. Choosing what to build

Each experiment isolates ONE component family from REFERENCE-ANALYSIS §C and pushes it to a full-screen study. Existing coverage:

| # | Study | Component rules exercised |
|---|---|---|
| 01 | Orbital tactical console (integration piece) | panel, status node, stamps, meter+threshold, 7-seg countdown+mode rail, terminal, lattice, alert overlay |
| 02 | Alarm suite | alert overlay ×3 (splash strobe / barricade / marquee) |
| 03 | Maintenance terminal | terminal/log, teletype, destructive stamp cascade |
| 04 | Search-pattern map | map/radar, entity silhouettes, callouts+leader lines, title plate |
| 05 | Relay lattice loader | progress tree, BORDER·LINE threshold plate, teardown |
| 06 | Resonance comparison | chart panel, mirrored A/B hue semantics, divergence stamp |
| 07 | Countdown wall | big-value display, mode rail, absence-as-safe, zero state |
| 08 | Archive sweep overlay | scan grid, icon+rotated label unit, colorway flip |
| 09 | Charge distribution | blueprint light theme, fan-out diagram, stepped charge |
| 10 | Arbitration modal | modal double frame, rotated slots, single-value focus |
| 11 | Airlock state board | giant-word readout, hardware bezel, state machine |

Unclaimed territory for future numbers: segmented gauge wall (bar graph deep-dive), data-wall hero backdrop (modal.gif ambience), handheld/mini responsive variant (council-small), a composite "bridge" multi-screen scene, sound-free klaxon choreography, printable blueprint report.

Per experiment: pick the study, invent original fiction for it, choose 2–4 principles to foreground (e.g. 08 = "color is state" + "density conveys scale"), and put ONE signature element at center (the memorable thing). Everything else stays quiet.

## 8. Verification workflow (do not skip)

The browser pane is the test rig. Lessons already paid for:

1. Writing/editing a file auto-opens it in a pane tab (PostToolUse hook) — but as a **background 0×0 tab** (hence the §6 guard). Hook-opened tabs are the only reliable way to open `file://` URLs; `navigate` to a not-yet-opened file URL may be refused. To (re)open a file: make a trivial edit (or rewrite) and let the hook open it; find its `tabId` via `tabs_context`.
2. `navigate` to the same URL does NOT reliably reload — use `javascript_tool: location.reload()` on the tab.
3. Verify each file: screenshot (check against §4 rules), `read_console_messages onlyErrors`, and exercise at least one interaction/state via `javascript_tool` (e.g. `triggerOverload()`, `.click()` + read back a DOM value synchronously).
4. Blinking elements are invisible ~50% of screenshots — an absent stamp is usually blink phase, not a bug. Confirm via a second screenshot or DOM read.
5. Timed states can flip between tool calls (a full state cycle can complete in the gap). For state-machine checks, click and read the result **in the same `javascript_exec`**.
6. Screenshot inspection catches what consoles don't: silent TDZ failures present as "some panels dead while others live" — if later-defined sections are inert, suspect an early call into TDZ.

## 9. Quality floor

- Interactive controls: real `<button>`s, `role="group"`/`aria-label` on rails and panels, `role="alertdialog"` on overlays, Escape dismisses overlays, `:focus-visible` styled.
- `prefers-reduced-motion` respected (both CSS and JS paths).
- Fixed-size compositions may set a `min-width` and allow scroll (01); full-screen procedural pieces adapt to viewport at load (04–09); reload-on-resize is acceptable (`addEventListener("resize",()=>location.reload())`) for canvas pieces.
- Comments in code explain the *grammar* being applied ("stepped, mechanical, no easing"), matching existing files' density — not line-by-line narration.
- File size ~7–20 KB source; no minification.

## 10. Session checklist for a new experiment

1. Read REFERENCE-ANALYSIS.md §A–C (and skim the relevant per-GIF entry).
2. Pick an uncovered study + invent original content (names, kanji vocabulary, fiction).
3. Copy the token block (§3), CRT pass, stamp/blink CSS, and any needed shared machinery (7-seg SVG, `el()` helper) from the closest existing experiment.
4. Add the zero-size guard first line of the script; end with a `START` section.
5. Build; keep one bold signature element; everything else disciplined.
6. Verify per §8 (screenshot + console + one interaction). Fix, re-verify.
7. Add the file to the §7 table in this spec.
