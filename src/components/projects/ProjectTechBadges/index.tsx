import clsx from 'clsx';

type ProjectTechBadgesProps = {
  techStack: string[];
  isCompact?: boolean;
  maxItems?: number;
};

export function ProjectTechBadges({
  techStack,
  isCompact = false,
  maxItems = 5,
}: ProjectTechBadgesProps) {
  if (!techStack || techStack.length === 0) {
    return null;
  }

  const badgeClasses = clsx(
    'px-3 py-1 text-sm font-medium',
    'bg-blue-100 text-blue-800 rounded-full',
    'dark:bg-blue-900/30 dark:text-blue-300',
    'border border-slate-200 dark:border-blue-800/50',
    'transition-colors duration-200',
  );

  const remainingBadgeClasses = clsx(
    'px-3 py-1 text-sm font-medium rounded-full border transition-colors duration-200',
    'bg-slate-100 text-slate-600 border-slate-300',
    'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', // Dark mode
  );

  return (
    <div className='flex flex-wrap gap-2'>
      {isCompact ? (
        <>
          {techStack.slice(0, maxItems).map(tech => (
            <span key={tech} className={badgeClasses}>
              {tech}
            </span>
          ))}

          {techStack.length > maxItems && (
            <span
              className={remainingBadgeClasses}
              title={`Other techs: ${techStack.slice(maxItems).join(', ')}`}
            >
              +{techStack.length - maxItems}
            </span>
          )}
        </>
      ) : (
        techStack.map(tech => (
          <span key={tech} className={badgeClasses}>
            {tech}
          </span>
        ))
      )}
    </div>
  );
}
