import { Heading } from '@/components/ui/Heading';

export function AboutHeader() {
  return (
    <header className='space-y-6'>
      <Heading as='h1'>Hey, I&apos;m Luis! 👋</Heading>

      <div className='max-w-3xl space-y-4 leading-relaxed'>
        <p>
          I am a Computer Science student at UFSM and a full-stack developer.
          Since I started programming in 2022, I have focused on building clear,
          reliable software with an emphasis on quality and maintainability.
        </p>

        <p>
          I prefer statically typed languages such as{' '}
          <strong>TypeScript</strong> and <strong>Go</strong>, and work mainly
          across frontend and backend development. I am also interested in
          DevOps and infrastructure, use Linux daily, and enjoy understanding
          how systems work under the hood.
        </p>
      </div>
    </header>
  );
}
