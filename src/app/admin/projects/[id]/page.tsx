import { ManageProjectForm } from '@/components/admin/ManageProjectForm';
import { makePublicProjectFromDb } from '@/dto/project/dto';
import { findProjectByIdAdmin } from '@/lib/project/queries/admin';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Edit Project',
};

type AdminProjectIdPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminProjectIdPage({
  params,
}: AdminProjectIdPageProps) {
  const { id } = await params;
  const project = await findProjectByIdAdmin(id).catch(() => undefined);

  if (!project) notFound();

  const publicProject = makePublicProjectFromDb(project);

  return (
    <>
      <div className='flex flex-col gap-6'>
        <h1 className='text-2xl font-extrabold'>Edit Project</h1>
        <ManageProjectForm mode='update' publicProject={publicProject} />
      </div>
    </>
  );
}
