import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL, FULL_NAME } from '@/config/constants';
import { PostModel } from '../../models/post-model';

type BlogPostSchemaProps = {
  post: PostModel;
};

export function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;

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
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    articleBody: post.content,
    wordCount,
  };

  return <JsonLd data={schema} />;
}
