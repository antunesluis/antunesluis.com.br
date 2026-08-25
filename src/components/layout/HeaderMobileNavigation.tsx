'use client';

import { Dialog } from '@base-ui/react/dialog';
import clsx from 'clsx';
import { MenuIcon, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigationLinks } from '@/config/navigation';

export function HeaderMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItemClasses =
    'block w-full text-lg text-left py-3 px-4 font-medium transition-colors duration-200';

  return (
    <div className='md:hidden'>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger
          render={
            <button
              type='button'
              className='flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors'
              aria-label='Toggle mobile menu'
            >
              <MenuIcon className='w-6 h-6 text-foreground' />
            </button>
          }
        />

        <Dialog.Portal>
          <Dialog.Backdrop
            className={clsx(
              'fixed inset-0 z-40 backdrop-blur-sm bg-black/30',
              'transition-opacity duration-300',
              'data-starting-style:opacity-0 data-ending-style:opacity-0',
            )}
          />
          <Dialog.Viewport className='fixed inset-0 z-50 pointer-events-none'>
            <Dialog.Popup
              className={clsx(
                'pointer-events-auto fixed top-0 right-0 w-64 h-full',
                'bg-card shadow-xl border-l border-border',
                'transform transition-transform duration-300 ease-in-out',
                'data-starting-style:translate-x-full',
                'data-ending-style:translate-x-full',
              )}
            >
              <div className='flex items-center justify-between p-4 border-b border-border'>
                <Dialog.Title
                  className={clsx(
                    'text-2xl/tight sm:text-3xl/tight md:text-3xl/tight',
                    'font-semibold underline decoration-4 underline-offset-8',
                    'decoration-border text-foreground tracking-tight font-serif',
                  )}
                >
                  Menu
                </Dialog.Title>
                <Dialog.Close
                  render={
                    <button
                      type='button'
                      className='flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors'
                      aria-label='Close mobile menu'
                    >
                      <X className='w-6 h-6 text-foreground' />
                    </button>
                  }
                />
              </div>

              <nav className='py-4' aria-label='Mobile navigation'>
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
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
