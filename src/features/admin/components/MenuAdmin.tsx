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
    'transition-colors hover:bg-muted',
    'h-10 rounded-lg',
    'shrink-0',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
  );
  const openCloseBtnClasses = clsx(
    linkClasses,
    'text-primary italic',
    'sm:hidden',
  );
  const isCreatingPost = pathName === '/admin/blog/new';
  const isManagingPosts = pathName.startsWith('/admin/blog') && !isCreatingPost;
  const isCreatingProject = pathName === '/admin/projects/new';
  const isManagingProjects =
    pathName.startsWith('/admin/projects') && !isCreatingProject;

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
        className={clsx(
          'flex flex-col sm:contents',
          !isOpen && 'max-sm:hidden',
        )}
      >
        <a className={linkClasses} href='/' target='_blank'>
          <HouseIcon />
          Home
        </a>

        <Link
          className={clsx(
            linkClasses,
            isManagingPosts && 'bg-primary/10 text-primary',
          )}
          href='/admin/blog'
          aria-current={isManagingPosts ? 'page' : undefined}
        >
          <FileTextIcon />
          Blog
        </Link>

        <Link
          className={clsx(
            linkClasses,
            isCreatingPost && 'bg-primary/10 text-primary',
          )}
          href='/admin/blog/new'
          aria-current={isCreatingPost ? 'page' : undefined}
        >
          <PlusIcon />
          Create Post
        </Link>

        <Link
          className={clsx(
            linkClasses,
            isManagingProjects && 'bg-primary/10 text-primary',
          )}
          href='/admin/projects'
          aria-current={isManagingProjects ? 'page' : undefined}
        >
          <FileTextIcon />
          Projects
        </Link>

        <Link
          className={clsx(
            linkClasses,
            isCreatingProject && 'bg-primary/10 text-primary',
          )}
          href='/admin/projects/new'
          aria-current={isCreatingProject ? 'page' : undefined}
        >
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
