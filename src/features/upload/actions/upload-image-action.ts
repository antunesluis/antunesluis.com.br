'use server';

import { verifyLoginSession } from '@/lib/auth';
import { validatedPublicEnv } from '@/config/env/public.server';
import { serverEnv } from '@/config/env/server';
import { mkdir, rename, unlink, writeFile } from 'fs/promises';
import { isAbsolute, resolve } from 'path';
import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';

const MAX_INPUT_PIXELS = 25_000_000;
const MAX_OUTPUT_WIDTH = 1920;
const MAX_OUTPUT_HEIGHT = 1920;
const WEBP_QUALITY = 80;
const supportedImageFormats = new Set(['jpeg', 'png', 'webp', 'avif']);

type UploadImageActionResult = {
  url: string;
  error: string;
};

function resolveUploadDirectory(uploadDirectory: string) {
  if (isAbsolute(uploadDirectory)) {
    return uploadDirectory;
  }

  return resolve(process.cwd(), 'public', uploadDirectory);
}

async function processImage(file: File) {
  const fileArrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileArrayBuffer);
  const image = sharp(buffer, {
    failOn: 'error',
    limitInputPixels: MAX_INPUT_PIXELS,
  });
  const metadata = await image.metadata();

  const isAvif =
    metadata.format === 'heif' && metadata.compression === 'av1';

  if (
    (!metadata.format || !supportedImageFormats.has(metadata.format)) &&
    !isAvif
  ) {
    throw new Error('Unsupported image format');
  }

  if (!metadata.width || !metadata.height) {
    throw new Error('Unsupported image format');
  }

  return image
    .rotate()
    .resize({
      width: MAX_OUTPUT_WIDTH,
      height: MAX_OUTPUT_HEIGHT,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

async function writeImageAtomically({
  buffer,
  directory,
  fileName,
}: {
  buffer: Buffer;
  directory: string;
  fileName: string;
}) {
  await mkdir(directory, { recursive: true });

  const fileFullPath = resolve(directory, fileName);
  const temporaryFileFullPath = resolve(
    directory,
    `.${fileName}.${uuidV4()}.tmp`,
  );

  try {
    await writeFile(temporaryFileFullPath, buffer, { flag: 'wx' });
    await rename(temporaryFileFullPath, fileFullPath);
  } catch (error) {
    await unlink(temporaryFileFullPath).catch(() => undefined);
    throw error;
  }
}

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

  const uploadMaxSize = validatedPublicEnv.imageUploadMaxSize;
  if (file.size > uploadMaxSize) {
    return makeResult({ error: 'File size exceeds limit.' });
  }

  let processedImage: Buffer;

  try {
    processedImage = await processImage(file);
  } catch {
    return makeResult({ error: 'File is not a supported image.' });
  }

  const uniqueImageName = `image-${uuidV4()}.webp`;
  const uploadFullPath = resolveUploadDirectory(serverEnv.imageUploadDirectory);

  try {
    await writeImageAtomically({
      buffer: processedImage,
      directory: uploadFullPath,
      fileName: uniqueImageName,
    });
  } catch {
    return makeResult({ error: 'Could not save image.' });
  }

  const imageServerUrl = serverEnv.imageServerUrl;
  const url = `${imageServerUrl}/${uniqueImageName}`;

  return makeResult({
    url,
  });
}
