import Image from 'next/image';
import { findPublicPostBySlugCached } from '../lib/queries/public';
import {
  Comments,
  Heading,
  SafeMarkdown,
  ScrollTopAndComment,
} from '@/components/ui';
import { PostDate } from './PostDate';

type SinglePostProps = {
  slug: string;
};

export async function SinglePost({ slug }: SinglePostProps) {
  const post = await findPublicPostBySlugCached(slug);
  const pathname = `post/${post.slug}`;

  return (
    <main className='mb-24'>
      <article className='flex flex-col gap-12'>
        <header className='group flex flex-col gap-12'>
          <Image
            className='rounded-xl w-full h-auto'
            src={post.coverImageUrl}
            width={1200}
            height={720}
            alt={post.title}
            priority
          />

          <div className='flex flex-col gap-4'>
            <Heading as='h1'>{post.title}</Heading>

            <p className='text-lg text-muted-foreground font-semibold'>
              <span>{post.author}</span>
              <span className='mx-2'>•</span>
              <PostDate dateTime={post.createdAt} />
            </p>

            <p className='text-xl leading-relaxed text-foreground font-light italic'>
              {post.excerpt}
            </p>
          </div>
        </header>

        <hr className='border-border' />

        <section>
          <SafeMarkdown markdown={post.content} />
        </section>

        <hr className='border-border' />

        <section>
          <Comments commentsTerm={pathname} />
        </section>

        <ScrollTopAndComment />
      </article>
    </main>
  );
}
