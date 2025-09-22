import clsx from 'clsx';
import { ProjectTechBadges } from '../ProjectTechBadges';

type ProjectSummaryProps = {
  name: string;
  projectYear: string;
  description: string;
  techStack: string[];
};

export function ProjectSummary({
  name,
  projectYear,
  description,
  techStack,
}: ProjectSummaryProps) {
  return (
    <div className={clsx('flex flex-col justify-between', 'p-6', 'flex-1')}>
      <div className='mb-4'>
        <div className='flex flex-row justify-between align-start'>
          <h2
            className={clsx(
              'text-xl/tight sm:text-2xl/tight font-bold text-slate-900 mb-4',
              'transition-colors duration-200',
            )}
          >
            {name}
          </h2>
          <p className='text-slate-500'>{projectYear}</p>
        </div>

        <p className={clsx('text-slate-800 leading-relaxed', 'line-clamp-3')}>
          {description}
        </p>
      </div>

      {/* Tech Stack */}
      {techStack && techStack.length > 0 && (
        <ProjectTechBadges techStack={techStack} />
      )}
    </div>
  );
}
