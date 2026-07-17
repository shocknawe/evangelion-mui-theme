# Reference Analysis — `references-chosen/`

Per-GIF breakdown of all 23 references across ten attributes, followed by a synthesis into design principles, design tokens, and component rules. Companion to [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) (which holds the sampled palette and MUI mapping).

Attribute key used below: **Layout · Spacing · Type · Color · Motifs · Borders · Icons · Animation · Components · Hierarchy**

---

## 1. `council.gif` — MAGI status board (idle/check state)

- **Layout:** Triangular node diagram: three polygonal panels (top-center, bottom-left, bottom-right) around a central `MAGI` hub label; metadata block pinned top-left; kanji headers top-left and mid-right; status stamp right edge.
- **Spacing:** Panels nearly touch the screen edges; ~16–24px gutters between panels and connectors. Corner-anchored text blocks with tight internal leading.
- **Type:** Condensed grotesque caps for node names (`BALTHASAR·2`); mono caps key:value block (`CODE:127`, `FILE:AKAGI_CHK`, `EXTENTION:0256`, `EX_MODE:ON`, `PRIORITY:A--`); huge Mincho kanji headers (`定期検診`) in orange.
- **Color:** Black bg; nodes solid mint `#52F29A`; one node solid blue `#5090D0` (unit under test, with black schematic glyph inside); all chrome/metadata safety orange; red boxed stamp `点検中` ("under inspection").
- **Motifs:** Chamfer-cut polygon panels; kanji header + double-rule underline in teal; boxed text stamp; central hub with radiating connectors.
- **Borders:** Panels have no visible stroke when filled (color is the surface); 1–2px orange connector lines; stamp boxed in its own red; header underlined with paired teal bars.
- **Icons:** Black silhouette schematic (test pattern) inside the blue panel — icons are solid black cutouts on colored panels.
- **Animation:** Stamp blinks; panel colors snap between states; otherwise static board.
- **Components:** Status card (filled variant), diagram connector, metadata block, header w/ rule, blinking stamp chip.
- **Hierarchy:** 1) three giant colored panels (system state readable across a room), 2) kanji headers name the ceremony, 3) mono metadata for operators up close. Color = state; text is secondary.

## 2. `council-voting.gif` — MAGI deliberation (vote resolves)

- **Layout:** Same triangular board as №1, camera tilted (whole board rendered with slight perspective/rotation).
- **Spacing:** As №1; the tilt means nothing is axis-aligned — deliberate dynamism.
- **Type:** As №1; metadata reads `CODE:239 / FILE:MAGI_SYS / EXTENTION:4088 / EX_MODE:OFF / PRIORITY:AAA`; kanji `提訴` (appeal) and `決議` (resolution).
- **Color:** Starts black (panels dark/outline only), nodes flip to mint as each MAGI approves; denial state renders panel red `#C20C0C`; stamp `審議中` ("deliberating") boxed in gold/red.
- **Motifs:** Vote-as-color inversion; per-node kanji chips (`承認` approved / `否定` denied) as black-boxed stamps on the panel.
- **Borders:** Idle nodes are thin orange outlines on black; filled nodes drop the stroke.
- **Icons:** None beyond kanji stamp chips — text is the iconography.
- **Animation:** Sequential resolution: nodes fill one at a time with hard snaps (sometimes a 2–3 frame flicker before settling); blinking status stamp throughout; final unanimous state holds.
- **Components:** Votable status card with `idle → pending → approved/denied` state machine; connector diagram; stamp chip.
- **Hierarchy:** The unresolved node is the focal point precisely because it's still dark — absence of color reads as "waiting." Resolution order tells the story.

## 3. `council-small.gif` — MAGI board on handheld terminal

