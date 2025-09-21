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
      <button
        onClick={toggleMenu}
        className='flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors'
        aria-label='Toggle mobile menu'
        aria-expanded={isOpen}
      >
        <MenuIcon className='w-8 h-8 text-slate-700' />
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 z-40 backdrop-blur-sm bg-white/30 transition-all duration-300'
          onClick={closeMenu}
          aria-hidden='true'
        />
      )}

      <div
        className={clsx(
          'fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role='dialog'
        aria-modal='true'
        aria-labelledby='mobile-menu-title'
      >
        <div className='flex items-center justify-between p-4 border-b border-slate-200'>
          <h2
            id='mobile-menu-title'
            className='text-lg font-semibold text-slate-900'
          >
            Menu
          </h2>
          <button
            onClick={closeMenu}
            className='flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors'
            aria-label='Close mobile menu'
          >
            <X className='w-8 h-8 text-slate-700' />
          </button>
        </div>

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
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : 'text-slate-700 hover:text-blue-500 hover:bg-slate-50',
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
