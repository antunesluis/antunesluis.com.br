import { JsonLd } from '@/components/seo/JsonLd';
import {
  SITE_URL,
  FULL_NAME,
  MY_NAME,
  SITE_DESCRIPTION,
} from '@/config/constants';
import { PostModel } from '../../models/post-model';

type BlogSchemaProps = {
  posts: PostModel[];
};

export function BlogSchema({ posts }: BlogSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${MY_NAME} - Blog`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    inLanguage: 'pt-BR',
    image: `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: FULL_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: FULL_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    numberOfItems: posts.length,
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      image: post.coverImageUrl,
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Person',
        name: post.author || FULL_NAME,
      },
    })),
  };

  return <JsonLd data={schema} />;
}
