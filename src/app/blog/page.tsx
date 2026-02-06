import { Suspense } from 'react';
import PostFeatured from '@/components/blog/PostFeatured';
import PostsList from '@/components/blog/PostsList';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';
import { PersonSchema } from '@/components/seo/PersonSchema';
import { BlogSchema } from '@/components/seo/BlogSchema';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { Heading } from '@/components/ui/Heading';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const dynamic = 'force-dynamic';

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

  return (
    <>
      <WebSiteSchema />
      <PersonSchema />

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
            <PostFeatured />
            <PostsList />
          </Suspense>
        </article>
      </main>
    </>
  );
}
