import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sql } from 'drizzle-orm';
import { afterEach, expect, test } from 'vitest';
import { createTestDatabase } from './test-database';

const originalWorkingDirectory = process.cwd();

afterEach(() => {
  process.chdir(originalWorkingDirectory);
});

test('creates both typed tables in memory and exposes an effective teardown', async () => {
  const { db, close } = createTestDatabase();

  try {
    const tables = db
      .all<{ name: string }>(
        sql`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`,
      )
      .map(table => table.name);

    expect(tables).toEqual(['posts', 'projects']);
    await expect(db.query.posts.findMany()).resolves.toEqual([]);
    await expect(db.query.projects.findMany()).resolves.toEqual([]);
  } finally {
    close();
  }

  expect(() => db.run(sql`SELECT 1`)).toThrow();
});

test('importing concrete repositories does not create a production database', async () => {
  const isolatedDirectory = mkdtempSync(
    join(tmpdir(), 'essential-tests-drizzle-'),
  );

  try {
    process.chdir(isolatedDirectory);

    const [{ DrizzlePostRepository }, { DrizzleProjectRepository }] =
      await Promise.all([
        import('@/features/blog/repositories/drizzle-post-repository'),
        import('@/features/projects/repositories/drizzle-project-repository'),
      ]);
    const { db, close } = createTestDatabase();

    try {
      expect(new DrizzlePostRepository(db)).toBeInstanceOf(
        DrizzlePostRepository,
      );
      expect(new DrizzleProjectRepository(db)).toBeInstanceOf(
        DrizzleProjectRepository,
      );
    } finally {
      close();
    }

    expect(existsSync(join(isolatedDirectory, 'db.sqlite3'))).toBe(false);
  } finally {
    process.chdir(originalWorkingDirectory);
    rmSync(isolatedDirectory, { recursive: true, force: true });
  }
});
