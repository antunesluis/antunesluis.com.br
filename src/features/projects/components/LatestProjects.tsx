import Link from 'next/link';
import { CoverImage } from '@/components/ui/CoverImage';
import { findAllPublicProjectCached } from '../lib/queries/public';
import { getYearFromDate } from '@/lib/utils';
import { ProjectSummary } from './ProjectSummary';

export async function LatestProjects() {
  const projects = await findAllPublicProjectCached();
  const latestProjects = projects.slice(0, 2);

  return (
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
                  className: 'h-auto md:h-64',
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
  );
}
