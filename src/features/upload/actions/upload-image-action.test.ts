import assert from 'node:assert/strict';
import { before, mock, test } from 'node:test';

const mkdir = mock.fn();
const writeFile = mock.fn();

mock.module('@/lib/auth', {
  namedExports: { verifyLoginSession: async () => false },
});
mock.module('@/config/env/public', {
  namedExports: { publicEnv: { imageUploadMaxSize: 1024 } },
});
mock.module('@/config/env/server', {
  namedExports: {
    serverEnv: {
      imageUploadDirectory: 'uploads',
      imageServerUrl: 'http://localhost:3000/uploads',
    },
  },
});
mock.module('fs/promises', { namedExports: { mkdir, writeFile } });

let uploadImageAction: typeof import('./upload-image-action').uploadImageAction;
before(async () => {
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
  assert.equal(mkdir.mock.callCount(), 0);
  assert.equal(writeFile.mock.callCount(), 0);
});
