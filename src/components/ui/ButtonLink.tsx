import clsx from 'clsx';
import Link from 'next/link';

type ButtonLinkVariants = 'default' | 'ghost' | 'transparent' | 'link';
type ButtonLinkSizes = 'sm' | 'md';

type ButtonLinkProps = {
  href: string;
  variant?: ButtonLinkVariants;
  size?: ButtonLinkSizes;
  children: React.ReactNode;
  className?: string;
  target?: '_blank' | '_self';
  rel?: string;
};

export function ButtonLink({
  href,
  variant = 'default',
  size = 'md',
  children,
  className,
  target,
  rel,
}: ButtonLinkProps) {
  const buttonVariants: Record<ButtonLinkVariants, string> = {
    default: clsx(
      'bg-primary text-primary-foreground',
      'hover:opacity-90',
      'active:opacity-80',
      'transition hover:shadow-sm',
    ),

    ghost: clsx(
      'bg-muted text-foreground',
      'border border-border',
      'hover:bg-muted/80',
      'active:bg-muted/60',
      'transition hover:shadow-sm',
    ),

    transparent: clsx(
      'bg-transparent text-foreground',
      'hover:text-foreground',
    ),

    link: clsx(
      'bg-transparent',
      'text-foreground',
      'transition-colors',
      '[&>svg]:w-4 [&>svg]:h-4',
      'p-0 gap-1',
    ),
  };

  const sizeClasses: Record<ButtonLinkSizes, string> = {
    sm: clsx(
      'text-base/tight',
      'py-2 px-4',
      'rounded-lg',
      '[&>svg]:w-4 [&>svg]:h-4',
      'gap-1',
    ),
    md: clsx(
      'text-base/tight',
      'py-3 px-5',
      'rounded-lg',
      '[&>svg]:w-4 [&>svg]:h-4',
      'gap-2',
    ),
  };

  const linkClasses = clsx(
    'inline-flex items-center justify-center font-medium',
    buttonVariants[variant],
    variant !== 'link' && sizeClasses[size],
    className,
  );

  if (target === '_blank') {
    return (
      <Link
        href={href}
        target='_blank'
        rel={rel || 'noopener noreferrer'}
        className={linkClasses}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  );
}
