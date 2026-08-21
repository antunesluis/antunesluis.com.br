import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createTestDatabase } from '@/db/drizzle/test-database';
import type { PostModel } from '../models/post-model';
import { DrizzlePostRepository } from './drizzle-post-repository';

type PostUpdate = Parameters<DrizzlePostRepository['update']>[1];

const createdAt = '2026-08-20T10:00:00.000Z';

function makePost(overrides: Partial<PostModel> = {}): PostModel {
  return {
    id: 'post-1',
    slug: 'essential-post',
    title: 'Essential post',
    author: 'Luis Antunes',
    excerpt: 'Essential post excerpt',
    content: '<p>Essential post content</p>',
    coverImageUrl: '/uploads/essential-post.png',
    published: true,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

function makePostUpdate(overrides: Partial<PostUpdate> = {}): PostUpdate {
  return {
    title: 'Updated post',
    author: 'Updated author',
    excerpt: 'Updated excerpt',
    content: '<p>Updated content</p>',
    coverImageUrl: '/uploads/updated-post.png',
    published: false,
    ...overrides,
  };
}

describe('DrizzlePostRepository', () => {
  let testDatabase: ReturnType<typeof createTestDatabase>;
  let repository: DrizzlePostRepository;

  beforeEach(() => {
    testDatabase = createTestDatabase();
    repository = new DrizzlePostRepository(testDatabase.db);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    testDatabase.close();
  });

  test('creates and persists the received post', async () => {
    const post = makePost();

    await expect(repository.create(post)).resolves.toEqual(post);
    await expect(repository.findById(post.id)).resolves.toEqual(post);
  });

  test('finds by id and lists administrative posts by newest first', async () => {
    const oldest = makePost({
      id: 'post-oldest',
      slug: 'oldest-post',
      title: 'Oldest post',
      createdAt: '2026-08-18T10:00:00.000Z',
      updatedAt: '2026-08-18T10:00:00.000Z',
    });
    const newest = makePost({
      id: 'post-newest',
      slug: 'newest-post',
      title: 'Newest post',
      published: false,
      createdAt: '2026-08-21T10:00:00.000Z',
      updatedAt: '2026-08-21T10:00:00.000Z',
    });

    await repository.create(oldest);
    await repository.create(newest);

    await expect(repository.findById(oldest.id)).resolves.toEqual(oldest);
    await expect(repository.findAll()).resolves.toEqual([newest, oldest]);
  });

  test('public queries include only published posts and reject hidden slugs', async () => {
    const published = makePost();
    const draft = makePost({
      id: 'post-draft',
      slug: 'draft-post',
      title: 'Draft post',
      published: false,
      createdAt: '2026-08-21T10:00:00.000Z',
      updatedAt: '2026-08-21T10:00:00.000Z',
    });

    await repository.create(published);
    await repository.create(draft);

    await expect(repository.findAllPublic()).resolves.toEqual([published]);
    await expect(repository.findBySlugPublic(published.slug)).resolves.toEqual(
      published,
    );
    await expect(repository.findBySlugPublic(draft.slug)).rejects.toThrow(
      'Post with slug draft-post not found',
    );
    await expect(repository.findBySlugPublic('missing-post')).rejects.toThrow(
      'Post with slug missing-post not found',
    );
  });

  test('updates only mutable fields with a deterministic timestamp', async () => {
    const post = makePost();
    const update = makePostUpdate();
    const updatedAt = '2026-08-22T14:30:00.000Z';
    vi.useFakeTimers();
    vi.setSystemTime(new Date(updatedAt));

    await repository.create(post);

    const updatedPost = {
      ...post,
      ...update,
      updatedAt,
    };
    await expect(repository.update(post.id, update)).resolves.toEqual(
      updatedPost,
    );
    await expect(repository.findById(post.id)).resolves.toEqual(updatedPost);
    expect(updatedPost).toMatchObject({
      id: post.id,
      slug: post.slug,
      createdAt: post.createdAt,
    });
  });

  test('deletes a post and returns its previous state', async () => {
    const post = makePost();
    await repository.create(post);

    await expect(repository.delete(post.id)).resolves.toEqual(post);
    await expect(repository.findById(post.id)).rejects.toThrow(
      'Post with id post-1 not found',
    );
  });

  test.each([
    ['id', { id: 'post-1', slug: 'another-slug', title: 'Another title' }],
    ['slug', { id: 'post-2', slug: 'essential-post', title: 'Another title' }],
    ['title', { id: 'post-2', slug: 'another-slug', title: 'Essential post' }],
  ])('rejects a duplicate %s', async (_field, overrides) => {
    await repository.create(makePost());

    await expect(repository.create(makePost(overrides))).rejects.toThrow(
      'Post with the same id, slug or title already exists',
    );
  });

  test('preserves current errors for operations on a missing post', async () => {
    await expect(repository.findById('missing-post')).rejects.toThrow(
      'Post with id missing-post not found',
    );
    await expect(
      repository.update('missing-post', makePostUpdate()),
    ).rejects.toThrow('Post does not exist');
    await expect(repository.delete('missing-post')).rejects.toThrow(
      'Post does not exist',
    );
  });
});
