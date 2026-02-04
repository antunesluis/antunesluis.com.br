import { Suspense } from 'react';
import PostFeatured from '@/components/blog/PostFeatured';
import PostsList from '@/components/blog/PostsList';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';
import { PersonSchema } from '@/components/seo/PersonSchema';
import { BlogSchema } from '@/components/seo/BlogSchema';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { Heading } from '@/components/ui/Heading';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await findAllPublicPostsCached();

  return (
    <section className='mb-24'>
      <WebSiteSchema />
      <PersonSchema />

      <div className='flex flex-col gap-4 mb-12'>
        <Heading as='h1' className='md:text-5xl/tight'>
          /blog
        </Heading>
        <p>
          Here you can find all the 199 articles I wrote. You can read about web
          development, software engineering, and tech career in both English and
          Portuguese.
        </p>
      </div>

      {posts && posts.length > 0 && <BlogSchema posts={posts} />}

      <Suspense fallback={<SpinLoader className='mb-24 min-h-20' />}>
        <PostFeatured />
        <PostsList />
      </Suspense>
    </section>
  );
}
