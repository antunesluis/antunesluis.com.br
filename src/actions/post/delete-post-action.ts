'use server';

import { verifyLoginSession } from '@/lib/login/manage-login';
import { postRepository } from '@/repositories/post';
import { updateTag } from 'next/cache';

export async function deletePostAction(id: string) {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      errors: ['Log in again before continuing'],
    };
  }

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

  updateTag('blog');
  updateTag(`blog-${post.slug}`);

  return {
    error: '',
  };
}
