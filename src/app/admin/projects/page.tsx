import ProjectListAdmin from '@/components/admin/ProjectListAdmin';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Post Admin',
};

export default async function AdminProjectPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <ProjectListAdmin />
    </Suspense>
  );
}
