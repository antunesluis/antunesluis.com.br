import { SpinLoader } from '@/components/ui/SpinLoader';
import { PostListAdmin } from '@/features/blog';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Post Admin',
};

export default async function AdminPostPage() {
  return (
    <>
      <h1 className='mb-6 text-2xl font-extrabold text-foreground'>Posts</h1>
      <Suspense fallback={<SpinLoader className='mb-24' />}>
        <PostListAdmin />
      </Suspense>
    </>
  );
}
