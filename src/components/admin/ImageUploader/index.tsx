'use client';

import { Button } from '@/components/Button';
import { ImageUpIcon } from 'lucide-react';
import { useRef } from 'react';

// type ImageUploaderProps = {};

export function ImageUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChoseFile() {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
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
        ref={fileInputRef}
        className='hidden'
        name='file'
        type='file'
        accept='image/*'
      />
    </div>
  );
}
