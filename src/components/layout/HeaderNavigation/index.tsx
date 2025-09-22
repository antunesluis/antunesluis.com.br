import Link from 'next/link';
import { navigationLinks } from '@/config/navigation';

export function HeaderNavigation() {
  const navItemClasses =
    'text-slate-700 hover:text-blue-500 font-medium transition-colors duration-200';

  return (
    <div className='hidden md:flex items-center space-x-8'>
      {navigationLinks.map(link => (
        <Link key={link.href} href={link.href} className={navItemClasses}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
