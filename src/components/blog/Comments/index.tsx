'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

type CommentsProps = {
  commentsTerm: string;
};

export function Comments({ commentsTerm }: CommentsProps) {
  const { theme } = useTheme();

  return (
    <Giscus
      id='comments'
      repo={process.env.NEXT_PUBLIC_GISCUS_REPO! as `${string}/${string}`}
      repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
      category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
      mapping='specific'
      term={commentsTerm}
      reactionsEnabled='1'
      emitMetadata='0'
      inputPosition='top'
      theme={theme}
      lang='pt'
      loading='lazy'
    />
  );
}
