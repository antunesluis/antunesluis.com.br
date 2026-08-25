'use client';

import { AlertDialog } from '@base-ui/react/alert-dialog';
import clsx from 'clsx';
import { useRef, useState, useTransition } from 'react';
import { Button } from './Button';

type ConfirmationDialogProps = {
  trigger: React.ReactElement;
  title: string;
  content: React.ReactNode;
  onConfirm: () => Promise<void>;
};

export function ConfirmationDialog({
  trigger,
  title,
  content,
  onConfirm,
}: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isConfirmingRef = useRef(false);

  function handleOpenChange(open: boolean) {
    if (!open && (isPending || isConfirmingRef.current)) return;
    setIsOpen(open);
  }

  function handleConfirm() {
    if (isPending || isConfirmingRef.current) return;

    isConfirmingRef.current = true;

    startTransition(async () => {
      try {
        await onConfirm();
        setIsOpen(false);
      } finally {
        isConfirmingRef.current = false;
      }
    });
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialog.Trigger render={trigger} disabled={isPending} />

      <AlertDialog.Portal>
        <AlertDialog.Backdrop
          className={clsx(
            'fixed z-50 inset-0 bg-black/50 backdrop-blur-xs',
            'transition-opacity duration-200',
            'data-starting-style:opacity-0 data-ending-style:opacity-0',
          )}
        />
        <AlertDialog.Viewport className='fixed z-50 inset-0 flex items-center justify-center pointer-events-none'>
          <AlertDialog.Popup
            aria-busy={isPending}
            className={clsx(
              'pointer-events-auto bg-card p-6 mx-6 rounded-lg max-w-2xl border border-border',
              'flex flex-col gap-6',
              'shadow-lg shadow-black/30 text-center',
              'transition-[opacity,transform] duration-200',
              'data-starting-style:opacity-0 data-starting-style:scale-95',
              'data-ending-style:opacity-0 data-ending-style:scale-95',
            )}
          >
            <AlertDialog.Title className={clsx('text-2xl font-extrabold')}>
              {title}
            </AlertDialog.Title>
            <AlertDialog.Description className='text-muted-foreground'>
              {content}
            </AlertDialog.Description>
            <div className='flex items-center justify-end gap-3'>
              <AlertDialog.Close
                render={<Button type='button' variant='ghost' />}
                disabled={isPending}
              >
                Cancelar
              </AlertDialog.Close>
              <Button
                type='button'
                variant='danger'
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
