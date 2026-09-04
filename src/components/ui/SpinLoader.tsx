import clsx from 'clsx';

type SpinLoaderProps = {
  className?: string;
};

export function SpinLoader({ className }: SpinLoaderProps) {
  const classes = clsx('flex items-center justify-center', className);

  return (
    <div className={clsx(classes)} role='status'>
      <div
        className={clsx(
          'w-10 h-10',
          'border-5 border-t-transparent border-border rounded-full',
          'animate-spin motion-reduce:animate-none',
        )}
        aria-hidden='true'
      />
      <span className='sr-only'>Loading</span>
    </div>
  );
}
