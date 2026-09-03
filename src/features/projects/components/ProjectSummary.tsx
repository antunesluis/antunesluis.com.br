import { Heading } from '@/components/ui/Heading';
import clsx from 'clsx';

type ProjectSummaryProps = {
  name: string;
  description: string;
  className?: string;
};

export function ProjectSummary({
  name,
  description,
  className = '',
}: ProjectSummaryProps) {
  return (
    <div className={clsx('min-w-0', className)}>
      <Heading as='h2' withUnderline={false} className='transition-colors'>
        {name}
      </Heading>

      <p className='mt-2 line-clamp-3 max-w-2xl leading-relaxed text-muted-foreground'>
        {description}
      </p>
    </div>
  );
}
