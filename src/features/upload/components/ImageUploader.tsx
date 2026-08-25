'use client';

import { HourglassIcon, ImageUpIcon } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { publicEnv } from '@/config/env/public';
import { uploadImageAction } from '../actions/upload-image-action';

type ImageUploaderProps = {
  disabled?: boolean;
};

export function ImageUploader({ disabled = false }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();
  const [imgUrl, setImgUrl] = useState('');

  function handleChoseFile() {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }

  function handleChange() {
    toast.dismiss();

    if (!fileInputRef.current) {
      setImgUrl('');
      return;
    }

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      setImgUrl('');
      return;
    }

    const uploadMaxSize = publicEnv.imageUploadMaxSize;
    if (file.size > uploadMaxSize) {
      const readableMaxSize = (uploadMaxSize / 1024).toFixed(2);
      toast.error(`Image too large. Maximum size is ${readableMaxSize}KB.`);

      fileInput.value = '';
      setImgUrl('');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      const result = await uploadImageAction(formData);

      if (result.error) {
        toast.error(`Error uploading image: ${result.error}`);
        fileInput.value = '';
        return;
      }

      setImgUrl(result.url);
      toast.success('Image uploaded successfully!');
    });

    fileInput.value = '';
  }

  return (
    <div className='flex flex-col gap-4' aria-busy={isUploading}>
      <Button
        onClick={handleChoseFile}
        disabled={isUploading || disabled}
        className='self-start'
        type='button'
        variant='upload'
        size='md'
      >
        {isUploading ? <HourglassIcon /> : <ImageUpIcon />}
        {isUploading ? 'Enviando imagem...' : 'Enviar Imagem'}
      </Button>

      {!!imgUrl && (
        <div className='flex flex-col gap-4'>
          <p>
            <b>URL:</b> {imgUrl}
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl} alt='Uploaded' className='rounded-lg' />
        </div>
      )}

      <input
        onChange={handleChange}
        disabled={isUploading || disabled}
        ref={fileInputRef}
        className='hidden'
        name='file'
        type='file'
        accept='image/jpeg,image/png,image/webp,image/avif'
      />
    </div>
  );
}
