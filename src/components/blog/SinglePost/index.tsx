import Image from 'next/image';
import { PostDate } from '../PostDate';
import { SafeMarkdown } from '../../ui/SafeMarkdown';
import { Heading } from '@/components/ui/Heading';
import { Comments } from '@/components/ui/Comments';
import { findPublicPostBySlugCached } from '@/lib/post/queries/public';
import { ScrollTopAndComment } from '@/components/ui/ScrollTopAndComment';

type SinglePostProps = {
  slug: string;
};

export async function SinglePost({ slug }: SinglePostProps) {
  const post = await findPublicPostBySlugCached(slug);
  const pathname = `post/${post.slug}`;

  return (
    <article className='mb-24'>
      <header className='group flex flex-col gap-4 mb-4'>
        <Image
          className='rounded-xl mb-6'
          src={post.coverImageUrl}
          width={1200}
          height={720}
          alt={post.title}
        />

        <Heading as='h1'>{post.title}</Heading>

        <p className='text-md/tight text-muted-foreground'>
          {post.author} | <PostDate dateTime={post.createdAt} />
        </p>
      </header>

      <p className='text-xl mb-12 leading-relaxed font-light italic'>
        {post.excerpt}
      </p>

      <div className='w-full h-px bg-border mb-12'></div>
      <SafeMarkdown markdown={post.content} />
      <div className='w-full h-px bg-border mb-12'></div>

      <Comments commentsTerm={pathname} />
      <ScrollTopAndComment />
    </article>
  );
}