- **Layout:** Same tri-node diagram shrunk onto a phone-like device screen; header stack of orange boxed title bars on top (`ACCESS MODE: SUPERUSER`, `MOTION: SELF-DESTRUCTION`), diagram below with a right-side column of tiny mono annotations.
- **Spacing:** Extremely dense — the full board survives at ~200px wide. Margins collapse to 4–8px; hierarchy preserved by weight not space.
- **Type:** Same trio (condensed caps names, mono metadata, kanji stamps); header rows use boxed reversed text (orange box, black text and vice versa).
- **Color:** Black screen; green node outlines w/ green kanji chips; one red-boxed denial chip; header/metadata all orange-red.
- **Motifs:** The identical component scales from wall display to handheld — same diagram, same stamps.
- **Borders:** Every header row is a stroked box; node outlines thin green here (low-power variant).
- **Icons:** Kanji chips again; hardware buttons below screen.
- **Animation:** Chips blink; text rows appear line-by-line (teletype).
- **Components:** Responsive/miniature variant of the council board; stacked banner headers ("title bar list").
- **Hierarchy:** Headers (what's being decided) → diagram (who voted) → annotations. Reversed-box headers outrank plain text.

## 4. `processing.gif` — deliberation modal / vote card

- **Layout:** Perfectly framed modal: double orange border inset from screen edge; symmetric kanji headers top-left/top-right (`提訴`, `決議`) each over teal double bars; mono metadata under left header; center stage = a circle + three rotated square outlines with one filled mint square holding a giant numeral `2` and label `BALTHASAR`; red stamp `審議中` top-right; serif `MAGI` at circle center.
- **Spacing:** Generous symmetric padding (~24–32px) inside the frame — the most "composed" screen in the set; center cluster floats in black.
- **Type:** Giant numeral (fills panel); serif caps `MAGI` (rare serif Latin); mono metadata; Mincho kanji headers.
- **Color:** Black bg, orange frame/chrome, mint active panel with black text, teal header bars, red blinking stamp.
- **Motifs:** Rotated squares (~15°) as "slots" for candidates; circle as arena; double-rule header treatment; stamp.
- **Borders:** Signature **double frame** (thin outer + thick inner); rotated panels are 2px orange outlines; teal bars are solid filled rects.
- **Icons:** None — number + name is the payload.
- **Animation:** Stamp blinks ~1Hz; numeral/panel contents swap as deliberation proceeds; rotated empty slots stay static.
- **Components:** Modal/dialog frame, "big value" stat panel, slot outlines, header-with-rules, stamp chip.
- **Hierarchy:** 1) the giant `2`, 2) which slot is lit, 3) headers/stamp naming the process, 4) metadata. Single-value focus.

## 5. `2-graphs.gif` — dual solenoid graph comparison

- **Layout:** Split-screen mirror: two full-height chart panels (green left, red right) separated by a central axis column carrying scale labels (`+100/±0/-100`, `FIELD NEGATIVE` / `FIELD POSITIVE`); condensed title bar + mono subtitle top of each panel (`SOLENOID GRAPH PATTERN A⁺` / `OBJECT: EVA-01 PILOT`).
- **Spacing:** Charts bleed to edges; only the central gutter (~80px) separates them; titles flush-left with minimal padding.
- **Type:** Condensed caps title w/ superscript glyph; mono `OBJECT:` subtitle; tiny mono axis numerals.
- **Color:** Black bg; left waveform phosphor green, right waveform pure red — same data shape, hue = subject; chrome (grid `+` marks, rules, labels) all orange.
- **Motifs:** Mirrored comparison (green vs red as A/B); crosshair `+` grid markers instead of gridlines; Tetris-like block glyphs embedded in the waveform.
- **Borders:** No panel boxes — vertical orange rules define regions; title underlined by rule.
- **Icons:** `+` registration marks scattered on a grid.
- **Animation:** Waveforms scroll/undulate continuously (linear loop); blocks drift with the wave; no easing.
- **Components:** Chart panel w/ title bar, axis rail, comparison split view.
- **Hierarchy:** Waveform mass first (color tells you whose), then titles, then scale. Data is the hero.

## 6. `bar graph.gif` — LIFE meter with safety line

- **Layout:** Left edge: vertical axis with tick marks and `±0` label; rounded-box `LIFE` badge top-left; four vertical segmented bars fill the field; a full-width horizontal threshold rule with boxed `SAFETY LINE` label overlays the bars.
- **Spacing:** Bars ~equal width with gutters roughly half a bar width; segments have consistent ~4px gaps; badge floats with clear margin.
- **Type:** Chunky caps badge (`LIFE`) in a rounded box; tiny boxed caps `SAFETY LINE`; mono axis numbers.
- **Color:** Black bg; segments glowing red `#E2280F` (heavy bloom); axis + safety line yellow-orange; badge red-on-black w/ red outline and strong glow.
- **Motifs:** Segmented meter (discrete LED blocks, not continuous fill); threshold line with label riding on it; glow as importance.
- **Borders:** Badge box rounded ~4–6px; segments rounded ~3–4px; threshold is a 2px rule with label box breaking it.
- **Icons:** None.
- **Animation:** Bars drain/fill segment-by-segment (stepped, ~10 seg/s); whole display pulses subtly; crossing the safety line is the drama.
- **Components:** Segmented gauge/meter, threshold marker, glowing badge.
- **Hierarchy:** Bars vs. line = the entire message; badge names the metric; axis is tertiary.

## 7. `2-states.gif` — hatch status readout (OPEN)

