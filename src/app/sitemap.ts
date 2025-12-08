import { MetadataRoute } from 'next';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import { findAllPublicProjectCached } from '@/lib/project/queries/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://antunesluis.com.br';

  const posts = await findAllPublicPostsCached();
  const projects = await findAllPublicProjectCached();

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const projectUrls = projects.map(project => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  return [...staticPages, ...postUrls, ...projectUrls];
}
