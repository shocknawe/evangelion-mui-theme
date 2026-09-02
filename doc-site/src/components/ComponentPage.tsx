/**
 * A component's page: overview · playground · guidance · API · edge cases ·
 * performance · customization · a11y · source.
 *
 * Everything except the prose in `registry.tsx` and the seed in `examples.ts` is
 * generated from the library source, so a new export gets a working page with no
 * edits here. The CUSTOMIZE section is built from the generated props table (the
 * `classes`/`slots` keys) plus the per-component notes in `registry.tsx`, so the
 * recipe cannot drift from the props interface.
 */
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Stamp } from '@components';
import { DocSection, EmptyPanel, Guidance, PageHeader, Prose } from '../docs/chrome';
import { CodeBlock, ImportLine } from '../docs/CodeBlock';
import { LivePlayground } from '../playground/LivePlayground';
import { examples } from '../examples';
import { registry, type DocMeta } from '../registry';
import { classKeys, findComponent, importLine, isApi, slotKeys, sourceHref, type ComponentDoc } from '../siteData';
import { PropsTable } from './PropsTable';

/**
 * The customization recipe every component page carries (Task 7.4): the standard
 * per-instance hooks (`sx`, `classes`), any `slots`/`slotProps` point, the
 * theme-wide single-class override, then the per-component notes from
 * `registry.tsx`.
 *
 * The theme-wide half uses `GlobalStyles` on purpose: the theme's built-in
 * `MuiCssBaseline.styleOverrides` is a *callback* (keyframes, CRT pass,
 * reduced-motion guard), and MUI's deepmerge lets a non-object replacement win —
 * so both a spread `{ ...theme, components: { MuiCssBaseline: … } }` and a
 * `createTheme(theme, { components: { MuiCssBaseline: … } })` with a string/flat
 * override would silently drop all of it (verified against `@mui/utils/deepmerge`).
 * GlobalStyles appends.
 */
function customization(doc: ComponentDoc, meta?: DocMeta): { notes: string[]; code: string } {
  const keys = classKeys(doc);
  const slots = slotKeys(doc);
  const root = `Nerv${doc.name}-root`;

  // Hooks and helpers: no DOM to style — the recipe is usage.
  if (!keys.length) {
    return {
      notes: meta?.customizeExtra ?? ['A pure function/hook — nothing to style; the recipe is how to call it.'],
      code: meta?.customizeCode ?? `import { ${doc.name} } from 'phosphor-console-theme/components';`,
    };
  }

  const notes = [
    ...(meta?.customizeNoSx
      ? []
      : [
          'sx on the root — the library’s own root `sx` fragment renders first and yours is appended after, so a one-off tweak needs no override plumbing and no `!important`.',
        ]),
    `classes — keys \`${keys.join(' · ')}\`. \`root\` is always the outermost element, and supplied classes append to the generated one (generated → \`classes[part]\` → your \`className\`), never replace it.`,
    slots.length
      ? `slots/slotProps — replace the built-in ${slots.map((k) => `\`${k}\``).join(' / ')} part${
          slots.length > 1 ? 's' : ''
        }: the default element is swapped wholesale and \`slotProps\` merge last with your props winning (the generated class still lands on the slot).`
      : '',
    `Theme-wide — style the generated hook \`.${root}\` through \`GlobalStyles\`, with a single-class selector. The library defines zero \`Nerv*\` descendant selectors, and its only \`!important\` declarations are the sanctioned global \`prefers-reduced-motion\` reset (never on a \`Nerv*\` class), so one class of specificity always wins (Task 3.5).`,
    'Theme-wide — extend, never replace: do not spread `MuiCssBaseline: { styleOverrides: … }` over `theme` — the theme’s built-in cssBaseline override (the `nervBlink` / `nervBtnBlink` keyframes, the CRT pass, and the reduced-motion guard) would be swapped out wholesale, breaking every blink and the reduced-motion guarantee.',
    ...(meta?.customizeExtra ?? []),
  ];

  const code =
    meta?.customizeCode ??
    [
      '// Per instance — sx and classes land on the same element, consumer wins:',
      `<${doc.name} classes={{ root: 'my-${doc.slug}' }}${meta?.customizeNoSx ? '' : ' sx={{ /* one-off */ }}'} />`,
      '',
      '// Theme-wide — extra global rules via GlobalStyles: one-class selectors,',
      '// no descendant chains, no !important. GlobalStyles appends alongside the',
      '// theme’s built-in cssBaseline instead of replacing it.',
      '<GlobalStyles',
      '  styles={{',
      `    ".${root}": { /* token-driven values only — see theme/README.md */ },`,
      '  }}',
      '/>',
    ].join('\n');

  return { notes, code };
}

