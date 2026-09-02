#!/usr/bin/env node
/**
 * Build-time component-registry codegen — `registry.json` from `components/`.
 *
 * Sibling to `scripts/generate-dtcg.mjs` (Task 7.1, `dist/tokens.dtcg.json`):
 * same zero-new-dependency, derive-from-source discipline — nothing in the
 * emitted manifest is hand-copied, so the registry can be regenerated after any
 * component change and stays honest. Run via `npm run registry`, or as part of
 * `npm run build`.
 *
 * Emitted per public component (specs/…/docs-agent-readiness/spec.md,
 * "Component registry manifest"):
 *   - `name`           — the public export name (from `components/index.ts`,
 *                        the same source `app/src/api/api-conventions.test.tsx`
 *                        type-checks its fixture inventory against).
 *   - `props`          — a summary derived from the component's `XProps`
 *                        interface in its module file via the TypeScript
 *                        compiler API (names + optionality + documented
 *                        `@default`s — not full type dumps): `required`,
 *                        `optional`, `defaults`, and, when the component has
 *                        the Task 2.2/3.4 APIs, `slots` (the `SlotsOf<…>` keys)
 *                        and `classes` (the `ClassesOf<…>` keys).
 *   - `tokens`         — `theme.nerv.*` / `theme.vars…nerv.*` token paths
 *                        referenced in the component's module file, normalized
 *                        to their `nerv.*` token path in `theme/tokens.ts`.
 *   - `exampleRoute`   — an `app/` route where the component is actually
 *                        rendered (`/#<section-id>` anchors on the living
 *                        design-system page, `/dashboard-0N`, `/landing-0N`),
 *                        derived by scanning `app/src/pages` + `app/src/sections`
 *                        against the route table in `app/src/App.tsx`. `null`
 *                        (plus `routes: []`) when no route renders it — never
 *                        invented.
 *
 * The manifest is deterministic: no timestamp, components in `index.ts`
 * declaration order, sorted token/route lists.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const INDEX_FILE = path.join(ROOT, 'components', 'index.ts');
const OUT_FILE = path.join(ROOT, 'registry.json');
const APP_SRC = path.join(ROOT, 'app', 'src');

/** Value exports of the barrel that are hooks/utilities, not components. */
const NON_COMPONENT_EXPORTS = ['toneHue', 'useReducedMotion', 'pad2'];

const fail = (msg) => {
  console.error(`generate-registry: ${msg}`);
  process.exit(1);
};

/* ———————————————————————— barrel → name/module map ———————————————————————— */

/** Parse `components/index.ts` value exports: `export { A, B } from './mod';` */
async function readBarrel() {
  const src = await readFile(INDEX_FILE, 'utf8');
  const out = [];
  const re = /^export \{([^}]*)\} from '\.\/([\w-]+)';/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const module = m[2];
    for (const raw of m[1].split(',')) {
      const name = raw.trim();
      if (!name || name.startsWith('type ')) continue; // type-only re-export
      out.push({ name, module });
    }
  }
  if (out.length === 0) fail('no value exports parsed from components/index.ts');
  const seen = new Set();
  for (const { name } of out) {
    if (seen.has(name)) fail(`duplicate export in barrel: ${name}`);
    seen.add(name);
  }
  return out.filter((e) => !NON_COMPONENT_EXPORTS.includes(e.name));
}

/* ————————————————————————— props/type extraction ————————————————————————— */

/**
 * One module file's syntactic analysis. `ts.createSourceFile` (no type-check)
 * is enough: every component's props interface and its SlotsOf/ClassesOf key
 * lists are declared in the module itself, so nothing here can drift into
 * guessing.
 */
