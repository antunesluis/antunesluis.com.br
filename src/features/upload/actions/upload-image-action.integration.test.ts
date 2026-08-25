import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterEach, beforeAll, beforeEach, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  publicEnv: {
    imageUploadMaxSize: 1_000_000,
  },
  serverEnv: {
    imageUploadDirectory: '',
    imageServerUrl: 'https://images.example.test',
  },
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => true }));
vi.mock('@/config/env/public.server', () => ({
  validatedPublicEnv: mocks.publicEnv,
}));
vi.mock('@/config/env/server', () => ({ serverEnv: mocks.serverEnv }));

let uploadDirectory: string;
let uploadImageAction: typeof import('./upload-image-action').uploadImageAction;

beforeAll(async () => {
  ({ uploadImageAction } = await import('./upload-image-action'));
});

beforeEach(async () => {
  uploadDirectory = await mkdtemp(join(tmpdir(), 'essential-upload-'));
  mocks.publicEnv.imageUploadMaxSize = 1_000_000;
  mocks.serverEnv.imageUploadDirectory = uploadDirectory;
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(uploadDirectory, { recursive: true });
});

function makeUploadFormData(file: File) {
  const formData = new FormData();
  formData.set('file', file);
  return formData;
}

async function assertUploadDirectoryIsEmpty() {
  assert.deepEqual(await readdir(uploadDirectory), []);
}

async function makeImage(format: 'jpeg' | 'png' | 'webp' | 'avif') {
  const image = sharp({
    create: {
      width: 1200,
      height: 700,
      channels: 4,
      background: { r: 36, g: 110, b: 82, alpha: 0.5 },
    },
  });

  if (format === 'jpeg') {
    return image.jpeg().toBuffer();
  }

  if (format === 'png') {
    return image.png().toBuffer();
  }

  if (format === 'webp') {
    return image.webp().toBuffer();
  }

  return image.avif().toBuffer();
}

test.each(['jpeg', 'png', 'webp', 'avif'] as const)(
  'accepts a real %s image regardless of the client filename and MIME type',
  async inputFormat => {
    const imageBytes = await makeImage(inputFormat);
    const formData = makeUploadFormData(
      new File([imageBytes], 'avatar.bin', { type: 'text/plain' }),
    );

    const result = await uploadImageAction(formData);
    const [fileName] = await readdir(uploadDirectory);

    assert.match(fileName, /^image-[0-9a-f-]{36}\.webp$/);
    assert.deepEqual(result, {
      url: `https://images.example.test/${fileName}`,
      error: '',
    });

    const output = await readFile(join(uploadDirectory, fileName));
    const metadata = await sharp(output).metadata();

    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 700);
    assert.equal(metadata.hasAlpha, inputFormat !== 'jpeg');
  },
);

test('normalizes orientation, dimensions and metadata in the WebP output', async () => {
  const imageBytes = await sharp({
    create: {
      width: 2400,
      height: 1200,
      channels: 3,
      background: '#246e52',
    },
  })
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toBuffer();
  const result = await uploadImageAction(
    makeUploadFormData(
      new File([imageBytes], 'rotated.jpeg', { type: 'image/jpeg' }),
    ),
  );
  const [fileName] = await readdir(uploadDirectory);
  const metadata = await sharp(
    await readFile(join(uploadDirectory, fileName)),
  ).metadata();

  assert.equal(result.error, '');
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 960);
  assert.equal(metadata.height, 1920);
  assert.equal(metadata.orientation, undefined);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.icc, undefined);
  assert.equal(metadata.xmp, undefined);
});

test('keeps relative upload directories compatible with public/', async () => {
  mocks.serverEnv.imageUploadDirectory = 'uploads';
  vi.spyOn(process, 'cwd').mockReturnValue(uploadDirectory);
  const imageBytes = await makeImage('png');

  const result = await uploadImageAction(
    makeUploadFormData(
      new File([imageBytes], 'cover.png', { type: 'image/png' }),
    ),
  );
  const files = await readdir(join(uploadDirectory, 'public', 'uploads'));

  assert.equal(result.error, '');
  assert.deepEqual(files, [result.url.split('/').at(-1)]);
});

test('rejects an invalid payload without writing a file', async () => {
  const result = await uploadImageAction({} as FormData);

  assert.deepEqual(result, { url: '', error: 'Invalid data.' });
  await assertUploadDirectoryIsEmpty();
});

test('rejects an oversized image without writing a file', async () => {
  mocks.publicEnv.imageUploadMaxSize = 8;
  const file = new File([new Uint8Array(9)], 'oversized.png', {
    type: 'image/png',
  });

  const result = await uploadImageAction(makeUploadFormData(file));

  assert.deepEqual(result, {
    url: '',
    error: 'File size exceeds limit.',
  });
  await assertUploadDirectoryIsEmpty();
});

test('rejects bytes that cannot be decoded as an image without writing a file', async () => {
  const file = new File(['not an image'], 'cover.png', { type: 'image/png' });

  const result = await uploadImageAction(makeUploadFormData(file));

  assert.deepEqual(result, {
    url: '',
    error: 'File is not a supported image.',
  });
  await assertUploadDirectoryIsEmpty();
});

test('rejects SVG content without writing a file', async () => {
  const file = new File(
    ['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" />'],
    'cover.svg',
    { type: 'image/svg+xml' },
  );

  const result = await uploadImageAction(makeUploadFormData(file));

  assert.deepEqual(result, {
    url: '',
    error: 'File is not a supported image.',
  });
  await assertUploadDirectoryIsEmpty();
});

test('rejects images that exceed the input pixel limit without writing a file', async () => {
  const imageBytes = await sharp({
    create: {
      width: 5001,
      height: 5000,
      channels: 3,
      background: '#246e52',
    },
  })
    .png()
    .toBuffer();
  const file = new File([imageBytes], 'large.png', { type: 'image/png' });

  const result = await uploadImageAction(makeUploadFormData(file));

  assert.deepEqual(result, {
    url: '',
    error: 'File is not a supported image.',
  });
  await assertUploadDirectoryIsEmpty();
});
