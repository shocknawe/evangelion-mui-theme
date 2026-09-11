/**
 * Per-component prose the generated metadata can't express: a richer overview,
 * use/avoid guidance, accessibility notes, edge cases, performance notes, and
 * customization notes.
 *
 * The playground seed lives in `examples.ts`; the description and props table
 * come from the generated site data. Every field here is optional — a component
 * page renders whatever is present, so this file is additive by design and never
 * needs to keep pace with the export list.
 *
 * Three fields are part of the documentation contract (Task 7.4 of
 * `upgrade-theme-quality-maturity`): every public component's page covers
 * **edge cases**, **performance notes**, and **at least one customization
 * recipe**. `customizeExtra` is the per-component half of the recipe — the
 * standard half (`sx` on the root, the `classes` keys, the single-class
 * `Nerv*-root` theme override) is derived on the page from the generated props
 * table, so it cannot drift from source. Notes here are code-true, not
 * aspirational: if a claim is on one of these lists, the component really does it.
 */

export interface DocMeta {
  /** Richer overview than the JSDoc one-liner. */
  intro?: string;
  use?: string[];
  avoid?: string[];
  a11y?: string[];
  /** Boundary behavior: reduced motion, portals, controlled/uncontrolled, clamping, SSR. */
  edge?: string[];
  /** What the component actually costs at runtime: timers, repaints, bundle weight. */
  perf?: string[];
  /** Extra per-component customization notes, appended to the standard recipe. */
  customizeExtra?: string[];
  /** A runnable snippet replacing (or standing in for) the standard recipe code. */
  customizeCode?: string;
  /** The component takes no `sx` prop — the standard recipe's `sx` note is dropped. */
  customizeNoSx?: boolean;
  /** Min height for the playground preview pane (px). */
  previewHeight?: number;
}

/** Shared phrasing for notes that are true of a whole group of components. */
const CONVENTIONS = {
  /** Tasks 3.2/3.3 — every component spreads undeclared props (and `ref`) to its root. */
  spread:
    'Undeclared props (`data-*`, `aria-*`, `onClick`, `style`) and `ref` all land on the outermost element — no wrapper intercepts them.',
} as const;

