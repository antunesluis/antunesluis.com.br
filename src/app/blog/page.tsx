import { Suspense } from 'react';
import PostFeatured from '@/components/blog/PostFeatured';
import PostsList from '@/components/blog/PostsList';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';
import { PersonSchema } from '@/components/seo/PersonSchema';
import { BlogSchema } from '@/components/seo/BlogSchema';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await findAllPublicPostsCached();

  return (
    <>
      <WebSiteSchema />
      <PersonSchema />
      {posts && posts.length > 0 && <BlogSchema posts={posts} />}

      <Suspense fallback={<SpinLoader className='mb-16 min-h-20' />}>
        <PostFeatured />
        <PostsList />
      </Suspense>
    </>
  );
}
