import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { postRepository } from '../../repositories';
import { BLOG_CACHE_TAG, getPostCacheTag } from '../cache-tags';

export const findAllPublicPostsCached = cache(
  unstable_cache(
    async () => {
      return await postRepository.findAllPublic();
    },
    [BLOG_CACHE_TAG],
    {
      tags: [BLOG_CACHE_TAG],
    },
  ),
);

export const findPublicPostBySlugCached = cache((slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const post = await postRepository
        .findBySlugPublic(slug)
        .catch(() => undefined);

      if (!post) notFound();

      return post;
    },
    [getPostCacheTag(slug)],
    { tags: [getPostCacheTag(slug)] },
  )(slug);
});
