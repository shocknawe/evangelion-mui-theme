import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@theme';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Single dark scheme — the canonical Phosphor Console. CssBaseline installs
        the CRT pass, keyframes, and reduced-motion guard. */}
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
