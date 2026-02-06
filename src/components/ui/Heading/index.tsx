import clsx from 'clsx';

type HeadingProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
};

export function Heading({ children, as: Tag = 'h2', className }: HeadingProps) {
  const headingClassesMap: Record<string, string> = {
    h1: clsx('text-4xl/tight sm:text-5xl/tight md:text-6xl/tight font-bold'),

    h2: clsx(
      'text-2xl/tight sm:text-3xl/tight md:text-3xl/tight font-semibold',
      'underline decoration-4 underline-offset-8',
      'decoration-border',
    ),

    h3: clsx('text-xl/tight sm:text-2xl/tight md:text-2xl/tight font-semibold'),

    h4: clsx('text-lg/tight sm:text-xl/tight md:text-xl/tight font-semibold'),

    h5: clsx('text-base/tight sm:text-lg/tight md:text-lg/tight font-semibold'),

    h6: clsx(
      'text-sm/tight sm:text-base/tight md:text-base/tight font-semibold',
    ),
  };

  return (
    <Tag
      className={clsx(
        headingClassesMap[Tag],
        'text-foreground group-hover:text-primary',
        'tracking-tight',
        'font-serif',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
