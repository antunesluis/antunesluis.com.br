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
        <div className='w-5 h-5' />
      </button>
    );
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200'
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? (
        <Moon className='w-6 h-6 text-slate-300 hover:text-slate-300 transition-colors' />
      ) : (
        <Sun className='w-6 h-6 text-slate-600 hover:text-slate-700 transition-colors' />
      )}
    </button>
  );
}
