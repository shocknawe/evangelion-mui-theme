/**
 * MUI / BUTTONS & ACTIONS — every clickable primitive the theme overrides:
 * Button (stock variants + the custom ghost/alt/stamp), the nerv-live blink
 * modifier, IconButton, ButtonGroup, and Fab.
 */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { DocSection, PageHeader, Prose, Guidance, DemoStage } from '../../docs/chrome';
import { CodeBlock } from '../../docs/CodeBlock';

export default function MuiButtons() {
  return (
    <>
      <PageHeader
        eyebrow="THEMED MUI"
        title="BUTTONS & ACTIONS"
        lede="Every clickable primitive MUI ships carries the Phosphor Console grammar out of the box — hard corners, no ripple, mechanical hover snaps. The default contained button is a mint outline at rest that fills solid on hover, the figure/ground inversion the whole system runs on. Three custom variants extend the vocabulary beyond stock MUI."
      />

      <DocSection id="variants" title="VARIANTS">
        <Prose>
          Contained is the theme default (an outline that fills mint on hover). Outlined and text are quieter
          stock faces carrying an orange hairline and a mono label respectively. Ghost, alt, and stamp are custom
          variants declared in the theme&rsquo;s TypeScript augmentation and implemented in theme/components/buttons.ts.
        </Prose>
        <DemoStage>
          <Button variant="contained">CONTAINED</Button>
          <Button variant="outlined">OUTLINED</Button>
          <Button variant="text">TEXT</Button>
          <Button variant="ghost">GHOST</Button>
          <Button variant="alt">ALT</Button>
          <Button variant="stamp">STAMP</Button>
        </DemoStage>
        <CodeBlock
          filename="Variants.tsx"
          code={`<Button variant="contained">CONTAINED</Button>
<Button variant="outlined">OUTLINED</Button>
<Button variant="text">TEXT</Button>
<Button variant="ghost">GHOST</Button>
<Button variant="alt">ALT</Button>
<Button variant="stamp">STAMP</Button>`}
        />
      </DocSection>

      <DocSection id="stamp-selected" title="STAMP — SELECTED">
        <Prose>
          A stamp button inverts to a solid, blinking mint fill on{' '}
          <code>.Mui-selected</code> (or <code>aria-pressed=&quot;true&quot;</code>) — the boxed, pressable status the
          filter-rail and mode-toggle patterns use.
        </Prose>
        <DemoStage>
          <Button variant="stamp">IDLE</Button>
          <Button variant="stamp" className="Mui-selected">
            SELECTED
          </Button>
        </DemoStage>
        <CodeBlock
          filename="StampSelected.tsx"
          code={`<Button variant="stamp">IDLE</Button>
<Button variant="stamp" className="Mui-selected">SELECTED</Button>`}
        />
      </DocSection>

      <DocSection id="sizes" title="SIZES">
        <Prose>Small, medium (default), and large — the same hard-cornered grammar at three scales.</Prose>
        <DemoStage>
          <Button variant="contained" size="small">
            SMALL
          </Button>
          <Button variant="contained" size="medium">
            MEDIUM
          </Button>
          <Button variant="contained" size="large">
            LARGE
          </Button>
        </DemoStage>
        <CodeBlock
          filename="Sizes.tsx"
          code={`<Button variant="contained" size="small">SMALL</Button>
<Button variant="contained" size="medium">MEDIUM</Button>
<Button variant="contained" size="large">LARGE</Button>`}
        />
      </DocSection>

      <DocSection id="states" title="STATES">
        <Prose>
          Disabled dims to the disabled ink over a dim border rather than fading opacity uniformly. Full width
          stretches to fill its container — the sidebar-action pattern.
        </Prose>
        <DemoStage column>
          <Box sx={{ display: 'flex', gap: 1.75, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" disabled>
              DISABLED
            </Button>
            <Button variant="outlined" disabled>
              DISABLED
            </Button>
            <Button variant="ghost" disabled>
              DISABLED
            </Button>
          </Box>
          <Button variant="alt" fullWidth>
            INITIALIZE PROTOCOL
          </Button>
        </DemoStage>
        <CodeBlock
          filename="States.tsx"
          code={`<Button variant="contained" disabled>DISABLED</Button>

<Button variant="alt" fullWidth>INITIALIZE PROTOCOL</Button>`}
        />
      </DocSection>

      <DocSection id="live" title="LIVE ACTION">
        <Prose>
          Add <code>className=&quot;nerv-live&quot;</code> to any button to mark it as the current in-progress
          action — a mechanical 1 Hz blink (<code>steps()</code>, never eased), with a settled reduced-motion
          fallback baked into the keyframe.
        </Prose>
        <DemoStage>
          <Button variant="contained" className="nerv-live">
            RESUME SESSION
          </Button>
        </DemoStage>
        <CodeBlock
          filename="LiveAction.tsx"
          code={`<Button variant="contained" className="nerv-live">
  RESUME SESSION
</Button>`}
        />
      </DocSection>

      <DocSection id="icon-button" title="ICON BUTTON">
        <Prose>MuiIconButton is themed: hard corners, mint hover, amber focus ring.</Prose>
        <DemoStage>
          <IconButton aria-label="settings">
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </DemoStage>
        <CodeBlock
          filename="IconButton.tsx"
          code={`<IconButton aria-label="settings">
  <SettingsIcon />
</IconButton>`}
        />
      </DocSection>

      <DocSection id="button-group" title="BUTTON GROUP">
        <Prose>
          MuiButtonGroup fuses its members with a shared chrome hairline between segments — no rounding, no gap.
        </Prose>
        <DemoStage>
          <ButtonGroup variant="outlined">
            <Button>NANO</Button>
            <Button>CORE</Button>
            <Button>MAX</Button>
          </ButtonGroup>
        </DemoStage>
        <CodeBlock
          filename="ButtonGroup.tsx"
          code={`<ButtonGroup variant="outlined">
  <Button>NANO</Button>
  <Button>CORE</Button>
  <Button>MAX</Button>
</ButtonGroup>`}
        />
      </DocSection>

      <DocSection id="fab" title="FAB">
        <Prose>MuiFab is themed as a hard-cornered solid mint square with a mint glow — no elevation, no circle.</Prose>
        <DemoStage>
          <Fab aria-label="add">
            <AddIcon />
          </Fab>
        </DemoStage>
        <CodeBlock
          filename="Fab.tsx"
          code={`<Fab aria-label="add">
  <AddIcon />
</Fab>`}
        />
      </DocSection>

      <DocSection id="which-one" title="WHICH ONE WHEN">
        <Guidance
          items={[
            'Contained — the primary act on the screen: submit, resume, confirm.',
            'Ghost — a quiet secondary action sitting beside a primary one.',
            'Alt — chrome-level / utility actions such as nav triggers and protocol switches; the orange stays chrome, never a data value.',
            'Stamp — a status you can press: a toggleable filter, a selectable mode, a live/selected action.',
          ]}
        />
      </DocSection>
    </>
  );
}
