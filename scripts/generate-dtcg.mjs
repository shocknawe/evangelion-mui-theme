#!/usr/bin/env node
/**
 * Build-time DTCG codegen — `dist/tokens.dtcg.json` from `theme/tokens.ts`.
 *
 * Approach (zero new dependencies): `tsup` compiles `theme/tokens.ts` to ESM at
 * `dist/tokens.js` first; this script then imports that emitted module and walks
 * its named exports. `theme/tokens.ts` stays the single source of truth — no
 * token value is ever hand-copied into this file.
 *
 * Emitting rules (see `openspec/changes/docs-agent-readiness/spec.md`):
 *  - Every exported group becomes a DTCG group; every serializable leaf value
 *    becomes a token: `{ "$type": …, "$value": … }`.
 *  - Non-serializable values (functions, symbols, undefined) are excluded and
 *    reported under the root `$extensions` block (`excluded`). `theme/tokens.ts`
 *    currently exports none — the guard exists so future helpers (chamfer
 *    clip-paths, hazard math, …) can be added to tokens.ts without breaking the
 *    DTCG export.
 *  - `$type` is assigned per top-level group (see `TYPE_BY_GROUP`) rather than
 *    guessed from the value, per the DTCG rule "no type may be guessed from the
 *    value".
 *  - The current DTCG draft (designtokens.org/TR/drafts/format/) requires
 *    dimension/duration `$value`s to be `{ value, unit }` objects, not bare
 *    numbers or unit strings. Numbers in dimension groups (`radii`, `space` —
 *    px in tokens.ts) and the duration group (`motion.durations` — ms) are
 *    therefore wrapped as `{ value: n, unit: "px" | "ms" }`. The numeric value
 *    is still taken verbatim from the source token; only the unit is annotated.
 *  - Composite CSS strings (`glowFx.*` shadows, `crt` gradient, `fluid.hero`
 *    clamp()) are not representable as DTCG composite types without
 *    restructuring, so they are emitted as `$type: "other"` raw strings.
 *  - Deterministic output: no timestamp, keys in source declaration order.
 *
 * Run as part of `npm run build` (after tsup): `node scripts/generate-dtcg.mjs`.
 */

import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SOURCE_MODULE = path.join(ROOT, 'dist', 'tokens.js');
const OUT_FILE = path.join(ROOT, 'dist', 'tokens.dtcg.json');

/** DTCG `$type` per top-level token group in `theme/tokens.ts`. */
const TYPE_BY_GROUP = {
  hue: 'color',
  status: 'color',
  surfaces: 'color',
  ink: 'color',
  terminal: 'color',
  glowFx: 'other',
  crt: 'other',
  radii: 'dimension',
  space: 'dimension',
  fonts: 'fontFamily',
  fluid: 'other',
  // per-key: easing/timing strings → "other", `durations` → "duration"
  motion: (key) => (key === 'durations' ? 'duration' : 'other'),
  layers: 'number',
};

/** Unit applied when wrapping bare numbers for a given `$type`. */
const NUMBER_UNITS = { dimension: 'px', duration: 'ms' };

const excluded = [];

/** Wrap a raw token value into its DTCG `$value` form for `$type`. */
function toDtcgValue(value, type) {
  const unit = NUMBER_UNITS[type];
  if (unit !== undefined && typeof value === 'number') {
    return { value, unit };
  }
  return value;
}

function isPlainObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

/**
 * Recursively walk one exported group into DTCG shape.
 * `typeForGroup` returns the `$type` for a (sub)group's leaves, or `null` to
 * descend without assigning a type at this level.
 */
function walkGroup(group, typeForGroup, prefix, out) {
  const result = {};
  for (const [key, value] of Object.entries(group)) {
    const tokenPath = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) {
      const type = typeForGroup(key);
      result[key] = walkGroup(
        value,
        type === null ? typeForGroup : () => type,
        tokenPath,
        out,
      );
    } else if (isEmittable(value)) {
      const type = typeForGroup(key) ?? 'other';
      result[key] = { $type: type, $value: toDtcgValue(value, type) };
      out.count += 1;
      out.paths.push(tokenPath);
    } else {
      excluded.push(`${tokenPath} (${typeof value})`);
    }
  }
  return result;
}

function isEmittable(value) {
  const t = typeof value;
  return t === 'string' || t === 'number' || t === 'boolean';
}

async function main() {
  const tokens = await import(pathToFileURL(SOURCE_MODULE).href);
  const dtcg = {
    $extensions: {
      'phosphor-console-theme:dtcg': {
        generator: 'scripts/generate-dtcg.mjs',
        source: 'theme/tokens.ts (via dist/tokens.js)',
        excluded,
      },
    },
  };
  const stats = { count: 0, paths: [] };

  for (const [name, group] of Object.entries(tokens)) {
    const groupType = Object.hasOwn(TYPE_BY_GROUP, name)
      ? TYPE_BY_GROUP[name]
      : undefined;
    if (isEmittable(group)) {
      // A root-level token (e.g. `crt`), not a group — the DTCG root is a group
      // that may hold tokens directly.
      const type = typeof groupType === 'function' ? undefined : groupType;
      dtcg[name] = { $type: type ?? 'other', $value: toDtcgValue(group, type) };
      stats.count += 1;
      stats.paths.push(name);
      continue;
    }
    if (!isPlainObject(group)) {
      excluded.push(`${name} (top-level ${typeof group})`);
      continue;
    }
    dtcg[name] = walkGroup(
      group,
      typeof groupType === 'function' ? groupType : () => groupType,
      name,
      stats,
    );
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(dtcg, null, 2)}\n`);

  console.log(
    `[generate-dtcg] ${stats.count} tokens -> ${path.relative(ROOT, OUT_FILE)}`,
  );
  for (const [name, group] of Object.entries(tokens)) {
    if (isPlainObject(group)) {
      const n = stats.paths.filter((p) => p === name || p.startsWith(`${name}.`)).length;
      console.log(`[generate-dtcg]   ${name}: ${n}`);
    }
  }
  if (excluded.length > 0) {
    console.log(`[generate-dtcg] excluded (not DTCG-representable):`);
    for (const entry of excluded) console.log(`[generate-dtcg]   - ${entry}`);
  }
}

main().catch((error) => {
  console.error('[generate-dtcg] failed:', error);
  process.exitCode = 1;
});