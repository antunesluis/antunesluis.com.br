import { Suspense } from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import { BlogSchema } from '@/features/blog/components/seo/BlogSchema';
import { PostFeatured } from '@/features/blog/components/PostFeatured';
import { PostsList } from '@/features/blog/components/PostsList';
import { findAllPublicPostsCached } from '@/features/blog/lib/queries/public';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { BreadcrumbSchema } from '@/components/seo';
import { Heading } from '@/components/ui/Heading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Blog',
  description:
    'Technical blog by Luis Antunes featuring articles on web development, software engineering, and technology in English and Portuguese.',
  pathname: '/blog',
});

export default async function BlogPage() {
  const posts = await findAllPublicPostsCached();

  if (!posts || posts.length <= 0) {
    return (
      <ErrorMessage
        statusCode='😅 Oops!'
        content="We haven't created any posts yet."
      />
    );
  }
  const firstPost = posts[0];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ]}
      />
      {posts && posts.length > 0 && <BlogSchema posts={posts} />}

      <div className='mb-16 sm:mb-20'>
        <header className='mb-12 max-w-2xl'>
          <Heading as='h1'>Blog</Heading>
          <p className='mt-3 leading-relaxed text-muted-foreground'>
            Technical notes on software development, tools, and the systems I
            use.
          </p>
        </header>

        <div>
          <Suspense fallback={<SpinLoader className='min-h-20 mb-24' />}>
            <PostFeatured post={firstPost} />
            <PostsList posts={posts} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
