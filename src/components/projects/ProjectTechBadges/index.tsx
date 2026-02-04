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
    'bg-secondary/30 text-secondary-foreground hover:bg-secondary/60',
    'border border-secondary/20 rounded-full',
    'transition-colors duration-200',
  );

  const remainingBadgeClasses = clsx(
    'px-3 py-1.5 text-sm font-medium',
    'bg-muted text-muted-foreground',
    'border border-border',
    'rounded-full',
    'transition-all duration-200',
    'hover:bg-muted/70 hover:text-foreground',
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
