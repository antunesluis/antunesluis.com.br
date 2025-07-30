import { postRepository } from '@/repositories/post';
import { PostCoverImage } from '../PostCoverImage';
import { PostHeading } from '../PostHeading';

export default async function PostsList() {
  const posts = await postRepository.findAll();

  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
      {posts.map(post => {
        return (
          <div className='flex flex-col gap-4 group' key={post.slug}>
            <PostCoverImage
              linkProps={{ href: `/posts/${post.slug}` }}
              imageProps={{
                width: 1200,
                height: 700,
                src: post.coverImageUrl,
                alt: post.title,
                priority: true,
              }}
            />
            <div className='flex flex-col gap-4 sm:justify-center'>
              <time
                dateTime={post.createdAt}
                className='text-sm/tight text-gray-500'
              >
                {post.createdAt}
              </time>

              <PostHeading url='#' as='h2'>
                {post.title}
              </PostHeading>

              <p>{post.excerpt}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
