import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { ProjectRepository } from './project-repository';
import { ProjectModel } from '../models/project-model';

const ROOT_DIR = process.cwd();
const JSON_PROJECTS_FILE_PATH = resolve(
  ROOT_DIR,
  'src',
  'db',
  'seed',
  'projects.json',
);

export class JsonProjectRepository implements ProjectRepository {
  private async readFromDisk(): Promise<ProjectModel[]> {
    const jsonContent = await readFile(JSON_PROJECTS_FILE_PATH, 'utf-8');
    const parsedJson = JSON.parse(jsonContent);
    const { projects } = parsedJson;
    return projects;
  }

  private async writeToDisk(projects: ProjectModel[]): Promise<void> {
    const jsonToString = JSON.stringify({ projects }, null, 2);
    await writeFile(JSON_PROJECTS_FILE_PATH, jsonToString, 'utf-8');
  }

  async findAllPublic(): Promise<ProjectModel[]> {
    const projects = await this.readFromDisk();
    return projects.filter(project => project.published);
  }

  async findAll(): Promise<ProjectModel[]> {
    const projects = await this.readFromDisk();
    return projects;
  }

  async findById(id: string): Promise<ProjectModel> {
    const projects = await this.findAllPublic();
    const project = projects.find(project => project.id === id);

    if (!project) throw new Error('Project não encontrado para ID');

    return project;
  }

  async findBySlugPublic(slug: string): Promise<ProjectModel> {
    const projects = await this.findAllPublic();
    const project = projects.find(project => project.slug === slug);

    if (!project) throw new Error('Project não encontrado para slug');

    return project;
  }

  async create(project: ProjectModel): Promise<ProjectModel> {
    const projects = await this.findAll();

    if (!project.id || !project.slug) {
      throw new Error('Project sem ID ou Slug');
    }

    const idOrSlugExist = projects.find(
      savedProject =>
        savedProject.id === project.id || savedProject.slug === project.slug,
    );

    if (idOrSlugExist) {
      throw new Error('ID ou Slug devem ser únicos');
    }

    projects.push(project);
    await this.writeToDisk(projects);

    return project;
  }

  async delete(id: string): Promise<ProjectModel> {
    const projects = await this.findAll();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex < 0) {
      throw new Error('Project não existe');
    }

    const project = projects[projectIndex];
    projects.splice(projectIndex, 1);
    await this.writeToDisk(projects);

    return project;
  }

  async update(
    id: string,
    newProjectData: Omit<
      ProjectModel,
      'id' | 'slug' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<ProjectModel> {
    const projects = await this.findAll();
    const projectIndex = projects.findIndex(p => p.id === id);
    const savedProject = projects[projectIndex];

    if (projectIndex < 0) {
      throw new Error('Project não existe');
    }

    const newProject = {
      ...savedProject,
      ...newProjectData,
      updatedAt: new Date().toISOString(),
    };
    projects[projectIndex] = newProject;
    await this.writeToDisk(projects);
    return newProject;
  }
}
