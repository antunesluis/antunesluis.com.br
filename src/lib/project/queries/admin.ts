import { projectRepository } from '@/repositories/project';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findProjectByIdAdmin = cache(async (id: string) => {
  const projects = await projectRepository.findById(id).catch(() => undefined);
  if (!projects) notFound();
  return projects;
});

export const findAllProjectAdmin = cache(async () => {
  const projects = await projectRepository.findAll().catch(() => undefined);
  if (!projects) notFound();
  return projects;
});
