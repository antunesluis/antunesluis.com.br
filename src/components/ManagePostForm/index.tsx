'use client';

import { useState } from 'react';
import { Button } from '../Button';
import { InputCheckbox } from '../InputCheckbox';
import { InputText } from '../InputText';
import { MarkdownEditor } from '../MarkdownEditor';
import { ImageUploader } from '../admin/ImageUploader';

export function ManagePostForm() {
  const [content, setContent] = useState('');

  return (
    <form action='' className='mb-16'>
      <div className='flex flex-col gap-6'>
        <ImageUploader />

        <InputCheckbox labelText='Ativo' />

        <InputText disabled labelText='Label 1' placeholder='New Post Title' />
        <InputText
          disabled
          defaultValue='fdsfdds'
          labelText='Label 2'
          placeholder='New Post Title'
        />
        <InputText labelText='Label 2' placeholder='New Post Title' />
        <InputText
          defaultValue='fsdfsdsdd'
          labelText='Label 2'
          placeholder='New Post Title'
        />

        <MarkdownEditor
          labelText='Markdown Editor'
          disabled={false}
          textAreaName='markdown-editor'
          value={content}
          setValue={setContent}
        />

        <div className='mt-4'>
          <Button type='submit' size='md'>
            Enviar
          </Button>
        </div>
      </div>
    </form>
  );
}
