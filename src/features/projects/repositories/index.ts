import { drizzleDb } from '@/db/drizzle';
import { DrizzleProjectRepository } from './drizzle-project-repository';
import { ProjectRepository } from './project-repository';

export const projectRepository: ProjectRepository =
  new DrizzleProjectRepository(drizzleDb);
