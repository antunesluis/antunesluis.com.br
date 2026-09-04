'use client';

import Link from 'next/link';
import { navigationLinks } from '@/config/navigation';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export function HeaderNavigation() {
  const pathname = usePathname();
  const navItemClasses = clsx(
    'group inline-flex min-h-11 items-center text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:text-primary',
  );
  const navLabelClasses = clsx(
    'relative',
    'after:absolute after:-bottom-1 after:left-0 after:block after:h-[2px] after:w-full after:bg-primary',
    'after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out',
    'group-hover:after:origin-bottom-left group-hover:after:scale-x-100',
    'group-focus-visible:after:origin-bottom-left group-focus-visible:after:scale-x-100',
    'motion-reduce:after:transition-none',
  );

  return (
    <div className='hidden md:flex items-center space-x-5 px-2'>
      {navigationLinks.map(link => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(navItemClasses, isActive && 'text-primary')}
            aria-current={isActive ? 'page' : undefined}
          >
            <span
              className={clsx(
                navLabelClasses,
                isActive && 'after:origin-bottom-left after:scale-x-100',
              )}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
