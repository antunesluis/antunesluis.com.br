import Link from 'next/link';
import { navigationLinks } from '@/config/navigation';
import clsx from 'clsx';

export function HeaderNavigation() {
  const navItemClasses = clsx(
    // Estilos base
    'relative text-slate-700 hover:text-blue-500 font-medium transition-colors duration-200',
    'dark:text-slate-300 dark:hover:text-blue-400',

    // Pseudo-elemento para o underline animado
    'before:bg-blue-500 before:absolute before:-bottom-1 before:left-0',
    'before:block before:h-[2px] before:w-full',
    'before:origin-bottom-right before:scale-x-0',
    'before:transition-transform before:duration-300 before:ease-in-out',
    'hover:before:origin-bottom-left hover:before:scale-x-100',
  );

  return (
    <div className={clsx('hidden md:flex items-center space-x-6', '')}>
      {navigationLinks.map(link => (
        <Link key={link.href} href={link.href} className={navItemClasses}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
