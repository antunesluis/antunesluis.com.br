import { DrizzleProjectRepository } from './drizzle-project-repository';
import { ProjectRepository } from './project-repository';

export const projectRepository: ProjectRepository =
  new DrizzleProjectRepository();