- **Layout:** Physical panel containing an inset screen; screen shows: title row (`L.C.L PLANT: CL3 SEG.`), status line, giant centered `OPEN`, instruction line below; separate hardware door at right with tiny `KEY LOCK OPEN` labels and red indicator arrow; orange `EMERGENCY` plate below.
- **Spacing:** Screen text tight to edges; the giant word gets all the vertical room.
- **Type:** All mint phosphor: condensed/gothic caps at three sizes — label (small), status (medium), state word (huge ~5× body); glow on all text.
- **Color:** Monochrome green-on-black screen embedded in dark blue-gray hardware; tiny red indicator; orange plate w/ black text.
- **Motifs:** Single-word state display; screen-in-bezel framing; text glow.
- **Borders:** Screen edge = the border; rules above/below text rows; hardware plate boxed.
- **Icons:** Red triangle indicator (▼) — tiny, blinking.
- **Animation:** State word swaps (`CLOSE`→`OPEN`); indicator blinks; text has slight CRT shimmer.
- **Components:** Status display panel ("giant word" readout), labeled hardware plate, indicator LED.
- **Hierarchy:** One word dominates; everything else is caption. The clearest example of the bimodal type scale.

## 8. `prompt.gif` — DANGER splash

- **Layout:** Full-bleed red field; full-width black horizontal band across center; `DANGER` fills the band; boxed `危険` stamps centered above and below; white-boxed `ALERT` chips in opposite corners (TL, BR).
- **Spacing:** Big symmetric composition; band height ~30% of screen; corner chips inset ~16px.
- **Type:** `DANGER` — massive condensed grotesque caps in red on black; `ALERT` — white caps in white box; kanji in thin black boxes.
- **Color:** Three colors only: red `#E2280F`, black, white. Red text on black band (not white!) is the signature move.
- **Motifs:** Diagonal-corner symmetry (TL/BR chips); boxed stamps; figure/ground inversion (red field ↔ black band).
- **Borders:** Every text element is boxed except the giant word.
- **Icons:** None — typography IS the alarm.
- **Animation:** Whole screen strobes (red field ↔ inverted), ~1–2Hz hard blink; no fades.
- **Components:** Full-screen alert overlay, corner chip, stamp.
- **Hierarchy:** DANGER → 危険 → ALERT. Redundant tri-lingual escalation, biggest wins.

## 9. `prompt-error.gif` — CAUTION barricade

