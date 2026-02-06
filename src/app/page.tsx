import { PostSummary } from '@/components/blog/PostSummary';
import { ProjectSummary } from '@/components/projects/ProjectSummary';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { CoverImage } from '@/components/ui/CoverImage';
import { Heading } from '@/components/ui/Heading';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';
import { getYearFromDate } from '@/utils/format-datetime';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const projects = await findAllPublicProjectCached();
  const posts = await findAllPublicPostsCached();
  if (!posts || !projects) return null;

  const latestProjects = projects.slice(0, 2);
  const latestPosts = posts.slice(0, 2);

  return (
    <main className='flex flex-col gap-16 mb-24'>
      <header className='space-y-1'>
        <Heading as='h1'>Luis Antunes</Heading>
        <p className='text-lg text-muted-foreground'>
          Computer science student
        </p>
        <ButtonLink
          href='/projects'
          variant='link'
          size='sm'
          className='group hover:text-primary'
        >
          Know more about me
          <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
        </ButtonLink>
      </header>

      {/* Latest Posts Section */}
      <section className='space-y-6'>
        <Heading as='h2'>Latest Posts</Heading>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          {latestPosts.map(post => {
            const postLink = `/blog/${post.slug}`;

            return (
              <article key={post.slug}>
                <Link href={postLink} className='flex flex-col gap-4 group'>
                  <CoverImage
                    imageProps={{
                      width: 1200,
                      height: 700,
                      src: post.coverImageUrl,
                      alt: post.title,
                      priority: false,
                    }}
                  />
                  <PostSummary
                    postHeading='h3'
                    createdAt={post.createdAt}
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                </Link>
              </article>
            );
          })}
        </div>

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

      {/* Latest Projects Section */}
      <section className='space-y-6'>
        <Heading as='h2'>Latest Projects</Heading>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          {latestProjects.map(project => {
            const projectLink = `/projects/${project.slug}`;
            const projectYear = getYearFromDate(project.createdAt);

            return (
              <article key={project.slug}>
                <Link href={projectLink} className='flex flex-col gap-4 group'>
                  <CoverImage
                    imageProps={{
                      width: 1200,
                      height: 700,
                      src: project.coverImageUrl,
                      alt: project.name,
                      priority: false,
                    }}
                  />
                  <ProjectSummary
                    variant='card'
                    name={project.name}
                    projectYear={String(projectYear)}
                    description={project.description}
                    techStack={project.techStack}
                    showTechs={false}
                  />
                </Link>
              </article>
            );
          })}
        </div>

        <div className='flex justify-center pt-2'>
          <ButtonLink
            href='/projects'
            variant='ghost'
            size='sm'
            className='group hover:text-primary'
          >
            See all projects
            <ArrowRight className='w-4 hover:text-primary h-4 transition-transform group-hover:translate-x-1' />
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
