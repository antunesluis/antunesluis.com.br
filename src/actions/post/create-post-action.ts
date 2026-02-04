'use server';

import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';
import { makePartialPublicPost, type PublicPost } from '@/dto/post/dto';
import { PostCreateSchema } from '@/lib/post/validation';
import type { PostModel } from '@/models/post/post-model';
import { postRepository } from '@/repositories/post';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { makeSlugFromText } from '@/utils/make-slug-from-text';
import { verifyLoginSession } from '@/lib/login/manage-login';
import { updateTag } from 'next/cache';

type CreatePostActionState = {
  formState: PublicPost;
  errors: string[];
  success?: true;
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = PostCreateSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicPost(formDataToObj),
      errors: ['Log in to another tab before continuing'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicPost(formDataToObj),
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
      };
    }

    return {
      formState: newPost,
      errors: ['Erro desconhecido'],
    };
  }

  updateTag('blog');
  redirect(`/admin/blog/${newPost.id}?created=1`);
}
