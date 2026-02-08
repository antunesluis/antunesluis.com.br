import { notFound } from 'next/navigation';
import { cache } from 'react';
import { postRepository } from '../../repositories';

export const findPostByIdAdmin = cache(async (id: string) => {
  const post = await postRepository.findById(id).catch(() => undefined);
  if (!post) notFound();
  return post;
});

export const findAllPostsAdmin = cache(async () => {
  const posts = await postRepository.findAll().catch(() => undefined);
  if (!posts) notFound();
  return posts;
});
