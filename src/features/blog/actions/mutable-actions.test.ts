import assert from 'node:assert/strict';
import { before, mock, test } from 'node:test';

const postRepository = {
  create: mock.fn(),
  update: mock.fn(),
  delete: mock.fn(),
};
const updateTag = mock.fn();
const redirect = mock.fn();

mock.module('@/lib/auth', {
  namedExports: { verifyLoginSession: async () => false },
});
mock.module('../repositories/index.ts', {
  namedExports: { postRepository },
});
mock.module('next/cache', { namedExports: { updateTag } });
mock.module('next/navigation', { namedExports: { redirect } });

let actions: {
  createPostAction: typeof import('./create-post-action').createPostAction;
  updatePostAction: typeof import('./update-post-action').updatePostAction;
  deletePostAction: typeof import('./delete-post-action').deletePostAction;
};

before(async () => {
  const [createModule, updateModule, deleteModule] = await Promise.all([
    import('./create-post-action'),
    import('./update-post-action'),
    import('./delete-post-action'),
  ]);
  actions = {
    createPostAction: createModule.createPostAction,
    updatePostAction: updateModule.updatePostAction,
    deletePostAction: deleteModule.deletePostAction,
  };
});

function poisonFormData() {
  return new Proxy(
    {},
    {
      getPrototypeOf() {
        throw new Error('form data was inspected');
      },
    },
  ) as FormData;
}
function assertNoEffects() {
  assert.equal(postRepository.create.mock.callCount(), 0);
  assert.equal(postRepository.update.mock.callCount(), 0);
  assert.equal(postRepository.delete.mock.callCount(), 0);
  assert.equal(updateTag.mock.callCount(), 0);
  assert.equal(redirect.mock.callCount(), 0);
}

test('createPostAction refuses before reading input or causing effects', async () => {
  const formState = { marker: 'original' };
  const result = await actions.createPostAction(
    { formState, errors: [] } as never,
    poisonFormData(),
  );
  assert.deepEqual(result, {
    formState,
    errors: ['Log in again before continuing'],
  });
  assertNoEffects();
});

test('updatePostAction refuses before reading input or causing effects', async () => {
  const formState = { marker: 'original' };
  const result = await actions.updatePostAction(
    { formState, errors: [] } as never,
    poisonFormData(),
  );
  assert.deepEqual(result, {
    formState,
    errors: ['Log in again before continuing'],
  });
  assertNoEffects();
});

test('deletePostAction uses the error field and causes no effects', async () => {
  const result = await actions.deletePostAction('post-id');
  assert.deepEqual(result, { error: 'Log in again before continuing' });
  assertNoEffects();
});
