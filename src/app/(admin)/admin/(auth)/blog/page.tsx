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
    <Suspense fallback={<SpinLoader className='mb-24' />}>
      <PostListAdmin />
    </Suspense>
  );
}
