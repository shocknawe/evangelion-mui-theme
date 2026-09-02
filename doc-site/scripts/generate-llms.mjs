/**
 * `llms.txt` generator for the Phosphor Console doc site.
 *
 * Emits `public/llms.txt` (Vite copies `public/` to the dist root, so the file
 * is served at the site root) indexing the site's curated LLM-consumable pages,
 * following the llms.txt convention: an H1, a blockquote summary, then `## `
 * sections of `- [Title](url): description` links.
 *
 * Route list is derived, not hand-maintained, so it cannot drift:
 *   - static pages come from the `STATIC_GROUPS` block in `src/App.tsx`
 *   - component pages come from `src/generated/site-data.json` (written by
 *     `scripts/generate-metadata.mjs` from `components/index.ts` — run first)
 * Only the *descriptions* are curated, keyed by route href; a new route that
 * lacks one falls back to a plain label so its absence is visible.
 *
 * URLs mirror how the site links itself: the app is hash-routed
 * (`HashRouter`), so every page lives at `<base>#/<route>` off the single
 * `index.html`. `DOCS_BASE` matches the `base` in `vite.config.ts` (CI sets
 * `/evangelion-mui-theme/` for the GitHub Pages project site). Optionally set
 * `LLMS_ORIGIN` (e.g. `https://shocknawe.github.io`) to emit the absolute URLs
 * the llms.txt spec prefers.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(here, '../src');
const outPath = path.resolve(here, '../public/llms.txt');

/* ------------------------- base path / URL helpers ------------------------ */

const base = process.env.DOCS_BASE ?? '/';
const origin = process.env.LLMS_ORIGIN?.replace(/\/$/, '') ?? '';
/** Hash route (`/getting-started`) → site URL; plain path → static file URL. */
const href = (route) =>
  route.startsWith('pipeline/') ? `${origin}${base}${route}` : `${origin}${base}#${route}`;

/* -------------------- 1. Static pages, from src/App.tsx ------------------- */

const appText = readFileSync(path.join(srcDir, 'App.tsx'), 'utf8');
const staticBlock = appText.match(/const STATIC_GROUPS[\s\S]*?\n];/)?.[0];
if (!staticBlock) throw new Error('STATIC_GROUPS block not found in src/App.tsx');

const groups = [...staticBlock.matchAll(/title:\s*'([^']+)'/g)].map((m) => ({
  title: m[1],
  at: m.index,
  links: [],
}));
for (const m of staticBlock.matchAll(/label:\s*'([^']+)',\s*href:\s*'(#[^']+)'/g)) {
  const owner = groups.filter((g) => g.at < m.index).at(-1);
  if (!owner) throw new Error(`TOC link "${m[1]}" sits before the first STATIC_GROUPS title`);
  owner.links.push({ label: m[1], route: m[2].slice(1) });
}

// The landing route is the app root, not a STATIC_GROUPS link — pin it on top.
const overview = groups[0];
if (overview && !overview.links.some((l) => l.route === '/')) {
  overview.links.unshift({ label: 'Overview', route: '/' });
}

/* --------------------- 2. Component pages, from site-data ----------------- */

const data = JSON.parse(readFileSync(path.join(srcDir, 'generated/site-data.json'), 'utf8'));

/* ------------------------------ 3. Descriptions --------------------------- */

/** Curated one-liners, keyed by route (the hash href without `#`). */
const DESCRIPTIONS = {
  '/': 'Overview of the Phosphor Console design language and what the library ships.',
  '/getting-started': 'Install the theme, mount ThemeProvider + CssBaseline, load the fonts, set dark mode.',
  '/pipeline': 'How the system was made — video references, throwaway experiments, sample layouts, then the theme.',
  '/foundations/color': 'Color is state: mint nominal, orange chrome-only, blue pending, amber caution, red critical.',
  '/foundations/typography': 'Bimodal type — condensed ALL CAPS display, monospace data, Mincho JP — with pairing rules.',
  '/foundations/spacing-shape': 'Spacing scale, radius 0, chamfered corners, and border discipline on a single black surface.',
  '/foundations/depth-glow': 'Elevation is none: depth comes from border, glow, and hue — never a drop shadow.',
  '/foundations/motion': 'Mechanical motion only — steps(), blink, linear — with a reduced-motion path that renders the final state.',
  '/mui/buttons': 'Button variants the theme adds: ghost, alt, stamp, and the nerv-live accent.',
  '/mui/gallery': 'Every stock MUI component carrying the Phosphor Console theme, in one place.',
  '/patterns/forms': 'The numbered console form: SectionDivider + FieldLabel + console controls.',
  '/patterns/screens': 'ConsoleFrame shell assembly — header · sidebar · main · rail · footer.',
};

