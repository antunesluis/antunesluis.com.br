// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { MenuAdmin } from './MenuAdmin';

const mocks = vi.hoisted(() => ({ pathname: '/admin/blog' }));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));
vi.mock('lucide-react', () => ({
  CircleXIcon: () => null,
  FileTextIcon: () => null,
  HourglassIcon: () => null,
  HouseIcon: () => null,
  LogOutIcon: () => null,
  MenuIcon: () => null,
  PlusIcon: () => null,
}));

afterEach(() => {
  cleanup();
  mocks.pathname = '/admin/blog';
});

test('exposes a disclosure control and disables logout while it is pending', async () => {
  const user = userEvent.setup();
  let resolveLogout: (() => void) | undefined;
  const onLogout = vi.fn(
    () =>
      new Promise<void>(resolve => {
        resolveLogout = resolve;
      }),
  );
  render(<MenuAdmin onLogout={onLogout} />);

  expect(
    screen.getByRole('navigation', { name: 'Navegação administrativa' }),
  ).toBeInstanceOf(HTMLElement);
  expect(
    screen.getByRole('link', { name: 'Blog' }).getAttribute('aria-current'),
  ).toBe('page');

  const toggle = screen.getByRole('button', { name: 'Menu' });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');

  await user.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');

  const logout = screen.getByRole('button', { name: 'Logout' });
  await user.click(logout);

  expect(onLogout).toHaveBeenCalledOnce();
  await waitFor(() =>
    expect(
      (
        screen.getByRole('button', {
          name: /logging out/i,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true),
  );

  resolveLogout?.();
});

test('closes the mobile disclosure after a pathname change', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<MenuAdmin onLogout={vi.fn()} />);
  const toggle = screen.getByRole('button', { name: 'Menu' });

  await user.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');

  mocks.pathname = '/admin/projects';
  rerender(<MenuAdmin onLogout={vi.fn()} />);

  await waitFor(() =>
    expect(toggle.getAttribute('aria-expanded')).toBe('false'),
  );
});
