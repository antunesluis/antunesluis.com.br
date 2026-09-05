// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { StatusAsciiBird } from './StatusAsciiBird';
import {
  STATUS_BIRD_CONFIG,
  STATUS_BIRD_POSES,
} from './status-ascii-bird-animation';

let prefersReducedMotion = false;
let motionPreferenceListener: (() => void) | undefined;

beforeEach(() => {
  vi.useFakeTimers();
  prefersReducedMotion = false;
  motionPreferenceListener = undefined;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      get matches() {
        return query === '(prefers-reduced-motion: reduce)'
          ? prefersReducedMotion
          : true;
      },
      media: query,
      onchange: null,
      addEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'change') {
          motionPreferenceListener = listener;
        }
      }),
      removeEventListener: vi.fn((event: string, listener: () => void) => {
        if (event === 'change' && motionPreferenceListener === listener) {
          motionPreferenceListener = undefined;
        }
      }),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: false,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test.each([
  ['not-found', 'lostCrouch'],
  ['error', 'errorSurprise'],
] as const)('runs the %s interaction on activation', (variant, firstPose) => {
  const { container } = render(<StatusAsciiBird variant={variant} />);
  const button = screen.getByRole('button', { name: /pássaro ascii/i });
  const art = container.querySelector('pre');

  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(0));

  expect(button.dataset.status).toBe('interaction');
  expect(art?.textContent).toBe(STATUS_BIRD_POSES[firstPose]);

  const interactionDuration = STATUS_BIRD_CONFIG[variant].interaction.reduce(
    (total, step) => total + step.ms,
    0,
  );

  act(() => vi.advanceTimersByTime(interactionDuration));

  expect(button.dataset.status).toBe('ambient');
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});

test('restarts the interaction when activated again', () => {
  const { container } = render(<StatusAsciiBird variant='not-found' />);
  const button = screen.getByRole('button', { name: /pássaro ascii/i });
  const art = container.querySelector('pre');

  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(500));
  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(0));

  expect(art?.textContent).toBe(STATUS_BIRD_POSES.lostCrouch);
});

test('hands interaction back to ambient motion without another long idle', () => {
  const { container } = render(<StatusAsciiBird variant='not-found' />);
  const button = screen.getByRole('button', { name: /pássaro ascii/i });
  const art = container.querySelector('pre');
  const interactionDuration = STATUS_BIRD_CONFIG[
    'not-found'
  ].interaction.reduce((total, step) => total + step.ms, 0);

  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(interactionDuration));
  act(() => vi.advanceTimersByTime(0));

  expect(art?.textContent).toBe(STATUS_BIRD_POSES.lostBlink);
});

test('renders a static image instead of a dead control with reduced motion', () => {
  prefersReducedMotion = true;
  const { container } = render(<StatusAsciiBird variant='error' />);

  act(() => vi.runOnlyPendingTimers());

  const image = screen.getByRole('img', { name: /movimento reduzido/i });
  const art = container.querySelector('pre');

  expect(image.dataset.status).toBe('reduced');
  expect(screen.queryByRole('button')).toBeNull();
  expect(art?.textContent).toBe(STATUS_BIRD_POSES.errorIdle);
  expect(vi.getTimerCount()).toBe(0);
});

test('responds when the motion preference changes', () => {
  render(<StatusAsciiBird variant='not-found' />);

  act(() => {
    prefersReducedMotion = true;
    motionPreferenceListener?.();
  });

  expect(screen.getByRole('img').dataset.status).toBe('reduced');

  act(() => {
    prefersReducedMotion = false;
    motionPreferenceListener?.();
  });

  const button = screen.getByRole('button', { name: /pássaro ascii/i });
  expect(button.dataset.status).toBe('ambient');
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});

test('pauses while the page is hidden and resumes when it returns', () => {
  render(<StatusAsciiBird variant='error' />);
  const button = screen.getByRole('button', { name: /pássaro ascii/i });

  act(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(button.dataset.status).toBe('paused');

  act(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(button.dataset.status).toBe('ambient');
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});
