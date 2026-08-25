import { drizzleDb } from '@/db/drizzle';
import { DrizzleProjectRepository } from './drizzle-project-repository';

export const projectRepository = new DrizzleProjectRepository(drizzleDb);
