import Link from 'next/link';
import { HeaderNavigation } from '../HeaderNavigation';
import clsx from 'clsx';
import { HeaderMobileNavigation } from '../HeaderMobileNavigation';
import { BirdIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchButton } from '@/components/ui/SearchButton';

export function Header() {
  return (
    <header>
      <nav
        className={clsx(
          'flex items-center justify-between max-w-6xl mx-auto pt-6 lg:pt-8 pb-12 lg:pb-16',
        )}
      >
        <Link href='/' className='flex gap-2 items-center group'>
          <BirdIcon className='w-7 h-7 lg:w-8 lg:h-8 text-blue-600 md:text-slate-800 dark:text-slate-200 transition-all duration-300 ease-in-out group-hover:rotate-12 group-hover:text-blue-600 dark:group-hover:text-blue-400' />

          <h1 className='text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100'>
            Luis Antunes
          </h1>
        </Link>

        <div className='flex items-center md:gap-2'>
          <HeaderNavigation />
          <ThemeToggle />
          <SearchButton />
          <HeaderMobileNavigation />
        </div>
      </nav>
    </header>
  );
}
