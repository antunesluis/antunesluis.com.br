import ProjectsList from '@/components/projects/ProjectsList';
import { ProjectsListSchema } from '@/components/seo/ProjectsListSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Heading } from '@/components/ui/Heading';

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
        <div className='flex flex-col gap-6 mb-12'>
          <Heading as='h1' className='md:text-5xl/tight'>
            /projects
          </Heading>
          <p>
            Here you can find all the 199 articles I wrote. You can read about
            web development, software engineering, and tech career in both
            English and Portuguese.
          </p>
        </div>

        <p className='text-foreground font-semibold text-md/tight'>
          ALL PROJECTS
        </p>
        <div className='w-full h-px bg-border mb-6 mt-2' />

        <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
          <ProjectsList />
        </Suspense>
      </section>
    </>
  );
}
