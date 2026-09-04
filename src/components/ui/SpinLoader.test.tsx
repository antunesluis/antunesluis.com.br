// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { SpinLoader } from './SpinLoader';

afterEach(cleanup);

test('announces the loading state without exposing the decorative spinner', () => {
  const { container } = render(<SpinLoader />);

  expect(screen.getByRole('status').textContent).toBe('Loading');
  expect(container.querySelector('[aria-hidden="true"]')).toBeInstanceOf(
    HTMLElement,
  );
});
