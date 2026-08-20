'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { publicEnv } from '@/config/env/public';

type CommentsProps = {
  commentsTerm: string;
};

export function Comments({ commentsTerm }: CommentsProps) {
  const { theme } = useTheme();

  return (
    <Giscus
      id='comments'
      repo={publicEnv.giscusRepo!}
      repoId={publicEnv.giscusRepoId!}
      category={publicEnv.giscusCategory!}
      categoryId={publicEnv.giscusCategoryId!}
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
