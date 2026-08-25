import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { eq, sql } from 'drizzle-orm';
import { projectsTable } from '@/db/drizzle/schemas';
import { createTestDatabase } from '@/db/drizzle/test-database';
import type { ProjectModel } from '../models/project-model';
import { DrizzleProjectRepository } from './drizzle-project-repository';

type ProjectUpdate = Parameters<DrizzleProjectRepository['update']>[1];

const createdAt = '2026-08-20T10:00:00.000Z';

function makeProject(overrides: Partial<ProjectModel> = {}): ProjectModel {
  return {
    id: 'project-1',
    slug: 'essential-project',
    name: 'Essential project',
    description: 'Essential project description',
    content: '<p>Essential project content</p>',
    coverImageUrl: '/uploads/essential-project.png',
    repositoryUrl: 'https://github.com/example/essential-project',
    deployUrl: 'https://essential-project.example.com',
    techStack: ['TypeScript', 'React', 'SQLite'],
    published: true,
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

function makeProjectUpdate(
  overrides: Partial<ProjectUpdate> = {},
): ProjectUpdate {
  return {
    name: 'Updated project',
    description: 'Updated project description',
    content: '<p>Updated project content</p>',
    coverImageUrl: '/uploads/updated-project.png',
    repositoryUrl: 'https://github.com/example/updated-project',
    deployUrl: 'https://updated-project.example.com',
    techStack: ['TypeScript', 'Vitest'],
    published: false,
    ...overrides,
  };
}

describe('DrizzleProjectRepository', () => {
  let testDatabase: ReturnType<typeof createTestDatabase>;
  let repository: DrizzleProjectRepository;

  beforeEach(() => {
    testDatabase = createTestDatabase();
    repository = new DrizzleProjectRepository(testDatabase.db);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    testDatabase.close();
  });

  test('creates a project and serializes techStack in SQLite', async () => {
    const project = makeProject();

    await expect(repository.create(project)).resolves.toEqual(project);
    const storedProject = await testDatabase.db.get<{ techStack: string }>(sql`
      SELECT tech_stack AS techStack FROM projects
    `);

    expect(storedProject).toEqual({
      techStack: JSON.stringify(project.techStack),
    });
  });

  test('reads an existing TEXT JSON techStack as domain values', async () => {
    const project = makeProject({
      id: 'legacy-project',
      slug: 'legacy-project',
      name: 'Legacy project',
      techStack: ['TypeScript', 'SQLite'],
    });

    await testDatabase.db.run(sql`
      INSERT INTO projects (
        id, name, slug, description, content, cover_image_url,
        repository_url, deploy_url, tech_stack, published, created_at,
        updated_at
      ) VALUES (
        ${project.id}, ${project.name}, ${project.slug},
        ${project.description}, ${project.content}, ${project.coverImageUrl},
        ${project.repositoryUrl}, ${project.deployUrl},
        ${JSON.stringify(project.techStack)}, ${project.published ? 1 : 0},
        ${project.createdAt}, ${project.updatedAt}
      )
    `);

    await expect(repository.findById(project.id)).resolves.toEqual(project);
  });

  test('normalizes a missing deployUrl at the repository boundary', async () => {
    const project = makeProject({ deployUrl: undefined });

    await repository.create(project);

    await expect(repository.findById(project.id)).resolves.toEqual(project);
    const storedProject = await testDatabase.db.get<{ deployUrl: null }>(sql`
      SELECT deploy_url AS deployUrl FROM projects WHERE id = ${project.id}
    `);
    expect(storedProject).toEqual({ deployUrl: null });
  });

  test('finds and lists administrative projects with domain techStack values', async () => {
    const oldest = makeProject({
      id: 'project-oldest',
      slug: 'oldest-project',
      name: 'Oldest project',
      createdAt: '2026-08-18T10:00:00.000Z',
      updatedAt: '2026-08-18T10:00:00.000Z',
    });
    const newest = makeProject({
      id: 'project-newest',
      slug: 'newest-project',
      name: 'Newest project',
      techStack: ['Next.js', 'SQLite'],
      published: false,
      createdAt: '2026-08-21T10:00:00.000Z',
      updatedAt: '2026-08-21T10:00:00.000Z',
    });

    await repository.create(oldest);
    await repository.create(newest);

    await expect(repository.findById(oldest.id)).resolves.toEqual(oldest);
    await expect(repository.findAll()).resolves.toEqual([newest, oldest]);
  });

  test('public queries include only published projects and reject hidden slugs', async () => {
    const published = makeProject();
    const draft = makeProject({
      id: 'project-draft',
      slug: 'draft-project',
      name: 'Draft project',
      techStack: ['TypeScript'],
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
      'Project with slug draft-project not found',
    );
    await expect(
      repository.findBySlugPublic('missing-project'),
    ).rejects.toThrow('Project with slug missing-project not found');
  });

  test('updates mutable and optional fields with a deterministic timestamp', async () => {
    const project = makeProject();
    const update = makeProjectUpdate();
    const updatedAt = '2026-08-22T14:30:00.000Z';
    vi.useFakeTimers();
    vi.setSystemTime(new Date(updatedAt));

    await repository.create(project);

    const updatedProject = {
      ...project,
      ...update,
      updatedAt,
    };
    await expect(repository.update(project.id, update)).resolves.toEqual(
      updatedProject,
    );
    await expect(repository.findById(project.id)).resolves.toEqual(
      updatedProject,
    );
    expect(updatedProject).toMatchObject({
      id: project.id,
      slug: project.slug,
      createdAt: project.createdAt,
      deployUrl: update.deployUrl,
      techStack: update.techStack,
    });

    const [storedProject] = await testDatabase.db
      .select({
        deployUrl: projectsTable.deployUrl,
        techStack: projectsTable.techStack,
      })
      .from(projectsTable)
      .where(eq(projectsTable.id, project.id));
    expect(storedProject).toEqual({
      deployUrl: update.deployUrl,
      techStack: update.techStack,
    });
  });

  test('clears deployUrl when an update receives undefined', async () => {
    const project = makeProject();
    const update = makeProjectUpdate({ deployUrl: undefined });

    await repository.create(project);
    await repository.update(project.id, update);

    await expect(repository.findById(project.id)).resolves.toMatchObject({
      deployUrl: undefined,
    });
    const storedProject = await testDatabase.db.get<{ deployUrl: null }>(sql`
      SELECT deploy_url AS deployUrl FROM projects WHERE id = ${project.id}
    `);
    expect(storedProject).toEqual({ deployUrl: null });
  });

  test('deletes a project and returns its transformed previous state', async () => {
    const project = makeProject();
    await repository.create(project);

    await expect(repository.delete(project.id)).resolves.toEqual(project);
    await expect(repository.findById(project.id)).rejects.toThrow(
      'Project with id project-1 not found',
    );
  });

  test.each([
    ['id', { id: 'project-1', slug: 'another-slug', name: 'Another project' }],
    [
      'slug',
      { id: 'project-2', slug: 'essential-project', name: 'Another project' },
    ],
    [
      'name',
      { id: 'project-2', slug: 'another-slug', name: 'Essential project' },
    ],
  ])('rejects a duplicate %s', async (_field, overrides) => {
    await repository.create(makeProject());

    await expect(repository.create(makeProject(overrides))).rejects.toThrow(
      'Project with the same id, slug or name already exists',
    );
  });

  test('preserves current errors for operations on a missing project', async () => {
    await expect(repository.findById('missing-project')).rejects.toThrow(
      'Project with id missing-project not found',
    );
    await expect(
      repository.update('missing-project', makeProjectUpdate()),
    ).rejects.toThrow('Project does not exist');
    await expect(repository.delete('missing-project')).rejects.toThrow(
      'Project does not exist',
    );
  });
});
