import ProjectsList from '@/components/projects/ProjectsList';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function Projects() {
  return (
    <>
      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <ProjectsList />
      </Suspense>
    </>
  );
}
