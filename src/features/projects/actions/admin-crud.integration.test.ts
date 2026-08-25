import assert from 'node:assert/strict';
import { afterAll, beforeAll, test, vi } from 'vitest';
import { createTestDatabase } from '@/db/drizzle/test-database';
import { DrizzleProjectRepository } from '../repositories/drizzle-project-repository';

const uuidV4Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const mocks = vi.hoisted(() => ({
  repository: undefined as DrizzleProjectRepository | undefined,
  redirect: vi.fn(),
  updateTag: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => true }));
vi.mock('../repositories/index.ts', () => ({
  projectRepository: {
    create: (...args: Parameters<DrizzleProjectRepository['create']>) =>
      mocks.repository!.create(...args),
    update: (...args: Parameters<DrizzleProjectRepository['update']>) =>
      mocks.repository!.update(...args),
    delete: (...args: Parameters<DrizzleProjectRepository['delete']>) =>
      mocks.repository!.delete(...args),
  },
}));
vi.mock('next/cache', () => ({ updateTag: mocks.updateTag }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));

let closeDatabase: () => void;
let repository: DrizzleProjectRepository;
let actions: {
  createProjectAction: typeof import('./create-project-action').createProjectAction;
  updateProjectAction: typeof import('./update-project-action').updateProjectAction;
  deleteProjectAction: typeof import('./delete-project-action').deleteProjectAction;
};

beforeAll(async () => {
  const testDatabase = createTestDatabase();
  closeDatabase = testDatabase.close;
  repository = new DrizzleProjectRepository(testDatabase.db);
  mocks.repository = repository;

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

afterAll(() => {
  closeDatabase();
});

function makeProjectFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(values)) {
    formData.set(name, value);
  }
  return formData;
}

test('runs an authenticated project CRUD cycle through the real actions and repository', async () => {
  const createFormData = makeProjectFormData({
    name: '  Essential Integration Project  ',
    description: '  A project persisted through the real Server Action.  ',
    content: '<p>Created project</p><script>unsafe()</script>',
    coverImageUrl: '/images/essential-project.png',
    repositoryUrl: 'https://github.com/example/essential-project',
    deployUrl: '',
    techStack: ' TypeScript, SQLite, React ',
    published: 'on',
  });

  await actions.createProjectAction(
    { formState: {}, errors: [], success: false } as never,
    createFormData,
  );

  const createdProjects = await repository.findAll();
  assert.equal(createdProjects.length, 1);
  const createdProject = createdProjects[0];
  assert.match(createdProject.id, uuidV4Pattern);
  assert.equal(createdProject.name, 'Essential Integration Project');
  assert.deepEqual(createdProject.techStack, ['TypeScript', 'SQLite', 'React']);
  assert.equal(createdProject.published, true);
  assert.match(createdProject.slug, /^essential-integration-project-/);
  assert.doesNotMatch(createdProject.content, /<script>/);
  assert.deepEqual(mocks.redirect.mock.calls, [
    [`/admin/projects/${createdProject.id}?created=1`],
  ]);

  const updateFormData = makeProjectFormData({
    id: createdProject.id,
    name: 'Updated Essential Integration Project',
    description: 'The persisted project after the administrative update.',
    content: '<p>Updated project</p>',
    coverImageUrl: '/images/updated-essential-project.png',
    repositoryUrl: 'https://github.com/example/updated-project',
    deployUrl: 'https://example.com/updated-project',
    techStack: 'Next.js, Drizzle',
    published: 'false',
  });
  const updateResult = await actions.updateProjectAction(
    { formState: {}, errors: [], success: false } as never,
    updateFormData,
  );

  assert.equal(updateResult.success, true);
  assert.deepEqual(updateResult.errors, []);
  assert.equal(updateResult.formState.id, createdProject.id);
  assert.equal(updateResult.formState.slug, createdProject.slug);
  assert.equal('updatedAt' in updateResult.formState, false);

  const updatedProject = await repository.findById(createdProject.id);
  assert.equal(updatedProject.id, createdProject.id);
  assert.equal(updatedProject.name, 'Updated Essential Integration Project');
  assert.equal(updatedProject.deployUrl, 'https://example.com/updated-project');
  assert.deepEqual(updatedProject.techStack, ['Next.js', 'Drizzle']);
  assert.equal(updatedProject.published, false);
  assert.equal(updatedProject.slug, createdProject.slug);
  assert.equal(updatedProject.createdAt, createdProject.createdAt);

  const deleteResult = await actions.deleteProjectAction(createdProject.id);
  assert.deepEqual(deleteResult, { errors: [], success: true });
  assert.deepEqual(await repository.findAll(), []);
  assert.deepEqual(mocks.updateTag.mock.calls, [
    ['projects'],
    ['projects'],
    [`project-${createdProject.slug}`],
    ['projects'],
    [`project-${createdProject.slug}`],
  ]);
});

test('returns the shared CRUD error contract for invalid project input', async () => {
  const formState = { marker: 'original' };

  assert.deepEqual(
    await actions.createProjectAction(
      { formState, errors: [], success: false } as never,
      {} as FormData,
    ),
    { formState, errors: ['Invalid data'], success: false },
  );
  assert.deepEqual(await actions.deleteProjectAction(''), {
    errors: ['Invalid data'],
    success: false,
  });
});
