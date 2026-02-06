import clsx from 'clsx';

type ButtonVariants = 'default' | 'ghost' | 'transparent' | 'danger' | 'upload';
type ButtonSizes = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariants;
  size?: ButtonSizes;
} & React.ComponentProps<'button'>;

export function Button({
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  const buttonVariants: Record<ButtonVariants, string> = {
    default: clsx(
      'bg-primary text-primary-foreground',
      'hover:opacity-90',
      'active:opacity-80',
    ),

    ghost: clsx(
      'bg-muted text-foreground',
      'border border-border',
      'hover:bg-muted/80',
      'active:bg-muted/60',
    ),

    transparent: clsx(
      'bg-transparent text-foreground',
      'hover:text-foreground',
    ),

    danger: clsx(
      'bg-error text-error-foreground',
      'hover:opacity-90',
      'active:opacity-80',
    ),

    upload: clsx(
      'bg-primary/10 text-primary',
      'border-2 border-primary/20',
      'hover:bg-primary/20 hover:border-primary/30',
      'active:bg-primary/30',
    ),
  };

  const sizeClasses: Record<ButtonSizes, string> = {
    sm: clsx(
      'text-xs/tight',
      'py-1 px-2',
      'rounded-sm',
      '[&>svg]:w-3 [&>svg]:h-3',
      'gap-1',
    ),
    md: clsx(
      'text-base/tight',
      'py-3 px-5',
      'rounded-md',
      '[&>svg]:w-4 [&>svg]:h-4',
      'gap-2',
    ),
    lg: clsx(
      'text-lg/tight',
      'py-4 px-6',
      'rounded-lg',
      '[&>svg]:w-5 [&>svg]:h-5',
      'gap-3',
    ),
  };

  const buttonClasses = clsx(
    buttonVariants[variant],
    sizeClasses[size],
    'flex items-center justify-center cursor-pointer',
    'transition hover:shadow-sm',
    'disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400',
    'dark:disabled:bg-slate-800 dark:disabled:text-slate-600',
    props.className,
  );

  return <button {...props} className={buttonClasses} />;
}
