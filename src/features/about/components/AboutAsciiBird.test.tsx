// @vitest-environment jsdom

import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AboutAsciiBird } from './AboutAsciiBird';
import {
  ABOUT_BIRD_POSES,
  ABOUT_BIRD_SEQUENCE,
} from './about-ascii-bird-animation';

let prefersReducedMotion = false;
let motionPreferenceListener: (() => void) | undefined;

function sequenceDurationBefore(
  pose: (typeof ABOUT_BIRD_SEQUENCE)[number]['pose'],
) {
  const poseIndex = ABOUT_BIRD_SEQUENCE.findIndex(step => step.pose === pose);

  return ABOUT_BIRD_SEQUENCE.slice(0, poseIndex).reduce(
    (total, step) => total + step.ms,
    0,
  );
}

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

test('plays the ambient hello sequence while facing forward', () => {
  const { container } = render(<AboutAsciiBird />);
  const bird = container.querySelector('[data-status]');
  const art = container.querySelector('pre');

  expect(bird?.getAttribute('data-status')).toBe('greeting');
  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.idle);

  act(() => {
    vi.advanceTimersByTime(sequenceDurationBefore('helloOne'));
  });

  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.helloOne);
});

test('blinks once while facing the visitor on hover', () => {
  const { container } = render(<AboutAsciiBird />);
  const bird = container.querySelector('[data-status]') as HTMLElement;
  const art = container.querySelector('pre');

  fireEvent.pointerEnter(bird);

  expect(bird.dataset.status).toBe('watching');
  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.idle);

  act(() => vi.advanceTimersByTime(650));
  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.blink);

  act(() => vi.advanceTimersByTime(140));
  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.idle);

  fireEvent.pointerLeave(bird);
  expect(bird.dataset.status).toBe('greeting');
  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.idle);
});

test('stays static when the visitor prefers reduced motion', () => {
  prefersReducedMotion = true;
  const { container } = render(<AboutAsciiBird />);
  const bird = container.querySelector('[data-status]') as HTMLElement;
  const art = container.querySelector('pre');

  expect(bird.dataset.status).toBe('reduced');

  act(() => vi.runOnlyPendingTimers());

  expect(art?.textContent).toBe(ABOUT_BIRD_POSES.idle);
  expect(vi.getTimerCount()).toBe(0);
});

test('responds when the motion preference changes', () => {
  const { container } = render(<AboutAsciiBird />);
  const bird = container.querySelector('[data-status]') as HTMLElement;

  act(() => {
    prefersReducedMotion = true;
    motionPreferenceListener?.();
  });

  expect(bird.dataset.status).toBe('reduced');

  act(() => {
    prefersReducedMotion = false;
    motionPreferenceListener?.();
  });

  expect(bird.dataset.status).toBe('greeting');
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});

test('pauses while the page is hidden and resumes when it returns', () => {
  const { container } = render(<AboutAsciiBird />);
  const bird = container.querySelector('[data-status]') as HTMLElement;

  act(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(bird.dataset.status).toBe('paused');

  act(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  expect(bird.dataset.status).toBe('greeting');
  expect(vi.getTimerCount()).toBeGreaterThan(0);
});
