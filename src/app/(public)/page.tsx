import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';
import { ButtonLink, Heading, SpinLoader } from '@/components/ui';
import { LatestPosts } from '@/features/blog';
import { LatestProjects } from '@/features/projects';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description:
    'Personal website of Luis Antunes, a Computer Science student sharing projects, articles, and ideas about web development and technology.',
  pathname: '/',
});

export default function HomePage() {
  return (
    <main className='flex flex-col gap-16 mb-24'>
      <header className='space-y-1'>
        <Heading as='h1'>Luis Antunes</Heading>
        <p className='text-lg text-muted-foreground'>
          Computer science student
        </p>

        <ButtonLink
          href='/about'
          variant='link'
          size='sm'
          className='group hover:text-primary'
        >
          Know more about me
          <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
        </ButtonLink>
      </header>

      <section className='space-y-6'>
        <Heading as='h2'>Latest Posts</Heading>

        <Suspense fallback={<SpinLoader className='min-h-64' />}>
          <LatestPosts />
        </Suspense>

        <div className='flex justify-center pt-2'>
          <ButtonLink
            href='/blog'
            variant='ghost'
            size='sm'
            className='group hover:text-primary'
          >
            See all posts
            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
          </ButtonLink>
        </div>
      </section>

      <section className='space-y-6'>
        <Heading as='h2'>Latest Projects</Heading>

        <Suspense fallback={<SpinLoader className='min-h-64' />}>
          <LatestProjects />
        </Suspense>

        <div className='flex justify-center pt-2'>
          <ButtonLink
            href='/projects'
            variant='ghost'
            size='sm'
            className='group hover:text-primary'
          >
            See all projects
            <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
