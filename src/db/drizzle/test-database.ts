import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzleSchema } from './schemas';

const testSchemaSql = `
  CREATE TABLE posts (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    published INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE projects (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    repository_url TEXT NOT NULL,
    deploy_url TEXT,
    tech_stack TEXT NOT NULL,
    published INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export function createTestDatabase() {
  const sqlite = new Database(':memory:');
  sqlite.exec(testSchemaSql);

  return {
    db: drizzle(sqlite, {
      schema: drizzleSchema,
      logger: false,
    }),
    close: () => sqlite.close(),
  };
}
