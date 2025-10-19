import Image from 'next/image';
import { PostDate } from '../PostDate';
import { SafeMarkdown } from '../../ui/SafeMarkdown';
import { Heading } from '@/components/ui/Heading';
import { Comments } from '@/components/blog/Comments';
import { findPublicPostBySlugCached } from '@/lib/post/queries/public';

type SinglePostProps = {
  slug: string;
};

export async function SinglePost({ slug }: SinglePostProps) {
  const post = await findPublicPostBySlugCached(slug);
  const pathname = `post/${post.slug}`;

  return (
    <article className='mb-16'>
      <header className='group flex flex-col gap-4 mb-4'>
        <Image
          className='rounded-xl mb-6'
          src={post.coverImageUrl}
          width={1200}
          height={720}
          alt={post.title}
        />

        <Heading as='h1'>{post.title}</Heading>

        <p className='text-md/tight text-slate-500 dark:text-slate-400'>
          {post.author} | <PostDate dateTime={post.createdAt} />
        </p>
      </header>

      <p className='text-xl mb-6 leading-relaxed text-slate-600 dark:text-slate-200 font-light italic'>
        {post.excerpt}
      </p>

      <div className='w-full h-px bg-slate-200 dark:bg-slate-700 my-12'></div>

      <SafeMarkdown markdown={post.content} />

      <div className='w-full h-px bg-slate-200 dark:bg-slate-700 my-12'></div>

      <Comments commentsTerm={pathname} />
    </article>
  );
}
