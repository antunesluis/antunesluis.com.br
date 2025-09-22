import { PostDate } from '../PostDate';
import { PostHeading } from '../PostHeading';

type PostSummaryProps = {
  postHeading: 'h1' | 'h2';
  postLink: string;
  createdAt: string;
  title: string;
  excerpt: string;
};

export function PostSummary({
  postHeading,
  postLink,
  createdAt,
  title,
  excerpt,
}: PostSummaryProps) {
  return (
    <div className='flex flex-col gap-4 sm:justify-center'>
      <PostDate dateTime={createdAt} />

      <PostHeading url={postLink} as={postHeading}>
        {title}
      </PostHeading>

      <p>{excerpt}</p>
      {/* <p className='text-slate-800'>{excerpt}</p> */}
    </div>
  );
}
