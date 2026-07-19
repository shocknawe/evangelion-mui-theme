/**
 * The two-column reference shell: a sticky left rail (brand + scroll-spy TOC +
 * source meta) and the scrolling main column. Collapses to a stacked layout at
 * the md breakpoint (1000px), mirroring design-system.html.
 */
import { useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';

const TOC = [
  { id: 'foundations', k: '基', label: 'FOUNDATIONS' },
  { id: 'atoms', k: '原', label: 'ATOMS' },
  { id: 'forms', k: '申', label: 'FORM CONTROLS' },
  { id: 'data', k: '図', label: 'DATA DISPLAY' },
  { id: 'feedback', k: '応', label: 'FEEDBACK' },
  { id: 'nav', k: '案', label: 'NAVIGATION' },
  { id: 'patterns', k: '構', label: 'PATTERNS' },
];

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-15% 0px -75% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function Shell({ children }: { children: ReactNode }) {
  const active = useScrollSpy(TOC.map((t) => t.id));

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '214px 1fr' }, minHeight: '100vh' }}>
      <Box
        component="aside"
        sx={(t) => ({
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          height: { xs: 'auto', md: '100vh' },
          overflowY: 'auto',
          zIndex: 5,
          p: '16px 12px',
          backgroundColor: 'rgba(10,10,10,.97)',
          borderRight: { xs: 0, md: `2px solid ${t.nerv.hue.orange}` },
          borderBottom: { xs: `2px solid ${t.nerv.hue.orange}`, md: 0 },
          boxShadow: { xs: 'none', md: '2px 0 14px rgba(242,100,0,.14)' },
          '&::-webkit-scrollbar': { width: 7 },
          '&::-webkit-scrollbar-thumb': { background: t.nerv.hue.greenDim },
        })}
      >
        {/* brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={(t) => ({
              width: 14,
              height: 14,
              backgroundColor: t.nerv.hue.mint,
              boxShadow: `0 0 8px ${t.nerv.hue.mint}`,
              transform: 'rotate(45deg)',
            })}
          />
          <Box
            component="b"
            sx={(t) => ({
              fontFamily: t.nerv.fonts.display,
              fontWeight: 700,
              fontSize: 17,
              color: t.nerv.hue.mintHi,
              textShadow: '0 0 6px rgba(82,242,154,.5)',
              letterSpacing: '0.03em',
            })}
          >
            JAIRUS_OS
          </Box>
        </Box>
        <Box
          sx={(t) => ({
            fontFamily: t.nerv.fonts.mono,
            fontSize: 8,
            color: t.nerv.hue.orange,
            letterSpacing: '0.14em',
            m: '2px 0 16px 22px',
          })}
        >
          DESIGN SYSTEM · v1
        </Box>

        {/* TOC */}
        <Box component="nav" sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, flexWrap: 'wrap' }}>
          {TOC.map((item) => {
            const on = active === item.id;
            return (
              <Box
                key={item.id}
                component="a"
                href={`#${item.id}`}
                sx={(t) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.125,
                  fontFamily: t.nerv.fonts.mono,
                  fontSize: 11,
                  p: '6px 9px',
                  color: on ? t.nerv.hue.mintHi : t.nerv.hue.mint,
                  opacity: on ? 1 : 0.66,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderLeft: `2px solid ${on ? t.nerv.hue.mint : 'transparent'}`,
                  backgroundColor: on ? 'rgba(82,242,154,.08)' : 'transparent',
                  '&:hover': { opacity: 1, backgroundColor: 'rgba(82,242,154,.05)' },
                })}
              >
                <Box
                  component="span"
                  sx={(t) => ({ fontFamily: t.nerv.fonts.jp, fontSize: 13, width: 16, textTransform: 'none' })}
                >
                  {item.k}
                </Box>
                {item.label}
              </Box>
            );
          })}
        </Box>

        {/* source meta */}
        <Box
          sx={(t) => ({
            mt: 2,
            pt: 1.5,
            fontFamily: t.nerv.fonts.mono,
            fontSize: 9,
            color: t.nerv.hue.amber,
            lineHeight: 1.5,
            letterSpacing: '0.06em',
            borderTop: `1px solid ${t.nerv.hue.greenDim}`,
            '& b': { color: t.nerv.hue.orange, fontWeight: 400 },
          })}
        >
          <div>
            <b>SOURCE:</b> 8 PAGES · 34 EXP · 23 GIF
          </div>
          <div>
            <b>DRIFT:</b> 0 · <b>SCORE:</b> 92/100
          </div>
          <div>
            <b>DOC:</b> design-system.md
          </div>
        </Box>
      </Box>

      <Box component="main" sx={{ minWidth: 0, px: { xs: '18px', sm: '32px', lg: '52px' }, pb: '90px' }}>
        {children}
      </Box>
    </Box>
  );
}
