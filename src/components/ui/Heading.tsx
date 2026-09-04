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
  withUnderline?: boolean;
};

export function Heading({
  children,
  as: Tag = 'h2',
  className,
  withUnderline = true,
  ...props
}: HeadingProps) {
  const headingClassesMap: Record<HeadingTag, string> = {
    h1: 'text-3xl/tight font-bold sm:text-4xl/tight',

    h2: 'text-xl/tight font-semibold sm:text-2xl/tight',

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
        Tag === 'h2' &&
          withUnderline &&
          'underline decoration-2 underline-offset-8 decoration-border',
        'text-foreground group-hover:text-primary group-focus-visible:text-primary',
        'tracking-tight',
        'font-sans',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
