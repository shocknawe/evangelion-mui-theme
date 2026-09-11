#!/usr/bin/env node
/**
 * Independent verification of `dist/tokens.dtcg.json` against `dist/tokens.js`
 * (the compiled `theme/tokens.ts`). Dev-only helper — not part of the build.
 * Checks: token-for-token parity, exact value match, `$type` match, and that
 * every DTCG leaf carries a `$value`.
 */
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const tokens = await import(pathToFileURL(path.join(ROOT, 'dist/tokens.js')).href);
const dtcg = JSON.parse(readFileSync(path.join(ROOT, 'dist/tokens.dtcg.json'), 'utf8'));

// Mirrors the mapping in generate-dtcg.mjs.
const TYPE = {
  hue: 'color', status: 'color', surfaces: 'color', ink: 'color', terminal: 'color',
  glowFx: 'other', crt: 'other', radii: 'dimension', space: 'dimension',
  fonts: 'fontFamily', fluid: 'other', layers: 'number',
  motion: (key) => (key === 'durations' ? 'duration' : 'other'),
};
const UNIT = { dimension: 'px', duration: 'ms' };

const expected = {};
function flatten(group, prefix, type) {
  for (const [k, v] of Object.entries(group)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object') {
      flatten(v, p, typeof type === 'function' ? type(k) : type);
    } else {
      let t = typeof type === 'function' ? type(k) : type;
      t = t ?? 'other';
      let value = v;
      if (UNIT[t] && typeof v === 'number') value = { value: v, unit: UNIT[t] };
      expected[p] = { type: t, value };
    }
  }
}
for (const [name, g] of Object.entries(tokens)) {
  if (g !== null && typeof g === 'object') {
    flatten(g, name, Object.hasOwn(TYPE, name) ? TYPE[name] : undefined);
  } else {
    const t = TYPE[name] ?? 'other';
    let value = g;
    if (UNIT[t] && typeof g === 'number') value = { value: g, unit: UNIT[t] };
    expected[name] = { type: t, value };
  }
}

const actual = {};
(function walkDtcg(obj, prefix) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && '$value' in v) actual[p] = { type: v.$type, value: v.$value };
    else walkDtcg(v, p);
  }
})(dtcg, '');

let bad = 0, missing = 0, extra = 0;
for (const [p, e] of Object.entries(expected)) {
  const a = actual[p];
  if (!a) { console.log('MISSING in dtcg:', p); missing++; continue; }
  if (JSON.stringify(a.value) !== JSON.stringify(e.value)) {
    console.log('VALUE MISMATCH', p, JSON.stringify(e.value), '!=', JSON.stringify(a.value)); bad++;
  }
  if (a.type !== e.type) { console.log('TYPE MISMATCH', p, e.type, '!=', a.type); bad++; }
}
for (const p of Object.keys(actual)) {
  if (!expected[p]) { console.log('EXTRA in dtcg:', p); extra++; }
}
let noValue = 0;
for (const [p, a] of Object.entries(actual)) if (a.value === undefined) { console.log('NO $value:', p); noValue++; }

console.log('source tokens:', Object.keys(expected).length);
console.log('dtcg tokens:  ', Object.keys(actual).length);
console.log('value/type mismatches:', bad, '| missing:', missing, '| extra:', extra, '| leaves without $value:', noValue);
console.log('excluded reported:', JSON.stringify(dtcg.$extensions['phosphor-console-theme:dtcg'].excluded));