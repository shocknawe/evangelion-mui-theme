/**
 * Build-time metadata generator for the Phosphor Console doc site.
 *
 * Reads `components/index.ts` (the canonical export list) and emits
 * `src/generated/site-data.json`:
 *   - nav groups derived from the section comments in index.ts
 *   - per-component: description (JSDoc), `@example` snippet, source path, and
 *     the props table extracted from its `<Name>Props` interface via the
 *     TypeScript compiler API
 *   - the library version + name (for the masthead and import lines)
 *   - a flat search index (components, props, foundations, pages)
 *
 * A new `export { X } from '…'` in components/index.ts appears in the nav, gets
 * a page, an API table, and search entries — with zero manual wiring here.
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const srcRoot = path.join(repoRoot, 'components');
const outDir = path.resolve(here, '../src/generated');

/* ---------------- 1. Parse index.ts into grouped exports ---------------- */

const indexText = readFileSync(path.join(srcRoot, 'index.ts'), 'utf8');

/**
 * Map an index.ts section comment to a nav group title. The comments are the
 * library's own taxonomy — keep this in step with them rather than inventing a
 * second one.
 */
function groupFor(comment, name) {
  // Hooks and the tone helper are API, not renderable components.
  if (name.startsWith('use') || name === 'pad2' || name === 'toneHue') return 'Hooks & utils';
  const c = comment.toLowerCase();
  if (/shared vocabulary/.test(c)) return 'Hooks & utils';
  if (/^atoms/.test(c)) return 'Atoms';
  if (/^text/.test(c)) return 'Text';
  if (/layout & structure/.test(c)) return 'Layout';
  if (/^flow/.test(c)) return 'Flow';
  if (/^status/.test(c)) return 'Status';
  if (/form controls/.test(c)) return 'Inputs';
  if (/^navigation/.test(c)) return 'Navigation';
  if (/^feedback/.test(c)) return 'Feedback';
  if (/^data-viz/.test(c)) return 'Data viz';
  return 'Other';
}

const exportRe = /^export\s+\{([^}]+)\}\s+from\s+'(\.[^']+)';/;
let currentComment = '';
const entries = []; // { name, modulePath, group }

for (const rawLine of indexText.split('\n')) {
  const line = rawLine.trim();
  if (line.startsWith('//')) {
    currentComment = line.replace(/^\/\/\s*/, '');
    continue;
  }
  // `export type { … }` blocks re-export the prop interfaces — the props table
  // already covers them, so they get no page of their own.
  if (line.startsWith('export type')) continue;
  const m = line.match(exportRe);
  if (!m) continue;
  const names = m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    // `export { type Tone, toneHue }` — drop the inline type specifiers.
    .filter((s) => !s.startsWith('type '));
  for (const spec of names) {
    const name = spec.includes(' as ') ? spec.split(' as ')[1].trim() : spec;
    entries.push({ name, modulePath: m[2], group: groupFor(currentComment, name) });
  }
}

/* ------------- 2. Extract JSDoc + props via the TS compiler ------------- */

/** Resolve `./text` → the absolute .tsx/.ts file it names. */
function resolveModule(modulePath) {
  const base = path.join(srcRoot, modulePath);
  for (const ext of ['.tsx', '.ts']) {
    if (existsSync(base + ext)) return base + ext;
  }
  return null;
}

const files = [...new Set(entries.map((e) => resolveModule(e.modulePath)))].filter(Boolean);

// Parsed standalone (no Program) because `ts.getJSDocCommentsAndTags` requires
// parent pointers, which a Program's source files only get after binding — and
// with them the JSDoc came back empty for every export. We only read syntax
// + JSDoc here, so a plain parse with `setParentNodes: true` is enough.
const sourceFiles = new Map(); // path -> SourceFile
function sourceFile(file) {
  let sf = sourceFiles.get(file);
  if (!sf) {
    sf = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.ES2022,
      true, // setParentNodes — JSDoc lookup needs node.parent
      path.extname(file) === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    sourceFiles.set(file, sf);
  }
  return sf;
}

const commentText = (c) => (typeof c === 'string' ? c : (c?.map((p) => p.text).join('') ?? '')).trim();

const jsdocText = (node) => {
  const docs = ts.getJSDocCommentsAndTags(node).filter(ts.isJSDoc);
  if (!docs.length) return '';
  return commentText(docs[docs.length - 1].comment);
};

/** Read a named JSDoc tag (`@default`, `@example`) off a node. */
const tagText = (node, tagName) => {
  for (const tag of ts.getJSDocTags(node)) {
    if (tag.tagName.text === tagName) return commentText(tag.comment);
  }
  return '';
};

