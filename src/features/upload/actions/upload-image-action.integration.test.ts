import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeAll, beforeEach, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  publicEnv: {
    imageUploadMaxSize: 8,
  },
  serverEnv: {
    imageUploadDirectory: '',
    imageServerUrl: 'https://images.example.test',
  },
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => true }));
vi.mock('@/config/env/public', () => ({ publicEnv: mocks.publicEnv }));
vi.mock('@/config/env/server', () => ({ serverEnv: mocks.serverEnv }));

let uploadDirectory: string;
let uploadImageAction: typeof import('./upload-image-action').uploadImageAction;

beforeAll(async () => {
  ({ uploadImageAction } = await import('./upload-image-action'));
});

beforeEach(async () => {
  uploadDirectory = await mkdtemp(join(tmpdir(), 'essential-upload-'));
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

test('writes an authenticated image with controlled name, bytes and URL', async () => {
  vi.spyOn(Date, 'now').mockReturnValue(1_725_000_000_000);
  const imageBytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);
  const formData = makeUploadFormData(
    new File([imageBytes], 'avatar.png', { type: 'image/png' }),
  );

  const result = await uploadImageAction(formData);

  const expectedName = 'image-1725000000000.png';
  assert.deepEqual(result, {
    url: `https://images.example.test/${expectedName}`,
    error: '',
  });
  assert.deepEqual(await readdir(uploadDirectory), [expectedName]);
  assert.deepEqual(
    await readFile(join(uploadDirectory, expectedName)),
    Buffer.from(imageBytes),
  );
});

test('rejects an invalid payload without writing a file', async () => {
  const result = await uploadImageAction({} as FormData);

  assert.deepEqual(result, { url: '', error: 'Invalid data.' });
  await assertUploadDirectoryIsEmpty();
});

test('rejects an oversized image without writing a file', async () => {
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

test('rejects a non-image MIME type without writing a file', async () => {
  const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

  const result = await uploadImageAction(makeUploadFormData(file));

  assert.deepEqual(result, { url: '', error: 'File is not an image.' });
  await assertUploadDirectoryIsEmpty();
});
