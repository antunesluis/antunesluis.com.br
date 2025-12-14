import { JsonLd } from './JsonLd';
import { SITE_URL, FULL_NAME } from '@/config/constants';
import { PostModel } from '@/models/post/post-model';

type BlogPostSchemaProps = {
  post: PostModel;
};

export function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author || FULL_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: FULL_NAME,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/post/${post.slug}`,
    },
    url: `${SITE_URL}/post/${post.slug}`,
    articleBody: post.content,
    inLanguage: 'en-US',
  };

  return <JsonLd data={schema} />;
}