/** Description + `@example` of the exported symbol, plus members of `<Name>Props`. */
function analyze(file, name) {
  const sf = sourceFile(file);
  if (!sf) return { description: '', example: '', props: [] };
  let description = '';
  let example = '';
  let props = [];

  sf.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) {
      description = jsdocText(node) || description;
      example = tagText(node, 'example') || example;
    }
    if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.name.text === name) {
          description = jsdocText(node) || description;
          example = tagText(node, 'example') || example;
        }
      }
    }
    if (ts.isInterfaceDeclaration(node) && node.name.text === `${name}Props`) {
      props = node.members.filter(ts.isPropertySignature).map((m) => {
        const typeText = (m.type ? m.type.getText(sf) : 'unknown').replace(/\s+/g, ' ');
        // The @default tag gets its own column, so strip it from the prose.
        const desc = jsdocText(m).replace(/@default.*$/s, '').replace(/\s+/g, ' ').trim();
        return {
          name: m.name.getText(sf),
          type: typeText,
          required: !m.questionToken,
          default: tagText(m, 'default'),
          description: desc,
        };
      });
    }
  });

  // First paragraph as the summary line — the rest is authoring detail.
  const summary = description.split(/\n\n/)[0].replace(/\s+/g, ' ').trim();
  return { description: summary, example: example.replace(/^```\w*\n?|```$/g, '').trim(), props };
}

/* --------------------------- 3. Assemble output -------------------------- */

const GROUP_ORDER = [
  'Atoms',
  'Text',
  'Layout',
  'Flow',
  'Status',
  'Inputs',
  'Navigation',
  'Feedback',
  'Data viz',
  'Hooks & utils',
  'Other',
];

const slug = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const components = entries.map((e) => {
  const file = resolveModule(e.modulePath);
  const { description, example, props } = file
    ? analyze(file, e.name)
    : { description: '', example: '', props: [] };
  return {
    name: e.name,
    slug: slug(e.name),
    group: e.group,
    description,
    example,
    props,
    sourcePath: `components/${path.relative(srcRoot, file ?? e.modulePath).replace(/\\/g, '/')}`,
  };
});

const pkg = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

const groups = GROUP_ORDER.map((title) => ({
  title,
  items: components.filter((c) => c.group === title),
})).filter((g) => g.items.length);

const FOUNDATIONS = [
  { name: 'Color & state', slug: 'color', keywords: ['hue', 'mint', 'orange', 'tone', 'palette'] },
  { name: 'Typography', slug: 'typography', keywords: ['display', 'mono', 'jp', 'mincho', 'bimodal'] },
  { name: 'Spacing & shape', slug: 'spacing-shape', keywords: ['radius', 'chamfer', 'grid', 'space'] },
  { name: 'Depth & glow', slug: 'depth-glow', keywords: ['elevation', 'shadow', 'border', 'crt', 'glow'] },
  { name: 'Motion', slug: 'motion', keywords: ['steps', 'blink', 'linear', 'reduced-motion'] },
];

const searchIndex = [
  ...components.map((c) => ({
    type: c.group === 'Hooks & utils' ? 'api' : 'component',
    name: c.name,
    href: `#/components/${c.slug}`,
    description: c.description,
    keywords: c.props.map((p) => p.name),
  })),
  ...FOUNDATIONS.map((f) => ({
    type: 'foundation',
    name: f.name,
    href: `#/foundations/${f.slug}`,
    description: `Foundation — ${f.name}`,
    keywords: f.keywords,
  })),
  {
    type: 'page',
    name: 'Getting started',
    href: '#/getting-started',
    description: `Install and mount ${pkg.name}`,
    keywords: ['install', 'setup', 'provider', 'CssBaseline', 'fonts'],
  },
  {
    type: 'page',
    name: 'Themed MUI — buttons',
    href: '#/mui/buttons',
    description: 'Button variants the theme adds: ghost, alt, stamp, nerv-live',
    keywords: ['button', 'ghost', 'alt', 'stamp', 'variant'],
  },
  {
    type: 'page',
    name: 'Themed MUI — gallery',
    href: '#/mui/gallery',
    description: 'Every stock MUI component carrying the Phosphor Console theme',
    keywords: ['mui', 'inputs', 'table', 'alert', 'tabs', 'dialog'],
  },
  {
    type: 'page',
    name: 'Forms pattern',
    href: '#/patterns/forms',
    description: 'The numbered console form: SectionDivider + FieldLabel + console controls',
    keywords: ['form', 'FieldLabel', 'SectionDivider', 'validation'],
  },
  {
    type: 'page',
    name: 'Screens pattern',
    href: '#/patterns/screens',
    description: 'ConsoleFrame shell assembly — header · sidebar · main · rail · footer',
    keywords: ['ConsoleFrame', 'dashboard', 'shell', 'layout'],
  },
];

mkdirSync(outDir, { recursive: true });
writeFileSync(
  path.join(outDir, 'site-data.json'),
  `${JSON.stringify({ version: pkg.version, pkgName: pkg.name, groups, searchIndex }, null, 2)}\n`,
);

const propCount = components.reduce((n, c) => n + c.props.length, 0);
console.log(
  `site-data.json: v${pkg.version}, ${components.length} exports in ${groups.length} groups, ` +
    `${propCount} props, ${searchIndex.length} search entries`,
);
