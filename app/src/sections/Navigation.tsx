/**
 * 06 · NAVIGATION — filter rail (dims, never hides), sidebar nav with the
 * figure/ground inversion (MUI List), and MUI Tabs, Pagination, Breadcrumbs.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { Section, SpecCard, SpecGrid, ZoneTitle } from '../components/primitives';

const ROWS: [string, string, 'CRON' | 'EVENT'][] = [
  ['RT·01', 'NIGHTLY REVIEW', 'CRON'],
  ['RT·05', 'TICKET INGEST', 'EVENT'],
  ['RT·02', 'JOURNAL SYNC', 'CRON'],
];
const NAV = [
  ['工学', 'ENGINEERING'],
  ['記憶', 'KNOWLEDGE'],
  ['自動', 'AUTOMATION'],
];

export function Navigation() {
  const t = useTheme();
  const [filter, setFilter] = useState<'ALL' | 'CRON' | 'EVENT'>('ALL');
  const [nav, setNav] = useState(0);
  const [tab, setTab] = useState(0);

  return (
    <Section id="nav" idx="06" kanji="案内" title="NAVIGATION" note="Filter rails dim non-matching rows rather than hiding them. The current sidebar item uses the figure/ground inversion. Tabs, Pagination and Breadcrumbs are stock MUI.">
      <SpecGrid cols={2}>
        {/* filter rail */}
        <SpecCard label="FILTER RAIL (DIM)" src="sonnet-35" verdict="keep" verdictText="✅ FILTER" column>
          <Box sx={{ display: 'flex', gap: '5px', mb: 1.25 }}>
            {(['ALL', 'CRON', 'EVENT'] as const).map((k) => {
              const on = filter === k;
              return (
                <Box key={k} component="button" onClick={() => setFilter(k)} sx={{ border: `1px solid ${t.nerv.hue.orange}`, background: on ? t.nerv.hue.orange : t.nerv.hue.void, color: on ? t.nerv.hue.void : t.nerv.hue.orange, fontWeight: on ? 700 : 400, fontSize: 10, p: '5px 11px', cursor: 'pointer', fontFamily: t.nerv.fonts.mono, '&:focus-visible': { outline: `2px solid ${t.nerv.hue.mint}`, outlineOffset: 2 } }}>{k}</Box>
              );
            })}
          </Box>
          <Box sx={{ width: '100%' }}>
            {ROWS.map(([id, name, kind]) => {
              const dim = filter !== 'ALL' && kind !== filter;
              return (
                <Box key={id} sx={{ display: 'flex', alignItems: 'center', gap: 1, border: `1px solid ${t.nerv.hue.greenDim}`, p: '7px 10px', mb: '6px', fontSize: 11, opacity: dim ? 0.25 : 1, filter: dim ? 'grayscale(.6)' : 'none', transition: 'opacity 120ms linear' }}>
                  <Box component="span" sx={{ color: t.nerv.hue.amber, whiteSpace: 'nowrap' }}>{id}</Box>
                  <Box component="span" sx={{ color: t.nerv.hue.paper, flex: 1 }}>{name}</Box>
                  <Box component="span" sx={{ fontSize: 8, color: t.nerv.hue.greenMap, letterSpacing: '0.1em' }}>{kind}</Box>
                </Box>
              );
            })}
          </Box>
        </SpecCard>

        {/* sidebar nav */}
        <SpecCard label="SIDEBAR NAV (INVERSION)" src="MuiList · dashboard-01" verdict="keep" verdictText="✅ SIDEBAR" column>
          <List sx={{ width: '100%' }}>
            {NAV.map(([jp, en], i) => (
              <ListItemButton key={en} selected={nav === i} onClick={() => setNav(i)}>
                <ListItemText primary={`${jp}  ${en}`} />
              </ListItemButton>
            ))}
          </List>
        </SpecCard>
      </SpecGrid>

      <ZoneTitle>TABS · PAGINATION</ZoneTitle>
      <SpecGrid cols={2}>
        <SpecCard label="TABS" src="MuiTabs" column>
          <Box sx={{ width: '100%' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="BRIEF" />
              <Tab label="GATES" />
              <Tab label="ROSTER" />
            </Tabs>
          </Box>
        </SpecCard>
        <SpecCard label="PAGINATION" src="MuiPagination">
          <Pagination count={5} defaultPage={2} />
        </SpecCard>
      </SpecGrid>

      <ZoneTitle>BREADCRUMB · WIKILINK</ZoneTitle>
      <SpecGrid cols={2}>
        <SpecCard label="BREADCRUMB" src="MuiBreadcrumbs" column>
          <Breadcrumbs separator="›" sx={{ alignSelf: 'flex-start' }}>
            <Link href="#nav">KNOWLEDGE</Link>
            <Link href="#nav">CONCEPTS</Link>
            <Box component="span">FEEDBACK LOOPS</Box>
          </Breadcrumbs>
        </SpecCard>
        <SpecCard label="WIKILINK" src="wiki">
          <Box sx={{ fontSize: 13, color: t.nerv.hue.mint, textTransform: 'none', fontFamily: t.nerv.fonts.mono }}>
            learns from the{' '}
            <Box component="button" sx={{ color: t.nerv.hue.mintHi, border: 0, borderBottom: `1px dashed ${t.nerv.hue.mint}`, background: 'none', cursor: 'pointer', font: 'inherit', '&:hover': { background: t.nerv.hue.mint, color: t.nerv.hue.void } }}>[[MEMORY_VAULT]]</Box>{' '}
            archive
          </Box>
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
