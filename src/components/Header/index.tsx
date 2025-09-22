import Link from 'next/link';
import { HeaderNavigation } from '../HeaderNavigation';
import clsx from 'clsx';
import { HeaderMobileNavigation } from '../HeaderMobileNavigation';

export function Header() {
  return (
    <header>
      <nav
        className={clsx(
          'flex items-center justify-between max-w-6xl mx-auto pt-6 lg:pt-8 pb-12 lg:pb-16',
        )}
      >
        <Link href='/' className='flex items-center space-x-3 group'>
          <h1 className='text-3xl lg:text-4xl font-bold font-serif tracking-tighter'>
            Luis Antunes
          </h1>
        </Link>

        <HeaderMobileNavigation />
        <HeaderNavigation />
      </nav>
    </header>
  );
}