- **Layout:** Horizontal red bands + black gaps stacked across the screen; 45° chevron stripes cut across top and bottom; small `CAUTION` mono text dead center.
- **Spacing:** Bands are thick (~15% height each); composition is pure stripe rhythm.
- **Type:** Single tiny stitched/dot-matrix `CAUTION` — minuscule against the graphics (inverse of №8's approach).
- **Color:** Red `#E2280F`/`#C20C0C` and black only.
- **Motifs:** Hazard chevrons; barricade stripes; tiny-label-on-huge-graphic.
- **Borders:** None — bands are the structure.
- **Icons:** The chevron pattern itself.
- **Animation:** Bands slide/flash; chevrons animate laterally (marching stripes), linear loop.
- **Components:** Warning banner/backdrop, animated hazard stripe (CSS `repeating-linear-gradient` + background-position loop).
- **Hierarchy:** Pattern first (pre-verbal danger), word second. For states where reading is optional.

## 10. `prompt-warning.gif` — EMERGENCY marquee

- **Layout:** Black field with crimson chevron stripe blocks top and bottom; center band carries giant scrolling `EMERGENCY` in safety orange; boxed kanji `非常事態` centered in the stripe zones.
- **Spacing:** Three horizontal zones (stripes / marquee / stripes) ≈ 30/40/30.
- **Type:** Orange extended caps for the marquee word; Mincho kanji in thin red boxes.
- **Color:** Black bg, crimson `#E60225` stripes, orange `#F26400` display text — the red/orange two-alarm pairing.
- **Motifs:** Marquee ticker; chevrons; boxed kanji; EN+JP pairing.
- **Borders:** Kanji boxes only.
- **Icons:** None.
- **Animation:** Word scrolls horizontally (right-to-left ticker, linear); stripes pulse; kanji boxes blink alternately.
- **Components:** Ticker/marquee alert bar, hazard stripe block.
- **Hierarchy:** Motion carries urgency; the scroll forces attention before comprehension.

## 11. `terminal-prompt.gif` — boot/diagnostic terminal

- **Layout:** Classic full-screen terminal: copyright line top, left-aligned check list (`CO-CPU… Check… OK`) with aligned columns, dashed-rule section headers (`SYSTEM CONFIGURATION`), tabular memory map, summary totals.
- **Spacing:** Character-grid spacing only; sections separated by blank lines and dash rules; columns aligned by spaces.
- **Type:** Single bitmap mono face, ALL CAPS, amber; JP text inline in header line.
- **Color:** Amber/orange `#F49F09` (bright) and rust `#9C3C24` (dim) on black — two-level brightness = two-level hierarchy.
- **Motifs:** `key … value … OK` status rows; dash-line rules `-----`; `<free>` style bracket annotations.
- **Borders:** None — structure from whitespace and dashes.
- **Icons:** None.
- **Animation:** Lines print sequentially (teletype, row chunks ~20–30 rows/s); cursor blink.
- **Components:** Console/log viewer, boot sequence loader, status table.
- **Hierarchy:** Brightness (bright=data, dim=chrome), then position. Right column `OK` scan-line is the read path.

## 12. `terminal-color.gif` — DELETED cascade

- **Layout:** Laptop screen, two text columns of amber prose; rows progressively replaced by grids of boxed `DELETED` stamps; black-on-mint timestamp chip bottom-left (`06:00AM`).
- **Spacing:** Stamp grid inherits the text's line grid — destruction respects layout.
- **Type:** Amber mono prose (mixed case here — civilian text); `DELETED` in glowing red caps inside rounded-corner boxes; chunky digital clock chip.
- **Color:** Amber text, red `#C20C0C→#E2280F` stamps with bloom, teal hardware bezel `#0C6C80`, mint chip.
- **Motifs:** Stamp-over-content destruction; boxed status word repeated as texture; timestamp chip.
- **Borders:** Each stamp is a filled/stroked rounded box (~4px); chip has mint fill + dark text.
- **Icons:** None.
- **Animation:** Stamps cascade across rows (row-major stagger, several per frame, accelerating); clock ticks minute-by-minute; amber text scrolls beneath.
- **Components:** Log viewer w/ destructive row state, badge/stamp chip, clock chip.
- **Hierarchy:** Red beats amber; repetition-as-mass conveys scale of deletion; the lone clock chip anchors time.

## 13. `map.gif` — targeting map

- **Layout:** Full-bleed city map (contour lines + rounded-diamond block grid) in dim greens; large orange crosshair at target; boxed red callout bottom-right (`ESTIMATED POINT OF IMPACT` + kanji `予想落下地点` + coordinates).
- **Spacing:** No margins — map is a texture; callout inset from corner.
- **Type:** Tiny mono map labels (dim green); callout mixes small caps EN, large boxed kanji, mono coords.
- **Color:** Three-level green (`#246C3C` linework → `#3C9C6C` roads → brighter features) + orange `#F26400` crosshair + red callout. Dim field / bright annotation.
- **Motifs:** Crosshair; data-as-backdrop; boxed multi-line callout; contour texture.
- **Borders:** Callout stroked in red; crosshair strokes ~3–4px.
- **Icons:** Crosshair; `×` registration marks scattered.
- **Animation:** Crosshair blinks/pulses; map pans slowly; callout text flickers in.
- **Components:** Map/radar surface, target marker, callout card.
- **Hierarchy:** Crosshair → callout → map. Annotation colors are reserved: nothing else on screen is orange or red.

## 14. `map-02.gif` — operation schematic (naval map)

- **Layout:** Denser variant of №13: green city map + orange ship silhouettes (real object shapes, not abstract markers) + multiple red boxed callouts w/ leader-line anchors (`UN·CVN075 / MPACN / Over The Rainbow`, `DDG·173 KONGO`); central vertical yellow rule (route line); stamped title plate bottom-right: `作戦行動予定図` in a 2×2 boxed kanji grid + `OPERATING SCHEMATIC` caption.
- **Spacing:** Callouts avoid overlapping their subjects; plate anchored to corner; otherwise map-dense.
- **Type:** Mono caps in callouts (ID·NUMBER on line 1, class, name in mixed case); Mincho kanji plate w/ tiny EN caption below.
- **Color:** Green field, orange assets (the entities), red boxes (the labels), single yellow route rule.
- **Motifs:** Silhouette-as-icon; callout + anchor line; kanji title plate w/ EN subtitle; asset color ≠ label color.
- **Borders:** Callouts 1–2px red boxes; plate cells individually boxed (grid of four kanji).
- **Icons:** Ship silhouettes in solid orange — literal shapes, top-down.
- **Animation:** Assets creep along routes; callouts blink on acquisition; route line pulses.
- **Components:** Map w/ entity markers, anchored tooltip/callout, title plate.
- **Hierarchy:** Orange objects (what) → red callouts (labels) → green world (where) → plate (document title).

## 15. `loading-animation-01.gif` — gene-tree progress (dense)

- **Layout:** Full-screen node-link tree: columns of 45° chevron bars connected by orthogonal orange traces; mono IDs at joints (`A0131`, `01001`, `MT-01351`, `B22`); central spine of numbered nodes; horizontal bus bars near bottom.
- **Spacing:** Tight lattice; bars uniform size; ID labels nested into gaps in the traces.
- **Type:** Tiny mono caps IDs and binary strings (`GTGA0101101`) — labels as circuitry.
- **Color:** Starts black → fills red `#C20C0C` bars w/ orange connectors; a minority of bars are mint (the contrast minority); orange tab-notches on bar ends.
- **Motifs:** Chevron/parallelogram bars; circuit-trace connectors; binary/gene-code labels; red-majority-green-minority ratio.
- **Borders:** None — bars are solid fills; traces are 1px lines.
- **Icons:** Small orange notch tabs on bars (connection points).
- **Animation:** Bars ignite in propagating waves along the tree (stepped, cascade from origin outward); traces light before their bars; loop.
- **Components:** Progress-tree loader, activity diagram, "data lattice" background.
- **Hierarchy:** Propagation front = current state; color ratio = health; IDs only matter on freeze-frame.

## 16. `loading-animation-02.gif` — border-line tree (sparse)

- **Layout:** Same lattice zoomed in: large mint chevron bars left/center, red column right; axis numerals down the left edge (`81 82 83…`); diagonal red plate mid-screen: `BORDER-LINE` w/ hazard-striped end caps; `ABSOLUTE·LINE` labels on verticals.
- **Spacing:** Looser than №15 — bars ~3× bigger, gaps proportional.
- **Type:** Mono IDs (`D23`, `A13`); condensed caps on the rotated plate; axis numerals.
- **Color:** Mint bars w/ orange notch tabs vs red bars; red plate w/ black text? (plate = red fill, darker red text, striped caps); orange traces.
- **Motifs:** The threshold again — `BORDER-LINE` as a diagonal plate crossing the data, like №6's safety line but rotated and named; hazard caps on the plate.
- **Borders:** Plate outlined + striped end blocks; bars unstroked.
- **Icons:** Notch tabs; stripe caps.
- **Animation:** Bars fill toward the border-line; plate blinks when approached; stepped cascade as №15.
- **Components:** Progress tree w/ named threshold, rotated warning plate.
- **Hierarchy:** The diagonal plate interrupts the lattice — thresholds outrank data.

## 17. `loading-animation-03-finish.gif` — tree completion/collapse

- **Layout:** Mostly-black screen; the tree survives only in the right margin (green bars + red joints), rest has gone dark.
- **Spacing:** Emptiness as terminal state — the layout is the absence.
- **Type:** (labels too small/dim to read — vestigial).
- **Color:** Small green bars, red connector stubs, black dominance.
- **Motifs:** Power-down/completion as darkness; residual activity at edge.
- **Borders:** None.
- **Icons:** None.
- **Animation:** Bars extinguish region-by-region (reverse cascade) until only the edge remains, then it too fades; reads as "process complete/killed."
- **Components:** Loader exit/teardown animation.
- **Hierarchy:** Inverted — the message is what's no longer there. End loaders by switching segments off in waves, not by fading opacity.

## 18. `timer.gif` — internal power countdown

- **Layout:** Perspective-tilted physical board: left column = vertical JP label + `ACTIVE TIME REMAINING:`; center = giant 7-seg `2:53:10`; right = stacked plates `内部/INTERNAL` and `主電源供給システム/MAIN ENERGY SUPPLY SYSTEM`, hazard-striped corner wedge; bottom rail = mode boxes `STOP SLOW NORMAL RACING`.
- **Spacing:** Digits get ~60% of board; plates stack tight at right; mode rail evenly distributed.
- **Type:** 7-segment digits (slanted); Mincho kanji large w/ small EN caption below (the `内部→INTERNAL` pattern); condensed caps mode labels.
- **Color:** Black board, all content safety orange `#F26400`; green board-frame edge; red accent in stripes; active mode highlighted red.
- **Motifs:** Kanji-over-English caption plates; hazard corner; mode selector rail; colon blink.
- **Borders:** Plates boxed 2px; mode cells individually boxed; board itself plated with visible bolts (hardware framing).
- **Icons:** None — 7-seg digits are the icon.
- **Animation:** Countdown ticks 1s; colons blink 1Hz; active mode cell blinks/invert-flashes; stripes static.
- **Components:** Countdown display, segmented mode selector (radio rail), caption plate.
- **Hierarchy:** Digits → mode rail (what speed we're burning) → plates (which system). Number first, always.

## 19. `timer-02.gif` — external power state (same board)

- **Layout:** Same board as №18, different state: `外部/EXTERNAL` plate lit, timer region dark/blank (unlimited external power = no countdown).
- **Spacing:** As №18.
- **Type:** As №18.
- **Color:** As №18; `NORMAL` mode cell carries a red underbar highlight (active-with-sublabel state).
- **Motifs:** Same board, state via which plate is lit and whether digits exist.
- **Borders:** As №18.
- **Icons:** As №18.
- **Animation:** Plate swap (`内部`↔`外部`) is a hard cut; mode underbar blinks.
- **Components:** Same countdown board — proof these are stateful components, not illustrations.
- **Hierarchy:** Empty digits = good news; the design lets absence signal safety.

## 20. `folder.gif` — file-scan overlay (green)

- **Layout:** Repeating grid overlay on top of scene content: unit = red folder glyph (outline) + vertical mint bar with rotated mono label (binary/`CAT010101` strings); rows offset, semi-transparent.
- **Spacing:** Uniform grid ~5 columns; units evenly distributed, edge-to-edge.
- **Type:** Mono binary/ID strings rotated 90° along the bars.
- **Color:** Mint `#52F29A`→pale `#EDF8D6` bars (additive/screen blend), red-orange folder outlines; underlying scene visible through it.
- **Motifs:** UI-as-veil (data overlays reality); icon+label unit repeated as texture; rotated text.
- **Borders:** Folder glyphs are 2px outlines; bars unstroked translucent fills.
- **Icons:** **Folder glyph** — the one true pictogram in the set: simple tabbed-rectangle outline, geometric, single-weight.
- **Animation:** Grid scrolls vertically; labels flicker; units pop in/out as "files" are scanned.
- **Components:** Scan overlay, file-grid, icon+label cell.
- **Hierarchy:** Texture first (the mass of files), individual items unreadable by design — conveys volume, not detail.

## 21. `folder red.gif` — file-scan overlay (alert)

- **Layout:** Same grid as №20.
- **Spacing:** As №20.
- **Type:** As №20.
- **Color:** Entire overlay flipped to red/pink glow — bars and folders both red; same additive blend.
- **Motifs:** Hue swap = state change across a whole subsystem (green scan → red alarm) with zero layout change.
- **Borders:** As №20.
- **Icons:** As №20.
- **Animation:** As №20 plus urgent flicker.
- **Components:** Same overlay, `error` colorway.
- **Hierarchy:** Identical structure, new meaning — the palette IS the state. Build components colorway-parameterized.

## 22. `multi-item-charging?.gif` — fan-out distribution (light mode!)

- **Layout:** Left: black label chip (`EVA-01`) from which dozens of hairline traces fan out rightward into 4+ vertical columns of solid cells; columns get denser to the right (1→2→4 branching).
- **Spacing:** Cells uniform per column w/ small gaps; column pitch even; branching geometry does the layout.
- **Type:** Single mono label on black chip, white text.
- **Color:** **Pale gray `#B4B4B4` background** (unique in set); cells red `#E40C0C` (charged) or black (uncharged); traces thin dark red/gray.
- **Motifs:** Fan-out/one-to-many tree; fill-state cells; blueprint aesthetic (light bg + hairlines).
- **Borders:** None — cells are solid; traces hairline.
- **Icons:** None.
- **Animation:** Cells charge in sequence along traces (black→red, stepped propagation left→right); reads as power/data distribution.
- **Components:** Distribution diagram, multi-target progress, "blueprint" light theme variant.
- **Hierarchy:** Propagation front again; the lone black chip is the root/source anchor.

## 23. `modal.gif` — command-deck data wall

- **Layout:** Giant green data-wall (terrain map / molecular diagram) filling the frame behind silhouetted foreground figures and consoles; wall subdivided by diagonal seams with node points.
- **Spacing:** Architectural scale — the "screen" is a room surface.
- **Type:** None legible — pure data texture.
- **Color:** Saturated green field `#52F29A→#246C3C` with white-hot detail; everything foreground in silhouette.
- **Motifs:** Data as environment/backdrop; diagonal panel seams w/ junction nodes; silhouette contrast.
- **Borders:** Seam lines with node dots at intersections.
- **Icons:** None.
- **Animation:** Wall content shifts/updates in blocks; ambient shimmer.
- **Components:** Hero/backdrop surface — use as app background texture or empty-state backdrop behind real UI.
- **Hierarchy:** Deliberately none — it's ambience. Real content must sit on top in chrome colors.

---

# Synthesis

## A. Design principles

1. **Black is the canvas; light is the ink.** No elevation grays, no shadows-as-depth. Everything luminous sits directly on `#0A0A0A`, and hierarchy is built from hue, brightness, and border — not surface stacking. (Every GIF except №22.)
2. **Color is state, layout is constant.** The same component re-renders green/red/blue/dark to mean approved/denied/pending/idle without moving a pixel (№1–4, №20–21, №18–19). Build colorway-parameterized components with hard state snaps.
3. **Figure/ground inversion marks activation.** Idle = outline on black; active = solid fill with black content punched out (council panels, DANGER band, mode cells). "Filled means alive."
4. **Bimodal type scale.** One giant element (word, numeral, waveform) + tiny dense captions; almost nothing mid-sized (№4, №7, №8, №18). If everything is medium, it's off-brand.
5. **Everything important is boxed.** A label is text inside a 1px same-color rectangle (`ALERT`, `審議中`, `SAFETY LINE`, callouts, mode cells). The box is the badge.
6. **Bilingual pairing: kanji display + English caption.** Big Mincho kanji as the graphic, small Latin caps beneath as the translation (`内部/INTERNAL`, `作戦行動予定図/OPERATING SCHEMATIC`). Kanji is never decoration without its caption.
7. **Thresholds are physical objects.** Limits get drawn as labeled lines/plates crossing the data (`SAFETY LINE`, `BORDER-LINE`, `ABSOLUTE·LINE`) — never as a footnote.
8. **Diagrams over lists.** Relationships render as node-link circuitry: connectors, traces, fan-outs, hubs (№1–3, №15–17, №22). Data has anatomy.
9. **Motion is mechanical.** Stepped fills, hard blinks, teletype prints, snap cuts, marching stripes. Linear or `steps()` timing only; propagation (cascade/stagger) replaces easing as the source of life.
10. **Diagonal energy.** Rotated plates, 45° chevrons, tilted boards, rotated labels break the grid exactly where urgency or dynamism is intended (№4, №9, №10, №15–16, №18, №20).
11. **Density conveys scale; emptiness conveys resolution.** Walls of repeated stamps/files/bars say "much"; a dark board or extinguished tree says "done/safe" (№12, №17, №19).
12. **Redundant alarm channels.** Critical alerts say it three ways — EN word, JP word, pattern (stripes/strobe) — so it reads pre-verbally, peripherally, and literally (№8–10).

## B. Design tokens

```
COLOR (sampled — see DESIGN-SYSTEM.md §1 for full table)
  bg.void            #0A0A0A   app background, filled-state content color
  bg.blueprint       #B4B4B4   optional light "blueprint" theme only
  green.phosphor     #52F29A   primary / success / active data
  green.phosphorHi   #7CF4AB   glow cores, hover, peaks
  green.map          #3C9C6C   secondary data, dim wireframes
  green.mapDim       #246C3C   tertiary linework, disabled
  mint.paper         #EDF8D6   max-brightness fill (near-white)
  red.nerv           #C20C0C   danger data, denial fills
  red.bright         #E2280F   alert surfaces, strobes, stamps
  red.crimson        #E60225   hazard stripes
  orange.safety      #F26400   chrome: borders, rules, digits, markers
  orange.amber       #F49F09   terminal/log text (dim step: #9C3C24)
  teal.surface       #0C6C80   header bars, hardware bezels
  blue.pending       #5090D0   deliberating/processing state

TYPE
  display   Oswald / Archivo Narrow (≈Helvetica Condensed) — ALL CAPS, 700, tracking −1%
  mono      Share Tech Mono / VT323 — ALL CAPS for UI, +0.05em
  digits    DSEG7 Classic (slanted) — timers/counters
  jp        Shippori Mincho B1 800 (≈Matisse EB) — kanji display
  scale     10 / 12 / 14 / 24 / 40 / 64+  (bimodal: cluster at ≤14 and ≥40)
  leading   1.1–1.2 everywhere
  conventions  interpunct in IDs (BALTHASAR·2); KEY:VALUE metadata blocks; no lowercase in UI chrome

SPACE
  base grid  4 / 8 / 16 / 24 / 32
  panel padding      16–24   (modal frames 24–32)
  chip/box padding   2–6 × 4–8
  segment gap        3–4     (meters, grids)
  screen margin      8–16    (dense by default)

SHAPE
  radius.default     0
  radius.chip        2–4     (stamps, meter segments, badges)
  chamfer.panel      16–32px 45° cut, 1–2 corners  (clip-path)
  rotation.accent    3–15°   (plates, slots); 45° (chevrons, stripes)

BORDER
  hairline  1px   connectors, traces, label boxes
  standard  2px   panel outlines, callouts, plates
  emphasis  3–4px crosshairs, inner modal frame
  double    1px + gap 3px + 3px   (modal/document frames)
  rule.header   paired 2px bars (teal) under kanji headers

GLOW
  text    0 0 4px currentColor, 0 0 12px currentColor@40%
  box     0 0 6px edge@50%, inset 0 0 6px edge@25%
  intensity: red > orange > green;  none on black-on-fill content

MOTION
  easing      linear | steps(n, end)  — never cubic-bezier springs
  blink       1–2Hz, steps(2), hard on/off
  snap        0ms state change (optional 2–3 frame flicker on settle)
  teletype    rows appear in chunks, 20–30 rows/s
  cascade     row-major stagger 30–80ms/unit
  segment     10–15 segments/s fill rate
  countdown   1s tick, blinking colons
  teardown    reverse cascade to black (no opacity fades)
  reduced-motion: keep final states, kill blinks/marquees
```

## C. Component rules

**Panel / Card** — Black fill + 1–2px `orange.safety` outline. Hero cards chamfer 1–2 corners (16–32px). Never elevate with shadow; use edge glow. Filled variant: solid semantic color, all content `bg.void` black, no stroke.

**Status node (council panel)** — Chamfered polygon with state machine: `idle` outline-only → `pending` blue `#5090D0` → `approved` mint fill + black condensed name → `denied` red fill + black-boxed kanji/label chip. State change is a snap (≤3-frame flicker allowed). Nodes join via 1px orange connectors to a mono hub label.

**Stamp / Chip / Badge** — Text in a 1px box of its own color, radius 0–4px, padding 2–6px. Blinking = "in progress" (`審議中`), static = record (`ALERT`). Inverse variant: solid fill, black text (timestamps, mode cells).

**Metadata block** — Mono caps `KEY:VALUE` list, left-aligned, leading 1.15, `orange.safety` or red, pinned to a corner. Underscores in values (`MAGI_SYS`), no lowercase.

**Header** — Kanji display (Mincho 800) + paired teal rules beneath, small EN caption below or beside. Latin-only fallback: condensed caps + single 2px rule.

**Modal / Dialog** — Double orange frame (thin outer, thick inner). Symmetric kanji headers in top corners, metadata under left header, blinking stamp top-right, single focal element centered in black space. No backdrop blur — dim to black.

**Meter / Gauge** — Discrete segments (radius ~4px, gap ~4px), never continuous fill; fill/drain by whole segments at 10–15/s. Thresholds are drawn: 2px rule + boxed label riding the line. Red data glows hardest.

**Chart panel** — Title bar (condensed caps) + mono `OBJECT:` subtitle; `+` crosshair marks instead of gridlines; axis rails in orange; data in one semantic hue per subject; A/B comparisons = mirrored green/red panels.

**Terminal / Log** — Amber mono on black, two brightness levels (bright data / dim chrome), dash rules for sections, right-aligned `OK` status column, teletype entry, blinking cursor. Destructive rows: red boxed `DELETED`-style stamps cascading over content.

**Map / Radar** — Three-level dim green field; annotation colors reserved (orange = assets/crosshair, red = label callouts, yellow = routes). Callouts are red-boxed mono cards with leader lines. Corner title plate: boxed kanji grid + EN caption.

**Countdown / Big value** — 7-seg digits in orange, blinking colons, 1s ticks. Absence of digits may signal "safe." Pair with caption plates and a boxed radio rail (`STOP SLOW NORMAL RACING`) where the active cell inverts/blinks.

**Alert overlay** — Full-bleed semantic color or black; giant condensed word in a full-width inverted band; boxed JP + EN stamps in diagonal corners; strobe 1–2Hz or marquee scroll; hazard chevrons (45°, red/black) for barricade-grade warnings. Always tri-channel: word + kanji + pattern.

**Loader / Progress tree** — Node-link lattice of 45° chevron bars + 1px traces; ignition propagates outward stepped; complete = reverse-cascade to black. Thresholds appear as rotated named plates (`BORDER-LINE`).

**Overlay / Scan grid** — Repeating icon+rotated-mono-label units, additive/screen blend over content; whole overlay recolors (mint→red) to change meaning. Conveys volume, not item-level detail.

**Iconography rules** — Almost none: the system is typographic. Permitted: folder-style 2px geometric outlines, solid silhouettes of real objects (ships), crosshairs/`+`/`×` marks, ▼ indicators, 7-seg digits. No rounded friendly icon sets, no emoji, no filled icon fonts.
