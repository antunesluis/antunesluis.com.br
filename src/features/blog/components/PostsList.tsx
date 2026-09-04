import Link from 'next/link';
import { CoverImage } from '@/components/ui/CoverImage';
import { Heading } from '@/components/ui/Heading';
import { PostSummary } from './PostSummary';
import { PostModel } from '../models/post-model';

type PostsListProps = {
  posts: PostModel[];
};

export async function PostsList({ posts }: PostsListProps) {
  const postsToShow = posts.slice(1);

  return (
    <section className='flex flex-col gap-6'>
      <Heading as='h2'>All Posts</Heading>

      <div className='grid grid-cols-1 gap-8 sm:grid-cols-2'>
        {postsToShow.map(post => {
          const postLink = `/blog/${post.slug}`;

          return (
            <article key={post.slug} className='flex'>
              <Link
                href={postLink}
                className='group -m-3 flex min-w-0 flex-1 flex-col gap-4 rounded-2xl p-3 transition-colors hover:bg-muted active:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
              >
                <CoverImage
                  imageProps={{
                    width: 1200,
                    height: 700,
                    src: post.coverImageUrl,
                    alt: '',
                    priority: false,
                  }}
                  className='aspect-[12/7] bg-muted ring-1 ring-border/70'
                />
                <PostSummary
                  postHeading='h3'
                  createdAt={post.createdAt}
                  title={post.title}
                  excerpt={post.excerpt}
                  variant='grid'
                />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