async function analyzeModule(absFile) {
  const text = await readFile(absFile, 'utf8');
  const sf = ts.createSourceFile(absFile, text, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX);

  /** interface/alias declarations by name (shallow — declared in this file) */
  const decls = new Map();
  const visit = (node) => {
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
      decls.set(node.name.text, node);
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sf, visit);

  /** JSDoc comment text directly above a node (trimmed of `*` rails) — the
   * leading trivia only, never the declaration body itself. */
  const docOf = (node) => {
    const ranges = ts.getLeadingCommentRanges(text, node.getFullStart()) ?? [];
    const jsdoc = [...ranges].reverse().find((r) => text.slice(r.pos, r.pos + 3) === '/**');
    if (!jsdoc) return '';
    return text
      .slice(jsdoc.pos, jsdoc.end)
      .replace(/^\/\*\*/, '')
      .replace(/\*\/$/, '')
      .split('\n')
      .map((l) => l.replace(/^\s*\*? ?/, '').trim())
      .filter(Boolean)
      .join(' ');
  };

  const summarizeProps = (propsName) => {
    const decl = decls.get(propsName);
    if (!decl) return null;

    // `slots?: SlotsOf<'a' | 'b'>` / `classes?: ClassesOf<…>` key lists.
    const keysOfHelper = (node, helper) => {
      if (!node || !ts.isTypeReferenceNode(node)) return null;
      if (node.typeName.getText() !== helper) return null;
      const arg = node.typeArguments?.[0];
      if (!arg) return [];
      return arg
        .getText()
        .split('|')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    };

    const required = [];
    const optional = [];
    const defaults = {};
    let slots = [];
    let classes = [];

    const members = ts.isInterfaceDeclaration(decl) ? decl.members : [];
    for (const member of members) {
      if (!ts.isPropertySignature(member) || !member.name) continue;
      const name = member.name.getText().replace(/^['"]|['"]$/g, '');
      const isOptional = Boolean(member.questionToken);
      (isOptional ? optional : required).push(name);
      if (ts.isTypeReferenceNode(member.type)) {
        if (member.type.typeName.getText() === 'SlotsOf') slots = keysOfHelper(member.type, 'SlotsOf');
        if (member.type.typeName.getText() === 'ClassesOf') classes = keysOfHelper(member.type, 'ClassesOf');
      }
      const doc = docOf(member);
      const dm = doc.match(/@default\s+([^@]*?)(?=$|@(?:default|deprecated))/s);
      if (dm) defaults[name] = dm[1].replace(/\s+/g, ' ').trim();
    }

    /** Intersection helpers (`extends RootHTMLAttributes, WithRef`) — these
     * carry the DOM pass-through contract (Tasks 3.2/3.3), worth surfacing. */
    const extendsNames = ts.isInterfaceDeclaration(decl)
      ? (decl.heritageClauses ?? []).flatMap((c) => c.types.map((t) => t.expression.getText()))
      : [];

    return {
      type: propsName,
      required,
      optional,
      ...(Object.keys(defaults).length ? { defaults } : {}),
      ...(slots.length ? { slots } : {}),
      ...(classes.length ? { classes } : {}),
      ...(extendsNames.length ? { extends: extendsNames } : {}),
    };
  };

  return { text, summarizeProps };
}

/* ———————————————————————————— token consumption ——————————————————————————— */

/** Matches every theme-token read shape used by `components/` and normalizes it
 * to the token path in `theme/tokens.ts` (see `theme/README.md` extension
 * contract: structural `theme.nerv.*`, palette `theme.palette.nerv.*`, CSS-var
 * form `theme.vars.*.nerv.*`). */
const TOKEN_RE = /(?:theme|t|th)\.(?:vars\.)?(?:palette\.)?nerv\.([A-Za-z0-9_.]+)/g;

function tokensOf(text) {
  const set = new Set();
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text)) !== null) set.add(`nerv.${m[1]}`);
  return [...set].sort();
}

/* ———————————————————————————— app route usage ————————————————————————————— */

/**
 * Route table derived from `app/src/App.tsx` (`path === '/x'` → `<XPage />`,
 * fallback → DesignSystemPage) so the route strings are not hand-copied.
 */
