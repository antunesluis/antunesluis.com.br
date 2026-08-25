'use server';

import { updateTag } from 'next/cache';
import { postRepository } from '../repositories';
import { verifyLoginSession } from '@/lib/auth';
import type { ActionResult } from '@/lib/action-result';
import { BLOG_CACHE_TAG, getPostCacheTag } from '../lib/cache-tags';

export async function deletePostAction(id: string): Promise<ActionResult> {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      errors: ['Log in again before continuing'],
      success: false,
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      errors: ['Invalid data'],
      success: false,
    };
  }

  let post;
  try {
    post = await postRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        errors: [e.message],
        success: false,
      };
    }

    return {
      errors: ['Unknown error'],
      success: false,
    };
  }

  updateTag(BLOG_CACHE_TAG);
  updateTag(getPostCacheTag(post.slug));

  return {
    errors: [],
    success: true,
  };
}
