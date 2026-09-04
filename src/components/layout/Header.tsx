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
        className={clsx(
          'flex items-center justify-between mx-auto pt-5 pb-9 sm:pb-10',
        )}
        aria-label='Navegação principal'
      >
        <Link
          href='/'
          className='group -ml-2 inline-flex size-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          aria-label='Página inicial'
        >
          <BirdIcon className='size-6 text-foreground transition-colors group-hover:text-primary motion-reduce:transition-none sm:size-7' />

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
