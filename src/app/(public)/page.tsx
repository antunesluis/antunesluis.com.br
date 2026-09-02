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
import { LATEST_OFFSET } from '@/config/constants';
import { Heading } from '@/components/ui/Heading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description:
    'Personal website of Luis Antunes, a Computer Science student sharing projects, articles, and ideas about web development and technology.',
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

      <div className='mb-20 w-full sm:mb-24'>
        <header className='grid grid-cols-[4rem_minmax(0,1fr)] items-start gap-x-4 pb-14 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-6 sm:pb-16'>
          <div className='relative size-16 overflow-hidden rounded-full bg-muted ring-1 ring-border/80 sm:size-[72px]'>
            <Image
              src='/images/hero.jpg'
              alt='Portrait of Luis Antunes'
              width={72}
              height={72}
              className='size-full object-cover'
              loading='eager'
              sizes='(max-width: 640px) 64px, 72px'
            />
          </div>

          <div className='min-w-0 pt-0.5 sm:pt-1'>
            <Heading as='h1'>Luis Antunes</Heading>

            <p className='mt-3 max-w-lg text-[15px] leading-6 text-muted-foreground sm:text-base sm:leading-7'>
              I build clear, reliable software and share projects and technical
              notes along the way.
            </p>
          </div>
        </header>

        <div className='space-y-14 sm:space-y-16'>
          <section
            className='space-y-3'
            aria-labelledby='latest-posts-heading'
          >
            <div className='flex min-h-7 items-center justify-between gap-4'>
              <Heading
                as='h2'
                id='latest-posts-heading'
              >
                Latest posts
              </Heading>

              <ButtonLink
                href='/blog'
                variant='link'
                size='sm'
                className='group shrink-0 text-[13px] text-muted-foreground hover:text-primary'
              >
                View Blog
                <ArrowRight
                  aria-hidden='true'
                  className='size-3.5 transition-transform group-hover:translate-x-1'
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
              <Heading
                as='h2'
                id='latest-projects-heading'
              >
                Latest projects
              </Heading>

              <ButtonLink
                href='/projects'
                variant='link'
                size='sm'
                className='group shrink-0 text-[13px] text-muted-foreground hover:text-primary'
              >
                View Projects
                <ArrowRight
                  aria-hidden='true'
                  className='size-3.5 transition-transform group-hover:translate-x-1'
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
