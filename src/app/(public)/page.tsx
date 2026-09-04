import { Metadata } from 'next';
import { PersonSchema, WebSiteSchema } from '@/components/seo';
import { SOCIAL } from '@/config/constants';
import { AsciiBird } from '@/features/home/components/AsciiBird';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description:
    'Personal website of Luis Fernando Antunes, a Computer Science student sharing projects, articles, and ideas about web development and technology.',
  pathname: '/',
});

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />
      <PersonSchema />

      <section
        className='flex min-h-0 w-full flex-1 items-center py-8 sm:py-10'
        aria-labelledby='home-heading'
      >
        <div className='grid w-full items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16'>
          <header className='mx-auto max-w-md text-center md:mx-0 md:text-left'>
            <h1
              id='home-heading'
              className='text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]'
            >
              @{SOCIAL.github}
            </h1>

            <p className='mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8'>
              I build clear, reliable software and share projects and technical
              notes along the way.
            </p>
          </header>

          <AsciiBird />
        </div>
      </section>
    </>
  );
}
