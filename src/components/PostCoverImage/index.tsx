import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

type PostCoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  linkProps: React.ComponentProps<typeof Link>;
};

export function PostCoverImage({ imageProps, linkProps }: PostCoverImageProps) {
  return (
    <Link
      className={clsx(
        'w-full h-full overflow-hidden rounded-2xl',
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
