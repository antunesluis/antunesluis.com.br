import { postRepository } from '@/repositories/post';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findAllPublicPostsCached = cache(
  unstable_cache(
    async () => {
      const posts = await postRepository.findAllPublic().catch(() => undefined);

      if (!posts) notFound();
      return posts;
    },
    ['posts'],
    {
      tags: ['posts'],
    },
  ),
);

export const findPostBySlugPublicCached = cache((slug: string) => {
  return unstable_cache(
    async (slug: string) => {
      const post = await postRepository
        .findBySlugPublic(slug)
        .catch(() => undefined);

      if (!post) notFound();
      return post;
    },
    [`post-${slug}`],
    { tags: [`post-${slug}`] },
  )(slug);
});
