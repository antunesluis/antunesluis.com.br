// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { HeaderNavigation } from './HeaderNavigation';

const mocks = vi.hoisted(() => ({ pathname: '/blog' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));
vi.mock('next/link', () => ({
  default: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}));

afterEach(() => {
  cleanup();
  mocks.pathname = '/blog';
});

test('marks the current public page in the desktop navigation', () => {
  render(<HeaderNavigation />);

  expect(
    screen.getByRole('link', { name: 'Blog' }).getAttribute('aria-current'),
  ).toBe('page');
  expect(
    screen.getByRole('link', { name: 'Home' }).hasAttribute('aria-current'),
  ).toBe(false);
});
