import PostFeatured from '@/components/blog/PostFeatured';
import PostsList from '@/components/blog/PostsList';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <PostFeatured />
        <PostsList />
      </Suspense>
    </>
  );
}
