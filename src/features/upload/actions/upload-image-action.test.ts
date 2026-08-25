import assert from 'node:assert/strict';
import sharp from 'sharp';
import { beforeAll, beforeEach, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  isAuthenticated: false,
  mkdir: vi.fn(),
  rename: vi.fn(),
  unlink: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  verifyLoginSession: async () => mocks.isAuthenticated,
}));
vi.mock('@/config/env/public', () => ({
  publicEnv: { imageUploadMaxSize: 1024 },
}));
vi.mock('@/config/env/server', () => ({
  serverEnv: {
    imageUploadDirectory: 'uploads',
    imageServerUrl: 'http://localhost:3000/uploads',
  },
}));
vi.mock('fs/promises', () => ({
  mkdir: mocks.mkdir,
  rename: mocks.rename,
  unlink: mocks.unlink,
  writeFile: mocks.writeFile,
}));

let uploadImageAction: typeof import('./upload-image-action').uploadImageAction;
beforeAll(async () => {
  ({ uploadImageAction } = await import('./upload-image-action'));
});

beforeEach(() => {
  mocks.isAuthenticated = false;
  vi.clearAllMocks();
});

test('uploadImageAction refuses before reading input or touching files', async () => {
  const formData = new Proxy(
    {},
    {
      getPrototypeOf() {
        throw new Error('form data was inspected');
      },
    },
  ) as FormData;
  const result = await uploadImageAction(formData);

  assert.deepEqual(result, {
    url: '',
    error: 'Log in to another tab before continuing',
  });
  assert.equal(mocks.mkdir.mock.calls.length, 0);
  assert.equal(mocks.writeFile.mock.calls.length, 0);
});

test('removes the temporary file when promotion to the final name fails', async () => {
  mocks.isAuthenticated = true;
  mocks.rename.mockRejectedValueOnce(new Error('rename failed'));
  const image = await sharp({
    create: {
      width: 1,
      height: 1,
      channels: 3,
      background: '#246e52',
    },
  })
    .png()
    .toBuffer();
  const formData = new FormData();
  formData.set('file', new File([image], 'cover.png', { type: 'image/png' }));

  const result = await uploadImageAction(formData);
  const [[temporaryFileFullPath, , options]] = mocks.writeFile.mock.calls;
  const [[renamedTemporaryFileFullPath, fileFullPath]] = mocks.rename.mock.calls;
  const [[removedTemporaryFileFullPath]] = mocks.unlink.mock.calls;

  assert.deepEqual(result, { url: '', error: 'Could not save image.' });
  assert.equal(mocks.mkdir.mock.calls.length, 1);
  assert.equal(options.flag, 'wx');
  assert.equal(temporaryFileFullPath, renamedTemporaryFileFullPath);
  assert.equal(temporaryFileFullPath, removedTemporaryFileFullPath);
  assert.match(temporaryFileFullPath, /\.tmp$/);
  assert.match(fileFullPath, /image-[0-9a-f-]{36}\.webp$/);
});
