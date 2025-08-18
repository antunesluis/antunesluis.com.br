'use server';

import { drizzleDb } from '@/db/drizzle';
import { postsTable } from '@/db/drizzle/schemas';
import { makePartialPublicPost, PublicPost } from '@/dto/post/dto';
import { PostCreateSchema } from '@/lib/post/validation';
import { PostModel } from '@/models/post/post-model';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { makeSlugFromText } from '@/utils/make-slug-from-text';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';

type CreatePostActionState = {
  formState: PublicPost;
  errors: string[];
};

export async function createPostAction(
  prevState: CreatePostActionState,
  formData: FormData,
): Promise<CreatePostActionState> {
  // TODO - Verify if the user is authenticated

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Invalid form data'],
    };
  }

  const formDataToObject = Object.fromEntries(formData.entries());
  const zodParsedObj = PostCreateSchema.safeParse(formDataToObject);

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);

    return {
      formState: makePartialPublicPost(formDataToObject),
      errors,
    };
  }
  const validPostData = zodParsedObj.data;

  const dateNow = new Date().toISOString();
  const newPost: PostModel = {
    ...validPostData,
    createdAt: dateNow,
    updatedAt: dateNow,
    id: uuidV4(),
    slug: makeSlugFromText(validPostData.title),
  };

  // TODO - Move to repository
  await drizzleDb.insert(postsTable).values(newPost);

  revalidateTag('posts');
  // Move to edit post page
  redirect(`/admin/post/${newPost.id}`);
}
