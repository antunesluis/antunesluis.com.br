import clsx from 'clsx';

type ProjectTechBadgesProps = {
  techStack: string[];
};

export function ProjectTechBadges({ techStack }: ProjectTechBadgesProps) {
  const badgeClasses = clsx(
    'px-3 py-1 text-sm font-medium',
    'bg-blue-100 text-blue-800 rounded-full',
    'border border-slate-200',
  );

  return (
    <div className='flex flex-wrap gap-2'>
      {techStack.slice(0, 5).map((tech, index) => (
        <span key={index} className={badgeClasses}>
          {`#${tech}`}
        </span>
      ))}

      {techStack.length > 4 && (
        <span className={badgeClasses}>+{techStack.length - 4}</span>
      )}
    </div>
  );
}
