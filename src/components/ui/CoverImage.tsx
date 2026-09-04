import clsx from 'clsx';
import Image from 'next/image';

type CoverImageProps = {
  imageProps: React.ComponentProps<typeof Image>;
  className?: string;
};

export function CoverImage({ imageProps, className }: CoverImageProps) {
  return (
    <div
      className={clsx('w-full shrink-0 overflow-hidden rounded-xl', className)}
    >
      <Image
        {...imageProps}
        alt={imageProps.alt}
        className={clsx(
          'h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none',
          imageProps.className,
        )}
      />
    </div>
  );
}
