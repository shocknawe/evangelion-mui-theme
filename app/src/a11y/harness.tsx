/**
 * Task 6.1 — the axe-core audit harness.
 *
 * Mounts the app's own live-example routes (Design decision D5: the routes in
 * `app/src/App.tsx` ARE the component examples) inside the canonical Phosphor
 * Console theme, runs axe-core over the rendered document, and classifies the
 * result.
 *
 * jsdom limitation (documented for Task 6.4): jsdom implements no layout engine
 * and no CSS cascade, so axe cannot compute geometry-dependent checks — most
 * importantly `color-contrast` (disabled in `axe-config.ts`, along with
 * `hidden-content` and `css-orientation-lock`). Focus order, pointer-target
 * spacing and visual overflow are therefore out of scope here; a Playwright run
 * against `vite preview` would be the upgrade path if those are ever needed.
 */
import { cleanup, render } from '@testing-library/react';
import axe from 'axe-core';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@theme';
import App from '../App';
import { AXE_RUN_OPTIONS, BLOCKING_IMPACTS } from './axe-config';
import type { ImpactValue, Result } from 'axe-core';

/**
 * Mount `<App />` at `path` (the routes are client-side, so we set the History
 * API path that `useRoute` reads) and return axe's violations for the whole
 * document — including MUI portals, which render outside React's container.
 */
export async function auditRoute(path: string): Promise<Result[]> {
  const { pushState } = window.history;
  const previous = window.location.pathname;
  pushState.call(window.history, {}, '', path);
  // The live examples own ticking clocks (SevenSegClock, DigitalClock,
  // SegmentedMeter). Their setInterval updates fire outside act() while axe
  // runs, so leave the act environment for the audit window only.
  const actEnv = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
  actEnv.IS_REACT_ACT_ENVIRONMENT = false;
  try {
    render(
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <App />
      </ThemeProvider>,
    );
    const results = await axe.run(document.body, AXE_RUN_OPTIONS);
    return results.violations;
  } finally {
    actEnv.IS_REACT_ACT_ENVIRONMENT = true;
    cleanup();
    document.body.innerHTML = '';
    pushState.call(window.history, {}, '', previous);
  }
}

export interface ClassifiedViolation {
  id: string;
  impact: Exclude<ImpactValue, null> | 'unknown';
  help: string;
  /** Selector targets plus a truncated HTML snippet for the offending nodes. */
  nodes: string[];
  html: string[];
}

export function classify(violations: Result[]): {
  blocking: ClassifiedViolation[];
  recorded: ClassifiedViolation[];
} {
  const toRecord = (v: Result): ClassifiedViolation => ({
    id: v.id,
    impact: v.impact ?? 'unknown',
    help: v.help,
    nodes: v.nodes.map((n) => n.target.join(' ')),
    html: v.nodes.map((n) => n.html.slice(0, 240)),
  });
  return {
    blocking: violations
      .filter((v) => BLOCKING_IMPACTS.has(v.impact ?? 'unknown'))
      .map(toRecord),
    recorded: violations
      .filter((v) => !BLOCKING_IMPACTS.has(v.impact ?? 'unknown'))
      .map(toRecord),
  };
}

/** Human-readable one-line-per-violation summary for test output / Task 6.4. */
export function formatViolations(route: string, violations: ClassifiedViolation[]): string {
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node(s)) on ${route}\n    ${v.nodes
          .slice(0, 5)
          .join('\n    ')}${v.html.length ? `\n    e.g. ${v.html[0]}` : ''}`,
    )
    .join('\n');
}