export const registry: Record<string, DocMeta> = {
  /* ------------------------------------------------------------- Atoms */
  stamp: {
    intro:
      'The atomic unit of the design language: a short label in a 1px box. Every id, status, tag, and verdict on a console screen is a Stamp. Idle reads as an outline on black; `filled` inverts it to a solid hue with black content punched out — the "recorded / active" state. `blink` marks work in progress.',
    use: [
      'Any id, status, tag, count, or verdict — reach for Stamp before a restyled Chip or a bordered <span>.',
      'tone carries the meaning: mint = nominal, amber = caution, blue = pending, red = critical, orange = chrome-level label.',
      'filled for a recorded/committed state; blink for something still running.',
    ],
    avoid: [
      'Orange as a data value — orange is chrome. If the stamp is reporting a state, pick the state hue.',
      'glow together with filled: the fill already carries the light, and glow on black-on-fill content muddies it.',
      'Sentence case. Stamp text is UI chrome, so it stays ALL CAPS.',
    ],
    edge: [
      CONVENTIONS.spread,
      'blink is hook-gated (it settles lit); glow is static — and glow is suppressed when `filled`, because glow on black-on-fill content is banned.',
      'Long text does not wrap (`white-space: nowrap`) — a long stamp pushes a flex row wider instead of breaking.',
      'The root is a `<span>`, so it will not stretch like a block; make the parent `display: flex` when it must fill a row.',
    ],
    perf: [
      'No state, no effects: after mount the only cost is one Emotion class. The 1 Hz blink is a CSS keyframe, not a timer.',
      'Module weight: `components/chips.tsx` — 1.2 kB gzip (budget table in docs/bundle-budgets.md).',
    ],
    customizeExtra: [
      '`size` only switches between two token-driven paddings/sizes (`sm` 9px, `md` 11px); anything else is an `sx`/`classes` override, not a new prop.',
    ],
    a11y: [
      'Color never carries the meaning alone — the label text always says the state too.',
      'blink is suppressed under prefers-reduced-motion; the stamp settles lit.',
    ],
  },

  /* -------------------------------------------------------------- Text */
  'bilingual-label': {
    intro:
      'The bimodal pairing itself: one large graphic term (kanji, numeral, or heading) with a small caption pinned to it. This is the type rule made into a component — a big glyph must never appear unlabelled.',
    use: ['Any hero term, zone marker, or oversized metric. Give it the en caption every time.'],
    avoid: ['Mid-sized settings. The whole point is the jump between the giant term and the tiny caption.'],
    edge: [
      CONVENTIONS.spread,
      '`en` is optional in the type but mandatory in the grammar — an unlabelled giant term is exactly what this component exists to prevent.',
      'The caption size derives from `size` (≈26%, floored at 8px), so shrinking the term keeps the pair proportional.',
      '`layout="column"` stacks the caption under the term and drops the `/ ` separator prefix.',
    ],
    perf: ['Two spans, no state, no effects — the cheapest text primitive.'],
  },

  'metadata-block': {
    intro:
      'The `KEY:VALUE` spec block — keys in chrome (orange), values in the dim rust the terminal uses for non-text ink. The house idiom for `CODE:`, `FILE:`, `EX_MODE:` rows.',
    use: ['Spec rows, file headers, and any KEY:VALUE metadata block.'],
    edge: [
      CONVENTIONS.spread,
      'Keys render verbatim — pass them already uppercased; the component does not transform case.',
      'The object form of `entries` loses duplicate keys and relies on insertion order; use the tuple-array form when key order matters or a key repeats.',
    ],
    perf: ['Stateless: one row per entry, no effects.'],
    customizeExtra: ['`keyTone` recolors the key column; values stay on the dim rust token.'],
  },

  'section-divider': {
    intro:
      'The numbered form-section head: a solid index chip, a kanji term, and the English title over a fading orange rule.',
    use: ['Form sections, pipeline stages, the OODA loop — anything that genuinely is a sequence.'],
    avoid: [
      'Numbering a set of unrelated sections. A number claims order; if the order carries no information the eyebrow is noise.',
    ],
    edge: [CONVENTIONS.spread, '`index` is display text — pass `"01"`, not `1`, so the chip width stays stable.'],
    perf: ['Static; the fading rule is a single linear-gradient, no animation.'],
  },

  'section-heading': {
    intro:
      'The landing-section header: filled orange index chip, large condensed heading, fading orange rule, optional right-aligned note.',
    use: ['Marketing section breaks.'],
    edge: [
      CONVENTIONS.spread,
      'Renders a real `<h2>` — one per section, or the document outline flattens. The font size is a `clamp()`, so it reflows without JS.',
    ],
    perf: ['Static; no state, no effects.'],
  },

  'dossier-sheet': {
    intro:
      'The spec sheet: a teal-ruled heading over KEY/VALUE rows, an optional rotated watermark, and a signature footer with two ruled lines and a stamp. The system’s "official document" surface.',
    use: ['Landing-page spec blocks, release manifests, anything that should read as filed paperwork.'],
    edge: [
      CONVENTIONS.spread,
      'The watermark is absolutely positioned and set 2px past the sheet edge (`right: -2`) — but the root itself has `overflow: hidden`, so the overhang is absorbed by the sheet, and a parent with `overflow: hidden` clips nothing extra of it. What *does* clip: any content (watermark, rows) pushed beyond the sheet’s own box.',
      'Rows are keyed by index, so reordering the array re-mounts rows rather than moving them — harmless for static sheets.',
      '`rows` values may be rich nodes (an inline `<b>` picks up the highlighted-value style).',
    ],
    perf: ['Static; the sheet is one bordered box plus one row grid.'],
    previewHeight: 340,
  },

  'field-label': {
    intro: 'The form-control label: a kanji tag over an ALL-CAPS English label, wrapping any themed input.',
    use: [
      'Every console form field. Put the already-themed stock control inside — TextField, Select, Checkbox, Switch, Slider.',
      'Pair with SectionDivider to number the form sections.',
    ],
    avoid: ['A second label on the input itself — that fights the wrapper.'],
    edge: [
      CONVENTIONS.spread,
      '`htmlFor` is only wired when the child input carries an `id` — the label degrades to plain text otherwise, which is the usual cause of a "label not associated" axe finding.',
    ],
    perf: ['Static wrapper; the control inside renders as-is.'],
    a11y: ['htmlFor wires the label to the control when the child input carries an id.'],
  },

  /* ------------------------------------------------------------ Layout */
  'console-frame': {
    intro:
      'The command shell every full console screen is built in: a chamfered, orange double-framed box with a full-width header over a `sidebar · main · rail` grid, plus optional `band` and `footer` rows. Each region scrolls independently, and the whole frame recolors red with a hazard stripe when `alarm` is set.',
    use: [
      'The outermost element of a dashboard or operator screen — see the /dashboard-01..03 routes in app/.',
      'Omit sidebar or rail to drop that column entirely; the grid re-flows.',
      'Drive alarm from real state (a failed gate, a retried routine), never decoratively.',
    ],
    avoid: [
      'Nesting one ConsoleFrame inside another — one shell per screen.',
      'Using it as a card. It is the screen, not a panel; reach for TelemetryCard or GaugeCard for panels.',
    ],
    edge: [
      CONVENTIONS.spread,
      'Below the `md` breakpoint the frame stops being a fixed viewport-height deck: regions stop scrolling individually (`min-height: auto`, `overflow: visible`) and the page scrolls as one. Column widths and region heights only apply at `md+`.',
      'Omitting a region rebuilds the grid template areas from scratch — there is no empty-column placeholder to style.',
      '`alarm` adds a hazard stripe marked `aria-hidden`; announce the state in text somewhere else in the shell.',
    ],
    perf: [
      'One CSS grid, no JS measurement; the chamfer `clip-path` plus two box-shadow glows are the whole paint cost.',
      'Independent region scrolling is plain `overflow-y: auto` per grid area.',
    ],
    customizeExtra: [
      '`sidebarWidth` / `railWidth` / `headerHeight` / `bandHeight` / `footerHeight` are the layout knobs — prefer them over fighting the grid template in `sx`.',
      '`classes` covers every region: root · header · band · sidebar · main · rail · footer.',
    ],
    previewHeight: 460,
    a11y: [
      'The regions render as header / nav / main / aside / footer landmarks, so screen readers get the shell structure for free.',
      'The alarm state is a visual amplifier — pair it with a text status in the footer so it is not color-only.',
    ],
  },

  'zone-title': {
    intro: 'A zone header: condensed orange caps over a dim-green rule, with optional right-aligned amber meta.',
    use: ['Section headers inside a ConsoleFrame main column.'],
    edge: [
      CONVENTIONS.spread,
      'The default root is a `div` — pass `component="h2"` (or `h3`) when the zone is a real document section, or the page outline stays flat. The type ramp is set here, so a heading renders identically.',
      'Heading user-agent margins are zeroed here (CssBaseline does not reset them), so an `h2` lines up with the `div`.',
    ],
    perf: ['Static.'],
    customizeExtra: ['`component` is the accessibility hook; `aside` is the right-aligned amber meta slot.'],
  },

  monogram: {
    intro: 'A boxed bilingual monogram — a glowing kanji over a tiny caption, in a 1px chrome box.',
    use: ['Mastheads, rail headers, identity marks.'],
    edge: [CONVENTIONS.spread, '`size` drives the kanji; the caption stays 8px by design (the bimodal jump is the point).'],
    perf: ['Static; the glow is a single text-shadow.'],
  },

  stat: {
    intro: 'A compact vital: a tiny mono label above a condensed value.',
    use: ['Rows of readouts in a header or hero — lighter than StatTile.'],
    edge: [
      CONVENTIONS.spread,
      '`tone="paper"` (the default) means no glow; only `mint` adds the phosphor text-shadow — glow is a state accent, not a default.',
    ],
    perf: ['Static.'],
  },

  'gauge-card': {
    intro:
      'A single-corner-chamfered card that frames one gauge as a monitored channel, tinted end-to-end by the channel’s state hue.',
    use: ['A named channel with a state — a cron job, a watcher, a queue.'],
    edge: [
      CONVENTIONS.spread,
      'The chamfer is a literal `clip-path` (16px cut, top-right corner), not the token `chamfer()` helper — resizing the cut is an `sx` override.',
      '`tone` colors border, channel label, and readout together: color = state, so a row of these reads as a trigger bank.',
    ],
    perf: ['Static wrapper; the gauge you drop in carries its own cost.'],
    previewHeight: 280,
  },

  'telemetry-card': {
    intro: 'The standard panel around a gauge: a title/type header, the gauge body, and a two-slot footer.',
    use: ['Every free-floating gauge should be framed by this or GaugeCard — a naked gauge reads as unfinished.'],
    edge: [
      CONVENTIONS.spread,
      '`foot` is exactly two slots `[left, right]` — a third item needs `classes.foot` restyling or a different shell.',
      '`title`/`type` are display text; the DOM `title` is omitted from the props type so a consumer tooltip attribute still works.',
    ],
    perf: ['Static.'],
    previewHeight: 280,
  },

  /* -------------------------------------------------------------- Flow */
  'step-flow': {
    intro:
      'The progress stepper: chamfered nodes where completed steps are solid mint, the current step blinks blue, upcoming steps are dim outlines.',
    use: ['Sequences where order carries meaning — an OODA loop, a pipeline stage list.'],
    edge: [
      CONVENTIONS.spread,
      'Fully controlled and purely presentational: `active` drives everything, unclamped. A negative `active` marks no step done; `active >= steps.length` marks *every* step done (`done = i < active`) and leaves no active node — neither case throws.',
      'The active node’s blink is settled by the *global* reduced-motion guard (CssBaseline, animation duration ~0), not the hook — StepFlow reads no `useReducedMotion`; with the guard on, the node simply holds solid blue.',
      'Node width is fixed at 72px and the connector flexes — very long labels wrap rather than resize the node.',
    ],
    perf: ['No state, no effects; re-renders only when `steps` or `active` changes.'],
    customizeExtra: ['`classes` covers root · node · connector; the connector hue follows `active` (mint once reached).'],
  },

  'agentic-loop': {
    intro:
      'The OODA loop drawn as a ring of kanji nodes with one lit at a time. Self-cycles when uncontrolled; pass active to drive it from a real agent state machine.',
    use: ['Showing an autonomous process is alive and which phase it is in.'],
    avoid: ['Decorative use on a static page — a moving ring implies something is actually running.'],
    edge: [
      CONVENTIONS.spread,
      'The internal cycle only runs while uncontrolled *and* motion is allowed — passing `active` removes the interval entirely (it is cleared, not just paused).',
      'There is no minimum `cycleMs`; a value under ~100ms makes the ring unreadable.',
      'Under reduced motion the loop holds the first node and never starts a timer.',
    ],
    perf: ['One `setInterval` at `cycleMs` (900ms default) when uncontrolled; each tick re-renders the ring. Pass `active` to stop it.'],
    previewHeight: 300,
    a11y: ['The cycle stops under prefers-reduced-motion and settles on the active node.'],
  },

  'task-card': {
    intro:
      'The composed task row: an id · title · action header, an embedded StepFlow, and a labeled progress bar (SegmentBar).',
    use: ['Agent-console task lists — the dashboard-01 pattern.'],
    edge: [
      CONVENTIONS.spread,
      '`id` and `title` are display props — the DOM `id`/`title` are omitted from the attributes type so a consumer tooltip attribute still reaches the root.',
      '`pct` renders verbatim; clamp to 0..100 before passing (the embedded SegmentBar rounds to whole segments).',
    ],
    perf: ['Static composition of StepFlow + SegmentBar — no timers of its own.'],
    customizeExtra: ['`classes` covers root · header · progress; replace `steps` to swap the OODA default sequence.'],
  },

  /* ------------------------------------------------------------ Status */
  'status-legend': {
    intro:
      'The key for a screen’s state vocabulary — a row of bilingual stamps, filled where that state is currently active.',
    use: ['At the top of a dense screen, so the operator can decode every hue below it.'],
    edge: [
      CONVENTIONS.spread,
      'Items are keyed by `en`, so duplicate English captions collapse — every state in a legend must be unique.',
      '`filled` is data-driven per item: it is the legend’s "this state is active now", not a style choice.',
    ],
    perf: ['Static.'],
  },

  roster: {
    intro:
      'Unit roster — status tiles that each own a hue; OFFLINE uses the figure/ground inversion, CAUTION blinks. Selecting thickens the border.',
    use: ['Unit/fleet status banks on a dashboard.'],
    edge: [
      CONVENTIONS.spread,
      'Selection is internal (uncontrolled): toggling a selected tile fires `onSelect(null)`, and there is no `selected` prop to drive selection from outside.',
      'Tiles render as real buttons with `aria-pressed`; there is no roving tabindex — keyboard users tab tile to tile.',
      'CAUTION’s blink is hook-gated and settles lit under reduced motion; OFFLINE’s inversion is static (it is the recorded/active grammar, not motion).',
      'It defaults to a sample roster when `units` is omitted — pass your own for anything real.',
    ],
    perf: ['Static grid; `columns` applies at `sm+` (2 columns below).'],
    customizeExtra: ['`classes` covers root · tile.'],
  },

  'stat-tile': {
    intro: 'A negative-space stat: a tiny label, one giant numeral, a tiny footer — the bimodal type rule as a KPI tile.',
    use: ['Landing/dashboard KPIs.'],
    edge: [CONVENTIONS.spread, '`value` renders verbatim — format numbers (thousands separators, units) before passing.'],
    perf: ['Static; the 58px value is display font with one text-shadow.'],
  },

  'rail-item': {
    intro: 'A rail list row: title (+ optional subtitle) on the left, a due/time marker on the right, on a dotted hairline.',
    use: ['Reminder/inbox rails inside ConsoleFrame’s rail column.'],
    edge: [
      CONVENTIONS.spread,
      '`title` is display text (the DOM `title` is omitted); `done` dims and strikes the row — it is a state, not a filter.',
    ],
    perf: ['Static.'],
  },

  'gate-row': {
    intro:
      'A "blocked on you" decision row: id · title · dot leader · sub · priority stamp, ending in a REVIEW action or — once decided — the verdict stamp.',
    use: ['Decision queues, review inboxes.'],
    edge: [
      CONVENTIONS.spread,
      'The REVIEW action renders only while `verdict` is unset; once decided the verdict stamp is data-driven and the slot no longer renders.',
      '`slots.action` is a locked internal affordance: the slot receives `onClick` (bound to `onReview`) and the default `REVIEW` label — restyle or relabel it, don’t re-route it.',
      'The idle left edge is a 1px priority tint (the no-side-stripe rule); approve/deny settle it back to a neutral hairline.',
      '`id`/`title` are display text — both are omitted from the DOM-attributes type.',
    ],
    perf: ['Static; the dot leader is a single `::after` string, not a measured layout.'],
    customizeExtra: ['Relabel the action through `slotProps` when only the text changes.'],
    customizeCode: '<GateRow slotProps={{ action: { children: "OPEN" } }} … />',
  },

  'agent-card': {
    intro: 'A boxed agent card colored by status, with a name, a status stamp, and a task line. Selectable.',
    use: ['Agent rosters, console switchers.'],
    edge: [
      CONVENTIONS.spread,
      'The root is a `<button>` (so it is keyboard-operable) — nested interactive elements inside it are invalid HTML.',
      '`aria-pressed` carries selection; `selected` thickens the border and adds an inset glow (no hue change — the status owns the hue).',
    ],
    perf: ['Static.'],
  },

  'recall-note': {
    intro: 'A recalled reference — a cited fragment with a tinted 1px left edge, an amber id, and readable body text.',
    use: ['Decision-log/memory citations under a working surface.'],
    edge: [
      CONVENTIONS.spread,
      '`id` is the displayed reference id, not the DOM `id` (omitted from the attributes type).',
      'The tint is a `color-mix` background wash over the note — decoration only; the body text never inherits it.',
    ],
    perf: ['Static.'],
  },

  'sink-row': {
    intro: 'A delivery-sink row: name over a state line, a ping readout, and a state stamp. OFFLINE inverts the stamp.',
    use: ['Notification/delivery sink lists.'],
    edge: [
      CONVENTIONS.spread,
      'OFFLINE flips the stamp to a solid red fill with black content and defaults `ping` to `—` and the label to `DOWN` — the inversion is derived from `status`, not passed in.',
      '`detail` defaults to the status word; `stampLabel` overrides the derived stamp text.',
    ],
    perf: ['Static.'],
  },

  'routine-row': {
    intro: 'A scheduled-routine row: id · name · kind · state stamp · RUN action. `dim` fades it without removing it.',
    use: ['Routine/cron managers, filterable lists.'],
    edge: [
      CONVENTIONS.spread,
      'RETRIED’s stamp blinks (hook-gated — it settles lit under reduced motion); PENDING/SUCCESS never blink.',
      '`dim` fades and desaturates the row (opacity .25 + grayscale) — the dim-not-hide rule; keep the row mounted while filtered.',
      '`slots.action` mirrors GateRow’s: `onClick` bound to `onRun`, default label `RUN`.',
    ],
    perf: ['Static; the dim transition is a single linear opacity fade.'],
    customizeExtra: ['Relabel the action without a slot.'],
    customizeCode: '<RoutineRow slotProps={{ action: { children: "TRIGGER" } }} … />',
  },

  'module-card': {
    intro: 'The product/system grid card: a large kanji mark, a system code pair, a title and body, and a footer stamp.',
    use: ['Landing-page module grids and system inventories.'],
    edge: [
      CONVENTIONS.spread,
      'Renders as a real `<button>` (`aria-pressed` for selection) — the whole card is one press target, so nothing interactive can nest inside it.',
      'Chrome (orange) border at rest, mint border + glow when selected; `title`/`onSelect` are display/behavior props, not DOM ones.',
    ],
    perf: ['Static; the hover lift is a border-color change, not a transform.'],
    previewHeight: 300,
  },

  'memory-row': {
    intro: 'A memory-vault entry row: a fixed-width node id, a readable title, and a kind stamp colored by type.',
    use: ['Memory/query result lists — pair with FilterRail for the dimming behavior.'],
    edge: [
      CONVENTIONS.spread,
      'Hover lifts the border to orange — a hover affordance is chrome signaling, never the only state carrier.',
    ],
    perf: ['Static.'],
  },

  'agent-dot': {
    intro: 'A single agent status readout for a footer / status bar: a small round state dot before its label.',
    use: ['Status bars, footers.'],
    edge: [
      CONVENTIONS.spread,
      '`busy` tints the whole readout amber — it is a state, so keep the label text (never color alone).',
    ],
    perf: ['Static; the cheapest status element in the library.'],
  },

  /* ------------------------------------------------------------ Inputs */
  'chip-radio-group': {
    intro: 'A single-select group of bilingual chips: selected = solid tone fill with black content + glow, idle = outline.',
    use: ['Priority/phase selectors, single-select filter rows.'],
    edge: [
      CONVENTIONS.spread,
      'Fully controlled — there is no uncontrolled mode; `value` must match an `options[].value` or nothing renders selected.',
      'Per-option `tone` means one group can mix state hues (mint nominal, red critical) — intended: the hue is the option’s meaning.',
      '`role="radiogroup"` with `role="radio"`/`aria-checked` per chip; keyboard users tab between chips (no roving tabindex).',
      'DOM `value`/`onChange` are omitted from the attributes type, so a consumer form handler cannot collide with them.',
    ],
    perf: ['Static; selection is a hard step (no transition on the inversion).'],
    customizeExtra: ['`classes` covers root · option; the selected glow is `color-mix` on the option’s tone.'],
  },

  'number-stepper': {
    intro: 'An integer stepper: orange chrome buttons flanking a monospace readout.',
    use: ['Counts, retries, concurrency limits.'],
    edge: [
      CONVENTIONS.spread,
      'Controlled only. Values clamp to `[min, max]` and move by `step` — no wraparound, and no direct typing (the readout is a read-only input).',
      'DOM `value`/`onChange` are omitted from the attributes type to keep the count props unshadowed.',
    ],
    perf: ['Static; every press is one re-render.'],
  },

  'hazard-rating': {
    intro: 'A discrete rating: lit mint segments over a hazard-hatched track. Segments are drawn objects, never a fill.',
    use: ['Severity/hazard inputs.'],
    edge: [
      CONVENTIONS.spread,
      'Controlled only; clicking segment *n* sets the rating to *n* (no half steps, no clear-on-second-click).',
      'Segments are unlabeled buttons with `aria-label` = the index and `aria-checked` for the current value, inside `role="radiogroup"`.',
    ],
    perf: ['Static.'],
    customizeExtra: [
      '`classes` covers root · segment; the unlit hatch is a `repeating-linear-gradient` you can replace per segment.',
    ],
  },

  'tag-input': {
    intro:
      'A tag field: mint stamp chips (deletable) with an inline input that adds a tag on Enter and removes the last on Backspace.',
    use: ['Tag/label inputs on console forms.'],
    edge: [
      CONVENTIONS.spread,
      'Controlled: the `tags` array is the truth. Enter adds, blur commits the draft, Backspace on an empty draft deletes the last tag.',
      'Duplicates are dropped silently; whitespace becomes `_`; `uppercase` (default true) uppercases new tags — set it false for case-sensitive tags.',
      'The `tag` slot contract ships `label` + `onDelete` — the default part is an MUI `Chip color="success"`. Stamp is *not* a drop-in slot: it reads `children`, not `label`.',
    ],
    perf: [
      'Uncontrolled draft state only; the tag list re-renders on change. Committing on blur means no per-keystroke parent updates.',
    ],
    customizeExtra: ['The `tag` slot replaces the default Chip; a custom part takes `label` + `onDelete` only.'],
    customizeCode: `const Tag = ({ label, onDelete }: { label?: ReactNode; onDelete?: () => void }) => (
  <Stamp tone="mint" onDoubleClick={onDelete}>{label}</Stamp>
);

<TagInput slots={{ tag: Tag }} />`,
  },

  'date-segments': {
    intro: 'A read-only segmented date/number display — glowing mint digits in bordered cells joined by an orange separator.',
    use: ['Timestamps, IDs, code fields.'],
    edge: [
      CONVENTIONS.spread,
      'Read-only: there is no input mode. Cell width adapts to segment length (`>2` chars → 66px, else 48px), so mixed-width segments stay legible.',
      'An empty segment renders an empty cell rather than collapsing the row.',
    ],
    perf: ['Static.'],
  },

  /* -------------------------------------------------------- Navigation */
  'filter-chips': {
    intro: 'A scope-filter chip row: orange outline chips where the active one inverts to solid orange with black content.',
    use: ['The chrome half of a filter — pair with your own dimmed rows, or use FilterRail for the bundled list.'],
    edge: [
      CONVENTIONS.spread,
      'Controlled (`value`); `onChange` is optional — a purely presentational chip row is valid.',
      '`aria-pressed` per chip inside `role="group"`; `ariaLabel` names the group.',
    ],
    perf: ['Static.'],
  },

  'filter-rail': {
    intro:
      'A filter rail that *dims and desaturates* non-matching rows instead of hiding them — the operator never loses their place. Uncontrolled by default.',
    use: ['Any filterable list of typed rows — routines, sinks, gates, memory entries.'],
    avoid: [
      'Hiding filtered rows. Dimming is the rule: removal destroys the operator’s spatial memory of the list.',
    ],
    edge: [
      CONVENTIONS.spread,
      'Uncontrolled by default: `defaultValue` falls back to `allValue`, which itself defaults to `filters[0]` — so the first filter means "show all" unless you pass `allValue` explicitly.',
      'Dim state rides a `data-dim="true"` attribute, never a `classes` key (state is not a class key) — target it as `[data-dim="true"]`.',
      'The `row` slot is the only way past the fixed `id · name · kind` layout; the dim-not-hide behavior is welded to the rail, not to the row renderer.',
    ],
    perf: [
      'Pure re-render filtering — no measurement, no virtualization. For hundreds of rows, virtualize outside and let the rail render the visible window.',
    ],
    customizeExtra: ['A richer row keeps the contract (`row`, `dim`) and restyles the part.'],
    customizeCode: `const Row = ({ row, dim }: { row?: FilterRow; dim?: boolean }) => (…);

<FilterRail slots={{ row: Row }} … />`,
    previewHeight: 300,
  },

  'console-nav': {
    intro:
      'The bilingual nav: kanji over an English label. `boxed` stacks full buttons with the current item inverted to a mint fill; `rail` is the compact app-shell form.',
    use: ['boxed for a landing or section switcher; rail for the sidebar of a ConsoleFrame.'],
    avoid: ['Lowercase labels, and dropping the kanji — the bilingual pairing is structural, not decorative.'],
    edge: [
      CONVENTIONS.spread,
      'Controlled only (`value` + `onChange`); `aria-current` marks the active item in both variants.',
      'The root is a `<nav>`; `ariaLabel` names it. Passing `aria-label` through the spread as well would duplicate it — use the prop.',
    ],
    perf: ['Static.'],
    a11y: ['Renders as a real nav with aria-current on the active item; ariaLabel names the group.'],
  },

  'site-header': {
    intro: 'The sticky masthead: the diamond brand mark, wordmark, version, nav links, and an actions slot.',
    use: ['Landing pages and marketing surfaces. In-app shells use ConsoleFrame’s header region instead.'],
    avoid: [
      'Passing hash-router routes as links — in-page `#anchor` hrefs are intercepted and smooth-scrolled, which collides with `#/route` routing.',
    ],
    edge: [
      CONVENTIONS.spread,
      'Only `#anchor` hrefs are intercepted (via `document.querySelector` on click); anything else behaves as a normal link. A missing anchor target falls through to the browser.',
      'The bar is a hard container (`overflow: hidden`): the wordmark truncates, and no consumer content can push the page wider than the viewport.',
      'Nav links hide below `md`; `actions` then takes the right edge on its own.',
    ],
    perf: [
      'Sticky positioning + a static glow; there are no scroll listeners — anchor scrolling happens on click only.',
      '`slots.brand` swaps the whole lockup (default `Brand`); the shrink-against-the-bar styling belongs to the header, not to the slot.',
    ],
    previewHeight: 200,
  },

  brand: {
    intro: 'The brand lockup: a glowing mint diamond mark, the wordmark in condensed caps, and an optional version tag.',
    use: ['SiteHeader, app-shell rails, footer mastheads.'],
    edge: [
      CONVENTIONS.spread,
      'The wordmark is the only elastic part: it truncates (`text-overflow: ellipsis`) rather than forcing the bar wider — give the parent a bounded width.',
      '`stackVersion` moves the version under the wordmark and drops the inline one.',
    ],
    perf: ['Static.'],
  },

  'wiki-link': {
    intro: 'A `[[wikilink]]`-style cross reference: dashed mint underline that inverts to solid mint on hover.',
    use: ['Cross references in wiki/article surfaces.'],
    edge: [
      CONVENTIONS.spread,
      'The root element changes with the props: an `<a>` when `href` is given, otherwise a `<button>`. The props type is anchored to the anchor case.',
      'No `target`/`rel` handling — pass them through the spread if you need external-link behavior.',
    ],
    perf: ['Static.'],
  },

  /* ---------------------------------------------------------- Feedback */
  'hazard-prompt': {
    intro:
      'The oversized decision surface: a giant kanji verb over a punched-out band carrying the English action. The loudest affordance in the system — one per screen at most.',
    use: ['The single decisive act on a screen: dispatch, commit, launch.'],
    avoid: ['More than one per screen, or anything routine. Loudness only works if it is rare.'],
    edge: [
      CONVENTIONS.spread,
      'The activation flash is a one-frame `filter: invert(1)` cleared by a timeout; under reduced motion the timer is cleared and the flash never fires.',
      'Focusable with `role="button"` + `tabIndex=0`; Enter and Space both fire `onDecide` (Space’s default scroll is prevented).',
      'The red surface is full-bleed at the given `height` — its type does not scale with `height`, so very short heights clip the kanji box.',
    ],
    perf: ['Static between activations: one timeout, cleared on unmount and on reduced-motion changes.'],
    a11y: ['Operable by click, Enter, and Space, with a visible focus ring.'],
    previewHeight: 260,
  },

  'gate-decision-dialog': {
    intro:
      'The full-screen human-in-the-loop gate: a giant kanji verb over approve / deny / defer, focus-trapped, with the item under review named on the ITEM line.',
    use: [
      'A decision that must block the operator — an irreversible action, a policy gate.',
      'Omit onClose to force a choice: Escape and backdrop dismissal are then ignored.',
    ],
    avoid: [
      'Anything reversible or low-stakes — use ApprovalBar inline instead.',
      'Stacking it over another overlay. One focal job, one open dialog.',
    ],
    edge: [
      'Renders through MUI `Modal`, i.e. a portal at `document.body`: theme CSS vars still apply (they are emitted on `:root`), but a consumer wrapper’s scoped CSS, stacking context, or `sx` on an ancestor will not reach it.',
      'It deliberately takes no `sx` prop (the 2.1 inventory finding) — restyle through `classes` (root · rail · marker) or the generated `NervGateDecisionDialog-*` classes.',
      'Omitting `onClose` makes Escape and backdrop dismissal inert; the only exits are the three decisions.',
      'The corner GATE markers blink unconditionally via CSS keyframe (`nervBlink`) — the global `prefers-reduced-motion` guard in CssBaseline (animation duration ~0) is what settles them, not the hook.',
    ],
    perf: ['Nothing renders while `open` is false (the Modal mounts its children on demand); focus moves to APPROVE on open.'],
    a11y: [
      'Focus is trapped while open and restored on close.',
      'Each decision is a real button, so the whole gate is keyboard-operable.',
      'The overlay carries `aria-label="Gate decision required"`; the ITEM line names what is being decided.',
    ],
    customizeNoSx: true,
    customizeExtra: [
      'No `sx` prop by design (the 2.1 inventory finding) — restyle through `classes` or the theme-wide override below.',
      'Inside the Modal portal, style `root` for the shell; `rail` holds the three decision columns and `marker` the corner GATE stamps.',
    ],
    customizeCode: [
      '// No `sx` prop on this component — restyle per instance with classes:',
      '<GateDecisionDialog classes={{ root: "my-gate", rail: "my-gate-rail", marker: "my-gate-marker" }} … />',
      '',
      '// Theme-wide — extra global rules via GlobalStyles; one-class selectors, no !important.',
      '// (Do not spread MuiCssBaseline over the theme: it would replace the built-in',
      '//  blink keyframes, CRT pass, and reduced-motion guard.)',
      '<GlobalStyles',
      '  styles={{',
      '    ".NervGateDecisionDialog-rail": { /* token-driven values only */ },',
      '    ".NervGateDecisionDialog-marker": { /* token-driven values only */ },',
      '  }}',
      '/>',
    ].join('\n'),
  },

  'approval-bar': {
    intro:
      'The inline gate: a caption, the item awaiting approval, and approve/deny buttons that collapse into a verdict once a decision is made.',
    use: [
      'Directly under the log or diff the operator is judging — the context stays on screen.',
      'Pass verdict once decided; the buttons disable and the outcome is stamped in place.',
    ],
    avoid: ['A blocking, irreversible decision — that earns the full GateDecisionDialog.'],
    edge: [
      CONVENTIONS.spread,
      'State is owned by the parent: `verdict` (or its absence) is the only decision record, so re-rendering with it cleared re-opens the gate.',
      'Once decided, both buttons disable and stop blinking; the verdict text is colored by `verdict.ok` (mint/red).',
      'The approve button’s blink is gated by the *global* reduced-motion guard (CssBaseline), not the hook — it settles without JS involvement.',
    ],
    perf: ['No timers of its own beyond the CSS blink.'],
  },

  'yes-no-gate': {
    intro: 'The big binary call-to-action for brand surfaces — two oversized buttons that resolve into a response.',
    use: ['A landing page’s single decisive CTA.'],
    avoid: ['In-app decisions — those are ApprovalBar or GateDecisionDialog.'],
    edge: [
      CONVENTIONS.spread,
      'Selection is internal — there is no `value` prop; react to `onDecide`. Each button carries `aria-pressed`, and the response line is `aria-live="polite"` with a reserved `min-height` so the layout never jumps.',
      'Passing neither `yesResponse` nor `noResponse` leaves the live region empty after a click — always pass both.',
    ],
    perf: ['Static; selection is a plain state flip.'],
    previewHeight: 260,
  },

  /* -------------------------------------------------------- Data viz */
  'segmented-meter': {
    intro:
      'The signature multi-column level meter: discrete lit segments per column against a threshold line, with an axis on the left and column labels beneath. Self-animates when uncontrolled; pass values to drive it from real data.',
    use: [
      'A handful of parallel channels read at a glance — never for a single value (use SegmentBar or MeterBar).',
      'limitPct draws the threshold the operator actually cares about.',
    ],
    avoid: ['A continuous fill. The segmentation is the point — it reads as instrumentation, not a progress bar.'],
    edge: [
      CONVENTIONS.spread,
      'Uncontrolled it jitters around `defaultValues`; passing `values` stops the timer. Values clamp into `[3, segments]` while animating.',
      'Segment hue is positional, not a `tone`: above 70% of full scale a segment reads red, above 50% amber — the alarm is baked into the geometry.',
      '`limitPct` is a drawn marker (line + LIMIT chip), not a fill boundary.',
    ],
    perf: ['One 600ms interval when uncontrolled; segments are plain boxes with linear transitions — no per-frame JS.'],
    previewHeight: 300,
    a11y: ['Passing values stops the internal timer, so a controlled meter has no motion to suppress.'],
  },

  'radial-gauge': {
    intro:
      'A segmented arc with a big center readout. Self-animates near full when uncontrolled; pass `value` for real data.',
    use: ['One headline percentage — armed level, buffer, completion.'],
    edge: [
      CONVENTIONS.spread,
      'Uncontrolled it drifts between 90–100% every 1.4s; passing `value` stops the timer. The reading is rounded for display.',
      '`slots.track` replaces the whole `<svg>` — a custom track owns the entire drawing; the `paths` geometry and the lit math stay internal and are not passed to the slot.',
      '`slots.readout` receives the contract (`value`, `label`) — a custom readout takes those props, not the built-in’s styling.',
    ],
    perf: [
      'The arc path list is a `useMemo` keyed on `segments` — it is not recomputed per tick.',
      'One 1400ms interval when uncontrolled; a controlled gauge is static SVG.',
    ],
    customizeExtra: ['Slot recipe (MUI Core convention — consumer props win, the generated class is appended).'],
    customizeCode: `<RadialGauge value={76}
  slotProps={{ readout: { label: "BUFFER" } }}
  slots={{ readout: ({ value, label }) => <Stack>{value}% · {label}</Stack> }} />`,
  },

  'bar-column-gauge': {
    intro: 'A horizontal LED bar over a column histogram — the paired channel readout from the landing page.',
    use: ['Ambient telemetry beside a named metric.'],
    edge: [
      CONVENTIONS.spread,
      'Passing only one of `columns`/`bar` still runs the internal timer: the controlled value stays pinned while the other keeps animating. Pass both to stop it.',
      'Column heights are 0..10 and the bar fill is 0..18 — the scales are internal, so normalize your data before passing it.',
    ],
    perf: ['One 900ms interval while partially uncontrolled; no canvas, no per-frame JS.'],
  },

  'progress-meter': {
    intro:
      'A horizontal progress meter drawn as discrete LED segments, with an optional threshold/gate line rendered as its own object. Fills in mechanical steps on mount.',
    use: ['Task/pipeline completion rows, with an ETA in `readout`.'],
    edge: [
      CONVENTIONS.spread,
      'The stepped fill re-runs whenever `value` changes — including resetting to 0 and climbing again. Pass `animated={false}` for a static readout that always renders at `value`.',
      'Under reduced motion the meter renders at `target` immediately (no mount animation, no interval).',
      '`threshold` is a drawn marker at `threshold.pct` — it annotates the fill, it does not gate it.',
    ],
    perf: ['One interval at 90ms for at most `segments` ticks per fill; it clears itself when the fill reaches the target.'],
    customizeExtra: ['`classes` covers root · marker (the threshold line + its label).'],
  },

  'health-columns': {
    intro: 'A tiny system-health readout: stepped mini columns, mostly nominal, with occasional amber peaks.',
    use: ['Header/status-bar ambience that reads as instrumentation.'],
    edge: [
      CONVENTIONS.spread,
      'It repaints *random* data every 700ms while `animated` — this is a demo readout, not a chart you feed. Under reduced motion it holds the first sample.',
      '`onSummary(lit, total)` fires on every repaint and on mount; keep the callback stable or the effect re-fires each render.',
    ],
    perf: ['A 700ms interval when animated; the DOM version is `columns × cells` small boxes.'],
  },

  'segment-bar': {
    intro: 'A compact horizontal progress bar drawn as discrete lit segments — the inline counterpart to ProgressMeter.',
    use: ['`PROGRESS … 62%` rows inside TaskCard or a stat line.'],
    edge: [
      CONVENTIONS.spread,
      '`value` is not clamped — an over-range value lights every segment (the math rounds); clamp upstream if the readout matters.',
      '`tone` colors the lit segments; there is no threshold marker here (that is ProgressMeter).',
    ],
    perf: ['Static: `segments` boxes, no timers, no transitions.'],
  },

  'led-column': {
    intro: 'A single vertical LED column that fills from the bottom — the vertical counterpart to SegmentBar.',
    use: ['Draining gauges: fuel, freshness, reservoir.'],
    edge: [
      CONVENTIONS.spread,
      '`hotBelow` is the alarm: under that percentage the lit segments switch to the critical hue (and glow harder). Omit it and the column never alarms.',
      'Fixed `width`/`height` (44×104 default) — resize via the props, not `sx` on the root (the segments flex inside).',
    ],
    perf: ['Static; transitions are linear opacity/background on the segments.'],
  },

  'meter-bar': {
    intro:
      'The one sanctioned continuous fill — a labelled horizontal track with a readout, for vitals dense enough that segmentation would be noise.',
    use: ['Rows of compact vitals. warn forces the caution fill regardless of tone.'],
    avoid: ['Using it where a segmented meter fits — discrete segments are the house default.'],
    edge: [
      CONVENTIONS.spread,
      '`pct` clamps to 0..100 when setting the fill width; `warn` overrides `tone` rather than blending with it.',
      'This is the only continuous fill in the library — using it as a general progress bar breaks the instrumentation grammar.',
    ],
    perf: ['Static; a fill-width change is a linear CSS transition (no JS animation).'],
  },

  /* ------------------------------------------- Terminal · clock · charts */
  terminal: {
    intro:
      'The diagnostic readout — dot-leader check rows, rules, notes, and timestamped exec lines, typed in one row at a time. Where LogConsole streams live output, Terminal reports a finished sequence.',
    use: [
      'Boot sequences, self-checks, verification passes — anything with a pass/fail per line.',
      'Set typewriter={false} for a static transcript.',
    ],
    avoid: ['A live tailing feed — that is LogConsole.'],
    edge: [
      CONVENTIONS.spread,
      'The typewriter restarts whenever the `rows` array identity changes — pass a stable array (module constant, state, or `useMemo`), not an inline literal, or the log re-types on every parent render.',
      'Reduced motion or `typewriter={false}` prints every row at once and never starts the interval.',
      '`title` is the header caption, not the DOM `title` (omitted from the attributes type); `maxBodyHeight` scrolls, `"none"` grows.',
    ],
    perf: [
      'One interval at `speed` ms until the last row, then it clears itself; auto-scroll writes `scrollTop` per row.',
      'Module weight: `components/terminal.tsx` — 2.7 kB gzip (docs/bundle-budgets.md).',
    ],
    previewHeight: 300,
    a11y: ['The typewriter reveal is skipped under prefers-reduced-motion; all rows render at once.'],
  },

  'log-console': {
    intro:
      'The streaming feed: tagged rows ([INFO] / [WARN] / [GIT] / [GATE]) or tagless rows colored by tone, auto-scrolled to the newest line, with an optional prompt row.',
    use: [
      'Any live output — agent stdout, a build log, an event stream. Push rows onto the array and it scrolls itself.',
      'status overrides the connection label: pass TAILING / PAUSED to reflect what the operator did.',
      'Pair with ApprovalBar underneath when the log ends in a decision.',
    ],
    avoid: ['Hand-building a log from Typography rows — this is the house recipe, including the auto-scroll.'],
    edge: [
      CONVENTIONS.spread,
      'Presentational only — there is no internal buffer or queue; the parent owns the rows array.',
      'Auto-scroll jumps to the newest row on every `rows` change; the operator’s scroll position is not preserved (no scroll-lock).',
      'The body is `role="log"` with `aria-live="polite"`, so streamed rows are announced — cap your update rate accordingly.',
    ],
    perf: ['No timers: rendering is the row list; the cursor blink is pure CSS.'],
    previewHeight: 300,
    a11y: ['The cursor stops blinking under prefers-reduced-motion.'],
  },

  'seven-seg-clock': {
    intro:
      'The tactical clock in two seven-segment skins: a paper timestamp chip and a glowing orange readout. Pass `digits` to drive it from an arbitrary `HHMMSS` value.',
    use: ['Masthead clocks, uptime/elapsed counters.'],
    edge: [
      CONVENTIONS.spread,
      '`digits` replaces the displayed value (6 characters, `HHMMSS`) and drops the AM/PM tag — non-digit characters fall through the segment map as blanks.',
      'The chip skin is 12-hour (`h % 12 || 12`), the countdown skin 24-hour.',
      'Colons dim on the off-tick; under reduced motion they hold lit.',
    ],
    perf: [
      'One 500ms interval drives both skins — and it keeps running even when `digits` replaces the display, so a bank of clocks re-renders twice a second each. Mount one and derive the rest.',
      'Each digit is a small SVG polygon set — cost scales with digit count, not with time.',
    ],
    customizeExtra: ['`classes` covers root · chip · countdown; restyle a skin per part rather than unmounting one.'],
  },

  'digital-clock': {
    intro: 'A lightweight tabular-numeral wall clock (`HH:MM:SS`) with 1 Hz blinking colons — the header/nav clock.',
    use: ['Nav bars, headers. For the seven-segment skins use SevenSegClock.'],
    edge: [
      CONVENTIONS.spread,
      'Reads the client clock — server-rendered HTML hydrates to a different time; render it client-side.',
      'The root carries `aria-label="system clock"`; the text is the accessible value.',
    ],
    perf: ['One 500ms interval re-rendering a text node; colons blink via the `nervBlink` keyframe (hook-gated, settles lit).'],
  },

  marquee: {
    intro: 'A red hazard ticker: a linearly scrolling strip of status items, duplicated for a seamless loop.',
    use: ['Alarm/status tickers across the top of a brand surface.'],
    edge: [
      CONVENTIONS.spread,
      'Under reduced motion the animation stops *and* the duplicated half of the track is not rendered — the static row is the real content, so keep `items` readable on its own.',
      'The strip never wraps: long item lists widen the track and the root clips them (`overflow: hidden`).',
    ],
    perf: [
      'Pure CSS: one linear infinite `translateX` on a duplicated track — no JS per frame, no timers.',
      'Module weight: `components/marquee.tsx` — 1.2 kB gzip, the lightest animated component (docs/bundle-budgets.md).',
    ],
  },

  'line-chart': {
    intro: 'A glowing sparse trend line over a dotted field, drawn on a canvas that repaints itself.',
    use: ['Ambient telemetry behind a label — a live field, not a data chart.'],
    edge: [
      CONVENTIONS.spread,
      'The series is internal random-walk state — there is no `data` prop. For real series bring your own chart; this one is scenery that stays on-palette.',
      'Under reduced motion exactly one frame is drawn and the repaint interval never starts.',
      'Canvas content is invisible to assistive tech — the corner caption (label · status) is the accessible text.',
    ],
    perf: [
      'Repaints every 140ms on a small canvas, DPR-aware, with a `resize` listener — all cleaned up on unmount.',
      'Module weight: `components/charts.tsx` — 2.7 kB gzip including Waveform and ScanLattice (docs/bundle-budgets.md).',
    ],
    customizeExtra: ['`classes` covers root · caption; the drawing is canvas — restyle it by supplying your own component, not CSS.'],
  },

  waveform: {
    intro: 'A braided oscilloscope separator: ten phase-shifted lines animating across a hairline axis.',
    use: ['Section separators on landing pages.'],
    edge: [
      CONVENTIONS.spread,
      'Reduced motion draws a single static frame (the braid frozen mid-phase) and never starts the interval.',
      '`frame={false}` drops the 1px border for embedding inside an already-bordered band.',
    ],
    perf: ['Repaints every 83ms — the densest canvas in the library; keep to one or two per screen.'],
  },

  'scan-lattice': {
    intro: 'A static schematic grid with a targeting reticle — the "scanning" separator that never actually moves.',
    use: ['Static radar/lattice separators where motion would be noise.'],
    edge: [
      CONVENTIONS.spread,
      'Pure SVG, fully static — there is no reduced-motion path because nothing animates.',
      'The `viewBox` is fixed at 600×110 with `preserveAspectRatio="none"`, so non-default heights stretch the lattice rather than reflowing it.',
    ],
    perf: ['The cheapest data-viz export: static SVG, no effects, no timers.'],
  },

  /* ------------------------------------------------------ Hooks & utils */
  'tone-hue': {
    intro:
      'Resolves a semantic Tone to its canonical theme.nerv.hue value. Components take a tone rather than a hex so a consumer never hardcodes a color off-token.',
    edge: [
      'Exhaustive over `Tone`: adding a tone to the union without a case is a compile error, never a silent `undefined`.',
      'It reads the live theme object — call it inside a callback (`sx={(t) => …}`) rather than memoizing a value across theme changes.',
    ],
    perf: ['A switch statement — effectively free; use it instead of importing token hexes into app code.'],
    customizeExtra: ['Call it inside a style callback instead of importing a token hex into app code.'],
    customizeCode: 'sx={(t) => ({ color: toneHue(t, "mint") })}   // never hardcode the hex',
  },

  'use-reduced-motion': {
    intro:
      'The live prefers-reduced-motion flag. Every animated component in the library reads it — or settles via the global CssBaseline guard — so the final frame renders when true.',
    edge: [
      'SSR/hydration: the initializer guards `typeof matchMedia !== "undefined"`, so a server render always reports `false` (full motion). A client first render can then differ in blink/animation state only — cosmetic, and invisible in the client-rendered Vite apps this repo ships.',
      'It is live: the hook subscribes to `change`, so toggling the OS setting updates every mounted consumer.',
    ],
    perf: ['One `matchMedia` listener per hook instance; reading the flag is a state read.'],
    customizeExtra: ['Gate any animation you write yourself — the reduced-motion contract is a design rule, not a nicety.'],
    customizeCode: `const reduced = useReducedMotion();
// …
animation: reduced ? "none" : \`nervMarquee \${speedSec}s linear infinite\``,
  },

  pad2: {
    intro: 'Zero-pad a number to two digits (`7` → `"07"`).',
    edge: ['Values ≥ 100 pass through unpadded (`123` → `"123"`); negatives keep their sign.'],
    perf: ['A single `String.padStart`.'],
    customizeCode: 'import { pad2 } from "phosphor-console-theme/components";\n\npad2(7);            // "07"\n`GATE·${pad2(n)}`   // "GATE·04"',
  },
};