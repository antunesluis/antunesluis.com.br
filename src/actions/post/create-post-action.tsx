'use server';

import { PublicPost } from '@/dto/post/dto';

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
  console.log(formDataToObject);

  return {
    formState: {
      ...prevState.formState,
    },
    errors: [],
  };
}
