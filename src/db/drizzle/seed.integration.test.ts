import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, expect, test } from 'vitest';
import projectsSeed from '../seed/projects.json';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const seedScriptPath = join(repositoryRoot, 'src/db/drizzle/seed.ts');
const tsxPath = join(repositoryRoot, 'node_modules/.bin/tsx');
const drizzleKitPath = join(repositoryRoot, 'node_modules/.bin/drizzle-kit');
const schemaPath = join(repositoryRoot, 'src/db/drizzle/schemas.ts');
const migrations = ['0000_groovy_reptil.sql', '0001_vengeful_risque.sql'].map(
  fileName =>
    readFileSync(
      join(repositoryRoot, 'src/db/drizzle/migrations', fileName),
      'utf8',
    ),
);
const workspaces: string[] = [];

function createWorkspace() {
  const workspace = mkdtempSync(join(tmpdir(), 'dependency-seed-'));
  workspaces.push(workspace);
  writeFileSync(
    join(workspace, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        baseUrl: repositoryRoot,
        paths: { '@/*': ['src/*'] },
      },
    }),
  );
  return workspace;
}

function runSeed(workspace: string) {
  return spawnSync(tsxPath, ['--tsconfig', 'tsconfig.json', seedScriptPath], {
    cwd: workspace,
    encoding: 'utf8',
  });
}

afterEach(() => {
  for (const workspace of workspaces.splice(0)) {
    rmSync(workspace, { recursive: true, force: true });
  }
});

test('migration creates the projects table and its unique slug index', () => {
  const database = new Database(':memory:');

  try {
    database.exec(migrations[1]);

    expect(
      database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'projects'",
        )
        .all(),
    ).toEqual([{ name: 'projects' }]);
    const projectIndexes = database
      .prepare("PRAGMA index_list('projects')")
      .all() as { name: string; unique: number }[];

    expect(
      projectIndexes.map(index => ({
        name: index.name,
        unique: index.unique,
      })),
    ).toContainEqual({ name: 'projects_slug_unique', unique: 1 });
  } finally {
    database.close();
  }
});

test('migration preserves projects materialized by drizzle-kit push', () => {
  const workspace = createWorkspace();
  const databasePath = join(workspace, 'db.sqlite3');
  const pushResult = spawnSync(
    drizzleKitPath,
    [
      'push',
      '--dialect',
      'sqlite',
      '--schema',
      schemaPath,
      '--url',
      databasePath,
      '--force',
    ],
    { cwd: workspace, encoding: 'utf8' },
  );

  expect(pushResult.status).toBe(0);

  const database = new Database(databasePath);

  try {
    database
      .prepare(
        `INSERT INTO projects (
          id, name, slug, description, content, cover_image_url,
          repository_url, deploy_url, tech_stack, published, created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        'existing-project',
        'Existing project',
        'existing-project',
        'Existing description',
        'Existing content',
        '/images/home.png',
        'https://example.test/repository',
        null,
        '[]',
        1,
        '2026-08-21T00:00:00.000Z',
        '2026-08-21T00:00:00.000Z',
      );

    database.exec(migrations[1]);

    expect(
      database
        .prepare('SELECT id, slug FROM projects WHERE id = ?')
        .get('existing-project'),
    ).toEqual({
      id: 'existing-project',
      slug: 'existing-project',
    });
  } finally {
    database.close();
  }
});

test('seeds projects after migrations in an isolated workspace', () => {
  const workspace = createWorkspace();
  const database = new Database(join(workspace, 'db.sqlite3'));

  try {
    database.exec(migrations.join('\n'));
  } finally {
    database.close();
  }

  const result = runSeed(workspace);
  const secondResult = runSeed(workspace);

  expect(result.status).toBe(0);
  expect(result.stdout).toContain('Projects inserted successfully');
  expect(secondResult.status).toBe(0);

  const seededDatabase = new Database(join(workspace, 'db.sqlite3'), {
    readonly: true,
  });

  try {
    const projectCount = seededDatabase
      .prepare('SELECT COUNT(*) AS count FROM projects')
      .get() as { count: number };

    expect(projectCount.count).toBe(projectsSeed.projects.length);
  } finally {
    seededDatabase.close();
  }
});

test('rolls back the delete when a project insert fails', () => {
  const workspace = createWorkspace();
  const databasePath = join(workspace, 'db.sqlite3');
  const database = new Database(databasePath);

  try {
    database.exec(migrations.join('\n'));
    database
      .prepare(
        `INSERT INTO projects (
          id, name, slug, description, content, cover_image_url,
          repository_url, deploy_url, tech_stack, published, created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        'existing-project',
        'Existing project',
        'existing-project',
        'Existing description',
        'Existing content',
        '/images/home.png',
        'https://example.test/repository',
        null,
        '[]',
        1,
        '2026-08-21T00:00:00.000Z',
        '2026-08-21T00:00:00.000Z',
      );
    database.exec(`
      CREATE TRIGGER reject_seed_project
      BEFORE INSERT ON projects
      WHEN NEW.id = 'project-003'
      BEGIN
        SELECT RAISE(ABORT, 'forced seed failure');
      END;
    `);
  } finally {
    database.close();
  }

  const result = runSeed(workspace);

  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('forced seed failure');

  const rolledBackDatabase = new Database(databasePath, { readonly: true });
  try {
    expect(
      rolledBackDatabase.prepare('SELECT id FROM projects').all(),
    ).toEqual([{ id: 'existing-project' }]);
  } finally {
    rolledBackDatabase.close();
  }
});

test('returns a non-zero status when the projects table is unavailable', () => {
  const workspace = createWorkspace();
  const result = runSeed(workspace);

  expect(result.status).not.toBe(0);
  expect(result.stderr).toContain('Error inserting projects:');
  expect(result.stderr).toContain('no such table: projects');
});
