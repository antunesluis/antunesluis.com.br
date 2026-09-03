import { Heading } from '@/components/ui/Heading';

export function AboutHeader() {
  return (
    <header className='space-y-6'>
      <Heading as='h1'>
        Hey, I&apos;m Luis! 👋
      </Heading>

      <div className='max-w-3xl space-y-4 leading-relaxed'>
        <p>
          I am 21 years old and currently in my 6th semester of Computer Science
          at UFSM. I started programming in 2022 and, since then, I have been
          building projects with a strong focus on quality, clarity, and best
          practices.
        </p>

        <p>
          I have a preference for statically typed languages such as{' '}
          <strong>TypeScript</strong> and <strong>Go</strong>, working mainly with
          frontend and backend development. I am also deeply interested in
          DevOps and infrastructure, have been using Linux daily for several
          years, and enjoy understanding how things work under the hood.
        </p>
      </div>
    </header>
  );
}
