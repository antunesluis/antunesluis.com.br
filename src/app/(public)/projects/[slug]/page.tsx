import { BreadcrumbSchema } from '@/components/seo';
import { SpinLoader } from '@/components/ui';
import {
  findPublicProjectBySlugCached,
  ProjectSchema,
  SingleProject,
} from '@/features/projects';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';

type ProjectSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: ProjectSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await findPublicProjectBySlugCached(slug);

  return createMetadata({
    title: project.name,
    description: project.description,
    pathname: `/projects/${slug}`,
    image: project.coverImageUrl,
    type: 'article',
  });
}

export default async function ProjectSlugPage({
  params,
}: ProjectSlugPageProps) {
  const { slug } = await params;
  const project = await findPublicProjectBySlugCached(slug);

  return (
    <>
      {project && (
        <>
          <ProjectSchema project={project} />
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: '/' },
              { name: 'Projetos', url: '/projects' },
              { name: project.name, url: `/projects/${slug}` },
            ]}
          />
        </>
      )}

      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <SingleProject project={project} />
      </Suspense>
    </>
  );
}
