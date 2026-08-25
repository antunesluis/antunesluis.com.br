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
            'text-error cursor-pointer transition-transform',
            '[&_svg]:h-5 [&_svg]:w-5 hover:scale-120',
            'disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:scale-100',
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
