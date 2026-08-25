'use client';

import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import clsx from 'clsx';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteProjectAction } from '../../actions/delete-project-action';

type DeleteProjectButtonProps = {
  id: string;
  title: string;
};

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  async function handleConfirm() {
    toast.dismiss();

    const result = await deleteProjectAction(id);

    if (!result.success) {
      result.errors.forEach(error =>
        toast.error(`Error deleting project: ${error}`),
      );
      return;
    }

    toast.success(`Project "${title}" deleted successfully!`);
  }

  return (
    <ConfirmationDialog
      title='Delete Project?'
      content={`Are you sure you want to delete the project: ${title}`}
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
          aria-label={`Delete project ${title}`}
          title={`Delete project ${title}`}
        >
          <Trash2Icon />
        </button>
      }
    />
  );
}
