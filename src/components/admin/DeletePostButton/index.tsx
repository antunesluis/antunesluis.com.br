'use client';

import { deletePostAction } from '@/actions/post/delete-post';
import { Dialog } from '@/components/Dialog';
import clsx from 'clsx';
import { Trash2Icon } from 'lucide-react';
import { useState, useTransition } from 'react';

type DeletePostButtonProps = {
  id: string;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  function handleClick() {
    setShowDialog(true);
  }

  function handleConfirm() {
    startTransition(async () => {
      const result = await deletePostAction(id);
      alert(`Result: ${result}`);
      setShowDialog(false);
    });
  }

  return (
    <>
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
      {showDialog && (
        <Dialog
          isVisible={showDialog}
          title='Delete Post?'
          content={`Are you sure you want to delete the post: ${title}`}
          onConfirm={handleConfirm}
          onCancel={() => setShowDialog(false)}
          disabled={isPending}
        />
      )}
    </>
  );
}
