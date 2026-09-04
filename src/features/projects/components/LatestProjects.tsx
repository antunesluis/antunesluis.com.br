import Link from 'next/link';
import { ProjectModel } from '../models/project-model';

type LatestProjectsProps = {
  latestProjects: ProjectModel[];
};

export function LatestProjects({ latestProjects }: LatestProjectsProps) {
  return (
    <ul className='divide-y divide-border/80'>
      {latestProjects.map(project => {
        const projectLink = `/projects/${project.slug}`;

        return (
          <li key={project.slug}>
            <article>
              <Link
                href={projectLink}
                className='group -mx-3 block rounded-lg px-3 py-3.5 transition-colors hover:bg-muted/50 active:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              >
                <h3 className='text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary group-focus-visible:text-primary sm:text-base'>
                  {project.name}
                </h3>
                <p className='mt-1 line-clamp-1 text-sm leading-6 text-muted-foreground'>
                  {project.description}
                </p>
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
