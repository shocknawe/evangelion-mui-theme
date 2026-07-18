# Product

## Register

product

## Users

Front-end developers adopting the system to build tactical, on-brand UI. The primary consumer is a developer who installs the tokens and components and assembles NERV/MAGI-styled screens — dashboards, forms, wikis, command consoles — without re-deriving the visual grammar each time. Their context is a build session: they want copy-paste-ready primitives, a clear token contract, and rules strict enough that anything they assemble still reads as one system.

Secondarily, the system powers **brand/showcase surfaces** (the two landing pages) where the design *is* the product. The default register is `product` because that's who the library serves most, but the tokens and components are dual-use.

## Product Purpose

A reusable, Evangelion-inspired **tactical UI system** — design tokens plus a component library — for building distinctive command-console interfaces fast. It exists to make an anime-terminal aesthetic (the NERV/MAGI screens of *Neon Genesis Evangelion*) into something rigorous and buildable, not a one-off costume. The shipped dashboards, forms, and wiki are reference implementations that prove the system holds together across real app surfaces.

Success looks like: a developer can build a new screen from the tokens and components and it is indistinguishable in grammar from the reference implementations — same inversion states, same stepped motion, same bilingual stamps — with zero palette drift and no accessibility regressions.

## Brand Personality

**Bold, confident, distinctive.** The system has strong opinions and enforces them; it is unmistakably not-SaaS and willing to be loud exactly where loudness is earned. Voice is that of a design director issuing directives — "prohibited," "never," "always," not "consider." It is memorable by commitment, not by decoration: one signature element carries each screen while everything around it stays disciplined. The tone is a working instrument reporting, not an app performing.

## Anti-references

The identity is guarded by what it refuses to be:

- **Cyberpunk-neon cliché.** No purple/cyan gradients, no glassmorphism, no glow-for-glow's-sake, no Blade-Runner-by-numbers. The glow here is *phosphor* — luminance on true black graded red > orange > green — never decorative neon.
- **Costume-only Eva skin.** Kanji, scanlines, and CRT effects must be **structural grammar** (figure/ground inversion, stepped motion, boxed bilingual stamps, drawn thresholds), never decoration pasted onto a conventional UI. If you could delete the theme and have a normal app underneath, it failed.
- **Generic SaaS / Linear-cream.** Implied by "unmistakably not-SaaS": no soft-gray neutral surfaces, no rounded cards with subtle drop shadows, no Inter-everywhere, no gentle eased transitions. Familiarity is explicitly *not* the goal.
- **Overwrought maximalism.** Not everything blinking, glowing, and animating at once. Restraint is the discipline — one signature per screen.

## Design Principles

1. **Grammar over costume.** The theme is structural, not applied. Inversion states, stepped motion, drawn thresholds, and boxed bilingual stamps are how the UI *works*, not how it's decorated. If the aesthetic can be peeled off and leave a normal app, it wasn't real.
2. **Enforce, don't suggest.** The system exists so screens can't drift. Color means state, orange means chrome, black is the only surface — these are rules the components hold, not options a builder weighs each time.
3. **One signature, disciplined surround.** Spend boldness in one memorable element per screen (a giant kanji, a decision alarm, a segmented meter) and keep everything else quiet. Loud-everywhere reads as slop.
4. **Report, don't perform.** Motion conveys machine state — a segment filled, a gate resolved, a check passed — never ambience. It is mechanical (stepped, blinked, snapped), because a console reports and an app animates.
5. **Distinctive and accountable.** Being unmistakable is the point, but never at the cost of legibility or access. The aesthetic risk is paid for with contrast, focus, and reduced-motion discipline — commitment and craft are not in tension.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**, held as a real bar rather than an afterthought:

- Body text ≥ 4.5:1 against its background; large/bold text ≥ 3:1. (Mint, amber, and orange on `#0A0A0A` clear this comfortably; the danger reds are used for large/boxed elements, not fine body text.)
- Visible keyboard focus on every interactive control (`:focus-visible`, never removed without a replacement ring).
- `prefers-reduced-motion` is honored on every animation — in both CSS and JS — killing blinks, strobes, marquees, and flicker while rendering the final settled state. Non-negotiable, and already built into every shipped file.
- Status is reinforced by more than hue where it can be: semantic colors travel with a boxed kanji + English stamp, so a state is legible without relying on color discrimination alone. Strengthen this toward full color-blind safety as the library grows.
