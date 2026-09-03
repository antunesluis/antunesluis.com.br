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
              className='flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
              aria-label='Toggle mobile menu'
            >
              <MenuIcon className='size-5 text-foreground' />
            </button>
          }
        />

        <Dialog.Portal>
          <Dialog.Backdrop
            className={clsx(
              'fixed inset-0 z-40 backdrop-blur-sm bg-black/30',
              'transition-opacity duration-300',
              'motion-reduce:transition-none',
              'data-starting-style:opacity-0 data-ending-style:opacity-0',
            )}
          />
          <Dialog.Viewport className='fixed inset-0 z-50 pointer-events-none'>
            <Dialog.Popup
              className={clsx(
                'pointer-events-auto fixed top-0 right-0 w-64 h-full',
                'bg-card shadow-xl border-l border-border',
                'transform transition-transform duration-300 ease-in-out',
                'motion-reduce:transition-none',
                'data-starting-style:translate-x-full',
                'data-ending-style:translate-x-full',
              )}
            >
              <div className='flex items-center justify-between p-4 border-b border-border'>
                <Dialog.Title
                  className={clsx(
                    'text-2xl/tight sm:text-3xl/tight md:text-3xl/tight',
                    'font-semibold underline decoration-2 underline-offset-8',
                    'decoration-border text-foreground tracking-tight font-sans',
                  )}
                >
                  Menu
                </Dialog.Title>
                <Dialog.Close
                  render={
                    <button
                      type='button'
                      className='flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
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
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                      )}
                      aria-current={isActive ? 'page' : undefined}
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
