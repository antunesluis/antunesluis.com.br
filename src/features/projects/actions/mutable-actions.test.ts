import assert from 'node:assert/strict';
import { beforeAll, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  projectRepository: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  updateTag: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => false }));
vi.mock('../repositories/index.ts', () => ({
  projectRepository: mocks.projectRepository,
}));
vi.mock('next/cache', () => ({ updateTag: mocks.updateTag }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));

let actions: {
  createProjectAction: typeof import('./create-project-action').createProjectAction;
  updateProjectAction: typeof import('./update-project-action').updateProjectAction;
  deleteProjectAction: typeof import('./delete-project-action').deleteProjectAction;
};

beforeAll(async () => {
  const [createModule, updateModule, deleteModule] = await Promise.all([
    import('./create-project-action'),
    import('./update-project-action'),
    import('./delete-project-action'),
  ]);
  actions = {
    createProjectAction: createModule.createProjectAction,
    updateProjectAction: updateModule.updateProjectAction,
    deleteProjectAction: deleteModule.deleteProjectAction,
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
  assert.equal(mocks.projectRepository.create.mock.calls.length, 0);
  assert.equal(mocks.projectRepository.update.mock.calls.length, 0);
  assert.equal(mocks.projectRepository.delete.mock.calls.length, 0);
  assert.equal(mocks.updateTag.mock.calls.length, 0);
  assert.equal(mocks.redirect.mock.calls.length, 0);
}

test('createProjectAction refuses before reading input or causing effects', async () => {
  const formState = { marker: 'original' };
  const result = await actions.createProjectAction(
    { formState, errors: [] } as never,
    poisonFormData(),
  );
  assert.deepEqual(result, {
    formState,
    errors: ['Log in again before continuing'],
  });
  assertNoEffects();
});

test('updateProjectAction refuses before reading input or causing effects', async () => {
  const formState = { marker: 'original' };
  const result = await actions.updateProjectAction(
    { formState, errors: [] } as never,
    poisonFormData(),
  );
  assert.deepEqual(result, {
    formState,
    errors: ['Log in again before continuing'],
  });
  assertNoEffects();
});

test('deleteProjectAction uses the error field and causes no effects', async () => {
  const result = await actions.deleteProjectAction('project-id');
  assert.deepEqual(result, { error: 'Log in again before continuing' });
  assertNoEffects();
});
