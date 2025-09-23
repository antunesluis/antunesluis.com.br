import Image from 'next/image';
import { PostDate } from '../PostDate';
import { SafeMarkdown } from '../../ui/SafeMarkdown';
import { findPostBySlugPublicCached } from '@/lib/post/queries/public';
import { Heading } from '@/components/ui/Heading';

type SinglePostProps = {
  slug: string;
};
export async function SinglePost({ slug }: SinglePostProps) {
  const post = await findPostBySlugPublicCached(slug);

  return (
    <article className='mb-16'>
      <header className='group flex flex-col gap-4 mb-4'>
        <Image
          className='rounded-xl'
          src={post.coverImageUrl}
          width={1200}
          height={720}
          alt={post.title}
        />

        <Heading as='h1'>{post.title}</Heading>

        <p className='text-md/tight text-gray-500'>
          {post.author} | <PostDate dateTime={post.createdAt} />
        </p>
      </header>

      <p className='text-xl mb-6 leading-relaxed text-slate-600 font-light italic'>
        {post.excerpt}
      </p>

      <hr className='border-slate-300 mb-6 ' />

      <SafeMarkdown markdown={post.content} />
    </article>
  );
}
