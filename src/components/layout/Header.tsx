import Link from 'next/link';
import clsx from 'clsx';
import { BirdIcon } from 'lucide-react';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderMobileNavigation } from './HeaderMobileNavigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SearchButton } from '../ui/SearchButton';

export function Header() {
  return (
    <header>
      <nav
        className={clsx('flex items-center justify-between mx-auto pt-6 pb-12')}
        aria-label='Navegação principal'
      >
        <Link
          href='/'
          className='flex gap-2 items-center rounded-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          aria-label='Página inicial'
        >
          <BirdIcon className='w-7 h-7 lg:w-8 lg:h-8 text-foreground group-hover:text-primary' />

          {/* <h1 className='text-2xl font-extrabold tracking-tight text-foreground'> */}
          {/*   antunesluis */}
          {/* </h1> */}
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
