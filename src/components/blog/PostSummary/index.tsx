import { Heading } from '@/components/ui/Heading';
import { PostDate } from '../PostDate';

type PostSummaryProps = {
  postHeading: 'h1' | 'h2';
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
    <div className='flex flex-col gap-4 sm:justify-center'>
      <PostDate dateTime={createdAt} />

      <Heading as={postHeading}>{title}</Heading>

      <p className='text-slate-800 leading-relaxed line-clamp-3'>{excerpt}</p>
    </div>
  );
}
