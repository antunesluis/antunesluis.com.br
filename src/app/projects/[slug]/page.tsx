import { SpinLoader } from '@/components/ui/SpinLoader';
import { findProjectBySlugPublicCached } from '@/lib/project/queries/public';
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
  const project = await findProjectBySlugPublicCached(slug);
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectSlugPage({
  params,
}: ProjectSlugPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
      <h1>{slug}</h1>
    </Suspense>
  );
}
