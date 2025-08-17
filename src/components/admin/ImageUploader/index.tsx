'use client';

import { Button } from '@/components/Button';
import { IMAGE_UPLOAD_MAX_SIZE } from '@/lib/constants';
import { ImageUpIcon } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChoseFile() {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  function handleChange() {
    if (!fileInputRef.current) return;

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) return;

    if (file.size > IMAGE_UPLOAD_MAX_SIZE) {
      const readableMaxSize = IMAGE_UPLOAD_MAX_SIZE / 1024;
      toast.error(`Image too large. Maximum size is ${readableMaxSize}KB.`);

      fileInput.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // TODO: Implement the upload logic here

    fileInput.value = '';
  }

  return (
    <div className='flex flex-col gap-2'>
      <Button
        onClick={handleChoseFile}
        className='self-start'
        type='button'
        variant='upload'
        size='md'
      >
        <ImageUpIcon />
        Enviar Imagem
      </Button>

      <input
        onChange={handleChange}
        ref={fileInputRef}
        className='hidden'
        name='file'
        type='file'
        accept='image/*'
      />
    </div>
  );
}
