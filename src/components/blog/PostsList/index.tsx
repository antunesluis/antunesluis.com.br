import Link from 'next/link';
import { PostSummary } from '@/components/blog/PostSummary';
import { CoverImage } from '../../ui/CoverImage';
import { findAllPublicPostsCached } from '@/lib/post/queries/public';

export default async function PostsList() {
  const posts = await findAllPublicPostsCached();
  if (!posts || posts.length <= 1) return null;

  const postsToShow = posts.slice(1);

  return (
    <div className='mb-16'>
      <p className='text-slate-800 dark:text-slate-200 font-semibold text-md/tight'>
        LATEST
      </p>

      {Array.from({ length: Math.ceil(postsToShow.length / 3) }).map(
        (_, rowIndex) => {
          const startIndex = rowIndex * 3;
          const rowPosts = postsToShow.slice(startIndex, startIndex + 3);

          return (
            <div key={rowIndex}>
              <div className='w-full h-px bg-slate-200 dark:bg-slate-700 mb-6 mt-2' />

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6'>
                {rowPosts.map((post, postIndex) => {
                  const postLink = `/post/${post.slug}`;
                  const isNotLastColumn = postIndex < 2;
                  const globalIndex = startIndex + postIndex;
                  const isNotLastPost = globalIndex < postsToShow.length - 1;

                  return (
                    <div key={post.slug} className='relative'>
                      <Link
                        href={postLink}
                        className='flex flex-col gap-4 group'
                      >
                        <CoverImage
                          imageProps={{
                            width: 1200,
                            height: 700,
                            src: post.coverImageUrl,
                            alt: post.title,
                            priority: true,
                          }}
                        />
                        <PostSummary
                          postHeading='h2'
                          createdAt={post.createdAt}
                          title={post.title}
                          excerpt={post.excerpt}
                        />
                      </Link>

                      {isNotLastColumn && rowPosts.length > 1 && (
                        <div className='hidden lg:block absolute top-0 -right-4 w-px h-full bg-slate-200 dark:bg-slate-700' />
                      )}

                      {isNotLastPost && (
                        <div className='lg:hidden w-full h-px bg-slate-200 dark:bg-slate-700 mt-8' />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
