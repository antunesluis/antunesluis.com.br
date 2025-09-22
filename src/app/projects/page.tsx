import { findAllPublicProjectsCached } from '@/lib/project/queries/public';

export const dynamic = 'force-dynamic';

export default async function Projects() {
  const projects = await findAllPublicProjectsCached();

  return (
    <>
      {projects.slice(1).map(project => {
        const projectLink = `/projects/${project.slug}`;

        return (
          <div className='flex flex-col gap-4 group' key={project.slug}>
            <h1>{projectLink}</h1>
          </div>
        );
      })}
    </>
  );
}
