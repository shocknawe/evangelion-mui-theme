/**
 * MUI / EVERYTHING ELSE — a broad gallery of the stock MUI surface the theme
 * dresses: inputs, data display, feedback, navigation, and surfaces. Every
 * widget below is an unmodified `@mui/material` import; the look is 100% theme
 * overrides (theme/components/*.ts), not page-level `sx`.
 */
import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Pagination from '@mui/material/Pagination';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { DocSection, PageHeader, Prose, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

/** A tiny orange mono caption over a demo widget — layout only, no restyle. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
      <Box
        component="span"
        sx={(t) => ({
          fontFamily: t.nerv.fonts.mono,
          fontSize: 9,
          letterSpacing: '0.14em',
          color: t.nerv.hue.orange,
        })}
      >
        {label}
      </Box>
      {children}
    </Box>
  );
}

export default function MuiGallery() {
  const [selectValue, setSelectValue] = useState('core');
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('a');
  const [sliderValue, setSliderValue] = useState(40);
  const [listSelected, setListSelected] = useState(0);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | false>('panel1');

  return (
    <>
      <PageHeader
        eyebrow="THEMED MUI"
        title="EVERYTHING ELSE"
        lede="These are stock @mui/material imports with zero extra styling on this page. Every hard corner, mint focus ring, and boxed stamp below comes from the theme's component overrides in theme/components/ — a consumer gets this whole surface for free just by mounting the ThemeProvider."
      />

      <DocSection id="inputs" title="INPUTS">
        <Prose>
          TextField/OutlinedInput/InputBase share one field grammar: a void field, a dim idle border, a mint
          border + glow ring on focus. Checked/selected states use the mint inversion; error state turns the
          border and label red.
        </Prose>
        <DemoStage>
          <Field label="TEXT FIELD">
            <TextField placeholder="CALLSIGN" defaultValue="UNIT-731" />
          </Field>
          <Field label="OUTLINED INPUT">
            <FormControl variant="outlined">
              <InputLabel htmlFor="gallery-raw-input">RAW FIELD</InputLabel>
              <OutlinedInput id="gallery-raw-input" label="RAW FIELD" placeholder="TYPE HERE" />
            </FormControl>
          </Field>
          <Field label="SELECT">
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel id="gallery-select-label">MODE</InputLabel>
              <Select
                labelId="gallery-select-label"
                label="MODE"
                value={selectValue}
                onChange={(e: SelectChangeEvent) => setSelectValue(e.target.value)}
              >
                <MenuItem value="nano">NANO</MenuItem>
                <MenuItem value="core">CORE</MenuItem>
                <MenuItem value="max">MAX</MenuItem>
              </Select>
            </FormControl>
          </Field>
          <Field label="CHECKBOX">
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(_, v) => setChecked(v)} />}
              label="Auto-approve routine gates"
            />
          </Field>
          <Field label="RADIO">
            <RadioGroup row value={radio} onChange={(e) => setRadio(e.target.value)}>
              <FormControlLabel value="a" control={<Radio />} label="ALPHA" />
              <FormControlLabel value="b" control={<Radio />} label="BETA" />
            </RadioGroup>
          </Field>
          <Field label="SWITCH">
            <FormControlLabel control={<Switch defaultChecked />} label="Push notifications" />
          </Field>
          <Field label="SLIDER">
            <Box sx={{ width: 160 }}>
              <Slider value={sliderValue} onChange={(_, v) => setSliderValue(v as number)} />
            </Box>
          </Field>
        </DemoStage>
        <CodeBlock
          filename="Inputs.tsx"
          code={`<TextField placeholder="CALLSIGN" defaultValue="UNIT-731" />

<FormControl>
  <InputLabel id="mode">MODE</InputLabel>
  <Select labelId="mode" label="MODE" value={mode} onChange={(e) => setMode(e.target.value)}>
    <MenuItem value="core">CORE</MenuItem>
  </Select>
</FormControl>

<FormControlLabel control={<Checkbox checked={checked} onChange={(_, v) => setChecked(v)} />} label="Auto-approve routine gates" />
<Switch defaultChecked />
<Slider value={value} onChange={(_, v) => setValue(v)} />`}
        />
      </DocSection>

      <DocSection id="data-display" title="DATA DISPLAY">
        <Prose>
          A Chip is a boxed stamp: outlined (default) is a hairline on void, <code>variant=&quot;stamp&quot;</code>{' '}
          is the solid-fill inverse. The <code>color</code> prop drives the state hue — success = mint, info =
          blue, warning = amber, error = red.
        </Prose>
        <DemoStage>
          <Field label="CHIP — OUTLINED">
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="NOMINAL" color="success" />
              <Chip label="PENDING" color="info" />
              <Chip label="CAUTION" color="warning" />
              <Chip label="CRITICAL" color="error" />
            </Box>
          </Field>
          <Field label="CHIP — STAMP">
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="APPROVED" color="success" variant="stamp" />
              <Chip label="BLOCKED" color="error" variant="stamp" />
            </Box>
          </Field>
          <Field label="TOOLTIP">
            <Tooltip title="APPROVE THIS GATE">
              <Button variant="ghost">HOVER ME</Button>
            </Tooltip>
          </Field>
          <Field label="AVATAR / BADGE">
            <Badge badgeContent={4} color="error">
              <Avatar>OP</Avatar>
            </Badge>
          </Field>
        </DemoStage>
        <DemoStage flush column minHeight={0}>
          <Table size="small" sx={{ minWidth: 340 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell align="right">PRIORITY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow selected>
                <TableCell>GATE·04</TableCell>
                <TableCell>PENDING</TableCell>
                <TableCell align="right">AAA</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>GATE·07</TableCell>
                <TableCell>RESOLVED</TableCell>
                <TableCell align="right">B++</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DemoStage>
        <DemoStage flush minHeight={0}>
          <List sx={{ width: 240 }}>
            {['ENGINEERING', 'KNOWLEDGE', 'AUTOMATION'].map((label, i) => (
              <ListItemButton key={label} selected={listSelected === i} onClick={() => setListSelected(i)}>
                <ListItemText primary={label} secondary={`SECTION ${i + 1}`} />
              </ListItemButton>
            ))}
          </List>
        </DemoStage>
        <DemoStage>
          <Divider sx={{ width: '100%' }} />
        </DemoStage>
        <CodeBlock
          filename="DataDisplay.tsx"
          code={`<Chip label="NOMINAL" color="success" />
<Chip label="APPROVED" color="success" variant="stamp" />

<Table size="small">
  <TableHead>
    <TableRow><TableCell>ID</TableCell><TableCell>STATUS</TableCell></TableRow>
  </TableHead>
  <TableBody>
    <TableRow selected><TableCell>GATE·04</TableCell><TableCell>PENDING</TableCell></TableRow>
  </TableBody>
</Table>

<List>
  <ListItemButton selected={selected}><ListItemText primary="ENGINEERING" /></ListItemButton>
</List>`}
        />
      </DocSection>

      <DocSection id="feedback" title="FEEDBACK">
        <Prose>
          Alerts are boxed and colored by <code>severity</code> — never a soft tinted card. Dialog is the
          double-frame chamfered modal shell; Snackbar reuses the same boxed callout grammar as Tooltip.
        </Prose>
        <DemoStage column>
          <Alert severity="success">NOMINAL — ALL SYSTEMS GREEN.</Alert>
          <Alert severity="info">PENDING — AWAITING REVIEW.</Alert>
          <Alert severity="warning">CAUTION — THRESHOLD NEAR.</Alert>
          <Alert severity="error">CRITICAL — GATE BLOCKED.</Alert>
        </DemoStage>
        <DemoStage>
          <Button variant="ghost" onClick={() => setSnackbarOpen(true)}>
            SHOW SNACKBAR
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message="GATE·04 APPROVED"
          />
          <Button variant="ghost" onClick={() => setDialogOpen(true)}>
            OPEN DIALOG
          </Button>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>CONFIRM DISPATCH</DialogTitle>
            <DialogContent>
              <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 13, textTransform: 'none' })}>
                Dispatch unit to sector 7. Confirm?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                CANCEL
              </Button>
              <Button variant="contained" onClick={() => setDialogOpen(false)}>
                CONFIRM
              </Button>
            </DialogActions>
          </Dialog>
        </DemoStage>
        <DemoStage>
          <Field label="LINEAR PROGRESS">
            <Box sx={{ width: 160 }}>
              <LinearProgress variant="determinate" value={68} />
            </Box>
          </Field>
          <Field label="CIRCULAR PROGRESS">
            <CircularProgress variant="determinate" value={72} />
          </Field>
          <Field label="SKELETON">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Skeleton variant="text" width={140} />
              <Skeleton variant="rectangular" width={140} height={44} />
            </Box>
          </Field>
        </DemoStage>
        <CodeBlock
          filename="Feedback.tsx"
          code={`<Alert severity="success">NOMINAL — ALL SYSTEMS GREEN.</Alert>

<Snackbar open={open} autoHideDuration={3000} onClose={close} message="GATE·04 APPROVED" />

<Dialog open={open} onClose={close}>
  <DialogTitle>CONFIRM DISPATCH</DialogTitle>
  <DialogContent>…</DialogContent>
  <DialogActions>
    <Button variant="ghost" onClick={close}>CANCEL</Button>
    <Button variant="contained" onClick={confirm}>CONFIRM</Button>
  </DialogActions>
</Dialog>

<LinearProgress variant="determinate" value={68} />
<CircularProgress variant="determinate" value={72} />
<Skeleton variant="rectangular" width={140} height={44} />`}
        />
      </DocSection>

      <DocSection id="navigation" title="NAVIGATION">
        <Prose>
          Selected/current states share the mint inversion or a mint indicator line everywhere: Tabs, Menu,
          Pagination, the current Breadcrumbs crumb.
        </Prose>
        <DemoStage flush column minHeight={0}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="OVERVIEW" />
            <Tab label="GATES" />
            <Tab label="LOGS" />
          </Tabs>
        </DemoStage>
        <DemoStage>
          <Breadcrumbs>
            <Link href="#/mui/gallery">HOME</Link>
            <Link href="#/mui/gallery">COMPONENTS</Link>
            <Box component="span">GALLERY</Box>
          </Breadcrumbs>
        </DemoStage>
        <DemoStage>
          <Pagination count={6} page={page} onChange={(_, v) => setPage(v)} />
        </DemoStage>
        <DemoStage>
          <Button variant="ghost" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            OPEN MENU
          </Button>
          <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => setMenuAnchor(null)}>APPROVE</MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>DENY</MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>DEFER</MenuItem>
          </Menu>
          <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
            OPEN DRAWER
          </Button>
          <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 240, p: 2 }}>
              <Typography variant="h3" sx={(t) => ({ fontSize: 16, color: t.nerv.hue.paper })}>
                NAV DRAWER
              </Typography>
              <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 12, textTransform: 'none', mt: 1 })}>
                A MuiDrawer paper carries a 2px orange edge and a panel glow.
              </Typography>
            </Box>
          </Drawer>
        </DemoStage>
        <DemoStage flush column minHeight={0}>
          <Accordion expanded={expanded === 'panel1'} onChange={() => setExpanded(expanded === 'panel1' ? false : 'panel1')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>SECTION 01 — SCOPE</AccordionSummary>
            <AccordionDetails>
              <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 12, textTransform: 'none' })}>
                Flat rows divided by chrome hairlines — no rounding, no shadow.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={() => setExpanded(expanded === 'panel2' ? false : 'panel2')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>SECTION 02 — RISK</AccordionSummary>
            <AccordionDetails>
              <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 12, textTransform: 'none' })}>
                Expanded border tints orange; the summary label goes mint.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </DemoStage>
        <CodeBlock
          filename="Navigation.tsx"
          code={`<Tabs value={tab} onChange={(_, v) => setTab(v)}>
  <Tab label="OVERVIEW" />
</Tabs>

<Pagination count={6} page={page} onChange={(_, v) => setPage(v)} />

<Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
  <MenuItem onClick={close}>APPROVE</MenuItem>
</Menu>

<Accordion expanded={expanded === 'panel1'} onChange={toggle}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>SECTION 01 — SCOPE</AccordionSummary>
  <AccordionDetails>…</AccordionDetails>
</Accordion>`}
        />
      </DocSection>

      <DocSection id="surfaces" title="SURFACES">
        <Prose>
          No elevation anywhere. A surface is a void fill with a 1–2px orange border and a faint inset glow.
          Paper carries two custom variants: <code>chamfer</code> (a mint-bordered hero panel with a cut corner)
          and <code>frame</code> (the double-frame command shell).
        </Prose>
        <DemoStage>
          <Paper sx={{ p: 2, width: 170, textAlign: 'center' }}>
            <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 11 })}>DEFAULT</Typography>
          </Paper>
          <Paper variant="chamfer" sx={{ p: 2, width: 170, textAlign: 'center' }}>
            <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 11 })}>CHAMFER</Typography>
          </Paper>
          <Paper variant="frame" sx={{ p: 2, width: 170, textAlign: 'center' }}>
            <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 11 })}>FRAME</Typography>
          </Paper>
        </DemoStage>
        <DemoStage>
          <Card sx={{ width: 260 }}>
            <CardHeader title="GATE·04" subheader="API SECURITY GATEWAY" />
            <CardContent>
              <Typography sx={(t) => ({ fontFamily: t.nerv.fonts.mono, fontSize: 12, textTransform: 'none' })}>
                3 PRs waiting for review.
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="ghost" size="small">
                REVIEW
              </Button>
            </CardActions>
          </Card>
        </DemoStage>
        <DemoStage flush minHeight={0}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h3" sx={{ fontSize: 14 }}>
                PHOSPHOR_CONSOLE
              </Typography>
            </Toolbar>
          </AppBar>
        </DemoStage>
        <CodeBlock
          filename="Surfaces.tsx"
          code={`<Paper sx={{ p: 2 }}>DEFAULT</Paper>
<Paper variant="chamfer" sx={{ p: 2 }}>CHAMFER</Paper>
<Paper variant="frame" sx={{ p: 2 }}>FRAME</Paper>

<Card>
  <CardHeader title="GATE·04" subheader="API SECURITY GATEWAY" />
  <CardContent>…</CardContent>
  <CardActions><Button variant="ghost" size="small">REVIEW</Button></CardActions>
</Card>

<AppBar position="static">
  <Toolbar>PHOSPHOR_CONSOLE</Toolbar>
</AppBar>`}
        />
      </DocSection>
    </>
  );
}
