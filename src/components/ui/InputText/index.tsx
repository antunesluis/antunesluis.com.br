import clsx from 'clsx';
import { useId } from 'react';

type InputTextProps = {
  labelText?: string;
} & React.ComponentProps<'input'>;

export function InputText({ labelText = '', ...props }: InputTextProps) {
  const id = useId();

  return (
    <div className='flex flex-col gap-2'>
      {labelText && (
        <label
          className='text-sm font-medium text-slate-700 dark:text-slate-300'
          htmlFor={id}
        >
          {labelText}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          'bg-white dark:bg-slate-800 outline-0 text-base/tight',
          'text-slate-900 dark:text-slate-100',
          'ring-2 ring-slate-300 dark:ring-slate-600 rounded-md',
          'focus:ring-blue-500 dark:focus:ring-blue-400',
          'px-3 py-2 transition-all duration-200',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',

          'disabled:placeholder:text-slate-300 dark:disabled:placeholder:text-slate-600',
          'disabled:bg-slate-100 dark:disabled:bg-slate-900',
          'disabled:text-slate-400 dark:disabled:text-slate-600',
          'disabled:ring-slate-200 dark:disabled:ring-slate-700',
          'disabled:cursor-not-allowed',

          'read-only:bg-slate-50 dark:read-only:bg-slate-900',
          'read-only:text-slate-600 dark:read-only:text-slate-400',
          'read-only:ring-slate-200 dark:read-only:ring-slate-700',
          'read-only:cursor-default',

          props.className,
        )}
        id={id}
      />
    </div>
  );
}
