import type { Metadata } from 'next';
import { ManageProjectForm } from '@/components/admin/ManageProjectForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New Project',
};

export default async function AdminProjectNewPage() {
  return (
    <>
      <div className='flex flex-col gap-6'>
        <h1 className='text-2xl font-extrabold'>New Project</h1>
        <ManageProjectForm mode='create' />
      </div>
    </>
  );
}
