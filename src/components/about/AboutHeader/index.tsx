import { Heading } from '@/components/ui/Heading';
import Image from 'next/image';

export function AboutHeader() {
  return (
    <section className='flex flex-col md:flex-row gap-10 items-start md:items-center'>
      <div className='max-w-[336px] w-full shrink-0 mx-auto md:mx-0'>
        <div className='relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg ring-1 ring-border'>
          <Image
            src='/images/hero-bw.jpg'
            alt='Luis Fernando Antunes'
            width={336}
            height={336}
            className='object-cover'
            priority
            sizes='(max-width: 768px) 256px, (max-width: 1024px) 300px, 336px'
          />
        </div>
      </div>

      <div className='flex-1 space-y-6'>
        <Heading as='h1'>/about</Heading>

        <div className='space-y-4 leading-relaxed text-muted-foreground'>
          <p>
            I am 21 years old and currently in my 6th semester of Computer
            Science at UFSM. I started programming in 2022 and, since then, I
            have been building projects with a strong focus on quality, clarity,
            and best practices.
          </p>

          <p>
            I have a preference for statically typed languages such as{' '}
            <strong>TypeScript</strong> and <strong>Go</strong>, working mainly
            with frontend and backend development. I am also deeply interested
            in DevOps and infrastructure, have been using Linux daily for
            several years, and enjoy understanding how things work under the
            hood.
          </p>
        </div>
      </div>
    </section>
  );
}
