/**
 * A component's page: overview · playground · guidance · API · a11y · source.
 *
 * Everything except the prose in `registry.tsx` and the seed in `examples.ts` is
 * generated from the library source, so a new export gets a working page with no
 * edits here.
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
import { registry } from '../registry';
import { findComponent, importLine, isApi, sourceHref } from '../siteData';
import { PropsTable } from './PropsTable';

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
