import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='text-center pb-16'>
      <p className='text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'>
        <Link href='/'>
          © {new Date().getFullYear()} Luis Antunes. All rights reserved.
        </Link>
      </p>
    </footer>
  );
}
