import Link from 'next/link';
import { CoverImage } from '@/components/ui/CoverImage';
import { getYearFromDate } from '@/lib/utils';
import { ProjectSummary } from './ProjectSummary';
import { ProjectModel } from '../models/project-model';

type LatestProjectsProps = {
  latestProjects: ProjectModel[];
};

export async function LatestProjects({ latestProjects }: LatestProjectsProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
      {latestProjects.map(project => {
        const projectLink = `/projects/${project.slug}`;
        const projectYear = getYearFromDate(project.createdAt);

        return (
          <article key={project.slug}>
            <Link
              href={projectLink}
              className='flex flex-col gap-4 rounded-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            >
              <CoverImage
                imageProps={{
                  width: 1200,
                  height: 700,
                  src: project.coverImageUrl,
                  alt: project.name,
                  priority: false,
                }}
                className='aspect-[12/7] h-auto'
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
  );
}
