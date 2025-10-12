'use client';

import clsx from 'clsx';
import { Button } from '../Button';

type DialogProps = {
  isVisible?: boolean;
  title: string;
  content: React.ReactNode;
  disabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Dialog({
  isVisible = false,
  title,
  content,
  disabled,
  onCancel,
  onConfirm,
}: DialogProps) {
  if (!isVisible) return null;

  function handleCancel() {
    if (disabled) return;
    onCancel();
  }

  return (
    <div
      className={clsx(
        'fixed z-50 inset-0 bg-black/50 backdrop-blur-xs',
        'flex items-center justify-center',
      )}
      onClick={handleCancel}
    >
      <div
        className={clsx(
          'bg-slate-100 p-6 mx-6 rounded-lg max-w-2xl',
          'dark:bg-slate-800',
          'flex flex-col gap-6',
          'shadow-lg shadow-black/30 text-center',
        )}
        role='dialog'
        onClick={e => e.stopPropagation()}
        aria-modal={true}
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
      >
        <h3 id='dialog-title' className={clsx('text-2xl font-extrabold')}>
          {title}
        </h3>
        <div id='dialog-description'>{content}</div>
        <div className='flex items-center justify-around'>
          <Button
            variant='ghost'
            onClick={handleCancel}
            disabled={disabled}
            autoFocus
          >
            Cancelar
          </Button>
          <Button variant='default' onClick={onConfirm} disabled={disabled}>
            Ok
          </Button>
        </div>
      </div>
    </div>
  );
}
