/**
 * The playground compiler: turns an editor snippet into a live React component.
 *
 * Snippets are compiled with sucrase (JSX + TypeScript, classic runtime) and run
 * against a fixed scope — every Phosphor Console export by name, a curated set
 * of already-themed MUI primitives, and React's hooks. We import the MUI parts
 * individually (not the whole namespace) so the bundle stays tree-shaken.
 */
import { Component } from 'react';
import type { ReactNode } from 'react';
import * as React from 'react';
import { transform } from 'sucrase';
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

/** The names every snippet can reach. Mirrors the docs in `examples.ts`. */
export const SCOPE: Record<string, unknown> = {
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

/**
 * Compile a snippet into a component. The snippet is either a bare JSX
 * expression (`<Stamp>OK</Stamp>`) or a function body ending in `return` (so it
 * can declare hooks and local state). The former is wrapped in `return (…)`;
 * either way the body runs inside React's render, so hooks work.
 */
export function compile(code: string): React.ComponentType {
  const hasReturn = /(^|\n)\s*return[\s(]/.test(code);
  const src = hasReturn ? code : `return (\n${code}\n);`;
  const { code: js } = transform(src, {
    transforms: ['jsx', 'typescript'],
    jsxRuntime: 'classic',
    production: true,
  });
  const body = new Function(...SCOPE_KEYS, js) as (...args: unknown[]) => ReactNode;
  const Preview = () => body(...SCOPE_VALUES) as ReactNode;
  Preview.displayName = 'CompiledPreview';
  return Preview as React.ComponentType;
}

/** Contains render-time errors so one bad snippet can't take down the page. */
export class PreviewBoundary extends Component<
  { children: ReactNode; onError?: (msg: string) => void },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error.message);
  }

  render() {
    if (this.state.error) {
      return (
        <Typography
          sx={(t) => ({
            fontFamily: t.nerv.fonts.mono,
            fontSize: 11,
            lineHeight: 1.6,
            color: t.nerv.hue.redHi,
            textTransform: 'none',
            p: 1.5,
            textAlign: 'center',
            border: `1px solid ${t.nerv.hue.redHi}`,
          })}
        >
          {this.state.error.message}
        </Typography>
      );
    }
    return this.props.children;
  }
}
