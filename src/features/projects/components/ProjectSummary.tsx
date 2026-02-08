import { Heading } from '@/components/ui';
import clsx from 'clsx';
import { ProjectTechBadges } from './ProjectTechBadges';

type ProjectSummaryProps = {
  name: string;
  projectYear?: string;
  description: string;
  techStack: string[];
  showTechs?: boolean;
  className?: string;
  variant?: 'card' | 'default';
};

export function ProjectSummary({
  name,
  projectYear,
  description,
  techStack,
  showTechs = true,
  className = '',
  variant = 'default',
}: ProjectSummaryProps) {
  const summaryVariants = {
    default: clsx('p-6'),
    card: clsx('p-0'),
  };

  return (
    <section
      className={clsx(
        'flex flex-col justify-between flex-1',
        className,
        summaryVariants[variant],
      )}
    >
      <div className='mb-4'>
        <div className='flex flex-row justify-between items-start mb-2'>
          <Heading as='h3'>{name}</Heading>
          {projectYear && (
            <span className='text-muted-foreground text-sm font-medium whitespace-nowrap shrink-0'>
              {projectYear}
            </span>
          )}
        </div>

        <p className={clsx('leading-relaxed', 'line-clamp-3')}>{description}</p>
      </div>

      {techStack && showTechs && techStack.length > 0 && (
        <ProjectTechBadges isCompact={true} techStack={techStack} />
      )}
    </section>
  );
}
