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
    h3: 'text-lg/tight sm:text-lg/tight lg:text-xl/tight font-bold',
  };

  return (
    <Tag
      className={clsx(
        headingClassesMap[Tag],
        'group-hover:text-blue-500 transition-colors duration-200',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
