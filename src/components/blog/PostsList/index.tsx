import Link from 'next/link';
import { PostSummary } from '@/components/blog/PostSummary';
import { CoverImage } from '../../ui/CoverImage';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { Heading } from '@/components/ui/Heading';

export default async function PostsList() {
  const posts = await findAllPublicPostsCached();
  if (!posts || posts.length <= 1) return null;

  const postsToShow = posts.slice(1);

  return (
    <section className='flex flex-col gap-6'>
      <Heading as='h2'>All Posts</Heading>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        {postsToShow.map(post => {
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
    </section>
  );
}
