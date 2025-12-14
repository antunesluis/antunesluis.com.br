import { JsonLd } from './JsonLd';
import { FULL_NAME, SITE_URL } from '@/config/constants';
import { ProjectModel } from '@/models/project/project-model';

type ProjectSchemaProps = {
  project: ProjectModel;
};

export function ProjectSchema({ project }: ProjectSchemaProps) {
  // const techStack =
  //   typeof project.techStack === 'string'
  //     ? (JSON.parse(project.techStack) as string[])
  //     : Array.isArray(project.techStack)
  //       ? project.techStack
  //       : [];

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
      priceCurrency: 'BRL',
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
      url: project.deployUrl,
    }),
    inLanguage: 'en-US',
  };

  return <JsonLd data={schema} />;
}
