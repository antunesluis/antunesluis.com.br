import Image from 'next/image';
import { ExternalLinkIcon, GithubIcon } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Comments } from '@/components/ui/Comments';
import { Heading } from '@/components/ui/Heading';
import { SafeMarkdown } from '@/components/ui/SafeMarkdown';
import { ScrollTopAndComment } from '@/components/ui/ScrollTopAndComment';
import { ProjectModel } from '../models/project-model';

type SingleProjectProps = {
  project: ProjectModel;
};

export async function SingleProject({ project }: SingleProjectProps) {
  const projectYear = new Date(project.createdAt).getFullYear();
  const pathname = `projects/${project.slug}`;

  return (
    <div className='mb-16 sm:mb-20'>
      <article className='flex flex-col gap-8'>
        <header className='flex flex-col gap-8'>
          <div className='flex max-w-3xl flex-col gap-4'>
            <div className='flex items-start justify-between gap-4 sm:gap-8'>
              <Heading as='h1' className='min-w-0'>
                {project.name}
              </Heading>

              <time
                dateTime={String(projectYear)}
                className='shrink-0 pt-1 text-sm font-medium tabular-nums text-muted-foreground sm:pt-1.5'
              >
                {projectYear}
              </time>
            </div>

            <p className='max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl'>
              {project.description}
            </p>

            {(project.deployUrl || project.repositoryUrl) && (
              <section aria-label='Project links'>
                <div className='flex flex-wrap items-center gap-x-5 gap-y-1'>
                  {project.deployUrl && (
                    <ButtonLink
                      href={project.deployUrl}
                      target='_blank'
                      variant='link'
                      className='group min-h-11 text-primary hover:underline hover:decoration-2 hover:underline-offset-4'
                    >
                      Live Demo
                      <span className='sr-only'> (opens in a new tab)</span>
                      <ExternalLinkIcon
                        aria-hidden='true'
                        className='transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none'
                      />
                    </ButtonLink>
                  )}

                  {project.repositoryUrl && (
                    <ButtonLink
                      href={project.repositoryUrl}
                      target='_blank'
                      variant='link'
                      className='group min-h-11 text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4'
                    >
                      Repository
                      <span className='sr-only'> (opens in a new tab)</span>
                      <GithubIcon aria-hidden='true' />
                    </ButtonLink>
                  )}
                </div>
              </section>
            )}
          </div>

          <div className='aspect-[16/9] overflow-hidden rounded-xl'>
            <Image
              className='h-full w-full object-cover'
              src={project.coverImageUrl}
              width={1200}
              height={720}
              sizes='(max-width: 848px) calc(100vw - 3rem), 50rem'
              alt={project.name}
              priority
            />
          </div>
        </header>

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
    </div>
  );
}
