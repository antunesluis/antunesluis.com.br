import { projectRepository } from '@/repositories/project';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findAllPublicProjectCached = cache(
  unstable_cache(
    async () => {
      return await projectRepository.findAllPublic();
    },
    ['projects'],
    {
      tags: ['projects'],
    },
  ),
);

export const findPublicProjectBySlugCached = cache((slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const project = await projectRepository
        .findBySlugPublic(slug)
        .catch(() => undefined);

      if (!project) notFound();

      return project;
    },
    [`project-${slug}`],
    { tags: [`project-${slug}`] },
  )(slug);
});
