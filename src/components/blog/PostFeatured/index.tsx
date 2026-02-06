import clsx from 'clsx';
import { CoverImage } from '../../ui/CoverImage';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { PostSummary } from '../PostSummary';
import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';

export default async function PostFeatured() {
  const posts = await findAllPublicPostsCached();
  if (!posts || posts.length <= 1) return null;
  const post = posts[0];

  return (
    <section className='flex flex-col gap-6'>
      <Heading as='h2'>Featured Post</Heading>

      <Link href={`/blog/${post.slug}`}>
        <section
          className={clsx(
            'grid grid-cols-1 gap-8 mb-16 group',
            'sm:grid-cols-2',
          )}
        >
          <CoverImage
            imageProps={{
              width: 1200,
              height: 700,
              src: post.coverImageUrl,
              alt: post.title,
              priority: true,
            }}
          />

          <PostSummary
            createdAt={post.createdAt}
            title={post.title}
            excerpt={post.excerpt}
            postHeading='h3'
          />
        </section>
      </Link>
    </section>
  );
}
