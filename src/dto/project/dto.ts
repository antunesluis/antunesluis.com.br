import { ProjectModel } from '@/models/project/project-model';

export type PublicProject = Omit<ProjectModel, 'updatedAt'>;

export const makePartialPublicProject = (
  project?: Partial<ProjectModel>,
): PublicProject => {
  return {
    id: project?.id || '',
    name: project?.name || '',
    slug: project?.slug || '',
    description: project?.description || '',
    content: project?.content || '',
    coverImageUrl: project?.coverImageUrl || '',
    repositoryUrl: project?.repositoryUrl || '',
    deployUrl: project?.deployUrl || '',
    techStack: project?.techStack || [],
    createdAt: project?.createdAt || '',
    published: project?.published || false,
  };
};

export const makePublicProjectFromDb = (
  project: ProjectModel,
): PublicProject => {
  return makePartialPublicProject(project);
};
