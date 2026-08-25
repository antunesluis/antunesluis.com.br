'use client';

import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import clsx from 'clsx';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { deletePostAction } from '../../actions/delete-post-action';

type DeletePostButtonProps = {
  id: string;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  async function handleConfirm() {
    toast.dismiss();

    const result = await deletePostAction(id);

    if (!result.success) {
      result.errors.forEach(error =>
        toast.error(`Error deleting post: ${error}`),
      );
      return;
    }

    toast.success(`Post "${title}" deleted successfully!`);
  }

  return (
    <ConfirmationDialog
      title='Delete Post?'
      content={`Are you sure you want to delete the post: ${title}`}
      onConfirm={handleConfirm}
      trigger={
        <button
          type='button'
          className={clsx(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-error transition-colors hover:bg-error/10',
            '[&_svg]:h-5 [&_svg]:w-5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          aria-label={`Delete post ${title}`}
          title={`Delete post ${title}`}
        >
          <Trash2Icon />
        </button>
      }
    />
  );
}
