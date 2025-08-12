'use client';

import { deletePostAction } from '@/actions/post/delete-post';
import clsx from 'clsx';
import { Trash2Icon } from 'lucide-react';
import { useTransition } from 'react';

type DeletePostButtonProps = {
  id: string;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Are you sure you want to delete the post "${title}"?`))
      return;

    startTransition(async () => {
      const result = await deletePostAction(id);
      alert(`Result: ${result}`);
    });
  }

  return (
    <button
      className={clsx(
        'text-red-500 cursor-pointer transition-transform',
        '[&_svg]:h-5 [&_svg]:w-5',
        'hover:scale-120 hover:text-red-700',
        'disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:scale-100',
      )}
      aria-label={`Delete post ${title}`}
      title={`Delete post ${title}`}
      onClick={handleClick}
      disabled={isPending}
    >
      <Trash2Icon />
    </button>
  );
}
