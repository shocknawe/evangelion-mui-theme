/**
 * Playground compilation — transpile in the parent, execute in the sandbox.
 *
 * The parent only runs sucrase over the snippet and ships the transpiled body
 * to a sandboxed iframe (`SandboxPreview`). The `new Function` that executes
 * the snippet lives in `sandbox-runtime.ts`, inside an iframe sandboxed with
 * `allow-scripts` only (no `allow-same-origin`) — so a snippet can never reach
 * the doc-site's window, storage, or cookies.
 */
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { transform } from 'sucrase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * Transpile a snippet (a bare JSX expression, or a body ending in `return`)
 * into the function body the sandbox runtime executes. Throws on bad syntax.
 */
export function transpile(code: string): string {
  const hasReturn = /(^|\n)\s*return[\s(]/.test(code);
  const src = hasReturn ? code : `return (\n${code}\n);`;
  const { code: js } = transform(src, {
    transforms: ['jsx', 'typescript'],
    jsxRuntime: 'classic',
    production: true,
  });
  return js;
}

const SANDBOX_SRC = `${import.meta.env.BASE_URL}sandbox.html`;

/**
 * Renders a compiled snippet inside a sandboxed iframe. The iframe document
 * (`public/sandbox.html`) loads the bundled runtime, which executes the
 * snippet and reports errors back over postMessage. The component type is
 * stable — only the `js` prop changes — so the iframe stays mounted across
 * edits and never reloads.
 */
export function SandboxPreview({ js }: { js: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const jsRef = useRef(js);
  jsRef.current = js;
  const idRef = useRef(0);

  const post = useCallback(() => {
    const id = ++idRef.current;
    iframeRef.current?.contentWindow?.postMessage({ type: 'compile', js: jsRef.current, id }, '*');
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const { type, message } = e.data ?? {};
      if (type === 'ready') {
        readyRef.current = true;
        setReady(true);
      } else if (type === 'error') {
        setError(message ?? 'Unknown error');
      } else if (type === 'ok') {
        setError(null);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Recompile when the snippet changes, once the runtime is ready.
  useEffect(() => {
    if (!ready) return;
    setError(null);
    post();
  }, [js, ready, post]);

  // If the runtime never signals ready, surface it instead of a silent blank.
  useEffect(() => {
    if (ready) return;
    const t = setTimeout(() => {
      if (!readyRef.current) setError('Preview runtime failed to load.');
    }, 5000);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 120 }}>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="sandboxed preview"
        src={SANDBOX_SRC}
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
      {error && (
        <Typography
          sx={(t) => ({
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            p: 1.5,
            fontFamily: t.nerv.fonts.mono,
            fontSize: 11,
            lineHeight: 1.6,
            color: t.nerv.hue.redHi,
            textTransform: 'none',
            textAlign: 'center',
            background: t.nerv.hue.void,
            border: `1px solid ${t.nerv.hue.redHi}`,
          })}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Error boundary for the preview pane. With the sandbox, render errors are
 * caught inside the iframe and reported via postMessage, so this only guards
 * the SandboxPreview wrapper itself — kept as a safety net.
 */
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
