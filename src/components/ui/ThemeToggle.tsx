'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

type ThemeToggleProps = {
  onThemeChange?: (theme: 'dark' | 'light') => void;
};

export function ThemeToggle({ onThemeChange }: ThemeToggleProps = {}) {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    themeColor?.setAttribute(
      'content',
      resolvedTheme === 'dark' ? '#08070b' : '#f5f9ff',
    );
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='inline-flex size-11 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
      aria-label='Alternar tema'
      title='Alternar tema'
    >
      <Moon className='hidden size-6 text-foreground transition-colors hover:text-primary motion-reduce:transition-none dark:block' />
      <Sun className='size-6 text-foreground transition-colors hover:text-primary motion-reduce:transition-none dark:hidden' />
    </button>
  );
}
