/**
 * 05 · FEEDBACK — MUI Alert severities (theme-colored), the tri-channel hazard
 * Y/N prompt, and a live double-frame MUI Dialog. Modals keep one focal job.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { Section, SpecCard, SpecGrid, ZoneTitle } from '../components/primitives';

export function Feedback() {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  const trigger = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 120);
  };

  return (
    <Section id="feedback" idx="05" kanji="応答" title="FEEDBACK" note="Alerts are boxed and colored by state (never a soft tinted card) and always give the operator a response. The dialog is the double-frame command shell.">
      <ZoneTitle>ALERTS · MuiAlert</ZoneTitle>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 1 }}>
        <Alert severity="success">GATE 0771 APPROVED — ROUTED TO ENGINEERING</Alert>
        <Alert severity="info">3 GATES AWAITING ARBITRATION</Alert>
        <Alert severity="warning">
          <AlertTitle>VIBRATION HIGH</AlertTitle>
          PUMP·B SECONDARY DRIVE EXCEEDS TOLERANCE
        </Alert>
        <Alert severity="error" variant="filled">
          UPLINK LOST — VEGA·1 UNREACHABLE
        </Alert>
      </Box>

      <ZoneTitle>PROMPT · MODAL</ZoneTitle>
      <SpecGrid cols={2}>
        {/* tri-channel hazard prompt */}
        <SpecCard label="ALERT / Y-N PROMPT" src="exp-02 · dashboard-01" verdict="keep" verdictText="✅ Y/N" column flush>
          <Box
            role="button"
            tabIndex={0}
            aria-label="decide"
            onClick={trigger}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } }}
            sx={{
              position: 'relative',
              border: `2px solid ${t.nerv.hue.redHi}`,
              background: t.nerv.hue.redHi,
              height: 150,
              width: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              filter: flash ? 'invert(1)' : 'none',
            }}
          >
            <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: 'repeating-linear-gradient(-45deg, #000 0 10px, transparent 10px 20px)' }} />
            <Box sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 20, color: t.nerv.hue.void, border: `2px solid ${t.nerv.hue.void}`, p: '1px 12px', letterSpacing: '0.4em', textIndent: '0.4em' }}>裁定</Box>
            <Box sx={{ background: t.nerv.hue.void, width: '100%', textAlign: 'center', py: '4px' }}>
              <Box sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 44, lineHeight: 1, color: t.nerv.hue.redHi }}>DECIDE</Box>
            </Box>
            <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: 'repeating-linear-gradient(-45deg, #000 0 10px, transparent 10px 20px)' }} />
          </Box>
        </SpecCard>

        {/* live MUI dialog */}
        <SpecCard label="MODAL (DOUBLE FRAME)" src="MuiDialog" verdict="warn" verdictText="⚠️ ONE JOB" column>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start', width: '100%' }}>
            <Box sx={{ fontSize: 11, color: t.nerv.hue.greenMap, textTransform: 'none', lineHeight: 1.5, fontFamily: t.nerv.fonts.mono }}>
              A gate is a decision that waits for you. Open the command modal to route it, set priority, and submit for arbitration.
            </Box>
            <Button variant="alt" onClick={() => setOpen(true)}>FILE A GATE</Button>
          </Box>
        </SpecCard>
      </SpecGrid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.jp, fontWeight: 800, fontSize: 26, color: t.nerv.hue.orange, textShadow: '0 0 4px currentColor', display: 'block' }}>申請</Box>
            <Box component="span" sx={{ fontFamily: t.nerv.fonts.display, fontSize: 8, letterSpacing: '0.2em', color: t.nerv.hue.amber }}>FILING</Box>
          </Box>
          <Box sx={{ fontSize: 11, color: t.nerv.hue.orange, letterSpacing: '0.05em', fontFamily: t.nerv.fonts.mono, textAlign: 'right', '& b': { color: t.nerv.hue.amberDim, fontWeight: 400 } }}>
            <div>CODE:<b>0771</b></div>
            <div>EX_MODE:<b>MANUAL</b></div>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ fontFamily: t.nerv.fonts.display, fontWeight: 700, fontSize: 18, color: t.nerv.hue.paper, mb: 1 }}>FILE A GATE</Box>
          <Box sx={{ height: 7, borderTop: `2px solid ${t.nerv.hue.teal}`, borderBottom: `2px solid ${t.nerv.hue.teal}`, my: 1.25 }} />
          <Box sx={{ fontSize: 11, color: t.nerv.hue.greenMap, textTransform: 'none', lineHeight: 1.5, fontFamily: t.nerv.fonts.mono }}>
            A gate is a decision that waits for you. Route it, set priority, submit for arbitration.
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="ghost" onClick={() => setOpen(false)}>CANCEL</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>SUBMIT</Button>
        </DialogActions>
      </Dialog>
    </Section>
  );
}
