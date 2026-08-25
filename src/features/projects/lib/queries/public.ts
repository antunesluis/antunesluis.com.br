import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { projectRepository } from '../../repositories';
import { getProjectCacheTag, PROJECTS_CACHE_TAG } from '../cache-tags';

export const findAllPublicProjectCached = cache(
  unstable_cache(
    async () => {
      return await projectRepository.findAllPublic();
    },
    [PROJECTS_CACHE_TAG],
    {
      tags: [PROJECTS_CACHE_TAG],
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
    [getProjectCacheTag(slug)],
    { tags: [getProjectCacheTag(slug)] },
  )(slug);
});
