import { describe, expect, test } from 'vitest';
import {
  makePartialPublicProject,
  makePublicProjectFromDb,
} from '../dto/project-dto';
import type { ProjectModel } from '../models/project-model';
import { ProjectCreateSchema, ProjectUpdateSchema } from './validation';

const validProjectInput = {
  name: '  Essential project  ',
  description: '  A useful project description  ',
  content: '  <p>Safe content</p><script>alert(1)</script>  ',
  repositoryUrl: '  https://github.com/example/project  ',
  deployUrl: '  /projects/demo  ',
  coverImageUrl: '  /uploads/project.png  ',
  techStack: '  TypeScript, React, , SQLite  ',
  published: 'on',
};

describe.each([
  ['create', ProjectCreateSchema],
  ['update', ProjectUpdateSchema],
])('project %s schema', (_name, schema) => {
  test('normalizes fields, sanitizes HTML and converts structured values', () => {
    const parsed = schema.parse(validProjectInput);

    expect(parsed).toMatchObject({
      name: 'Essential project',
      description: 'A useful project description',
      repositoryUrl: 'https://github.com/example/project',
      deployUrl: '/projects/demo',
      coverImageUrl: '/uploads/project.png',
      techStack: ['TypeScript', 'React', 'SQLite'],
      published: true,
    });
    expect(parsed.content).toContain('<p>Safe content</p>');
    expect(parsed.content).not.toContain('<script>');

    for (const published of ['false', false, null, undefined]) {
      expect(schema.parse({ ...validProjectInput, published }).published).toBe(
        false,
      );
    }
    expect(
      schema.parse({ ...validProjectInput, deployUrl: '' }).deployUrl,
    ).toBe('');
    expect(
      schema.parse({ ...validProjectInput, deployUrl: undefined }).deployUrl,
    ).toBeUndefined();
  });

  test('enforces limits, URLs and at least one technology', () => {
    const invalidInputs = [
      { name: 'ab' },
      { name: 'a'.repeat(121) },
      { description: 'a'.repeat(9) },
      { description: 'a'.repeat(501) },
      { content: 'ab' },
      { repositoryUrl: 'not a URL or path' },
      { deployUrl: 'not a URL or path' },
      { coverImageUrl: 'not a URL or path' },
      { techStack: ' , , ' },
    ];

    for (const invalidInput of invalidInputs) {
      expect(
        schema.safeParse({ ...validProjectInput, ...invalidInput }).success,
      ).toBe(false);
    }
  });
});

test('public project DTO omits updatedAt and preserves techStack', () => {
  const project: ProjectModel = {
    id: 'project-id',
    slug: 'essential-project',
    name: 'Essential project',
    description: 'Description',
    content: '<p>Content</p>',
    coverImageUrl: '/cover.png',
    repositoryUrl: 'https://github.com/example/project',
    deployUrl: 'https://example.com',
    techStack: ['TypeScript', 'SQLite'],
    published: true,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T11:00:00.000Z',
  };

  const publicProject = makePublicProjectFromDb(project);

  expect(publicProject).not.toHaveProperty('updatedAt');
  expect(publicProject).toEqual(
    expect.objectContaining({
      id: 'project-id',
      techStack: ['TypeScript', 'SQLite'],
      published: true,
    }),
  );
  expect(makePartialPublicProject()).toEqual({
    id: '',
    name: '',
    slug: '',
    description: '',
    content: '',
    coverImageUrl: '',
    repositoryUrl: '',
    deployUrl: '',
    techStack: [],
    createdAt: '',
    published: false,
  });
});
