import { ManagePostForm } from '@/components/ManagePostForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Post',
};

export default async function AdminPostNewPage() {
  return (
    <>
      <h1 className='mb-8 text-2xl font-bold'>New Post</h1>
      <ManagePostForm />
    </>
  );
}
