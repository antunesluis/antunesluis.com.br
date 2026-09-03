import Link from 'next/link';
import { CoverImage } from '@/components/ui/CoverImage';
import { PostSummary } from './PostSummary';
import { PostModel } from '../models/post-model';

type PostFeaturedProps = {
  post: PostModel;
};

export async function PostFeatured({ post }: PostFeaturedProps) {
  return (
    <article className='mb-16'>
      <Link
        href={`/blog/${post.slug}`}
        className='group grid grid-cols-1 gap-8 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:grid-cols-2'
      >
        <CoverImage
          imageProps={{
            width: 1200,
            height: 700,
            src: post.coverImageUrl,
            alt: '',
            loading: 'eager',
            sizes: '(max-width: 640px) calc(100vw - 3rem), 25rem',
          }}
        />

        <PostSummary
          createdAt={post.createdAt}
          title={post.title}
          excerpt={post.excerpt}
          postHeading='h2'
        />
      </Link>
    </article>
  );
}
