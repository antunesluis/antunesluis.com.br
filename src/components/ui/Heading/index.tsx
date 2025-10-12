import clsx from 'clsx';

type HeadingProps = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

export function Heading({ children, as: Tag = 'h2', className }: HeadingProps) {
  const headingClassesMap: Record<string, string> = {
    h1: 'text-2xl/tight sm:text-3xl/tight lg:text-4xl/tight font-extrabold',
    h2: 'text-xl/tight sm:text-xl/tight lg:text-xl/tight font-extrabold',
    h3: clsx(
      'text-lg/tight sm:text-lg/tight lg:text-lg/tight font-bold',
      'underline decoration-3 underline-offset-5',
      'decoration-gray-300 dark:decoration-gray-700',
    ),
  };

  return (
    <Tag
      className={clsx(
        headingClassesMap[Tag],
        'text-slate-800 text-serif group-hover:text-blue-500 transition-colors duration-200',
        'dark:text-slate-100 dark:group-hover:text-blue-400',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