export default function ComponentPage() {
  const { slug = '' } = useParams();
  const doc = findComponent(slug);

  if (!doc) {
    return (
      <EmptyPanel
        title="NO SUCH COMPONENT"
        detail="That route does not match any export. Pick one from the navigation, or press ⌘K to search."
      />
    );
  }

  const meta = registry[slug];
  const seed = examples[slug];
  const api = isApi(doc);
  const src = sourceHref(doc);
  const recipe = customization(doc, meta);

  return (
    <Box>
      <PageHeader
        eyebrow={doc.group}
        title={doc.name}
        tags={
          <Stamp tone={api ? 'blue' : 'mint'} size="sm">
            {api ? 'API' : 'COMPONENT'}
          </Stamp>
        }
        lede={meta?.intro ?? doc.description}
      />

      <Box sx={{ mb: 4 }}>
        <ImportLine code={importLine(doc)} />
      </Box>

      <Stack spacing={5}>
        {seed && (
          <DocSection id="playground" title="PLAYGROUND · 実験" aside="LIVE">
            <LivePlayground code={seed} previewHeight={meta?.previewHeight} />
          </DocSection>
        )}

        {doc.example && (
          <DocSection id="example" title="EXAMPLE · 例">
            <CodeBlock code={doc.example} filename={`${doc.name} — from the source JSDoc`} />
          </DocSection>
        )}

        {(meta?.use || meta?.avoid) && (
          <DocSection id="usage" title="WHEN TO USE IT · 用法">
            <Stack spacing={2.5}>
              {meta.use && <Guidance items={meta.use} />}
              {meta.avoid && (
                <Box>
                  <Box
                    sx={(t) => ({
                      fontFamily: t.nerv.fonts.display,
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: '0.14em',
                      color: t.nerv.hue.redHi,
                      mb: 1,
                    })}
                  >
                    AVOID
                  </Box>
                  <Guidance items={meta.avoid} tone="red" />
                </Box>
              )}
            </Stack>
          </DocSection>
        )}

        <DocSection id="api" title="API · 仕様" aside={`${doc.props.length} PROPS`}>
          <PropsTable props={doc.props} />
        </DocSection>

        {meta?.edge && (
          <DocSection id="edge-cases" title="EDGE CASES · 例外">
            <Guidance items={meta.edge} />
          </DocSection>
        )}

        {meta?.perf && (
          <DocSection id="performance" title="PERFORMANCE · 性能">
            <Guidance items={meta.perf} />
          </DocSection>
        )}

        <DocSection id="customize" title="CUSTOMIZE · 改変" aside="RECIPE">
          <Stack spacing={2.5}>
            <Guidance items={recipe.notes} />
            <CodeBlock code={recipe.code} filename={`${doc.name} — customization recipe`} />
          </Stack>
        </DocSection>

        {meta?.a11y && (
          <DocSection id="accessibility" title="ACCESSIBILITY · 接近性">
            <Guidance items={meta.a11y} />
          </DocSection>
        )}

        <DocSection id="source" title="SOURCE · 出典">
          <Prose>
            {src ? (
              <Link href={src} target="_blank" rel="noreferrer">
                {doc.sourcePath}
              </Link>
            ) : (
              doc.sourcePath
            )}
          </Prose>
        </DocSection>
      </Stack>
    </Box>
  );
}
