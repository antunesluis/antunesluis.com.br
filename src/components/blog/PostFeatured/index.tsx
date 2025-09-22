import clsx from 'clsx';
import { CoverImage } from '../../ui/CoverImage';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';
import ErrorMessage from '../../ui/ErrorMessage';
import { PostSummary } from '../PostSummary';

export default async function PostFeatured() {
  const posts = await findAllPublicPostsCached();

  if (!posts || posts.length <= 0) {
    return (
      <ErrorMessage
        statusCode='😅 Oops!'
        content="We haven't created any posts yet."
      />
    );
  }

  const post = posts[0];
  const postLink = `/post/${post.slug}`;

  return (
    <>
      <section
        className={clsx('grid grid-cols-1 gap-8 mb-16 group', 'sm:grid-cols-2')}
      >
        <CoverImage
          linkProps={{ href: postLink }}
          imageProps={{
            width: 1200,
            height: 700,
            src: post.coverImageUrl,
            alt: post.title,
            priority: true,
          }}
        />

        <PostSummary
          postLink={postLink}
          createdAt={post.createdAt}
          title={post.title}
          excerpt={post.excerpt}
          postHeading='h1'
        />
      </section>
    </>
  );
}
