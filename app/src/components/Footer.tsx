import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

export function Footer() {
  const t = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        mt: 7.5,
        borderTop: `2px solid ${t.nerv.hue.orange}`,
        py: 2.25,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        fontSize: 10,
        color: t.nerv.hue.greenMap,
        letterSpacing: '0.08em',
        fontFamily: t.nerv.fonts.mono,
        '& .g': { color: t.nerv.hue.mint },
      }}
    >
      <span className="g">◉ TOKENS: 14 COLOR · 3 TYPE</span>
      <span>◉ 0 DRIFT</span>
      <span>◉ DARK-ONLY</span>
      <Box component="span" sx={{ ml: 'auto' }}>theme/tokens.ts</Box>
      <span className="g">© JAIRUS_OS · KESTREL·4</span>
    </Box>
  );
}
