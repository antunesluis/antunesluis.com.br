import { Heading } from '@/components/ui/Heading';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <section className='mb-24'>
      <div className={clsx('flex flex-row justify-center')}>
        <Heading as='h1' className='md:text-5xl/tight'>
          Olá, Sou o Luis! 👋
        </Heading>
      </div>
    </section>
  );
}
