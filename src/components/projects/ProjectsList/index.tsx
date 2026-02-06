import clsx from 'clsx';
import Link from 'next/link';
import { CoverImage } from '../../ui/CoverImage';
import { ProjectSummary } from '../ProjectSummary';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';
import { getYearFromDate } from '@/utils/format-datetime';
import { Heading } from '@/components/ui/Heading';

export default async function ProjectsList() {
  const projects = await findAllPublicProjectCached();
  if (!projects || projects.length <= 0) return null;

  return (
    <section>
      <Heading as='h2' className='mb-6'>
        All Projects
      </Heading>

      <div className='flex flex-col gap-6'>
        {projects.map(project => {
          const projectLink = `/projects/${project.slug}`;
          const projectYear = getYearFromDate(project.createdAt);

          return (
            <article key={project.slug}>
              <Link
                href={projectLink}
                className={clsx(
                  'group flex flex-col md:flex-row',
                  'hover:shadow-lg hover:bg-card/80',
                  'rounded-xl overflow-hidden',
                  'transition-all duration-300 ease-in-out',
                )}
              >
                <div className='w-full h-64 md:h-auto md:w-64 shrink-0'>
                  <CoverImage
                    imageProps={{
                      width: 1200,
                      height: 700,
                      src: project.coverImageUrl,
                      alt: project.name,
                      priority: false,
                    }}
                    className='h-full md:rounded-l-xl md:rounded-tr-none'
                  />
                </div>

                <ProjectSummary
                  variant='default'
                  name={project.name}
                  projectYear={String(projectYear)}
                  description={project.description}
                  techStack={project.techStack}
                />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
