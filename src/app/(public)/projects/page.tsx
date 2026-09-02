import { BreadcrumbSchema } from '@/components/seo';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { ProjectsList } from '@/features/projects/components/ProjectsList';
import { ProjectsListSchema } from '@/features/projects/components/seo/ProjectsListSchema';
import { findAllPublicProjectCached } from '@/features/projects/lib/queries/public';
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

export default async function ProjectsPage() {
  const projects = await findAllPublicProjectCached();

  if (!projects || projects.length <= 0) {
    return (
      <ErrorMessage
        statusCode='😅 Oops!'
        content="We haven't created any projects yet."
      />
    );
  }

  return (
    <>
      {projects && projects.length > 0 && (
        <ProjectsListSchema projects={projects} />
      )}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Projetos', url: '/projects' },
        ]}
      />

      <section className='mb-24'>
        <h1 className='sr-only'>Projects</h1>

        <Suspense fallback={<SpinLoader className='min-h-20 mb-24' />}>
          <ProjectsList projects={projects} />
        </Suspense>
      </section>
    </>
  );
}
