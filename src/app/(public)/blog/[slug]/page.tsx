import { BlogPostSchema, BreadcrumbSchema } from '@/components/seo';
import { SpinLoader } from '@/components/ui';
import { findPublicPostBySlugCached, SinglePost } from '@/features/blog';
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
              { name: post.title, url: `/blog/${slug}` },
            ]}
          />
        </>
      )}

      <Suspense fallback={<SpinLoader className='min-h-20 mb-24' />}>
        <SinglePost slug={slug} />
      </Suspense>
    </>
  );
}
