import clsx from 'clsx';
import Link from 'next/link';
import { DeletePostButton } from './DeletePostButton';
import { findAllPostsAdmin } from '../../lib/queries/admin';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export async function PostListAdmin() {
  const posts = await findAllPostsAdmin();

  if (!posts || posts.length <= 0) {
    return (
      <ErrorMessage statusCode='😅 Hey!' content="Let's create some posts!" />
    );
  }

  return (
    <div className='mb-16 overflow-hidden rounded-lg border border-border bg-card divide-y divide-border'>
      {posts.map(post => {
        return (
          <div
            className={clsx(
              'flex items-center justify-between gap-3 px-3 py-2 text-foreground transition-colors hover:bg-muted/70',
              !post.published && 'bg-muted/50',
            )}
            key={post.id}
          >
            <Link
              href={`/admin/blog/${post.id}`}
              className='min-w-0 flex-1 break-words font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:text-primary'
            >
              {post.title}
            </Link>

            {!post.published && (
              <span className='shrink-0 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground'>
                Draft
              </span>
            )}

            <DeletePostButton title={post.title} id={post.id} />
          </div>
        );
      })}
    </div>
  );
}
