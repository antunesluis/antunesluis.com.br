import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Dynamic posts
  try {
    const posts = await findAllPublicPostsCached();
    const postRoutes = posts.map(post => ({
      url: `${SITE_URL}/post/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    routes.push(...postRoutes);
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Dynamic projects
  try {
    const projects = await findAllPublicProjectCached();
    const projectRoutes = projects.map(project => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt || project.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
    routes.push(...projectRoutes);
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
  }

  return routes;
}
