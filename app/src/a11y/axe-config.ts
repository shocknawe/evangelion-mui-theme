import type { RunOptions } from 'axe-core';

/**
 * axe-core run configuration for the harness.
 *
 * Disabled rules — each is an environment artifact of jsdom, not a judged pass:
 *
 * | rule                | impact   | why it is off                                              |
 * |---------------------|----------|------------------------------------------------------------|
 * | color-contrast      | serious  | jsdom has no layout engine / CSS cascade, so axe cannot     |
 * |                     |          | resolve computed colors (and our palette lives in CSS      |
 * |                     |          | variables). Contrast is verified by the WCAG token work    |
 * |                     |          | in Task 6.4's docs, not here.                              |
 * | hidden-content      | minor    | needs real layout to decide what is "hidden".              |
 * | css-orientation-lock| serious  | needs a real CSS engine to evaluate media queries.         |
 *
 * Everything else runs at axe defaults (WCAG 2.x A/AA + best practice).
 * Critical/serious violations fail the suite; moderate/minor are recorded.
 */
export const AXE_RUN_OPTIONS: RunOptions = {
  resultTypes: ['violations', 'incomplete'],
  rules: {
    'color-contrast': { enabled: false },
    'hidden-content': { enabled: false },
    'css-orientation-lock': { enabled: false },
  },
};

/** Impact levels that fail the suite (Task 6.1 acceptance: critical + serious). */
export const BLOCKING_IMPACTS = new Set(['critical', 'serious']);