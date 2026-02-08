import { JsonLd } from '@/components/seo/JsonLd';
import { FULL_NAME, SITE_URL } from '@/config/constants';
import { ProjectModel } from '@/features/projects/models/project-model';

type ProjectSchemaProps = {
  project: ProjectModel;
};

export function ProjectSchema({ project }: ProjectSchemaProps) {
  const techStack = Array.isArray(project.techStack)
    ? project.techStack
    : typeof project.techStack === 'string' && project.techStack
      ? JSON.parse(project.techStack)
      : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
    image: project.coverImageUrl,
    url: `${SITE_URL}/projects/${project.slug}`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: FULL_NAME,
      url: SITE_URL,
    },
    creator: {
      '@type': 'Person',
      name: FULL_NAME,
    },
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    ...(project.deployUrl && {
      installUrl: project.deployUrl,
      downloadUrl: project.deployUrl,
    }),
    ...(project.repositoryUrl && {
      codeRepository: project.repositoryUrl,
    }),
    ...(techStack.length > 0 && {
      keywords: techStack.join(', '),
      programmingLanguage: techStack.map((tech: string) => ({
        '@type': 'ComputerLanguage',
        name: tech,
      })),
    }),
    inLanguage: 'pt-BR',
  };

  return <JsonLd data={schema} />;
}
