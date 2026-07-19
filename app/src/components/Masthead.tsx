/**
 * Masthead — eyebrow, bilingual monogram + wordmark, and the lede. The single
 * "hero" of the reference: the biggest characteristic thing (the 磁 monogram
 * boxed in chrome) paired with a small English caption, per the bilingual rule.
 */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function Masthead() {
  return (
    <Box
      component="header"
      sx={(t) => ({
        position: 'relative',
        pt: '38px',
        pb: '26px',
        mb: '6px',
        borderBottom: `2px solid ${t.nerv.hue.orange}`,
      })}
    >
      <Typography
        sx={(t) => ({
          fontFamily: t.nerv.fonts.mono,
          fontSize: 10,
          letterSpacing: '0.24em',
          color: t.nerv.hue.amber,
          mb: 2,
          '&::before': { content: '"◈ "' },
        })}
      >
        NERV/MAGI TACTICAL DESIGN SYSTEM
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2.25 }}>
        <Box
          component="span"
          sx={(t) => ({
            display: 'inline-block',
            textAlign: 'center',
            border: `1px solid ${t.nerv.hue.orange}`,
            color: t.nerv.hue.orange,
            fontFamily: t.nerv.fonts.jp,
            fontWeight: 800,
            fontSize: 34,
            lineHeight: 1,
            p: '8px 11px',
            letterSpacing: '0.1em',
            textShadow: '0 0 5px currentColor',
          })}
        >
          磁
          <Box
            component="small"
            sx={(t) => ({
              display: 'block',
              fontFamily: t.nerv.fonts.display,
              fontWeight: 700,
              fontSize: 8,
              letterSpacing: '0.16em',
              mt: '5px',
            })}
          >
            MAGI
          </Box>
        </Box>

        <Typography
          variant="h1"
          sx={(t) => ({
            fontSize: 'clamp(30px, 5vw, 54px)',
            color: t.nerv.hue.paper,
            letterSpacing: '0.02em',
            textShadow: '0 0 5px currentColor, 0 0 16px rgba(82,242,154,.3)',
          })}
        >
          JAIRUS OS
        </Typography>
      </Box>

      <Typography
        sx={(t) => ({
          mt: 2.25,
          fontFamily: t.nerv.fonts.mono,
          fontSize: 13,
          lineHeight: 1.7,
          color: t.nerv.hue.mint,
          opacity: 0.78,
          maxWidth: '74ch',
          textTransform: 'none',
          letterSpacing: '0.02em',
        })}
      >
        A black CRT command console where information glows in phosphor mint, safety orange, and blood red — dense,
        all-caps, hard-edged, bilingual, animated in abrupt mechanical steps. Every element below is a live Material UI
        component reading the same theme tokens. ✅ = confirmed keep · ⚠️ = kept with a refinement.
      </Typography>
    </Box>
  );
}