async function readRoutes() {
  const text = await readFile(path.join(APP_SRC, 'App.tsx'), 'utf8');
  const routes = [];
  const lineRe = /if \(path === '([^']+)'\) return <(\w+) \/>;/g;
  let m;
  while ((m = lineRe.exec(text)) !== null) routes.push({ path: m[1], page: m[2] });
  if (/return <(\w+) \/>;\s*\}/.exec(text)) {
    const fallback = /return <(\w+) \/>;\s*\}/.exec(text)[1];
    if (!routes.some((r) => r.page === fallback)) routes.unshift({ path: '/', page: fallback });
  }
  if (routes.length === 0) fail('no routes parsed from app/src/App.tsx');
  return routes;
}

/** `<ComponentName` usages of `@components` exports per app source file, with
 * the enclosing `<Section id="…">` anchor where the file declares one. */
async function usageScan(componentNames, files) {
  const wanted = new Set(componentNames);
  const usage = new Map(); // component → [{file, section}]
  const sectionRe = /<Section\b[^>]*?\bid="([^"]+)"/;
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const importMatch = text.match(/import\s*\{([^}]*)\}\s*from\s*'@components'/);
    if (!importMatch) continue;
    const imported = importMatch[1]
      .split(',')
      .map((s) => s.replace(/\s+as\s+\w+$/, '').trim())
      .filter((s) => wanted.has(s));
    if (imported.length === 0) continue;

    let currentSection = null;
    let firstSection = null;
    for (const line of text.split('\n')) {
      const sm = line.match(sectionRe);
      if (sm) {
        if (firstSection === null) firstSection = sm[1];
        currentSection = sm[1];
      }
      for (const name of imported) {
        if (new RegExp(`<${name}\\b`).test(line)) {
          if (!usage.has(name)) usage.set(name, []);
          const entry = { file: path.relative(ROOT, file), section: currentSection ?? firstSection };
          const list = usage.get(name);
          if (!list.some((e) => e.file === entry.file && e.section === entry.section)) list.push(entry);
        }
      }
    }
  }
  return usage;
}

/* ————————————————————————————————— main ————————————————————————————————— */

