import Image from 'next/image';
import { SafeMarkdown } from '../../ui/SafeMarkdown';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ExternalLinkIcon, GithubIcon } from 'lucide-react';
import { ProjectTechBadges } from '../ProjectTechBadges';
import { Heading } from '@/components/ui/Heading';
import { findPublicProjectBySlugCached } from '@/lib/project/queries/public';
import { Comments } from '@/components/ui/Comments';
import { ScrollTopAndComment } from '@/components/ui/ScrollTopAndComment';

type SingleProjectProps = {
  slug: string;
};

export async function SingleProject({ slug }: SingleProjectProps) {
  const project = await findPublicProjectBySlugCached(slug);
  const projectYear = new Date(project.createdAt).getFullYear();
  const pathname = `projects/${project.slug}`;

  return (
    <main className='mb-24'>
      <article className='flex flex-col gap-12'>
        <header className='group flex flex-col gap-12'>
          <Image
            className='rounded-xl w-full h-auto'
            src={project.coverImageUrl}
            width={1200}
            height={720}
            alt={project.name}
            priority
          />

          <div className='flex flex-col gap-4'>
            <Heading as='h1'>{project.name}</Heading>

            <p className='text-lg text-muted-foreground font-semibold'>
              Project developed in{' '}
              <time dateTime={String(projectYear)}>{projectYear}</time>
            </p>

            <p className='text-xl leading-relaxed text-foreground font-light italic'>
              {project.description}
            </p>

            {project.techStack && project.techStack.length > 0 && (
              <ProjectTechBadges
                techStack={project.techStack}
                isCompact={false}
              />
            )}
          </div>
        </header>

        {(project.deployUrl || project.repositoryUrl) && (
          <section aria-label='Project links'>
            <div className='flex flex-wrap gap-4 justify-center'>
              {project.deployUrl && (
                <ButtonLink
                  href={project.deployUrl}
                  target='_blank'
                  variant='default'
                  size='md'
                >
                  Live Demo
                  <ExternalLinkIcon />
                </ButtonLink>
              )}

              {project.repositoryUrl && (
                <ButtonLink
                  href={project.repositoryUrl}
                  target='_blank'
                  variant='ghost'
                  size='md'
                >
                  Repository
                  <GithubIcon />
                </ButtonLink>
              )}
            </div>
          </section>
        )}

        <hr className='border-border' />

        <section>
          <SafeMarkdown markdown={project.content} />
        </section>

        <hr className='border-border' />

        <section>
          <Comments commentsTerm={pathname} />
        </section>

        <ScrollTopAndComment />
      </article>
    </main>
  );
}
