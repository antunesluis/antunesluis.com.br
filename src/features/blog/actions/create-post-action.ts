'use server';

import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';
import { updateTag } from 'next/cache';
import { PostCreateSchema } from '../lib/validation';
import { makePartialPublicPost, PublicPost } from '../dto/post-dto';
import { getZodErrorMessages } from '@/lib/utils';
import { PostModel } from '../models/post-model';
import { makeSlugFromText } from '@/lib/utils/make-slug-from-text';
import { postRepository } from '../repositories';
import { verifyLoginSession } from '@/lib/auth';
import type { FormActionState } from '@/lib/action-result';
import { BLOG_CACHE_TAG } from '../lib/cache-tags';

type CreatePostActionState = FormActionState<PublicPost>;

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
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

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostCreateSchema.safeParse(formDataToObj);

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicPost(formDataToObj),
      success: false,
    };
  }

  const validPostData = zodParsedObj.data;
  const newPost: PostModel = {
    ...validPostData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidV4(),
    slug: makeSlugFromText(validPostData.title),
  };

  try {
    await postRepository.create(newPost);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: newPost,
        errors: [e.message],
        success: false,
      };
    }

    return {
      formState: newPost,
      errors: ['Unknown error'],
      success: false,
    };
  }

  updateTag(BLOG_CACHE_TAG);
  redirect(`/admin/blog/${newPost.id}?created=1`);
}
