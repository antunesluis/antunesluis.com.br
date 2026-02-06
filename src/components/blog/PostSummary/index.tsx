import { Heading } from '@/components/ui/Heading';
import { PostDate } from '../PostDate';

type PostSummaryProps = {
  postHeading: 'h1' | 'h2' | 'h3';
  createdAt: string;
  title: string;
  excerpt: string;
};

export function PostSummary({
  postHeading,
  createdAt,
  title,
  excerpt,
}: PostSummaryProps) {
  return (
    <section className='flex flex-col gap-4 sm:justify-center'>
      <PostDate dateTime={createdAt} />
      <Heading as={postHeading}>{title}</Heading>
      <p className='leading-relaxed line-clamp-3'>{excerpt}</p>
    </section>
  );
}
