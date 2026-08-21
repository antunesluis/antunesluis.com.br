import { drizzleDb } from '@/db/drizzle';
import { DrizzlePostRepository } from './drizzle-post-repository';
import { PostRepository } from './post-repository';

export const postRepository: PostRepository = new DrizzlePostRepository(
  drizzleDb,
);
