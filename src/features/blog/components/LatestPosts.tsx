import Link from 'next/link';
import { formatCompactDate } from '@/lib/utils';
import { PostModel } from '../models/post-model';

type LatestPostsProps = {
  latestPosts: PostModel[];
};

export function LatestPosts({ latestPosts }: LatestPostsProps) {
  return (
    <ul className='divide-y divide-border/80'>
      {latestPosts.map(post => {
        const postLink = `/blog/${post.slug}`;

        return (
          <li key={post.slug}>
            <article>
              <Link
                href={postLink}
                className='group -mx-3 flex items-baseline justify-between gap-4 rounded-lg px-3 py-3.5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              >
                <h3 className='min-w-0 text-[15px] font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base'>
                  {post.title}
                </h3>
                <time
                  dateTime={post.createdAt}
                  className='shrink-0 font-mono text-xs tracking-tight text-muted-foreground tabular-nums'
                >
                  {formatCompactDate(post.createdAt)}
                </time>
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