async function main() {
  const barrel = await readBarrel();
  const routes = await readRoutes();

  // Route file set: every page module + every section module it renders.
  const routeFiles = [];
  const pageByFile = new Map();
  for (const r of routes) {
    const pageFile = path.join(APP_SRC, 'pages', `${r.page}.tsx`);
    pageByFile.set(pageFile, r.path);
    routeFiles.push(pageFile);
    const pageText = await readFile(pageFile, 'utf8');
    for (const m of pageText.matchAll(/from '\.\.\/sections\/([\w-]+)'/g)) {
      const secFile = path.join(APP_SRC, 'sections', `${m[1]}.tsx`);
      pageByFile.set(secFile, r.path);
      routeFiles.push(secFile);
    }
  }

  const componentNames = new Set(barrel.map((b) => b.name));
  const usage = await usageScan(
    barrel.map((b) => b.name),
    [...new Set(routeFiles)],
  );

  const components = [];
  const problems = [];

  for (const { name, module } of barrel) {
    const { summarizeProps, text } = await analyzeModule(path.join(ROOT, 'components', `${module}.tsx`));

    // Props type: `<Name>Props` declared in the module (interface or alias).
    let props = summarizeProps(`${name}Props`);
    if (!props) problems.push(`${name}: no ${name}Props declaration in components/${module}.tsx`);

    // Example routes — page path + section anchor, declaration-ordered.
    const uses = usage.get(name) ?? [];
    const routeList = uses.map((u) => {
      const base = pageByFile.get(path.join(ROOT, u.file)) ?? '';
      return u.section ? `${base}#${u.section}` : base || null;
    });
    const deduped = [...new Set(routeList.filter(Boolean))];

    components.push({
      name,
      module: `components/${module}.tsx`,
      ...(props ? { props } : {}),
      tokens: tokensOf(text),
      exampleRoute: deduped[0] ?? null,
      routes: deduped,
    });
  }

  const unrouted = components.filter((c) => c.exampleRoute === null).map((c) => c.name);
  if (problems.length > 0) fail(`fail-closed: ${problems.length} problem(s):\n  - ${problems.join('\n  - ')}`);

  // Soft cross-check against the a11y harness's route-coverage map (Task 6.1,
  // app/src/a11y/coverage.ts). That map is hand-maintained and claims every
  // component renders on ≥1 route; when this scan — derived from actual JSX —
  // disagrees, say so loudly instead of quietly shipping both truths.
  const coverage = await readFile(path.join(APP_SRC, 'a11y', 'coverage.ts'), 'utf8').catch(() => '');
  for (const m of coverage.matchAll(/^\s{2}(\w+): \[([^\]]*)\]/gm)) {
    const [name, claim] = [m[1], m[2]];
    if (componentNames.has(name) && !usage.has(name)) {
      console.warn(
        `generate-registry: WARNING — app/src/a11y/coverage.ts COVERAGE claims ${name} renders on ${claim}, ` +
          `but no app/ page or section renders <${name}; COVERAGE is likely stale.`,
      );
    }
  }

  /** Coverage guard: a silent drop would publish an incomplete manifest. The
   * expected count is the previous committed manifest's `counts.components`
   * when it exists (so an intentional addition must be a strict increase, never
   * a quiet replacement), else the pinned full public surface (59 per
   * notes/2.1). */
  let previous;
  try {
    previous = JSON.parse(await readFile(OUT_FILE, 'utf8')).counts?.components;
  } catch {
    previous = undefined; // first run / manifest absent
  }
  const expected = typeof previous === 'number' ? previous : 59;
  if (components.length < expected) {
    fail(
      `fail-closed: only ${components.length} components derived; the manifest covers ${expected}. ` +
        'A component was likely dropped from the barrel or misparsed — regenerate nothing until resolved.',
    );
  }
  if (typeof previous !== 'number' && components.length !== 59) {
    fail(`fail-closed: derived ${components.length} components on first run; expected the pinned full surface of 59`);
  }

  const registry = {
    $schema: 'phosphor-console/component-registry/1',
    description:
      'Component registry manifest — every public component of the Phosphor Console library with its props summary, consumed theme tokens, and an example app/ route. Generated from source by scripts/generate-registry.mjs; do not edit by hand (regenerate with `npm run registry`).',
    generatedFrom: ['components/index.ts', 'components/*.tsx', 'app/src/App.tsx', 'app/src/pages', 'app/src/sections'],
    tokenScope:
      'nerv.* paths as referenced from the component module file (theme.nerv.* / theme.palette.nerv.* / theme.vars.*.nerv.*, normalized). Leaf values (hue.*, fonts.*, radius.*, motion.durations.*) are declared in theme/tokens.ts; a few paths (chamfer, overlay, overlayFaint, termDim) are derived members of the augmented theme.nerv object declared in theme/index.ts, and a bare group path (nerv.hue) denotes a dynamic key lookup into that group. Module-file scope: components sharing a module file share its token list, and a component consuming tokens only through a shared helper is attributed to that helper.',
    counts: {
      components: components.length,
      withExampleRoute: components.filter((c) => c.exampleRoute !== null).length,
      withoutExampleRoute: unrouted.length,
    },
    withoutExampleRouteNote: unrouted.length
      ? `No app/ route renders ${unrouted.length === 1 ? 'this component' : 'these components'} (routes: ${routes.map((r) => r.path).join(', ')}). Recorded as null rather than invented.`
      : null,
    routes: routes.map((r) => ({ path: r.path, page: `app/src/pages/${r.page}.tsx` })),
    components,
  };

  await writeFile(OUT_FILE, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  console.log(
    `generate-registry: wrote ${OUT_FILE} — ${components.length} components, ` +
      `${components.length - unrouted.length} with an example route, ${unrouted.length} without` +
      (unrouted.length ? ` (${unrouted.join(', ')})` : ''),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});