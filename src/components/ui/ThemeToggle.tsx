'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeToggleProps = {
  onThemeChange?: (theme: 'dark' | 'light') => void;
};

export function ThemeToggle({ onThemeChange }: ThemeToggleProps = {}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  if (!mounted) {
    return (
      <button
        type='button'
        className='p-2 rounded-lg'
        aria-label='Toggle theme'
        disabled
      >
        <div className='w-6 h-6' />
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='p-2 rounded-lg hover:bg-muted transition-colors duration-200'
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? (
        <Moon className='w-6 h-6 text-foreground hover:text-primary transition-colors' />
      ) : (
        <Sun className='w-6 h-6 text-foreground hover:text-primary transition-colors' />
      )}
    </button>
  );
}
