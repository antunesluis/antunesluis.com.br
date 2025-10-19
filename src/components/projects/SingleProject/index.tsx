import Image from 'next/image';
import { SafeMarkdown } from '../../ui/SafeMarkdown';
import { Button } from '@/components/ui/Button';
import { ExternalLinkIcon, GithubIcon } from 'lucide-react';
import { ProjectTechBadges } from '../ProjectTechBadges';
import { Heading } from '@/components/ui/Heading';
import Link from 'next/link';
import { findPublicProjectBySlugCached } from '@/lib/project/queries/public';
import { Comments } from '@/components/blog/Comments';

type SingleProjectProps = {
  slug: string;
};

export async function SingleProject({ slug }: SingleProjectProps) {
  const project = await findPublicProjectBySlugCached(slug);
  const projectYear = new Date(project.createdAt).getFullYear();
  const pathname = `projects/${project.slug}`;

  return (
    <article className='mb-16'>
      <header className='group flex flex-col gap-4 mb-4'>
        <Image
          className='rounded-xl mb-6'
          src={project.coverImageUrl}
          width={1200}
          height={720}
          alt={project.name}
        />

        <Heading as='h1'>{project.name}</Heading>

        <p className='text-md/tight text-slate-500 dark:text-slate-400'>
          Project developed in {projectYear}
        </p>
      </header>

      <p className='text-xl mb-6 leading-relaxed text-slate-600 dark:text-slate-200 font-light italic'>
        {project.description}
      </p>

      {(project.deployUrl || project.repositoryUrl) && (
        <div className='flex flex-wrap gap-4 mb-6'>
          {project.deployUrl && (
            <Link
              href={project.deployUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button variant='default' size='md'>
                Live Demo
                <ExternalLinkIcon />
              </Button>
            </Link>
          )}

          {project.repositoryUrl && (
            <Link
              href={project.repositoryUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button variant='ghost' size='md'>
                Repository
                <GithubIcon />
              </Button>
            </Link>
          )}
        </div>
      )}

      {project.techStack && project.techStack.length > 0 && (
        <div className='mb-6'>
          <ProjectTechBadges techStack={project.techStack} isCompact={false} />
        </div>
      )}

      <div className='w-full h-px bg-slate-200 dark:bg-slate-700 my-12'></div>

      <SafeMarkdown markdown={project.content} />

      <div className='w-full h-px bg-slate-200 dark:bg-slate-700 my-12'></div>

      <Comments commentsTerm={pathname} />
    </article>
  );
}
