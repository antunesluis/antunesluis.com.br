import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadingProps = Omit<
  ComponentPropsWithoutRef<'h2'>,
  'children' | 'className'
> & {
  children: React.ReactNode;
  as?: HeadingTag;
  className?: string;
};

export function Heading({
  children,
  as: Tag = 'h2',
  className,
  ...props
}: HeadingProps) {
  const headingClassesMap: Record<HeadingTag, string> = {
    h1: 'text-3xl/tight font-bold sm:text-4xl/tight',

    h2: clsx(
      'text-xl/tight font-semibold sm:text-2xl/tight',
      'underline decoration-4 underline-offset-8',
      'decoration-border',
    ),

    h3: 'text-lg/tight font-semibold sm:text-xl/tight',

    h4: 'text-base/tight font-semibold sm:text-lg/tight',

    h5: 'text-sm/tight font-semibold sm:text-base/tight',

    h6: 'text-sm/tight font-semibold',
  };

  return (
    <Tag
      {...props}
      className={clsx(
        headingClassesMap[Tag],
        'text-foreground group-hover:text-primary',
        'tracking-tight',
        'font-sans',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
