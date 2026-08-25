import assert from 'node:assert/strict';
import { beforeAll, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  postRepository: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  updateTag: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => false }));
vi.mock('../repositories/index.ts', () => ({
  postRepository: mocks.postRepository,
}));
vi.mock('next/cache', () => ({ updateTag: mocks.updateTag }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));

let actions: {
  createPostAction: typeof import('./create-post-action').createPostAction;
  updatePostAction: typeof import('./update-post-action').updatePostAction;
  deletePostAction: typeof import('./delete-post-action').deletePostAction;
};

beforeAll(async () => {
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
  assert.equal(mocks.postRepository.create.mock.calls.length, 0);
  assert.equal(mocks.postRepository.update.mock.calls.length, 0);
  assert.equal(mocks.postRepository.delete.mock.calls.length, 0);
  assert.equal(mocks.updateTag.mock.calls.length, 0);
  assert.equal(mocks.redirect.mock.calls.length, 0);
}

test('createPostAction refuses before reading input or causing effects', async () => {
  const formState = { marker: 'original' };
  const result = await actions.createPostAction(
    { formState, errors: [], success: false } as never,
    poisonFormData(),
  );
  assert.deepEqual(result, {
    formState,
    errors: ['Log in again before continuing'],
    success: false,
  });
  assertNoEffects();
});

test('updatePostAction refuses before reading input or causing effects', async () => {
  const formState = { marker: 'original' };
  const result = await actions.updatePostAction(
    { formState, errors: [], success: false } as never,
    poisonFormData(),
  );
  assert.deepEqual(result, {
    formState,
    errors: ['Log in again before continuing'],
    success: false,
  });
  assertNoEffects();
});

test('deletePostAction returns the shared result and causes no effects', async () => {
  const result = await actions.deletePostAction('post-id');
  assert.deepEqual(result, {
    errors: ['Log in again before continuing'],
    success: false,
  });
  assertNoEffects();
});
