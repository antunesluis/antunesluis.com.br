import { SpinLoader } from '@/components/ui/SpinLoader';
import { ProjectListAdmin } from '@/features/projects';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Admin',
};

export default async function AdminProjectPage() {
  return (
    <>
      <h1 className='mb-6 text-2xl font-extrabold text-foreground'>Projetos</h1>
      <Suspense fallback={<SpinLoader className='mb-16' />}>
        <ProjectListAdmin />
      </Suspense>
    </>
  );
}
