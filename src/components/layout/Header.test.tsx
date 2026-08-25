// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { Header } from './Header';

vi.mock('next/link', () => ({
  default: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}));
vi.mock('lucide-react', () => ({
  BirdIcon: () => null,
}));
vi.mock('./HeaderNavigation', () => ({
  HeaderNavigation: () => <a href='#blog'>Blog</a>,
}));
vi.mock('./HeaderMobileNavigation', () => ({
  HeaderMobileNavigation: () => null,
}));
vi.mock('../ui/ThemeToggle', () => ({
  ThemeToggle: () => null,
}));
vi.mock('../ui/SearchButton', () => ({
  SearchButton: () => null,
}));

afterEach(cleanup);

test('names the main navigation and its icon-only home link', () => {
  render(<Header />);

  expect(
    screen.getByRole('navigation', { name: 'Navegação principal' }),
  ).toBeInstanceOf(HTMLElement);
  expect(
    screen.getByRole('link', { name: 'Página inicial' }).getAttribute('href'),
  ).toBe('/');
});
