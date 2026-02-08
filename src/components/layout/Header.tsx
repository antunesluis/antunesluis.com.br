import Link from 'next/link';
import clsx from 'clsx';
import { BirdIcon } from 'lucide-react';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderMobileNavigation } from './HeaderMobileNavigation';
import { ThemeToggle } from '../ui';
import { SearchButton } from '../ui/SearchButton';

export function Header() {
  return (
    <header>
      <nav
        className={clsx('flex items-center justify-between mx-auto pt-6 pb-12')}
      >
        <Link href='/' className='flex gap-2 items-center group'>
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
