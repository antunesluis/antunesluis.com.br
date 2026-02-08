export type ProjectModel = {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  coverImageUrl: string;
  repositoryUrl: string;
  deployUrl?: string;
  techStack: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};
