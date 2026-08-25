import clsx from 'clsx';
import { useId } from 'react';

type InputCheckboxProps = {
  labelText?: string;
  type?: 'checkbox';
} & React.ComponentProps<'input'>;

export function InputCheckbox({
  labelText = '',
  type = 'checkbox',
  ...props
}: InputCheckboxProps) {
  const id = useId();

  return (
    <div className='flex flex-row gap-2 items-center'>
      <input
        {...props}
        className={clsx(
          'w-5 h-5 rounded border-input accent-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          props.className,
        )}
        type={type}
        id={id}
      />
      {labelText && (
        <label className='text-sm font-medium text-foreground' htmlFor={id}>
          {labelText}
        </label>
      )}
    </div>
  );
}
