/**
 * Task 6.3 — reduced-motion final/static-state verification.
 *
 * The source scan makes the public-component inventory fail closed: adding a
 * timer, keyframe, transition, canvas loop, or smooth-scroll path to an exported
 * component requires adding a named test path here. TaskCard is listed
 * separately because it composes StepFlow's active-node animation.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import * as Phosphor from '@components';
import { theme } from '@theme';
import { setReducedMotion } from './setup';

const DIRECT_ANIMATED_COMPONENTS = [
  'AgenticLoop',
  'ApprovalBar',
  'BarColumnGauge',
  'DigitalClock',
  'FilterRail',
  'GateDecisionDialog',
  'HazardPrompt',
  'HealthColumns',
  'LedColumn',
  'LineChart',
  'LogConsole',
  'Marquee',
  'MeterBar',
  'ModuleCard',
  'ProgressMeter',
  'RadialGauge',
  'Roster',
  'RoutineRow',
  'SegmentedMeter',
  'SevenSegClock',
  'SiteHeader',
  'Stamp',
  'StepFlow',
  'Terminal',
  'Waveform',
] as const;

const COMPOSED_ANIMATED_COMPONENTS = ['TaskCard'] as const;

const VERIFIED_COMPONENTS = [
  ...DIRECT_ANIMATED_COMPONENTS,
  ...COMPOSED_ANIMATED_COMPONENTS,
].sort();

function mount(ui: React.ReactElement): HTMLElement {
  return render(
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      {ui}
    </ThemeProvider>,
  ).container;
}

function expectNoAnimation(element: Element): void {
  expect(getComputedStyle(element).animationName).toBe('none');
}

function intervalSpy() {
  vi.useFakeTimers();
  return vi.spyOn(globalThis, 'setInterval');
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  setReducedMotion(false);
  vi.useRealTimers();
});

describe('reduced-motion inventory (Task 6.3)', () => {
  it('covers every public component with direct motion mechanics', () => {
    const componentsDir = resolve(process.cwd(), '../components');
    const motionSyntax = /useReducedMotion\(|\banimation\s*:|\btransition\s*:|\bsetInterval\(|\bsetTimeout\(|\brequestAnimationFrame\(|behavior:\s*reduced\s*\?/;
    const discovered = new Set<string>();

    for (const file of readdirSync(componentsDir).filter((name) => name.endsWith('.tsx'))) {
      const source = readFileSync(resolve(componentsDir, file), 'utf8');
      const exports = [...source.matchAll(/export function\s+(\w+)\s*\(/g)];
      exports.forEach((match, index) => {
        const body = source.slice(match.index, exports[index + 1]?.index ?? source.length);
        if (motionSyntax.test(body)) discovered.add(match[1]);
      });
    }

    expect([...discovered].sort()).toEqual([...DIRECT_ANIMATED_COMPONENTS]);
    expect(VERIFIED_COMPONENTS).toEqual([...DIRECT_ANIMATED_COMPONENTS, 'TaskCard'].sort());
    expect(VERIFIED_COMPONENTS.every((name) => typeof Phosphor[name as keyof typeof Phosphor] === 'function')).toBe(true);
  });

  it('installs the global final-frame guard used by CSS-only animation and transition paths', () => {
    const overrides = theme.components?.MuiCssBaseline?.styleOverrides;
    expect(typeof overrides).toBe('function');
    const styles = (overrides as (value: typeof theme) => Record<string, unknown>)(theme);
    const media = styles['@media (prefers-reduced-motion: reduce)'] as Record<string, Record<string, string>>;
    expect(media['*, *::before, *::after']).toMatchObject({
      animationDuration: '0.001ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.001ms !important',
    });
  });
});

describe('reduced-motion final/static paths (Task 6.3)', () => {
  it('Stamp, Roster, and RoutineRow hold blinking status marks lit', () => {
    setReducedMotion(true);
    const container = mount(
      <>
        <Phosphor.Stamp blink>READY</Phosphor.Stamp>
        <Phosphor.Roster units={[{ id: 'UNIT·01', status: 'CAUTION' }]} />
        <Phosphor.RoutineRow id="R·01" name="RETRY JOB" kind="CRON" status="RETRIED" />
      </>,
    );
    expectNoAnimation(screen.getByText('READY'));
    expectNoAnimation(screen.getByText('CAUTION'));
    expectNoAnimation(screen.getByText('RETRIED'));
    expect(container.textContent).toContain('RETRY JOB');
  });

  it('StepFlow and TaskCard render their controlled destination state under the global guard', () => {
    setReducedMotion(true);
    const steps = [
      { short: 'OBS', label: 'OBSERVE' },
      { short: 'DEC', label: 'DECIDE' },
    ];
    mount(
      <>
        <Phosphor.StepFlow steps={steps} active={1} />
        <Phosphor.TaskCard id="TASK·1" title="FINAL" active={1} pct={100} steps={steps} />
      </>,
    );
    expect(screen.getAllByText('DEC')).toHaveLength(2);
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('AgenticLoop holds its first node and schedules no cycle', () => {
    setReducedMotion(true);
    const spy = intervalSpy();
    mount(<Phosphor.AgenticLoop steps={[{ jp: '観', en: 'OBSERVE' }, { jp: '決', en: 'DECIDE' }]} />);
    expect(spy.mock.calls).toHaveLength(0);
    expect(screen.getByText('OBSERVE')).toBeTruthy();
  });

  it('FilterRail, ModuleCard, MeterBar, and LedColumn render final prop-driven values under the global guard', () => {
    setReducedMotion(true);
    const container = mount(
      <>
        <Phosphor.FilterRail
          filters={['ALL', 'CRON']}
          value="CRON"
          rows={[{ id: 'A', name: 'EVENT JOB', kind: 'EVENT' }, { id: 'B', name: 'CRON JOB', kind: 'CRON' }]}
        />
        <Phosphor.ModuleCard jp="工" code="SYS·01" title="ENGINE" stamp="ON" selected>BODY</Phosphor.ModuleCard>
        <Phosphor.MeterBar label="CPU" value="72%" pct={72} classes={{ fill: 'meter-fill' }} />
        <Phosphor.LedColumn value={50} segments={4} classes={{ segment: 'led-segment' }} />
      </>,
    );
    expect(screen.getByText('EVENT JOB').closest('[data-dim]')?.getAttribute('data-dim')).toBe('true');
    expect(screen.getByRole('button', { name: /ENGINE/ }).getAttribute('aria-pressed')).toBe('true');
    expect(getComputedStyle(container.querySelector('.meter-fill')!).width).toBe('72%');
    expect([...container.querySelectorAll('.led-segment')].map((el) => getComputedStyle(el).opacity)).toEqual(['1', '1', '0.3', '0.3']);
  });

  it('HazardPrompt skips its timed flash and still activates', () => {
    setReducedMotion(true);
    vi.useFakeTimers();
    const timeout = vi.spyOn(globalThis, 'setTimeout');
    const onDecide = vi.fn();
    mount(<Phosphor.HazardPrompt jp="裁定" en="DECIDE" onDecide={onDecide} />);
    const prompt = screen.getByRole('button', { name: 'decide' });
    fireEvent.click(prompt);
    expect(onDecide).toHaveBeenCalledOnce();
    expect(timeout.mock.calls).toHaveLength(0);
    expect(getComputedStyle(prompt).filter).toBe('none');
  });

  it('HazardPrompt preserves the normal-motion timed flash', () => {
    setReducedMotion(false);
    vi.useFakeTimers();
    mount(<Phosphor.HazardPrompt jp="裁定" en="DECIDE" />);
    const prompt = screen.getByRole('button', { name: 'decide' });
    fireEvent.click(prompt);
    expect(getComputedStyle(prompt).filter).toBe('invert(1)');
    act(() => vi.advanceTimersByTime(theme.nerv.motion.durations.fast));
    expect(getComputedStyle(prompt).filter).toBe('none');
  });

  it('GateDecisionDialog and ApprovalBar render their static action state under the global guard', () => {
    setReducedMotion(true);
    mount(
      <>
        <Phosphor.GateDecisionDialog open item="TASK·1" onDecide={() => {}} />
        <Phosphor.ApprovalBar item="TASK·2" />
      </>,
    );
    expect(screen.getAllByText('GATE')).toHaveLength(2);
    // MUI Modal marks its sibling subtree aria-hidden while open, so query the
    // rendered labels rather than pretending the background action is exposed.
    expect(screen.getAllByText(/APPROVE/)).toHaveLength(2);
  });

  it('all five self-driving meters render their final static reading without timers', () => {
    setReducedMotion(true);
    const spy = intervalSpy();
    mount(
      <>
        <Phosphor.SegmentedMeter defaultValues={[3]} segments={4} columnLabels={['A']} />
        <Phosphor.RadialGauge />
        <Phosphor.BarColumnGauge />
        <Phosphor.ProgressMeter value={68} />
        <Phosphor.HealthColumns />
      </>,
    );
    expect(spy.mock.calls).toHaveLength(0);
    expect(screen.getByText('98%')).toBeTruthy();
    expect(screen.getByText('68%')).toBeTruthy();
  });

  it('Terminal prints every row immediately and LogConsole holds its cursor lit', () => {
    setReducedMotion(true);
    const spy = intervalSpy();
    const container = mount(
      <>
        <Phosphor.Terminal rows={[{ k: 'line', t: 'FIRST' }, { k: 'sum', t: 'FINAL' }]} />
        <Phosphor.LogConsole rows={[{ ts: '00:00', msg: 'DONE' }]} />
      </>,
    );
    expect(spy.mock.calls).toHaveLength(0);
    expect(screen.getByText('FIRST')).toBeTruthy();
    expect(screen.getByText('FINAL')).toBeTruthy();
    const animated = [...container.querySelectorAll('span')].filter((el) => getComputedStyle(el).animationName !== 'none');
    expect(animated).toEqual([]);
  });

  it('DigitalClock and SevenSegClock hold their colons visible', () => {
    setReducedMotion(true);
    const container = mount(
      <>
        <Phosphor.DigitalClock classes={{ root: 'digital-clock' }} />
        <Phosphor.SevenSegClock variant="countdown" digits="123456" classes={{ countdown: 'seven-countdown' }} />
      </>,
    );
    const digitalColons = container.querySelectorAll('.digital-clock > span');
    expect(digitalColons).toHaveLength(2);
    digitalColons.forEach(expectNoAnimation);
    const countdown = container.querySelector('.seven-countdown')!;
    const colon = countdown.children[1]?.children[1];
    expect(colon).toBeTruthy();
    expect(getComputedStyle(colon).opacity).toBe('1');
  });

  it('Marquee renders one static copy of its content', () => {
    setReducedMotion(true);
    const container = mount(<Phosphor.Marquee items={['STATIC']} classes={{ track: 'marquee-track' }} />);
    expect(screen.getAllByText('STATIC')).toHaveLength(1);
    expectNoAnimation(container.querySelector('.marquee-track')!);
  });

  it('LineChart and Waveform draw one frame without scheduling canvas loops', () => {
    setReducedMotion(true);
    const spy = intervalSpy();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    mount(
      <>
        <Phosphor.LineChart label="LINE FINAL" />
        <Phosphor.Waveform label="WAVE FINAL" />
      </>,
    );
    expect(spy.mock.calls).toHaveLength(0);
    expect(screen.getByText(/LINE FINAL/)).toBeTruthy();
    expect(screen.getByText('WAVE FINAL')).toBeTruthy();
  });

  it('SiteHeader uses instant anchor scrolling', () => {
    setReducedMotion(true);
    const target = document.createElement('div');
    target.id = 'final';
    document.body.append(target);
    const scroll = vi.spyOn(target, 'scrollIntoView');
    mount(<Phosphor.SiteHeader name="NERV" links={[{ label: 'FINAL', href: '#final' }]} />);
    fireEvent.click(screen.getByRole('link', { name: 'FINAL' }));
    expect(scroll).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });
});
