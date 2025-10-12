import ErrorMessage from '@/components/ui/ErrorMessage';
import { findAllProjectAdmin } from '@/lib/project/queries/admin';
import clsx from 'clsx';
import Link from 'next/link';
import { DeleteProjectButton } from '../DeleteProjectButton';

export default async function ProjectListAdmin() {
  const projects = await findAllProjectAdmin();

  if (!projects || projects.length <= 0) {
    return (
      <ErrorMessage
        statusCode='😅 Hey!'
        content="Let's create some projects!"
      />
    );
  }

  return (
    <div className='mb-16'>
      {projects.map(project => {
        return (
          <div
            className={clsx(
              'py-2 px-2',
              !project.published && 'bg-slate-300 dark:bg-slate-600',
              'flex gap-2 items-center justify-between',
            )}
            key={project.id}
          >
            <Link href={`/admin/projects/${project.id}`}>{project.name}</Link>

            {!project.published && (
              <span className='text-xs text-slate-600 dark:text-slate-300 italic ml-2'>
                (Draft)
              </span>
            )}

            <DeleteProjectButton title={project.name} id={project.id} />
          </div>
        );
      })}
    </div>
  );
}
