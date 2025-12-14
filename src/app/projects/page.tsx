import ProjectsList from '@/components/projects/ProjectsList';
import { ProjectsListSchema } from '@/components/seo/ProjectsListSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';
import ErrorMessage from '@/components/ui/ErrorMessage';

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

      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <ProjectsList />
      </Suspense>
    </>
  );
}
