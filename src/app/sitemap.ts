import { MetadataRoute } from 'next';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';
import { SITE_URL } from '@/config/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Rotas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Rotas dinâmicas – posts
  const posts = await findAllPublicPostsCached();
  const postRoutes: MetadataRoute.Sitemap =
    posts?.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.createdAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })) ?? [];

  // Rotas dinâmicas – projetos
  const projects = await findAllPublicProjectCached();
  const projectRoutes: MetadataRoute.Sitemap =
    projects?.map(project => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt ?? project.createdAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })) ?? [];

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
