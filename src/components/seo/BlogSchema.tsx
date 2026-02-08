import { JsonLd } from './JsonLd';
import {
  SITE_URL,
  FULL_NAME,
  MY_NAME,
  SITE_DESCRIPTION,
} from '@/config/constants';
import { PostModel } from '@/features/blog/models/post-model';

type BlogSchemaProps = {
  posts: PostModel[];
};

export function BlogSchema({ posts }: BlogSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${MY_NAME} - Blog`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: 'pt-BR', // ou 'pt-BR'
    author: {
      '@type': 'Person',
      name: FULL_NAME,
      url: SITE_URL,
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/post/${post.slug}`,
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Person',
        name: post.author,
      },
    })),
  };

  return <JsonLd data={schema} />;
}
