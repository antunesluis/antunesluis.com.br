import { BreadcrumbSchema } from '@/components/seo';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { BlogPostSchema } from '@/features/blog/components/seo/BlogPostSchema';
import { SinglePost } from '@/features/blog/components/SinglePost';
import { findPublicPostBySlugCached } from '@/features/blog/lib/queries/public';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { Suspense } from 'react';

type PostSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: PostSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPublicPostBySlugCached(slug);

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    pathname: `/blog/${slug}`,
    image: post.coverImageUrl,
    type: 'article',
    publishedTime: post.createdAt,
    author: post.author,
  });
}

export default async function PostSlugPage({ params }: PostSlugPageProps) {
  const { slug } = await params;
  const post = await findPublicPostBySlugCached(slug);

  return (
    <>
      {post && (
        <>
          <BlogPostSchema post={post} />
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: post.title, url: `/blog/${slug}` },
            ]}
          />
        </>
      )}

      <Suspense fallback={<SpinLoader className='min-h-20 mb-24' />}>
        <SinglePost post={post} />
      </Suspense>
    </>
  );
}
