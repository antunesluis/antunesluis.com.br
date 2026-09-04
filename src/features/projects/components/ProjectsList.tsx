import Link from 'next/link';
import { CoverImage } from '@/components/ui/CoverImage';
import { ProjectSummary } from './ProjectSummary';
import { ProjectModel } from '../models/project-model';

type ProjectsListProps = {
  projects: ProjectModel[];
};

export async function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className='flex flex-col gap-12 sm:gap-16'>
      {projects.map((project, index) => (
        <article key={project.slug}>
          <Link
            href={`/projects/${project.slug}`}
            className='group -m-3 block rounded-2xl p-3 transition-colors hover:bg-muted active:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
          >
            <CoverImage
              imageProps={{
                width: 1200,
                height: 700,
                src: project.coverImageUrl,
                alt: '',
                loading: index === 0 ? 'eager' : 'lazy',
                sizes: '(max-width: 640px) calc(100vw - 3rem), 50rem',
              }}
              className='aspect-[2/1] bg-muted ring-1 ring-border/70'
            />

            <ProjectSummary
              name={project.name}
              description={project.description}
              createdAt={project.createdAt}
              className='mt-4 sm:mt-5'
            />
          </Link>
        </article>
      ))}
    </div>
  );
}
