import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='text-center pb-16'>
      <p className='text-slate-600'>
        <Link href='/'>
          © {new Date().getFullYear()} The Blog. Todos os direitos reservados.
        </Link>
      </p>
    </footer>
  );
}
