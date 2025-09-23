import Image from 'next/image';
import { SafeMarkdown } from '../../ui/SafeMarkdown';
import { findProjectBySlugPublicCached } from '@/lib/project/queries/public';
import { Button } from '@/components/ui/Button';
import { ExternalLinkIcon, GithubIcon } from 'lucide-react';
import { ProjectTechBadges } from '../ProjectTechBadges';
import { Heading } from '@/components/ui/Heading';
import Link from 'next/link';

type SingleProjectProps = {
  slug: string;
};

export async function SingleProject({ slug }: SingleProjectProps) {
  const project = await findProjectBySlugPublicCached(slug);
  const projectYear = new Date(project.createdAt).getFullYear();

  return (
    <article className='mb-16'>
      <header className='group flex flex-col gap-4 mb-4'>
        <Image
          className='rounded-xl'
          src={project.coverImageUrl}
          width={1200}
          height={720}
          alt={project.name}
        />

        <Heading as='h1'>{project.name}</Heading>

        <p className='text-md/tight text-gray-500'>
          Project developed in {projectYear}
        </p>
      </header>

      <p className='text-xl mb-6 leading-relaxed text-slate-600 font-light italic'>
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
              <Button variant='default' size='lg'>
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
              <Button variant='ghost' size='lg'>
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

      <hr className='border-slate-300 mb-6' />

      <SafeMarkdown markdown={project.content} />
    </article>
  );
}
