import clsx from 'clsx';

type HeadingProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

export function Heading({ children, as: Tag = 'h2', className }: HeadingProps) {
  const headingClassesMap: Record<string, string> = {
    h1: 'text-2xl/tight sm:text-3xl/tight md:text-4xl/tight font-extrabold',
    h2: 'text-xl/tight sm:text-xl/tight md:text-xl/tight font-extrabold',
    h3: clsx(
      'text-lg/tight sm:text-lg/tight md:text-lg/tight font-bold',
      'underline decoration-3 underline-offset-5',
      'decoration-border',
    ),
  };

  return (
    <Tag
      className={clsx(
        headingClassesMap[Tag],
        'text-foreground font-serif group-hover:text-primary transition-colors duration-200',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
