import clsx from 'clsx';
import Link from 'next/link';

export function Header() {
  return (
    <header>
      <h1
        className={clsx(
          'text-4xl/normal font-extrabold py-8',
          'sm:text-4xl/normal sm:py-10',
          'md:text-5xl/normal md:py-11',
          'lg:text-6xl/normal lg:py-12',
        )}
      >
        <Link href='/'>Luis Antunes</Link>
      </h1>
    </header>
  );
}
