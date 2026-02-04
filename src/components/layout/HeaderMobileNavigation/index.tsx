'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { navigationLinks } from '@/config/navigation';
import { MenuIcon, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function HeaderMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItemClasses =
    'block w-full text-lg text-left py-3 px-4 font-medium transition-colors duration-200';

  return (
    <div className='md:hidden'>
      {/* Botão de abrir menu */}
      <button
        onClick={toggleMenu}
        className='flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors'
        aria-label='Toggle mobile menu'
        aria-expanded={isOpen}
      >
        <MenuIcon className='w-6 h-6 text-foreground' />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 backdrop-blur-sm bg-black/30 transition-all duration-300'
          onClick={closeMenu}
          aria-hidden='true'
        />
      )}

      {/* Menu lateral */}
      <div
        className={clsx(
          'fixed top-0 right-0 z-50 w-64 h-full bg-card shadow-xl border-l border-border transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role='dialog'
        aria-modal='true'
        aria-labelledby='mobile-menu-title'
      >
        {/* Header do menu */}
        <div className='flex items-center justify-between p-4 border-b border-border'>
          <h2 className='text-lg font-semibold text-foreground'>Menu</h2>
          <button
            onClick={closeMenu}
            className='flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors'
            aria-label='Close mobile menu'
          >
            <X className='w-6 h-6 text-foreground' />
          </button>
        </div>

        {/* Links de navegação */}
        <nav className='py-4' role='navigation' aria-label='Mobile navigation'>
          {navigationLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  navItemClasses,
                  isActive
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-foreground hover:text-primary hover:bg-muted',
                )}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
