'use client';

import Link from 'next/link';
import { navigationLinks } from '@/config/navigation';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export function HeaderNavigation() {
  const pathname = usePathname();
  const navItemClasses = clsx(
    // Estilos base
    'relative text-sm text-foreground hover:text-primary font-medium transition-colors duration-200',

    // Pseudo-elemento para o underline animado
    'before:bg-primary before:absolute before:-bottom-1 before:left-0',
    'before:block before:h-[2px] before:w-full',
    'before:origin-bottom-right before:scale-x-0',
    'before:transition-transform before:duration-300 before:ease-in-out',
    'hover:before:origin-bottom-left hover:before:scale-x-100',
    'focus-visible:outline-none focus-visible:text-primary',
    'focus-visible:before:origin-bottom-left focus-visible:before:scale-x-100',
  );

  return (
    <div className='hidden md:flex items-center space-x-5 px-2'>
      {navigationLinks.map(link => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              navItemClasses,
              isActive &&
                'text-primary before:origin-bottom-left before:scale-x-100',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
