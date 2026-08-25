'use server';

import { updateTag } from 'next/cache';
import { PostUpdateSchema } from '../lib/validation';
import {
  makePartialPublicPost,
  makePublicPostFromDb,
  PublicPost,
} from '../dto/post-dto';
import { getZodErrorMessages } from '@/lib/utils';
import { verifyLoginSession } from '@/lib/auth';
import { postRepository } from '../repositories';
import type { FormActionState } from '@/lib/action-result';
import { BLOG_CACHE_TAG, getPostCacheTag } from '../lib/cache-tags';

type UpdatePostActionState = FormActionState<PublicPost>;

export async function updatePostAction(
  prevState: UpdatePostActionState,
  formData: FormData,
): Promise<UpdatePostActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      formState: prevState.formState,
      errors: ['Log in again before continuing'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Invalid data'],
      success: false,
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['Invalid ID'],
      success: false,
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostUpdateSchema.safeParse(formDataToObj);

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicPost(formDataToObj),
      success: false,
    };
  }

  const validPostData = zodParsedObj.data;
  const newPost = {
    ...validPostData,
  };

  let post;
  try {
    post = await postRepository.update(id, newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePartialPublicPost(formDataToObj),
        errors: [e.message],
        success: false,
      };
    }

    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Unknown error'],
      success: false,
    };
  }

  updateTag(BLOG_CACHE_TAG);
  updateTag(getPostCacheTag(post.slug));

  return {
    formState: makePublicPostFromDb(post),
    errors: [],
    success: true,
  };
}
