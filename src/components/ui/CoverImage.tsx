import clsx from 'clsx';
import Image from 'next/image';

type CoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  className?: string;
};

export function CoverImage({ imageProps, className }: CoverImageProps) {
  return (
    <div
      className={clsx('w-full h-full overflow-hidden rounded-xl', className)}
    >
      <Image
        {...imageProps}
        className={clsx(
          'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300',
          imageProps.className,
        )}
        alt={imageProps.alt || 'Post cover image'}
      />
    </div>
  );
}
