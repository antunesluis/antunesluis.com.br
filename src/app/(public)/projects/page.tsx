import { BreadcrumbSchema } from '@/components/seo';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { ProjectsList } from '@/features/projects/components/ProjectsList';
import { ProjectsListSchema } from '@/features/projects/components/seo/ProjectsListSchema';
import { findAllPublicProjectCached } from '@/features/projects/lib/queries/public';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Heading } from '@/components/ui/Heading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Projetos',
  description:
    'Portfólio de projetos de desenvolvimento web e software, com contexto, decisões de implementação e resultados.',
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

      <div className='mb-24'>
        <header className='mb-12 max-w-2xl'>
          <Heading as='h1'>Projects</Heading>
          <p className='mt-3 leading-relaxed text-muted-foreground'>
            Selected software projects, from focused tools to full-stack
            applications.
          </p>
        </header>

        <section aria-label='Project list'>
          <Suspense fallback={<SpinLoader className='min-h-20 mb-24' />}>
            <ProjectsList projects={projects} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
