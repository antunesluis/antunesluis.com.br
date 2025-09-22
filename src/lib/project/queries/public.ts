import { projectRepository } from '@/repositories/project';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findAllPublicProjectsCached = cache(
  unstable_cache(
    async () => {
      const projects = await projectRepository
        .findAllPublic()
        .catch(() => undefined);

      if (!projects) notFound();
      return projects;
    },
    ['projects'],
    {
      tags: ['projects'],
    },
  ),
);

export const findProjectBySlugPublicCached = cache((slug: string) => {
  unstable_cache(
    async (slug: string) => {
      const project = await projectRepository
        .findBySlugPublic(slug)
        .catch(() => undefined);

      if (!project) notFound();
      return project;
    },
    [`project-${slug}`],
    {
      tags: [`project-${slug}`],
    },
  );
});
