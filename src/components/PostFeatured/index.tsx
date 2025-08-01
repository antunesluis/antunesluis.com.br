import clsx from 'clsx';
import { PostCoverImage } from '../PostCoverImage';
import { PostSummary } from '../PostSummary';
import { findAllPublicPosts } from '@/lib/post/queries';

export default async function PostFeatured() {
  const posts = await findAllPublicPosts();
  const post = posts[0];
  const postLink = `/posts/${post.slug}`;

  return (
    <section
      className={clsx('grid grid-cols-1 gap-8 mb-16 group', 'sm:grid-cols-2')}
    >
      <PostCoverImage
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
        postHeading='h2'
      />
    </section>
  );
}
