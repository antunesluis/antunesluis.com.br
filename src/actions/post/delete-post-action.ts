'use server';

import { drizzleDb } from '@/db/drizzle';
import { postsTable } from '@/db/drizzle/schemas';
import { postRepository } from '@/repositories/post';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function deletePostAction(id: string) {
  if (!id || typeof id !== 'string') {
    return {
      error: 'Invalid data',
    };
  }

  const post = await postRepository.findById(id).catch(() => undefined);

  if (!post) {
    return {
      error: 'Post not found',
    };
  }

  // TODO: move to repository
  await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));

  // TODO: revalidate posts cache tag or path
  revalidateTag('posts');
  revalidateTag(`posts-${post.slug}`);

  return {
    error: null,
  };
}
