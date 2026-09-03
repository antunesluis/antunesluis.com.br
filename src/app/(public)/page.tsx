import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { createMetadata } from '@/lib/metadata';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { BlogSchema } from '@/features/blog/components/seo/BlogSchema';
import { LatestPosts } from '@/features/blog/components/LatestPosts';
import { findAllPublicPostsCached } from '@/features/blog/lib/queries/public';
import { LatestProjects } from '@/features/projects/components/LatestProjects';
import { ProjectsListSchema } from '@/features/projects/components/seo/ProjectsListSchema';
import { findAllPublicProjectCached } from '@/features/projects/lib/queries/public';
import { PersonSchema, WebSiteSchema } from '@/components/seo';
import { FULL_NAME, LATEST_OFFSET } from '@/config/constants';
import { Heading } from '@/components/ui/Heading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description:
    'Personal website of Luis Fernando Antunes, a Computer Science student sharing projects, articles, and ideas about web development and technology.',
  pathname: '/',
});

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    findAllPublicProjectCached(),
    findAllPublicPostsCached(),
  ]);

  const latestProjects = projects?.slice(0, LATEST_OFFSET) ?? [];
  const latestPosts = posts?.slice(0, LATEST_OFFSET) ?? [];

  return (
    <>
      <WebSiteSchema />
      <PersonSchema />
      {latestProjects.length > 0 && (
        <ProjectsListSchema projects={latestProjects} />
      )}
      {latestPosts.length > 0 && <BlogSchema posts={latestPosts} />}

      <div className='mb-16 w-full sm:mb-20'>
        <header className='grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 pb-10 sm:gap-x-6 sm:pb-12'>
          <Heading as='h1' className='min-w-0 pt-0.5 sm:pt-1'>
            {FULL_NAME}
          </Heading>

          <p className='col-span-2 col-start-1 row-start-2 mt-3 max-w-lg text-[15px] leading-6 text-muted-foreground sm:col-span-1 sm:text-base sm:leading-7'>
            I build clear, reliable software and share projects and technical
            notes along the way.
          </p>

          <div className='relative col-start-2 row-start-1 h-full w-auto aspect-square justify-self-end overflow-hidden rounded-xl bg-muted ring-1 ring-border/80 sm:row-span-2'>
            <Image
              src='/images/hero.jpg'
              alt={`Portrait of ${FULL_NAME}`}
              fill
              className='object-cover'
              loading='eager'
              sizes='(max-width: 640px) 72px, 128px'
            />
          </div>
        </header>

        <div className='space-y-12 sm:space-y-14'>
          <section className='space-y-3' aria-labelledby='latest-posts-heading'>
            <div className='flex min-h-7 items-center justify-between gap-4'>
              <Heading as='h2' id='latest-posts-heading'>
                Latest posts
              </Heading>

              <ButtonLink
                href='/blog'
                variant='link'
                size='sm'
                className='group -my-2 min-h-11 shrink-0 text-[13px] text-muted-foreground hover:text-primary'
              >
                View Blog
                <ArrowRight
                  aria-hidden='true'
                  className='size-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none'
                />
              </ButtonLink>
            </div>

            {latestPosts.length > 0 ? (
              <LatestPosts latestPosts={latestPosts} />
            ) : (
              <p className='py-3 text-sm text-muted-foreground'>
                No posts published yet.
              </p>
            )}
          </section>

          <section
            className='space-y-3'
            aria-labelledby='latest-projects-heading'
          >
            <div className='flex min-h-7 items-center justify-between gap-4'>
              <Heading as='h2' id='latest-projects-heading'>
                Latest projects
              </Heading>

              <ButtonLink
                href='/projects'
                variant='link'
                size='sm'
                className='group -my-2 min-h-11 shrink-0 text-[13px] text-muted-foreground hover:text-primary'
              >
                View Projects
                <ArrowRight
                  aria-hidden='true'
                  className='size-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none'
                />
              </ButtonLink>
            </div>

            {latestProjects.length > 0 ? (
              <LatestProjects latestProjects={latestProjects} />
            ) : (
              <p className='py-3 text-sm text-muted-foreground'>
                No projects published yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
