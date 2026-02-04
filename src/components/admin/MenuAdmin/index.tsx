'use client';

import { logoutAction } from '@/actions/login/logout-action';
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

export function MenuAdmin() {
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
    !isOpen && 'h-10',
    !isOpen && 'overflow-hidden',
    'sm:overflow-visible sm:h-auto',
  );
  const linkClasses = clsx(
    '[&>svg]:w-[16px] [&>svg]:h-[16px] px-4',
    'flex items-center justify-start gap-2 cursor-pointer',
    'transition hover:bg-muted',
    'h-10 rounded-lg',
    'shrink-0',
  );
  const openCloseBtnClasses = clsx(
    linkClasses,
    'text-primary italic',
    'sm:hidden',
  );

  function handleLogout(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();

    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <nav className={navClasses}>
      <button
        className={openCloseBtnClasses}
        onClick={() => setIsOpen(s => !s)}
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

      <a onClick={handleLogout} href='#' className={linkClasses}>
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
      </a>
    </nav>
  );
}
