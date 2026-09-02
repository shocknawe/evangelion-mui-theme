/**
 * 06 · NAVIGATION — the FilterRail and WikiLink library components beside stock
 * MUI (List with the figure/ground inversion, Tabs, Pagination, Breadcrumbs).
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { FilterRail, WikiLink } from '@components';
import { Section, SpecCard, SpecGrid, ZoneTitle } from '../components/primitives';

const NAV = [
  ['工学', 'ENGINEERING'],
  ['記憶', 'KNOWLEDGE'],
  ['自動', 'AUTOMATION'],
];

export function Navigation() {
  const t = useTheme();
  const [nav, setNav] = useState(0);
  const [tab, setTab] = useState(0);

  return (
    <Section id="nav" idx="06" kanji="案内" title="NAVIGATION" note="Filter rails dim non-matching rows rather than hiding them. The current sidebar item uses the figure/ground inversion. Tabs, Pagination and Breadcrumbs are stock MUI; FilterRail and WikiLink are @components.">
      <SpecGrid cols={2}>
        {/* filter rail */}
        <SpecCard label="FILTER RAIL (DIM)" src="<FilterRail/>" verdict="keep" verdictText="✅ FILTER" column>
          <FilterRail
            filters={['ALL', 'CRON', 'EVENT']}
            rows={[
              { id: 'RT·01', name: 'NIGHTLY REVIEW', kind: 'CRON' },
              { id: 'RT·05', name: 'TICKET INGEST', kind: 'EVENT' },
              { id: 'RT·02', name: 'JOURNAL SYNC', kind: 'CRON' },
            ]}
          />
        </SpecCard>

        {/* sidebar nav */}
        <SpecCard label="SIDEBAR NAV (INVERSION)" src="MuiList · dashboard-01" verdict="keep" verdictText="✅ SIDEBAR" column>
          <List sx={{ width: '100%' }}>
            {NAV.map(([jp, en], i) => (
              <ListItem key={en} disablePadding>
                <ListItemButton selected={nav === i} onClick={() => setNav(i)}>
                  <ListItemText primary={`${jp}  ${en}`} />
                </ListItemButton>
              </ListItem>
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
        <SpecCard label="WIKILINK" src="<WikiLink/>">
          <Box sx={{ fontSize: 13, color: t.nerv.hue.mint, textTransform: 'none', fontFamily: t.nerv.fonts.mono }}>
            learns from the <WikiLink>[[MEMORY_VAULT]]</WikiLink> archive
          </Box>
        </SpecCard>
      </SpecGrid>
    </Section>
  );
}
