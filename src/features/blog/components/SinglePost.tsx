import Image from 'next/image';
import { Comments } from '@/components/ui/Comments';
import { Heading } from '@/components/ui/Heading';
import { SafeMarkdown } from '@/components/ui/SafeMarkdown';
import { ScrollTopAndComment } from '@/components/ui/ScrollTopAndComment';
import { PostDate } from './PostDate';
import { PostModel } from '../models/post-model';

type SinglePostProps = {
  post: PostModel;
};

export async function SinglePost({ post }: SinglePostProps) {
  const pathname = `post/${post.slug}`;

  return (
    <div className='mb-16 sm:mb-20'>
      <article className='flex flex-col gap-8'>
        <header className='flex flex-col gap-8'>
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

          <div className='aspect-[16/9] overflow-hidden rounded-xl'>
            <Image
              className='h-full w-full object-cover'
              src={post.coverImageUrl}
              width={1200}
              height={720}
              sizes='(max-width: 848px) calc(100vw - 3rem), 50rem'
              alt={post.title}
              priority
            />
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
    </div>
  );
}
