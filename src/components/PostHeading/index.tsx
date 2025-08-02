import clsx from 'clsx';
import Link from 'next/link';

type PostHeadingProps = {
  children: React.ReactNode;
  url: string;
  as?: 'h1' | 'h2';
  className?: string;
  linkClassName?: string;
};

export function PostHeading({
  children,
  url,
  as: Tag = 'h2',
  className,
  linkClassName,
}: PostHeadingProps) {
  const headingClassesMap: Record<string, string> = {
    h1: 'text-2xl/tight sm:text-4xl font-extrabold',
    h2: 'text-xl/tight sm:text-2xl font-bold',
  };

  const defaultLinkClasses =
    'group-hover:text-blue-500 transition-colors duration-200';

  return (
    <Tag className={clsx(headingClassesMap[Tag], className)}>
      <Link href={url} className={clsx(defaultLinkClasses, linkClassName)}>
        {children}
      </Link>
    </Tag>
  );
}
