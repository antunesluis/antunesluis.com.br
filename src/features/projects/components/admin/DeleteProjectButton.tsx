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
            'text-error cursor-pointer transition-transform',
            '[&_svg]:h-5 [&_svg]:w-5 hover:scale-120',
            'disabled:text-muted disabled:cursor-not-allowed disabled:hover:scale-100',
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