/** Standalone HTML reference screens served from `public/pipeline/`. */
const PIPELINE_PAGES = [
  ['pipeline/design-system.html', 'Design system gallery', 'The living design-system.html — tokens, atoms, and patterns in one self-contained page.'],
  ['pipeline/dashboard-01.html', 'Dashboard 01', 'Reference implementation — tactical overview dashboard.'],
  ['pipeline/dashboard-02.html', 'Dashboard 02', 'Reference implementation — agent roster / operations dashboard.'],
  ['pipeline/dashboard-03.html', 'Dashboard 03', 'Reference implementation — telemetry dashboard.'],
  ['pipeline/form-01.html', 'Form 01', 'Reference implementation — numbered console form.'],
  ['pipeline/form-02.html', 'Form 02', 'Reference implementation — gate / approval form.'],
  ['pipeline/landing-page-01.html', 'Landing page 01', 'Reference implementation — brand landing surface.'],
  ['pipeline/landing-page-02.html', 'Landing page 02', 'Reference implementation — alternate brand landing surface.'],
  ['pipeline/wiki.html', 'Wiki', 'Reference implementation — documentation wiki with WikiLink navigation.'],
];

const describe = (route, label) =>
  DESCRIPTIONS[route] ?? `${label} — description pending; see the page for detail.`;

/* ------------------------------ 4. Assemble ------------------------------- */

const out = [];
out.push(`# ${data.pkgName} — Phosphor Console docs`);
out.push('');
out.push(
  `> NERV/MAGI tactical UI system: an Evangelion-inspired design language, a dark-only Material UI theme, ` +
    `and a React component library. Black CRT surfaces, phosphor mint / safety orange / blood red, ` +
    `bilingual EN + JP, mechanical motion. Docs are for v${data.version}; the site is a single-page ` +
    `hash-routed app, so every page below lives at ${base}#/<route>. ` +
    `Every component page carries edge cases, performance notes, and a customization recipe ` +
    `(sx, classes keys, slots/slotProps, and the single-class Nerv*-root theme override).`,
);

for (const g of groups) {
  out.push('', `## ${g.title}`, '');
  for (const l of g.links) out.push(`- [${l.label}](${href(l.route)}): ${describe(l.route, l.label)}`);
}

for (const g of data.groups) {
  out.push('', `## Components — ${g.title}`, '');
  for (const c of g.items) {
    const d = c.description || `${c.name} component — see the page for props and usage.`;
    out.push(`- [${c.name}](${href(`/components/${c.slug}`)}): ${d}`);
  }
}

out.push('', '## Standalone reference screens', '');
out.push('Self-contained HTML files served verbatim under `pipeline/` — full reference implementations, no build.', '');
for (const [file, label, desc] of PIPELINE_PAGES) out.push(`- [${label}](${href(file)}): ${desc}`);

const repoUrl = process.env.VITE_REPO_URL;
if (repoUrl) {
  out.push('', '## Source', '', `- [GitHub repository](${repoUrl.replace(/\/$/, '')}): theme/, components/, and this docs site.`);
}

writeFileSync(outPath, `${out.join('\n')}\n`);

const links = (out.join('\n').match(/^- \[/gm) ?? []).length;
console.log(`llms.txt: ${links} links across ${groups.length + data.groups.length + 2} sections (base ${base}${origin ? `, origin ${origin}` : ''})`);