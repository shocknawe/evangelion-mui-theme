/**
 * Per-component prose the generated metadata can't express: a richer overview,
 * use/avoid guidance, and accessibility notes.
 *
 * The playground seed lives in `examples.ts`; the description and props table
 * come from the generated site data. Every field here is optional — a component
 * page renders whatever is present, so this file is additive by design and never
 * needs to keep pace with the export list.
 */

export interface DocMeta {
  /** Richer overview than the JSDoc one-liner. */
  intro?: string;
  use?: string[];
  avoid?: string[];
  a11y?: string[];
  /** Min height for the playground preview pane (px). */
  previewHeight?: number;
}

export const registry: Record<string, DocMeta> = {
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
    a11y: [
      'Color never carries the meaning alone — the label text always says the state too.',
      'blink is suppressed under prefers-reduced-motion; the stamp settles lit.',
    ],
  },

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
    previewHeight: 460,
    a11y: [
      'The regions render as header / nav / main / aside / footer landmarks, so screen readers get the shell structure for free.',
      'The alarm state is a visual amplifier — pair it with a text status in the footer so it is not color-only.',
    ],
  },

  'log-console': {
    intro:
      'The streaming feed: tagged rows ([INFO] / [WARN] / [GIT] / [GATE]) or tagless rows colored by tone, auto-scrolled to the newest line, with an optional prompt row hosting a blinking cursor.',
    use: [
      'Any live output — agent stdout, a build log, an event stream. Push rows onto the array and it scrolls itself.',
      'status overrides the connection label: pass TAILING / PAUSED to reflect what the operator did.',
      'Pair with ApprovalBar underneath when the log ends in a decision.',
    ],
    avoid: ['Hand-building a log from Typography rows — this is the house recipe, including the auto-scroll.'],
    previewHeight: 300,
    a11y: ['The cursor stops blinking under prefers-reduced-motion.'],
  },

  terminal: {
    intro:
      'The diagnostic readout — dot-leader check rows (LABEL ....... OK), rules, notes, and timestamped exec lines, typed in one row at a time. Where LogConsole streams live output, Terminal reports a finished sequence.',
    use: [
      'Boot sequences, self-checks, verification passes — anything with a pass/fail per line.',
      'Set typewriter={false} for a static transcript.',
    ],
    avoid: ['A live tailing feed — that is LogConsole.'],
    previewHeight: 300,
    a11y: ['The typewriter reveal is skipped under prefers-reduced-motion; all rows render at once.'],
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
    a11y: [
      'Focus is trapped while open and restored on close.',
      'Each decision is a real button, so the whole gate is keyboard-operable.',
    ],
  },

  'approval-bar': {
    intro:
      'The inline gate: a caption, the item awaiting approval, and approve/deny buttons that collapse into a verdict once a decision is made.',
    use: [
      'Directly under the log or diff the operator is judging — the context stays on screen.',
      'Pass verdict once decided; the buttons disable and the outcome is stamped in place.',
    ],
    avoid: ['A blocking, irreversible decision — that earns the full GateDecisionDialog.'],
  },

  'segmented-meter': {
    intro:
      'The signature multi-column level meter: discrete lit segments per column against a threshold line, with an axis on the left and column labels beneath. Self-animates when uncontrolled; pass values to drive it from real data.',
    use: [
      'A handful of parallel channels read at a glance — never for a single value (use SegmentBar or MeterBar).',
      'limitPct draws the threshold the operator actually cares about.',
    ],
    avoid: ['A continuous fill. The segmentation is the point — it reads as instrumentation, not a progress bar.'],
    previewHeight: 300,
    a11y: ['Passing values stops the internal timer, so a controlled meter has no motion to suppress.'],
  },

  'meter-bar': {
    intro:
      'The one sanctioned continuous fill — a labelled horizontal track with a readout, for vitals dense enough that segmentation would be noise (CPU, memory, disk in a footer strip).',
    use: ['Rows of compact vitals. warn forces the caution fill regardless of tone.'],
    avoid: ['Using it where a segmented meter fits — discrete segments are the house default.'],
  },

  'filter-rail': {
    intro:
      'Scope chips over a list whose non-matching rows **dim** rather than disappear. The operator never loses their place or their sense of the whole set.',
    use: ['Any filterable list of typed rows — routines, sinks, gates, memory entries.'],
    avoid: [
      'Hiding filtered rows. Dimming is the rule: removal destroys the operator’s spatial memory of the list.',
    ],
    previewHeight: 300,
  },

  'console-nav': {
    intro:
      'The bilingual nav: kanji over an English label. `boxed` stacks full buttons with the current item inverted to a mint fill; `rail` is the compact app-shell form with a mint left-edge indicator.',
    use: ['boxed for a landing or section switcher; rail for the sidebar of a ConsoleFrame.'],
    avoid: ['Lowercase labels, and dropping the kanji — the bilingual pairing is structural, not decorative.'],
    a11y: ['Renders as a real nav with aria-current on the active item; ariaLabel names the group.'],
  },

  'bilingual-label': {
    intro:
      'The bimodal pairing itself: one large graphic term (kanji, numeral, or heading) with a small caption pinned to it. This is the type rule made into a component — a big glyph must never appear unlabelled.',
    use: ['Any hero term, zone marker, or oversized metric. Give it the en caption every time.'],
    avoid: ['Mid-sized settings. The whole point is the jump between the giant term and the tiny caption.'],
  },

  'field-label': {
    intro: 'The form-control label: a kanji tag over an ALL-CAPS English label, wrapping any themed input.',
    use: [
      'Every console form field. Put the already-themed stock control inside — TextField, Select, Checkbox, Switch, Slider.',
      'Pair with SectionDivider to number the form sections.',
    ],
    avoid: ['A second label on the input itself — that fights the wrapper.'],
    a11y: ['htmlFor wires the label to the control when the child input carries an id.'],
  },

  'section-divider': {
    intro:
      'The numbered form-section head: a solid index chip, a kanji term, and the English title over a fading rule.',
    use: ['Form sections, pipeline stages, the OODA loop — anything that genuinely is a sequence.'],
    avoid: [
      'Numbering a set of unrelated sections. A number claims order; if the order carries no information the eyebrow is noise.',
    ],
  },

  'hazard-prompt': {
    intro:
      'The oversized decision surface: a giant kanji verb over a punched-out band carrying the English action. The loudest affordance in the system — one per screen at most.',
    use: ['The single decisive act on a screen: dispatch, commit, launch.'],
    avoid: ['More than one per screen, or anything routine. Loudness only works if it is rare.'],
    a11y: ['Operable by click, Enter, and Space, with a visible focus ring.'],
    previewHeight: 260,
  },

  'agentic-loop': {
    intro:
      'The OODA loop drawn as a ring of kanji nodes with one lit at a time. Self-cycles when uncontrolled; pass active to drive it from a real agent state machine.',
    use: ['Showing an autonomous process is alive and which phase it is in.'],
    avoid: ['Decorative use on a static page — a moving ring implies something is actually running.'],
    previewHeight: 300,
    a11y: ['The cycle stops under prefers-reduced-motion and settles on the active node.'],
  },

  'dossier-sheet': {
    intro:
      'The spec sheet: a teal-ruled heading over KEY/VALUE rows, an optional rotated watermark, and a signature footer with two ruled lines and a stamp. The system’s "official document" surface.',
    use: ['Landing-page spec blocks, release manifests, anything that should read as filed paperwork.'],
    previewHeight: 340,
  },

  'telemetry-card': {
    intro: 'The standard panel around a gauge: a title/type header, the gauge body, and a two-slot footer.',
    use: ['Every free-floating gauge should be framed by this or GaugeCard — a naked gauge reads as unfinished.'],
    previewHeight: 280,
  },

  'gauge-card': {
    intro:
      'A single-corner-chamfered card that frames one gauge as a monitored channel, tinted end-to-end by the channel’s state hue.',
    use: ['A named channel with a state — a cron job, a watcher, a queue.'],
    previewHeight: 280,
  },

  'status-legend': {
    intro:
      'The key for a screen’s state vocabulary — a row of bilingual stamps, filled where that state is currently active.',
    use: ['At the top of a dense screen, so the operator can decode every hue below it.'],
  },

  'module-card': {
    intro:
      'The product/system grid card: a large kanji mark, a system code pair, a title and body, and a footer with a state stamp and meta.',
    use: ['Landing-page module grids and system inventories.'],
    previewHeight: 300,
  },

  'yes-no-gate': {
    intro: 'The big binary call-to-action for brand surfaces — two oversized buttons that resolve into a response.',
    use: ['A landing page’s single decisive CTA.'],
    avoid: ['In-app decisions — those are ApprovalBar or GateDecisionDialog.'],
    previewHeight: 260,
  },

  'site-header': {
    intro: 'The sticky masthead for landing and brand surfaces: the diamond brand mark, wordmark, version, nav links, and an actions slot.',
    use: ['Landing pages and marketing surfaces. In-app shells use ConsoleFrame’s header region instead.'],
    avoid: [
      'Passing hash-router routes as links — in-page `#anchor` hrefs are intercepted and smooth-scrolled, which collides with `#/route` routing.',
    ],
    previewHeight: 200,
  },

  'tone-hue': {
    intro:
      'Resolves a semantic Tone to its canonical theme.nerv.hue value. Components take a tone rather than a hex so a consumer never hardcodes a color off-token — use this when building your own component on the system.',
  },

  'use-reduced-motion': {
    intro:
      'The live prefers-reduced-motion flag. Every animated component in the library reads it and settles to its final frame when true. Gate any new interval or animation you write behind it — the reduced-motion contract is a design rule, not a nicety.',
  },
};
