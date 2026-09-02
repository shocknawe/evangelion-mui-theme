## 1. Token module split & extension contract (FR-3)

- [x] 1.1 Split `theme/` so tokens and component overrides are separately importable modules; keep `theme/tokens.ts` as the single source of truth
- [x] 1.2 Verify no off-token hex/size/timing values remain in `theme/` or `components/` (grep audit; fix or tokenize any strays)
- [x] 1.3 Add an "Extending the theme" section to `theme/README.md` with a runnable shallow-spread example and a named "do not deep-merge" anti-pattern
- [ ] 1.4 Confirm no deep-merge helper is exported; `app/` and `doc-site/` still build against the split modules

## 2. Component inventory & customization classification (FR-1)

- [ ] 2.1 Inventory every `components/*` export; classify each as `simple-props`, `slots`, or `composition-only`
- [ ] 2.2 Identify any existing `*Component/*Props`-style APIs to migrate; record the slot-candidate list (track/needle, header, leading/trailing, etc.)
- [x] 2.3 Record the classes/class-naming decision (`Nerv*` shape, `root` key) in the change for implementers

## 3. Strict API conventions (FR-2)

- [ ] 3.1 Ensure children-first composition on every component; convert fixed-order content props to children where order is permutable
- [ ] 3.2 Spread undeclared props to the root element on every component
- [ ] 3.3 Forward `ref` to the outermost DOM node on every component that renders one
- [ ] 3.4 Add a `classes` prop (root key = `root`, stable keys) to every public component
- [ ] 3.5 Flatten override selectors to single-class specificity so consumer overrides win without `!important`
- [ ] 3.6 Add tests asserting prop-spread, ref forwarding, and `classes` application per component

## 4. Slot APIs where warranted (FR-1)

- [ ] 4.1 Add `slots`/`slotProps` (MUI Core convention) to the slot-candidate components from 2.2
- [ ] 4.2 Migrate any `*Component/*Props` pairing to `slots`/`slotProps`; keep old props working with a deprecation notice for one release
- [ ] 4.3 Verify all custom variants (Button `ghost`/`alt`/`stamp`, Chip `stamp`, Paper `chamfer`/`frame`, Typography) render with no visual regression across `app/` routes (screenshot check)

## 5. Bundle budgets in CI (FR-4)

- [ ] 5.1 Add `size-limit` config measuring gzip bytes of the theme and each component entry
- [ ] 5.2 Commit a version-controlled budget table seeded from first measured numbers
- [ ] 5.3 Document the shared-runtime accounting rule (theme singleton / Emotion cache counted once)
- [ ] 5.4 Wire CI to fail on over-budget exports unless the same PR bumps the budget entry; verify both fail and pass paths

## 6. Accessibility audit in CI (FR-5)

- [ ] 6.1 Add axe-core to `app/` test tooling; run it against every component's live-example route
- [ ] 6.2 Map each component to its WAI-ARIA pattern (meter, `progressbar`, `feed`, `switch`/radio, modal focus) and assert required roles/states/keyboard
- [ ] 6.3 Add reduced-motion checks asserting final-state rendering for at least one path per animated component
- [ ] 6.4 Publish `docs/a11y.md` with the pattern pass rate (target ≥10/11), known gaps, severities, and remediation plans

## 7. Agent-readiness artifacts (FR-7)

- [ ] 7.1 Add build-time DTCG codegen generating `dist/tokens.dtcg.json` from `theme/tokens.ts`
- [ ] 7.2 Generate `registry.json` listing each component's name, props summary, tokens consumed, and example route
- [x] 7.3 Publish `llms.txt` at the docs-site root indexing curated LLM-consumable pages
- [ ] 7.4 Expand `doc-site/` + `theme/README.md` per-component docs to cover edge cases, performance notes, and a customization recipe
- [ ] 7.5 Score the agent-readiness rubric and confirm ≥4/5 (llms.txt + DTCG + registry present)

## 8. Maturity scorecard (FR-6)

- [ ] 8.1 Author `docs/maturity-scorecard.md`: CMM L0–L5 across 20 categories (10 system, 10 UX), each 0–5
- [ ] 8.2 Apply evidence weighting (prose ≤40, structural ≤40, verification +≤20) and score current state
- [ ] 8.3 Record the baseline score and wire a per-release refresh step that logs deltas

## 9. Verification & wrap-up

- [ ] 9.1 Run full build + typecheck for `theme/`, `app/`, and `doc-site/`; all green
- [ ] 9.2 Confirm all new CI gates (size-limit, axe-core) pass on the branch
- [ ] 9.3 Confirm no visual identity, token value, or variant changes shipped (diff review against constraints)
