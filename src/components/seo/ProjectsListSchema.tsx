import { JsonLd } from './JsonLd';
import { SITE_URL, MY_NAME } from '@/config/constants';
import { ProjectModel } from '@/models/project/project-model';

type ProjectsListSchemaProps = {
  projects: ProjectModel[];
};

export function ProjectsListSchema({ projects }: ProjectsListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${MY_NAME} - Projects`,
    description: 'Portfolio of web development and software projects',
    url: `${SITE_URL}/projects`,
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Person',
      name: 'Luis Fernando Antunes',
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: project.name,
          description: project.description,
          url: `${SITE_URL}/projects/${project.slug}`,
          image: project.coverImageUrl,
        },
      })),
    },
  };

  return <JsonLd data={schema} />;
}
