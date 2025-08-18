import { ManagePostForm } from '@/components/ManagePostForm';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New Post',
};

export default async function AdminPostNewPage() {
  return (
    <>
      <div className='flex flex-col gap-6'>
        <h1 className='text-2xl font-extrabold'>New Post</h1>
        <ManagePostForm />
      </div>
    </>
  );
}
