import { Suspense } from 'react';
import PostFeatured from '@/components/blog/PostFeatured';
import PostsList from '@/components/blog/PostsList';
import { SpinLoader } from '@/components/ui/SpinLoader';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={<SpinLoader className='mb-16 min-h-20' />}>
        <PostFeatured />
        <PostsList />
      </Suspense>
    </>
  );
}
