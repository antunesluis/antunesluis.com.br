import { Suspense } from 'react';
import { Metadata } from 'next';
import { createMetadata } from '@/lib/metadata';
import {
  BlogSchema,
  findAllPublicPostsCached,
  PostFeatured,
  PostsList,
} from '@/features/blog';
import { ErrorMessage, Heading, SpinLoader } from '@/components/ui';
import { BreadcrumbSchema, WebSiteSchema } from '@/components/seo';

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

      <main>
        <article className='mb-24'>
          <section className='flex flex-col gap-6 mb-12'>
            <Heading as='h1'>/blog</Heading>
            <p>
              This is where you’ll find all {posts.length} articles I’ve
              written. I share thoughts on web development and tech in both
              English and Portuguese.
            </p>
          </section>

          {posts && posts.length > 0 && <BlogSchema posts={posts} />}

          <Suspense fallback={<SpinLoader className='min-h-20 mb-24' />}>
            <PostFeatured post={firstPost} />
            <PostsList posts={posts} />
          </Suspense>
        </article>
      </main>
    </>
  );
}
