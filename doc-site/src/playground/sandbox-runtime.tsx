/**
 * Sandbox runtime — executes compiled snippets INSIDE the sandboxed preview
 * iframe, never in the parent page.
 *
 * Bundled as a classic (IIFE) script by `vite.sandbox.config.ts` and loaded by
 * `public/sandbox.html`. The iframe is sandboxed with `allow-scripts` only (no
 * `allow-same-origin`), so it has an opaque origin: no cookies, no
 * localStorage, no access to the parent document. A snippet can still touch
 * `window`/`document`/`fetch` *here*, but they are the iframe's own — the
 * blast radius is a throwaway document, not the doc-site.
 *
 * The parent posts `{ type: 'compile', js, id }`; we build the function with
 * the same SCOPE the parent transpiled against, render it, and reply
 * `{ type: 'ok' | 'error', id, message? }`.
 */
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@theme';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import * as Phosphor from '@components';

const SCOPE: Record<string, unknown> = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useMemo: React.useMemo,
  useRef: React.useRef,
  Box,
  Stack,
  Button,
  Typography,
  TextField,
  OutlinedInput,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Slider,
  Chip,
  Divider,
  IconButton,
  Alert,
  Paper,
  LinearProgress,
  ...Phosphor,
};
const SCOPE_KEYS = Object.keys(SCOPE);
const SCOPE_VALUES = SCOPE_KEYS.map((k) => SCOPE[k]);

/** Contain a throwing snippet so the iframe shows a message, not a blank. */
class Boundary extends React.Component<{ children: React.ReactNode; onError: (msg: string) => void }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error.message);
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

let root: Root | null = null;

function post(data: unknown) {
  window.parent?.postMessage(data, '*');
}

window.addEventListener('message', (e) => {
  const { type, js, id } = e.data ?? {};
  if (type !== 'compile' || typeof js !== 'string') return;
  try {
    const body = new Function(...SCOPE_KEYS, js) as (...args: unknown[]) => React.ReactNode;
    const el = document.getElementById('root');
    if (!el) throw new Error('sandbox root missing');
    if (!root) root = createRoot(el);
    // `key={id}` forces a fresh Boundary so a previous snippet's caught error
    // doesn't stick to the next render. The ThemeProvider is required — every
    // component reads `theme.nerv.*`, and the iframe has no other provider.
    root.render(
      <ThemeProvider theme={theme} defaultMode="dark">
        <Boundary key={id} onError={(msg) => post({ type: 'error', id, message: msg })}>
          {body(...SCOPE_VALUES)}
        </Boundary>
      </ThemeProvider>,
    );
    post({ type: 'ok', id });
  } catch (err) {
    post({ type: 'error', id, message: err instanceof Error ? err.message : String(err) });
  }
});

post({ type: 'ready' });
