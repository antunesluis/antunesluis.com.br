import Link from 'next/link';
import { HeaderNavigation } from '../HeaderNavigation';
import clsx from 'clsx';
import { HeaderMobileNavigation } from '../HeaderMobileNavigation';
import { BirdIcon } from 'lucide-react';

export function Header() {
  return (
    <header>
      <nav
        className={clsx(
          'flex items-center justify-between max-w-6xl mx-auto pt-6 lg:pt-8 pb-12 lg:pb-16',
        )}
      >
        <Link href='/' className='flex gap-1 items-center group'>
          {/* Ícone com animação de rotação - menor e mais próximo */}
          <BirdIcon className='w-8 h-8 text-slate-800 transition-transform duration-300 ease-in-out group-hover:rotate-12' />
          <h1 className='text-2xl lg:text-3xl font-bold font-serif tracking-tighter'>
            Luis Antunes
          </h1>
        </Link>
        <HeaderMobileNavigation />
        <HeaderNavigation />
      </nav>
    </header>
  );
}
