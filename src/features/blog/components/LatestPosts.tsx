import Link from 'next/link';
import { CoverImage } from '@/components/ui';
import { PostSummary } from './PostSummary';
import { PostModel } from '../models/post-model';

type LatestPostsProps = {
  latestPosts: PostModel[];
};

export async function LatestPosts({ latestPosts }: LatestPostsProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
      {latestPosts.map(post => {
        const postLink = `/blog/${post.slug}`;

        return (
          <article key={post.slug}>
            <Link href={postLink} className='flex flex-col gap-4 group'>
              <CoverImage
                imageProps={{
                  width: 1200,
                  height: 700,
                  src: post.coverImageUrl,
                  alt: post.title,
                  priority: false,
                  className: 'h-auto md:h-64',
                }}
              />
              <PostSummary
                postHeading='h3'
                createdAt={post.createdAt}
                title={post.title}
                excerpt={post.excerpt}
              />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
