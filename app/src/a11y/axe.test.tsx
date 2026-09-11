/**
 * Task 6.1 — CI accessibility audit.
 *
 * Spec: "WHEN the CI accessibility job runs, THEN each public component is
 * rendered in at least one app/ example and audited by axe-core."
 *
 * Two suites:
 *  1. `coverage` — derives the public component list from `@components` and
 *     proves the coverage map (`coverage.ts`) accounts for all of them on real
 *     routes, so a new component with no live example breaks CI.
 *  2. `axe` — mounts every live-example route and runs axe-core. Violations of
 *     impact `critical`/`serious` fail; `moderate`/`minor` are recorded in the
 *     JSON report (consumed by Task 6.4's docs/a11y.md gap list) without
 *     failing.
 */
import { afterAll, describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as Phosphor from '@components';
import { COVERAGE, NON_COMPONENT_EXPORTS, ROUTES } from './coverage';
import { auditRoute, classify, formatViolations, type ClassifiedViolation } from './harness';

interface RouteReport {
  route: string;
  label: string;
  blocking: ClassifiedViolation[];
  recorded: ClassifiedViolation[];
}

const REPORT: { routes: RouteReport[] } = { routes: [] };

/** Every value export of the library that is a component (capitalised). */
const PUBLIC_COMPONENTS = Object.keys(Phosphor)
  .filter((name) => /^[A-Z]/.test(name) && !NON_COMPONENT_EXPORTS.has(name))
  .sort();

describe('a11y coverage (Task 6.1)', () => {
  it('every public @components component is mapped to at least one live-example route', () => {
    const mapped = Object.keys(COVERAGE).sort();
    const missing = PUBLIC_COMPONENTS.filter((name) => !mapped.includes(name));
    const stale = mapped.filter((name) => !PUBLIC_COMPONENTS.includes(name));
    const unrouted = Object.entries(COVERAGE)
      .filter(([, routes]) => routes.length === 0)
      .map(([name]) => name);
    const unknownRoutes = Object.entries(COVERAGE)
      .filter(([, routes]) => routes.some((r) => !ROUTES.some((f) => f.path === r)))
      .map(([name]) => name);

    expect(
      { missing: missing, stale: stale, unrouted: unrouted, unknownRoutes: unknownRoutes },
      'coverage.ts must map every public component to a real app/ route',
    ).toEqual({ missing: [], stale: [], unrouted: [], unknownRoutes: [] });
    expect(PUBLIC_COMPONENTS.length).toBeGreaterThan(0);
  });
});

describe('axe-core audit of every live-example route', () => {
  it.each(ROUTES.map((r) => [r.label, r.path] as const))(
    'route %s (%s) has no critical or serious axe violations',
    async (label, path) => {
      const violations = await auditRoute(path);
      const { blocking, recorded } = classify(violations);

      REPORT.routes.push({ route: path, label, blocking, recorded });

      expect(
        blocking.length,
        `critical/serious a11y violations on ${path}:\n${formatViolations(path, blocking)}`,
      ).toBe(0);

      if (recorded.length > 0) {
        // Recorded, not failing — Task 6.4 publishes this list.
        console.log(`[a11y] ${path}: ${recorded.length} moderate/minor finding group(s)`);
        console.log(formatViolations(path, recorded));
      }
    },
    60_000,
  );

  afterAll(() => {
    // Machine-readable output for the Task 6.4 gap list / CI artifact upload.
    const totals = { critical: 0, serious: 0, moderate: 0, minor: 0, unknown: 0 };
    for (const r of REPORT.routes) {
      for (const v of [...r.blocking, ...r.recorded]) {
        const key = v.impact as keyof typeof totals;
        totals[key] = (totals[key] ?? 0) + v.nodes.length;
      }
    }
    const out = {
      generatedAt: new Date().toISOString(),
      tooling: 'vitest + jsdom + axe-core',
      publicComponents: PUBLIC_COMPONENTS.length,
      routes: REPORT.routes,
      totals,
    };
    const outDir = join(process.cwd(), 'test-results');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'axe-report.json'), JSON.stringify(out, null, 2));
    console.log(
      `[a11y] ${ROUTES.length} routes · ${PUBLIC_COMPONENTS.length} public components · ` +
        `blocking ${totals.critical + totals.serious} · recorded ${totals.moderate + totals.minor}`,
    );
  });
});