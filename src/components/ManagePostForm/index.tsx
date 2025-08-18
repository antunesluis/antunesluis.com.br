'use client';

import { useState } from 'react';
import { Button } from '../Button';
import { InputCheckbox } from '../InputCheckbox';
import { InputText } from '../InputText';
import { MarkdownEditor } from '../MarkdownEditor';
import { ImageUploader } from '../admin/ImageUploader';
import { PublicPost } from '@/dto/post/dto';

type ManagePostFormProps = {
  publicPost: PublicPost;
};

export function ManagePostForm({ publicPost }: ManagePostFormProps) {
  const [content, setContent] = useState(publicPost?.content || '');

  return (
    <form action='' className='mb-16'>
      <div className='flex flex-col gap-6'>
        <InputText
          labelText='ID'
          name='id'
          placeholder='Automatically generated ID'
          type='text'
          defaultValue={publicPost?.id || 'auto-generated'}
          readOnly
        />

        <InputText
          labelText='Slug'
          name='slug'
          placeholder='Automatically generated slug'
          type='text'
          defaultValue={publicPost?.slug || 'auto-generated'}
          readOnly
        />

        <InputText
          labelText='Title'
          name='title'
          placeholder='Enter the post title'
          type='text'
          defaultValue={publicPost?.title || ''}
        />

        <InputText
          labelText='Author'
          name='author'
          placeholder='Enter the author name'
          type='text'
          defaultValue={publicPost?.author || ''}
        />

        <InputText
          labelText='Excerpt'
          name='excerpt'
          placeholder='Enter a brief excerpt of the post'
          type='text'
          defaultValue={publicPost?.excerpt || ''}
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
          defaultValue={publicPost?.coverImageUrl || ''}
        />

        <InputCheckbox
          labelText='Published'
          name='published'
          type='checkbox'
          defaultChecked={publicPost?.published || false}
        />

        <div className='mt-4'>
          <Button type='submit'>Send</Button>
        </div>
      </div>
    </form>
  );
}
