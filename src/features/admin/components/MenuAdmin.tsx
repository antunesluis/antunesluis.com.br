'use client';

type MenuAdminProps = {
  onLogout: () => Promise<void>;
};

import clsx from 'clsx';
import {
  CircleXIcon,
  FileTextIcon,
  HourglassIcon,
  HouseIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function MenuAdmin({ onLogout }: MenuAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  const navClasses = clsx(
    'bg-card text-card-foreground rounded-lg shadow-sm',
    'flex flex-col mb-8',
    'sm:flex-row sm:flex-wrap',
  );
  const linkClasses = clsx(
    '[&>svg]:w-[16px] [&>svg]:h-[16px] px-4',
    'flex items-center justify-start gap-2 cursor-pointer',
    'transition hover:bg-muted',
    'h-10 rounded-lg',
    'shrink-0',
    'disabled:cursor-not-allowed disabled:opacity-50',
  );
  const openCloseBtnClasses = clsx(
    linkClasses,
    'text-primary italic',
    'sm:hidden',
  );

  function handleLogout() {
    if (isPending) return;

    startTransition(async () => {
      await onLogout();
    });
  }

  return (
    <nav className={navClasses} aria-label='Navegação administrativa'>
      <button
        type='button'
        className={openCloseBtnClasses}
        onClick={() => setIsOpen(s => !s)}
        aria-controls='admin-navigation-items'
        aria-expanded={isOpen}
      >
        {!isOpen && (
          <>
            <MenuIcon />
            Menu
          </>
        )}

        {isOpen && (
          <>
            <CircleXIcon />
            Close
          </>
        )}
      </button>

      <div
        id='admin-navigation-items'
        className={clsx('flex flex-col sm:contents', !isOpen && 'max-sm:hidden')}
      >
        <a className={linkClasses} href='/' target='_blank'>
          <HouseIcon />
          Home
        </a>

        <Link className={linkClasses} href='/admin/blog'>
          <FileTextIcon />
          Blog
        </Link>

        <Link className={linkClasses} href='/admin/blog/new'>
          <PlusIcon />
          Create Post
        </Link>

        <Link className={linkClasses} href='/admin/projects'>
          <FileTextIcon />
          Projects
        </Link>

        <Link className={linkClasses} href='/admin/projects/new'>
          <PlusIcon />
          Create Project
        </Link>

        <button
          type='button'
          onClick={handleLogout}
          className={linkClasses}
          disabled={isPending}
        >
          {isPending && (
            <>
              Logging out...
              <HourglassIcon />
            </>
          )}
          {!isPending && (
            <>
              <LogOutIcon />
              Logout
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
