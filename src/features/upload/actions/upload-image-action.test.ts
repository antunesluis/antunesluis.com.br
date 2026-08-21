import assert from 'node:assert/strict';
import { beforeAll, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => false }));
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
  writeFile: mocks.writeFile,
}));

let uploadImageAction: typeof import('./upload-image-action').uploadImageAction;
beforeAll(async () => {
  ({ uploadImageAction } = await import('./upload-image-action'));
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
