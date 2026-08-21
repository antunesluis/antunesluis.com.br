import { describe, expect, test } from 'vitest';
import { makePartialPublicPost, makePublicPostFromDb } from '../dto/post-dto';
import type { PostModel } from '../models/post-model';
import { PostCreateSchema, PostUpdateSchema } from './validation';

const validPostInput = {
  title: '  Essential post title  ',
  content: '  <p>Safe content</p><script>alert(1)</script>  ',
  author: '  Luis Antunes  ',
  excerpt: '  A useful excerpt  ',
  coverImageUrl: '  /uploads/cover.png  ',
  published: 'on',
};

describe.each([
  ['create', PostCreateSchema],
  ['update', PostUpdateSchema],
])('post %s schema', (_name, schema) => {
  test('normalizes text, sanitizes HTML and converts published values', () => {
    const parsed = schema.parse(validPostInput);

    expect(parsed).toMatchObject({
      title: 'Essential post title',
      author: 'Luis Antunes',
      excerpt: 'A useful excerpt',
      coverImageUrl: '/uploads/cover.png',
      published: true,
    });
    expect(parsed.content).toContain('<p>Safe content</p>');
    expect(parsed.content).not.toContain('<script>');

    for (const published of ['false', false, null, undefined]) {
      expect(schema.parse({ ...validPostInput, published }).published).toBe(
        false,
      );
    }
    expect(
      schema.parse({ ...validPostInput, published: 'true' }).published,
    ).toBe(true);
  });

  test('enforces text limits and accepts only URL or absolute-path covers', () => {
    const invalidInputs = [
      { title: 'a'.repeat(9) },
      { title: 'a'.repeat(121) },
      { author: 'abc' },
      { author: 'a'.repeat(101) },
      { excerpt: 'ab' },
      { excerpt: 'a'.repeat(201) },
      { content: 'ab' },
      { coverImageUrl: 'not a URL or path' },
    ];

    for (const invalidInput of invalidInputs) {
      expect(
        schema.safeParse({ ...validPostInput, ...invalidInput }).success,
      ).toBe(false);
    }

    expect(
      schema.safeParse({
        ...validPostInput,
        coverImageUrl: 'https://example.com/cover.png',
      }).success,
    ).toBe(true);
  });

  test.each([
    '<form action="javascript:alert(1)">Submit</form>',
    '<button formaction="javascript:alert(1)">Submit</button>',
    '<object data="javascript:alert(1)">Object</object>',
    '<video poster="javascript:alert(1)">Video</video>',
    '<table background="javascript:alert(1)"><tr><td>Cell</td></tr></table>',
  ])('removes unsafe URI attributes from content: %s', unsafeContent => {
    const content = [
      '<p>Safe paragraph</p>',
      '<a href="https://example.com/docs">Safe link</a>',
      unsafeContent,
    ].join('');

    const parsed = schema.parse({ ...validPostInput, content });

    expect(parsed.content).toContain('<p>Safe paragraph</p>');
    expect(parsed.content).toContain(
      '<a href="https://example.com/docs">Safe link</a>',
    );
    expect(parsed.content).not.toContain('javascript:');
  });
});

test('public post DTO omits updatedAt and supplies stable empty defaults', () => {
  const post: PostModel = {
    id: 'post-id',
    slug: 'essential-post',
    title: 'Essential post',
    excerpt: 'Excerpt',
    author: 'Luis',
    content: '<p>Content</p>',
    coverImageUrl: '/cover.png',
    published: true,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T11:00:00.000Z',
  };

  const publicPost = makePublicPostFromDb(post);

  expect(publicPost).not.toHaveProperty('updatedAt');
  expect(publicPost).toEqual(
    expect.objectContaining({ id: 'post-id', published: true }),
  );
  expect(makePartialPublicPost()).toEqual({
    id: '',
    slug: '',
    title: '',
    excerpt: '',
    author: '',
    content: '',
    coverImageUrl: '',
    createdAt: '',
    published: false,
  });
});
