import { SinglePost } from '@/components/blog/SinglePost';
import { BlogPostSchema } from '@/components/seo/BlogPostSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SpinLoader } from '@/components/ui/SpinLoader';
import { createMetadata } from '@/lib/metadata';
import { findPublicPostBySlugCached } from '@/lib/post/queries/public';
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

      <Suspense fallback={<SpinLoader className='min-h-20 mb-16' />}>
        <SinglePost slug={slug} />
      </Suspense>
    </>
  );
}
