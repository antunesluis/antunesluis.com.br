import ProjectsList from '@/components/projects/ProjectsList';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Projetos',
  description:
    'Portfólio de projetos de desenvolvimento web e software. Aplicações construídas com React, Next.js, TypeScript, Go e outras tecnologias modernas.',
  pathname: '/projects',
});

export default async function Projects() {
  return (
    <>
      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <ProjectsList />
      </Suspense>
    </>
  );
}
