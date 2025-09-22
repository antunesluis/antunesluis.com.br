import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

type CoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  linkProps: React.ComponentProps<typeof Link>;
};

export function CoverImage({ imageProps, linkProps }: CoverImageProps) {
  return (
    <Link
      className={clsx(
        'w-full h-full overflow-hidden rounded-xl',
        linkProps.className,
      )}
      {...linkProps}
    >
      <Image
        {...imageProps}
        className={clsx(
          'w-full h-full object-cover object-center group-hover:scale-105 transition',
          imageProps.className,
        )}
        alt={imageProps.alt || 'Post cover image'}
      />
    </Link>
  );
}
