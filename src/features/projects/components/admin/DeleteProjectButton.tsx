'use client';

import { Dialog } from '@/components/ui';
import clsx from 'clsx';
import { Trash2Icon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { deleteProjectAction } from '../../actions/delete-project-action';

type DeleteProjectButtonProps = {
  id: string;
  title: string;
};

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showDialog, setShowDialog] = useState(false);

  function handleClick() {
    setShowDialog(true);
  }

  function handleConfirm() {
    toast.dismiss();

    startTransition(async () => {
      const result = await deleteProjectAction(id);
      setShowDialog(false);

      if (result.error) {
        toast.error(`Error deleting project: ${result.error}`);
        return;
      }

      toast.success(`Project "${title}" deleted successfully!`);
    });
  }

  return (
    <>
      <button
        className={clsx(
          'text-error cursor-pointer transition-transform',
          '[&_svg]:h-5 [&_svg]:w-5 hover:scale-120',
          'disabled:text-muted disabled:cursor-not-allowed disabled:hover:scale-100',
        )}
        aria-label={`Delete project ${title}`}
        title={`Delete project ${title}`}
        onClick={handleClick}
        disabled={isPending}
      >
        <Trash2Icon />
      </button>
      {showDialog && (
        <Dialog
          isVisible={showDialog}
          title='Delete Project?'
          content={`Are you sure you want to delete the project: ${title}`}
          onConfirm={handleConfirm}
          onCancel={() => setShowDialog(false)}
          disabled={isPending}
        />
      )}
    </>
  );
}
