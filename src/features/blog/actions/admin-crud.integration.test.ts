import assert from 'node:assert/strict';
import { afterAll, beforeAll, test, vi } from 'vitest';
import { createTestDatabase } from '@/db/drizzle/test-database';
import { DrizzlePostRepository } from '../repositories/drizzle-post-repository';

const mocks = vi.hoisted(() => ({
  repository: undefined as DrizzlePostRepository | undefined,
  redirect: vi.fn(),
  updateTag: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ verifyLoginSession: async () => true }));
vi.mock('../repositories/index.ts', () => ({
  postRepository: {
    create: (...args: Parameters<DrizzlePostRepository['create']>) =>
      mocks.repository!.create(...args),
    update: (...args: Parameters<DrizzlePostRepository['update']>) =>
      mocks.repository!.update(...args),
    delete: (...args: Parameters<DrizzlePostRepository['delete']>) =>
      mocks.repository!.delete(...args),
  },
}));
vi.mock('next/cache', () => ({ updateTag: mocks.updateTag }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));

let closeDatabase: () => void;
let repository: DrizzlePostRepository;
let actions: {
  createPostAction: typeof import('./create-post-action').createPostAction;
  updatePostAction: typeof import('./update-post-action').updatePostAction;
  deletePostAction: typeof import('./delete-post-action').deletePostAction;
};

beforeAll(async () => {
  const testDatabase = createTestDatabase();
  closeDatabase = testDatabase.close;
  repository = new DrizzlePostRepository(testDatabase.db);
  mocks.repository = repository;

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

afterAll(() => {
  closeDatabase();
});

function makePostFormData(values: Record<string, string>) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(values)) {
    formData.set(name, value);
  }
  return formData;
}

test('runs an authenticated post CRUD cycle through the real actions and repository', async () => {
  const createFormData = makePostFormData({
    title: '  Essential Integration Post  ',
    author: '  Luis Antunes  ',
    excerpt: '  A persisted post created through the Server Action.  ',
    content: '<p>Created content</p><script>unsafe()</script>',
    coverImageUrl: '/images/essential-post.png',
    published: 'on',
  });

  await actions.createPostAction(
    { formState: {}, errors: [] } as never,
    createFormData,
  );

  const createdPosts = await repository.findAll();
  assert.equal(createdPosts.length, 1);
  const createdPost = createdPosts[0];
  assert.equal(createdPost.title, 'Essential Integration Post');
  assert.equal(createdPost.author, 'Luis Antunes');
  assert.equal(createdPost.published, true);
  assert.match(createdPost.slug, /^essential-integration-post-/);
  assert.doesNotMatch(createdPost.content, /<script>/);
  assert.deepEqual(mocks.redirect.mock.calls, [
    [`/admin/blog/${createdPost.id}?created=1`],
  ]);

  const updateFormData = makePostFormData({
    id: createdPost.id,
    title: 'Updated Essential Integration Post',
    author: 'Luis Antunes',
    excerpt: 'The persisted post after the administrative update.',
    content: '<p>Updated content</p>',
    coverImageUrl: '/images/updated-essential-post.png',
    published: 'false',
  });
  const updateResult = await actions.updatePostAction(
    { formState: {}, errors: [] } as never,
    updateFormData,
  );

  assert.equal(updateResult.success, true);
  assert.deepEqual(updateResult.errors, []);
  assert.equal(updateResult.formState.id, createdPost.id);
  assert.equal(updateResult.formState.slug, createdPost.slug);
  assert.equal('updatedAt' in updateResult.formState, false);

  const updatedPost = await repository.findById(createdPost.id);
  assert.equal(updatedPost.title, 'Updated Essential Integration Post');
  assert.equal(updatedPost.published, false);
  assert.equal(updatedPost.slug, createdPost.slug);
  assert.equal(updatedPost.createdAt, createdPost.createdAt);

  const deleteResult = await actions.deletePostAction(createdPost.id);
  assert.deepEqual(deleteResult, { error: '' });
  assert.deepEqual(await repository.findAll(), []);
  assert.deepEqual(mocks.updateTag.mock.calls, [
    ['blog'],
    ['blog'],
    [`blog-${createdPost.slug}`],
    ['blog'],
    [`blog-${createdPost.slug}`],
  ]);
});
