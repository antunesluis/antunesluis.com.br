import { eq } from 'drizzle-orm';
import { ProjectRepository } from './project-repository';
import { DrizzleDatabase, projectsTable } from '@/db/drizzle/schemas';
import { ProjectModel } from '../models/project-model';

export class DrizzleProjectRepository implements ProjectRepository {
  constructor(private readonly db: DrizzleDatabase) {}

  async findAllPublic(): Promise<ProjectModel[]> {
    const projects = await this.db.query.projects.findMany({
      orderBy: (projects, { desc }) => desc(projects.createdAt),
      where: (projects, { eq }) => eq(projects.published, true),
    });

    const projectsWithTechStack = projects.map(this.transformProject);
    return projectsWithTechStack;
  }

  async findBySlugPublic(slug: string): Promise<ProjectModel> {
    const project = await this.db.query.projects.findFirst({
      where: (projects, { eq, and }) =>
        and(eq(projects.slug, slug), eq(projects.published, true)),
    });

    if (!project) {
      throw new Error(`Project with slug ${slug} not found`);
    }

    return this.transformProject(project);
  }

  async findAll(): Promise<ProjectModel[]> {
    const projects = await this.db.query.projects.findMany({
      orderBy: (projects, { desc }) => desc(projects.createdAt),
    });

    const projectsWithTechStack = projects.map(this.transformProject);
    return projectsWithTechStack;
  }

  async findById(id: string): Promise<ProjectModel> {
    const project = await this.db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
    });

    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }

    return this.transformProject(project);
  }

  async create(project: ProjectModel): Promise<ProjectModel> {
    const projectExists = await this.db.query.projects.findFirst({
      where: (projects, { or, eq }) =>
        or(
          eq(projects.id, project.id),
          eq(projects.slug, project.slug),
          eq(projects.name, project.name),
        ),
      columns: { id: true },
    });

    if (projectExists) {
      throw new Error('Project with the same id, slug or name already exists');
    }

    const dbProject = this.transformToDb(project);
    await this.db.insert(projectsTable).values(dbProject);
    return project;
  }

  async delete(id: string): Promise<ProjectModel> {
    const project = await this.db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
    });

    if (!project) {
      throw new Error('Project does not exist');
    }

    await this.db.delete(projectsTable).where(eq(projectsTable.id, id));

    return this.transformProject(project);
  }

  async update(
    id: string,
    newProjectData: Omit<
      ProjectModel,
      'id' | 'slug' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<ProjectModel> {
    const oldProject = await this.db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, id),
    });

    if (!oldProject) {
      throw new Error('Project does not exist');
    }

    const updatedAt = new Date().toISOString();
    const projectData = {
      name: newProjectData.name,
      description: newProjectData.description,
      content: newProjectData.content,
      coverImageUrl: newProjectData.coverImageUrl,
      repositoryUrl: newProjectData.repositoryUrl,
      deployUrl: newProjectData.deployUrl,
      techStack: JSON.stringify(newProjectData.techStack),
      published: newProjectData.published,
      updatedAt,
    };

    await this.db
      .update(projectsTable)
      .set(projectData)
      .where(eq(projectsTable.id, id));

    const updatedProject = this.transformProject(oldProject);
    return {
      ...updatedProject,
      ...newProjectData,
      updatedAt,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transformProject(dbProject: any): ProjectModel {
    return {
      ...dbProject,
      techStack: JSON.parse(dbProject.techStack || '[]'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transformToDb(project: ProjectModel): any {
    return {
      ...project,
      techStack: JSON.stringify(project.techStack),
    };
  }
}
