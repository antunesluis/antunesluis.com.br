import assert from 'node:assert/strict';
import { before, mock, test } from 'node:test';

const projectRepository = {
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
  namedExports: { projectRepository },
});
mock.module('next/cache', { namedExports: { updateTag } });
mock.module('next/navigation', { namedExports: { redirect } });

let actions: {
  createProjectAction: typeof import('./create-project-action').createProjectAction;
  updateProjectAction: typeof import('./update-project-action').updateProjectAction;
  deleteProjectAction: typeof import('./delete-project-action').deleteProjectAction;
};

before(async () => {
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
  assert.equal(projectRepository.create.mock.callCount(), 0);
  assert.equal(projectRepository.update.mock.callCount(), 0);
  assert.equal(projectRepository.delete.mock.callCount(), 0);
  assert.equal(updateTag.mock.callCount(), 0);
  assert.equal(redirect.mock.callCount(), 0);
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
