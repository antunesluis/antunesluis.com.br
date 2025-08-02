import { postRepository } from '@/repositories/post';
import { notFound } from 'next/navigation';
import { cache } from 'react';

export const findAllPublicPostsCached = cache(async () => {
  const posts = await postRepository.findAllPublic().catch(() => undefined);

  if (!posts) {
    notFound();
  }
  return posts;
});

export const findPostByIdCached = cache(async (id: string) => {
  const post = await postRepository.findById(id).catch(() => undefined);

  if (!post) {
    notFound();
  }
  return post;
});

export const findPostBySlugCached = cache(async (slug: string) => {
  const post = await postRepository.findBySlug(slug).catch(() => undefined);

  if (!post) {
    notFound();
  }
  return post;
});
