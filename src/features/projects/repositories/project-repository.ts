import { ProjectModel } from '../models/project-model';

export interface ProjectRepository {
  // public
  findAllPublic(): Promise<ProjectModel[]>;
  findBySlugPublic(slug: string): Promise<ProjectModel>;

  // admin
  findAll(): Promise<ProjectModel[]>;
  findById(id: string): Promise<ProjectModel>;

  // Mutations
  create(project: ProjectModel): Promise<ProjectModel>;
  delete(id: string): Promise<ProjectModel>;
  update(
    id: string,
    newProjectData: Omit<
      ProjectModel,
      'id' | 'slug' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<ProjectModel>;
}
