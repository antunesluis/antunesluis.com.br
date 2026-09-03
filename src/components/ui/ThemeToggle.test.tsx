// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

const mocks = vi.hoisted(() => ({
  resolvedTheme: 'dark',
  setTheme: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: () => mocks,
}));

vi.mock('lucide-react', () => ({
  Moon: () => null,
  Sun: () => null,
}));

afterEach(() => {
  cleanup();
  mocks.resolvedTheme = 'dark';
  mocks.setTheme.mockReset();
  document.head.innerHTML = '';
});

test('toggles the resolved theme and updates the browser theme color', async () => {
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  document.head.appendChild(themeColor);

  render(<ThemeToggle />);

  await waitFor(() => expect(themeColor.content).toBe('#08070b'));
  await userEvent.click(screen.getByRole('button', { name: 'Alternar tema' }));

  expect(mocks.setTheme).toHaveBeenCalledWith('light');
});
