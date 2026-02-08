import Link from 'next/link';

export function Footer() {
  return (
    <footer className='text-center pb-6'>
      <p className='text-muted-foreground hover:text-accent transition-colors'>
        <Link href='/'>
          © {new Date().getFullYear()} Luis Antunes. All rights reserved.
        </Link>
      </p>
    </footer>
  );
}
