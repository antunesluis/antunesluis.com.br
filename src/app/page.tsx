import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import { PostCoverImage } from '@/components/PostCoverImage';
import { PostHeading } from '@/components/PostHeading';
import PostsList from '@/components/PostsList';
import { SpinLoader } from '@/components/SpinLoader';
import clsx from 'clsx';
import { Suspense } from 'react';

export default async function HomePage() {
  return (
    <Container>
      <Header />

      <section
        className={clsx('grid grid-cols-1 gap-8 mb-16 group', 'sm:grid-cols-2')}
      >
        <PostCoverImage
          linkProps={{ href: '#' }}
          imageProps={{
            width: 1200,
            height: 700,
            src: '/images/bryen_0.png',
            alt: 'PostCoverImage',
            priority: true,
          }}
        />

        <div className='flex flex-col gap-4 sm:justify-center'>
          <time dateTime='2023-10-01' className='text-sm/tight text-gray-500'>
            October 1, 2023, 10:00 AM
          </time>

          <PostHeading url='#' as='h1'>
            It has survived not only five centuries
          </PostHeading>

          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
        </div>
      </section>

      <Suspense fallback={<SpinLoader />}>
        <PostsList />
      </Suspense>

      <footer className='text-4xl font-bold text-center py-8'>
        <p>Footer</p>
      </footer>
    </Container>
  );
}
