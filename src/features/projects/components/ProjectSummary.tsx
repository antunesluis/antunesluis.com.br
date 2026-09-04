import { Heading } from '@/components/ui/Heading';
import clsx from 'clsx';

type ProjectSummaryProps = {
  name: string;
  description: string;
  createdAt: string;
  className?: string;
};

export function ProjectSummary({
  name,
  description,
  createdAt,
  className = '',
}: ProjectSummaryProps) {
  const projectYear = new Date(createdAt).getFullYear();

  return (
    <div className={clsx('min-w-0', className)}>
      <div className='flex items-baseline justify-between gap-4'>
        <Heading
          as='h2'
          withUnderline={false}
          className='min-w-0 transition-colors'
        >
          {name}
        </Heading>

        <time
          dateTime={createdAt}
          className='shrink-0 text-sm font-medium tabular-nums text-muted-foreground'
        >
          {projectYear}
        </time>
      </div>

      <p className='mt-1.5 line-clamp-3 max-w-2xl leading-6 text-muted-foreground'>
        {description}
      </p>
    </div>
  );
}
