import clsx from 'clsx';
import Link from 'next/link';
import { DeletePostButton } from './DeletePostButton';
import { findAllPostsAdmin } from '../../lib/queries/admin';
import { ErrorMessage } from '@/components/ui';

export async function PostListAdmin() {
  const posts = await findAllPostsAdmin();

  if (!posts || posts.length <= 0) {
    return (
      <ErrorMessage statusCode='😅 Hey!' content="Let's create some posts!" />
    );
  }

  return (
    <div className='mb-16'>
      {posts.map(post => {
        return (
          <div
            className={clsx(
              'py-2 px-2 rounded-md text-foreground',
              !post.published && 'bg-muted',
              'flex gap-2 items-center justify-between',
            )}
            key={post.id}
          >
            <Link href={`/admin/blog/${post.id}`}>{post.title}</Link>

            {!post.published && (
              <span className='text-xs text-muted-foreground italic ml-2'>
                (Draft)
              </span>
            )}

            <DeletePostButton title={post.title} id={post.id} />
          </div>
        );
      })}
    </div>
  );
}
