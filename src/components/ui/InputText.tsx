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
        <label className='text-sm font-medium text-foreground' htmlFor={id}>
          {labelText}
        </label>
      )}

      <input
        {...props}
        className={clsx(
          // Base
          'bg-background text-foreground',
          'outline-none text-base',

          // Border e ring
          'border-2 border-input rounded-lg',
          'focus:border-ring focus:ring-2 focus:ring-ring/20',

          // Padding e transição
          'px-3 py-2',
          'transition-all duration-200',

          // Placeholder
          'placeholder:text-muted-foreground',

          // Estado disabled
          'disabled:opacity-50',
          'disabled:cursor-not-allowed',
          'disabled:bg-muted',

          // Estado read-only
          'read-only:bg-muted',
          'read-only:cursor-default',
          'read-only:focus:ring-0',

          props.className,
        )}
        id={id}
      />
    </div>
  );
}
