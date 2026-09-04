// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AsciiBird } from './AsciiBird';
import { drawPose } from './ascii-bird-animation';

let prefersReducedMotion = false;
let motionPreferenceListener: (() => void) | undefined;
const cancelAnimation = vi.fn();
const animate = vi.fn(
  () => ({ cancel: cancelAnimation }) as unknown as Animation,
);

beforeEach(() => {
  vi.useFakeTimers();
  prefersReducedMotion = false;
  motionPreferenceListener = undefined;
  cancelAnimation.mockReset();
  animate.mockClear();

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      get matches() {
        return prefersReducedMotion;
      },
      media: '(prefers-reduced-motion: reduce)',
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

  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    value: animate,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test('animates only the ASCII art during arrival', () => {
  const { container } = render(<AsciiBird />);
  const art = container.querySelector('pre');

  expect(animate).toHaveBeenCalledOnce();
  expect(animate.mock.contexts[0]).toBe(art);
});

test('keeps dancing and advances through all four choreographies', () => {
  render(<AsciiBird />);
  const button = screen.getByRole('button', { name: /dancing ascii bird/i });

  act(() => vi.advanceTimersByTime(1690));
  expect(button.dataset.status).toBe('dancing');
  expect(button.dataset.choreography).toBe('shuffle');
  expect(screen.getByText('side shuffle - click for next')).toBeTruthy();

  fireEvent.click(button);
  expect(button.dataset.choreography).toBe('takeoff');
  expect(screen.getByText('little takeoff - click for next')).toBeTruthy();

  fireEvent.click(button);
  expect(button.dataset.choreography).toBe('song');
  expect(screen.getByText('tiny concert - click for next')).toBeTruthy();

  fireEvent.click(button);
  expect(button.dataset.choreography).toBe('pogo');
  expect(screen.getByText('happy hops - click for next')).toBeTruthy();

  fireEvent.click(button);
  expect(button.dataset.choreography).toBe('shuffle');
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});

test('restarts the current choreography without an idle gap', () => {
  const { container } = render(<AsciiBird />);
  const art = container.querySelector('pre');

  act(() => vi.advanceTimersByTime(1690));
  expect(art?.textContent).toBe(drawPose('idleB'));

  act(() => vi.advanceTimersByTime(2080));
  expect(art?.textContent).toBe(drawPose('idleB'));
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});

test('lands before switching away from an airborne pose', () => {
  render(<AsciiBird />);
  const button = screen.getByRole('button', { name: /dancing ascii bird/i });

  act(() => vi.advanceTimersByTime(1690));
  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(420));

  expect(button.dataset.choreography).toBe('takeoff');
  expect(button.dataset.airborne).toBe('true');

  fireEvent.click(button);

  expect(button.dataset.choreography).toBe('song');
  expect(button.dataset.status).toBe('switching');
  expect(button.dataset.airborne).toBe('false');

  act(() => vi.advanceTimersByTime(140));
  expect(button.dataset.status).toBe('dancing');
});

test('uses a native disabled button when motion is reduced', () => {
  prefersReducedMotion = true;
  render(<AsciiBird />);

  act(() => vi.runOnlyPendingTimers());

  const button = screen.getByRole('button', { name: /motion is reduced/i });
  expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(button.getAttribute('aria-busy')).toBe('false');
  expect(screen.getByText('motion reduced by system')).toBeTruthy();
  expect(animate).not.toHaveBeenCalled();
});

test('responds when the motion preference changes', () => {
  render(<AsciiBird />);
  const button = screen.getByRole('button', { name: /dancing ascii bird/i });

  act(() => vi.advanceTimersByTime(1690));

  act(() => {
    prefersReducedMotion = true;
    motionPreferenceListener?.();
  });

  expect(button.dataset.status).toBe('reduced');
  expect((button as HTMLButtonElement).disabled).toBe(true);

  act(() => {
    prefersReducedMotion = false;
    motionPreferenceListener?.();
  });

  expect(button.dataset.status).toBe('dancing');
  expect((button as HTMLButtonElement).disabled).toBe(false);
});

test('pauses when the page is hidden and resumes the current dance', () => {
  render(<AsciiBird />);
  const button = screen.getByRole('button', { name: /dancing ascii bird/i });

  act(() => vi.advanceTimersByTime(1690));
  fireEvent.click(button);
  fireEvent.click(button);
  expect(button.dataset.choreography).toBe('song');

  act(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(button.dataset.status).toBe('paused');
  expect(button.getAttribute('aria-busy')).toBe('false');

  act(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(button.dataset.status).toBe('dancing');
  expect(button.dataset.choreography).toBe('song');
});
