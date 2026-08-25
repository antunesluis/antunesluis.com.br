import { findAllProjectAdmin } from '@/features/projects';
import clsx from 'clsx';
import Link from 'next/link';
import { DeleteProjectButton } from './DeleteProjectButton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export async function ProjectListAdmin() {
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
    <div className='mb-16 overflow-hidden rounded-lg border border-border bg-card divide-y divide-border'>
      {projects.map(project => {
        return (
          <div
            className={clsx(
              'flex items-center justify-between gap-3 px-3 py-2 text-foreground transition-colors hover:bg-muted/70',
              !project.published && 'bg-muted/50',
            )}
            key={project.id}
          >
            <Link
              href={`/admin/projects/${project.id}`}
              className='min-w-0 flex-1 break-words font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:text-primary'
            >
              {project.name}
            </Link>

            {!project.published && (
              <span className='shrink-0 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground'>
                Draft
              </span>
            )}

            <DeleteProjectButton title={project.name} id={project.id} />
          </div>
        );
      })}
    </div>
  );
}
