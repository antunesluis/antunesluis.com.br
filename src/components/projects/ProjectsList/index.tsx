import { findAllPublicProjectsCached } from '@/lib/project/queries/public';
import clsx from 'clsx';
import Link from 'next/link';
import { CoverImage } from '../../ui/CoverImage';
import { ProjectSummary } from '../ProjectSummary';

export default async function ProjectsList() {
  const projects = await findAllPublicProjectsCached();
  if (!projects || projects.length <= 1) return null;

  return (
    <div className={clsx('flex flex-col mb-16 gap-6')}>
      {projects.map(project => {
        const projectLink = `/projects/${project.slug}`;
        const projectYear = new Date(project.createdAt).getFullYear();

        return (
          <Link
            href={projectLink}
            key={project.slug}
            className={clsx(
              'group flex flex-col md:flex-row rounded-xl',
              'hover:shadow-lg hover:bg-slate-100',
              'transition-all duration-300 ease-in-out',
              'overflow-hidden',
            )}
          >
            <div
              className={clsx(
                'w-full h-64 md:h-auto md:w-64 flex-shrink-0 overflow-hidden',
              )}
            >
              <CoverImage
                imageProps={{
                  width: 1200,
                  height: 700,
                  src: project.coverImageUrl,
                  alt: project.name,
                  priority: true,
                }}
                className={clsx(
                  'rounded-t-xl rounded-l-xl rounded-r-xl rounded-b-none md:rounded-b-none md:rounded-r-none',
                )}
              />
            </div>

            <ProjectSummary
              name={project.name}
              projectYear={String(projectYear)}
              description={project.description}
              techStack={project.techStack}
              className='p-6'
            />
          </Link>
        );
      })}
    </div>
  );
}
