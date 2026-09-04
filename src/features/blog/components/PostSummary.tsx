import { Heading } from '@/components/ui/Heading';
import clsx from 'clsx';
import { PostDate } from './PostDate';

type PostSummaryProps = {
  postHeading: 'h1' | 'h2' | 'h3';
  createdAt: string;
  title: string;
  excerpt: string;
  variant?: 'featured' | 'grid';
};

export function PostSummary({
  postHeading,
  createdAt,
  title,
  excerpt,
  variant = 'featured',
}: PostSummaryProps) {
  return (
    <section className='flex min-w-0 flex-col sm:justify-center'>
      <PostDate dateTime={createdAt} compact />

      <Heading
        as={postHeading}
        withUnderline={false}
        className={clsx(
          'mt-2 transition-colors',
          variant === 'grid' && 'line-clamp-2 sm:min-h-[2lh]',
        )}
      >
        {title}
      </Heading>

      <p
        className={clsx(
          'mt-1.5 line-clamp-3 leading-6 text-muted-foreground',
          variant === 'grid' && 'sm:min-h-[3lh]',
        )}
      >
        {excerpt}
      </p>
    </section>
  );
}
