import Link from 'next/link';
import { HeaderNavigation } from '../HeaderNavigation';
import clsx from 'clsx';
import { HeaderMobileNavigation } from '../HeaderMobileNavigation';

export function Header() {
  return (
    <header>
      <nav
        className={clsx(
          'flex items-center justify-between max-w-6xl mx-auto py-8',
        )}
      >
        <Link href='/' className='flex items-center space-x-3 group'>
          <div className='w-10 h-10 rounded-lg bg-blue-900 transition-transform group-hover:scale-105'></div>
        </Link>

        <HeaderMobileNavigation />
        <HeaderNavigation />
      </nav>
    </header>
  );
}
