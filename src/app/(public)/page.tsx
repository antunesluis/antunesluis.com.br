import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Heading } from '@/components/ui/Heading';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { BlogSchema } from '@/features/blog/components/seo/BlogSchema';
import { LatestPosts } from '@/features/blog/components/LatestPosts';
import { findAllPublicPostsCached } from '@/features/blog/lib/queries/public';
import { LatestProjects } from '@/features/projects/components/LatestProjects';
import { ProjectsListSchema } from '@/features/projects/components/seo/ProjectsListSchema';
import { findAllPublicProjectCached } from '@/features/projects/lib/queries/public';
import { PersonSchema, WebSiteSchema } from '@/components/seo';
import { LATEST_OFFSET } from '@/config/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description:
    'Personal website of Luis Antunes, a Computer Science student sharing projects, articles, and ideas about web development and technology.',
  pathname: '/',
});

export default async function HomePage() {
  const projects = await findAllPublicProjectCached();
  const posts = await findAllPublicPostsCached();

  if (!projects?.length || !posts?.length) {
    return (
      <ErrorMessage
        statusCode='😅 Oops!'
        content="We haven't created any projects or posts yet."
      />
    );
  }

  const latestProjects = projects.slice(0, LATEST_OFFSET);
  const latestPosts = posts.slice(0, LATEST_OFFSET);

  return (
    <>
      <WebSiteSchema />
      <PersonSchema />
      {latestProjects.length > 0 && (
        <ProjectsListSchema projects={latestProjects} />
      )}
      {latestPosts.length > 0 && <BlogSchema posts={latestPosts} />}

      <div className='flex flex-col gap-16 mb-24'>
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
            <LatestPosts latestPosts={latestPosts} />
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
            <LatestProjects latestProjects={latestProjects} />
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
      </div>
    </>
  );
}
