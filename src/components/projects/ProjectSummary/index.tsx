import clsx from 'clsx';
import { ProjectTechBadges } from '../ProjectTechBadges';
import { Heading } from '@/components/ui/Heading';

type ProjectSummaryProps = {
  name: string;
  projectYear?: string;
  description: string;
  techStack: string[];
  className?: string;
};

export function ProjectSummary({
  name,
  projectYear,
  description,
  techStack,
  className = '',
}: ProjectSummaryProps) {
  return (
    <div className={clsx('flex flex-col justify-between', 'flex-1', className)}>
      <div className='mb-4'>
        <div className='flex flex-row justify-between items-start mb-2'>
          <Heading as='h2'>{name}</Heading>
          {projectYear && (
            <span className='text-slate-500 text-sm font-medium whitespace-nowrap flex-shrink-0'>
              {projectYear}
            </span>
          )}
        </div>

        <p className={clsx('text-slate-800 leading-relaxed', 'line-clamp-3')}>
          {description}
        </p>
      </div>

      {techStack && techStack.length > 0 && (
        <ProjectTechBadges isCompact={true} techStack={techStack} />
      )}
    </div>
  );
}
