'use server';

import { postRepository } from '@/repositories/post';
import { revalidateTag } from 'next/cache';

export async function deletePostAction(id: string) {
  // TODO - Verify if the user is authenticated

  if (!id || typeof id !== 'string') {
    return {
      error: 'Invalid data',
    };
  }

  let post;
  try {
    post = await postRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }

    return {
      error: 'Unknown error',
    };
  }

  revalidateTag('posts');
  revalidateTag(`posts-${post.slug}`);

  return {
    error: '',
  };
}
