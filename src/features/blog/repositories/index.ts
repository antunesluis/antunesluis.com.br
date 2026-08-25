import { drizzleDb } from '@/db/drizzle';
import { DrizzlePostRepository } from './drizzle-post-repository';

export const postRepository = new DrizzlePostRepository(drizzleDb);
