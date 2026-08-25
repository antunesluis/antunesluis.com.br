// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { HeaderMobileNavigation } from './HeaderMobileNavigation';

const mocks = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));
vi.mock('next/link', async () => {
  const { forwardRef } = await import('react');

  return {
    default: forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
      ({ onClick, ...props }, ref) => (
        <a
          {...props}
          ref={ref}
          onClick={event => {
            event.preventDefault();
            onClick?.(event);
          }}
        />
      ),
    ),
  };
});
vi.mock('lucide-react', () => ({
  MenuIcon: () => null,
  X: () => null,
}));

afterEach(() => {
  cleanup();
  mocks.pathname = '/';
});

test('keeps mobile navigation links unavailable while closed and restores focus after Escape', async () => {
  const user = userEvent.setup();
  render(<HeaderMobileNavigation />);

  const trigger = screen.getByRole('button', { name: 'Toggle mobile menu' });
  expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull();

  await user.click(trigger);
  const dialog = await screen.findByRole('dialog');
  const close = screen.getByRole('button', { name: 'Close mobile menu' });
  await waitFor(() => expect(document.activeElement).toBe(close));
  expect(screen.getByRole('link', { name: 'Blog' })).not.toBeNull();

  await user.keyboard('{Escape}');

  await waitFor(() => expect(dialog.isConnected).toBe(false));
  expect(screen.queryByRole('link', { name: 'Blog' })).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test('closes when a navigation link is selected', async () => {
  const user = userEvent.setup();
  render(<HeaderMobileNavigation />);

  await user.click(screen.getByRole('button', { name: 'Toggle mobile menu' }));
  await user.click(await screen.findByRole('link', { name: 'Projects' }));

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});
