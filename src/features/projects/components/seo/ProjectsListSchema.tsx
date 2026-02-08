import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, MY_NAME, FULL_NAME } from '@/config/constants';
import { ProjectModel } from '@/features/projects/models/project-model';

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
    image: `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: FULL_NAME,
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
          applicationCategory: 'WebApplication',
          datePublished: project.createdAt,
        },
      })),
    },
  };

  return <JsonLd data={schema} />;
}
