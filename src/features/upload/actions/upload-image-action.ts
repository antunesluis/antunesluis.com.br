'use server';

import { verifyLoginSession } from '@/lib/auth';
import { publicEnv } from '@/config/env/public';
import { serverEnv } from '@/config/env/server';
import { mkdir, writeFile } from 'fs/promises';
import { extname, resolve } from 'path';

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageActionResult> {
  const makeResult = ({ url = '', error = '' }) => ({
    url,
    error,
  });

  const isAuthenticated = await verifyLoginSession();
  if (!isAuthenticated) {
    return makeResult({ error: 'Log in to another tab before continuing' });
  }

  if (!(formData instanceof FormData)) {
    return makeResult({ error: 'Invalid data.' });
  }

  const file = formData.get('file');

  if (!(file instanceof File)) {
    return makeResult({ error: 'Invalid file' });
  }

  const uploadMaxSize = publicEnv.imageUploadMaxSize;
  if (file.size > uploadMaxSize) {
    return makeResult({ error: 'File size exceeds limit.' });
  }

  if (!file.type.startsWith('image/')) {
    return makeResult({ error: 'File is not an image.' });
  }

  const imageExtension = extname(file.name);
  const uniqueImageName = `image-${Date.now()}${imageExtension}`;

  const uploadDirectory = serverEnv.imageUploadDirectory;
  const uploadFullPath = resolve(process.cwd(), 'public', uploadDirectory);
  await mkdir(uploadFullPath, { recursive: true });

  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);

  const fileFullPath = resolve(uploadFullPath, uniqueImageName);
  await writeFile(fileFullPath, buffer);

  const imageServerUrl = serverEnv.imageServerUrl;
  const url = `${imageServerUrl}/${uniqueImageName}`;

  return makeResult({
    url,
  });
}
