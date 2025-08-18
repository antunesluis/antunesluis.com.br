'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '../Button';
import { InputCheckbox } from '../InputCheckbox';
import { InputText } from '../InputText';
import { MarkdownEditor } from '../MarkdownEditor';
import { ImageUploader } from '../admin/ImageUploader';
import { makePartialPublicPost, PublicPost } from '@/dto/post/dto';
import { createPostAction } from '@/actions/post/create-post-action';
import { toast } from 'react-toastify';

type ManagePostFormProps = {
  publicPost?: PublicPost;
};

export function ManagePostForm({ publicPost }: ManagePostFormProps) {
  const initialState = {
    formState: makePartialPublicPost(publicPost),
    errors: [],
  };
  const [state, action, isPending] = useActionState(
    createPostAction,
    initialState,
  );

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach(error => {
        toast.error(error);
      });
    }
  }, [state.errors]);

  const { formState } = state;
  const [content, setContent] = useState(formState.content);

  return (
    <form action={action} className='mb-16'>
      <div className='flex flex-col gap-6'>
        <InputText
          labelText='ID'
          name='id'
          placeholder='Automatically generated ID'
          type='text'
          defaultValue={formState.id}
          readOnly
        />

        <InputText
          labelText='Slug'
          name='slug'
          placeholder='Automatically generated slug'
          type='text'
          defaultValue={formState.slug}
          readOnly
        />

        <InputText
          labelText='Title'
          name='title'
          placeholder='Enter the post title'
          type='text'
          defaultValue={formState.title}
        />

        <InputText
          labelText='Author'
          name='author'
          placeholder='Enter the author name'
          type='text'
          defaultValue={formState.author}
        />

        <InputText
          labelText='Excerpt'
          name='excerpt'
          placeholder='Enter a brief excerpt of the post'
          type='text'
          defaultValue={formState.excerpt}
        />

        <MarkdownEditor
          labelText='Content'
          value={content}
          setValue={setContent}
          textAreaName='content'
          disabled={false}
        />

        <ImageUploader />

        <InputText
          labelText='Cover Image URL'
          name='coverImageUrl'
          placeholder='Enter the URL of the cover image'
          type='text'
          defaultValue={formState.coverImageUrl}
        />

        <InputCheckbox
          labelText='Published'
          name='published'
          type='checkbox'
          defaultChecked={formState.published}
        />

        <div className='mt-4'>
          <Button type='submit'>Send</Button>
        </div>
      </div>
    </form>
  );
}
