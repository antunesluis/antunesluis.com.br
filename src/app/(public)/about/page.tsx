import { BreadcrumbSchema, PersonSchema } from '@/components/seo';
import { Heading } from '@/components/ui/Heading';
import {
  AboutAsciiBird,
  AboutHeader,
  Experience,
  ResumeSection,
} from '@/features/about';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = createMetadata({
  title: 'About',
  description:
    'Luis Fernando Antunes is a Computer Science student at UFSM and a full-stack developer working with TypeScript, React, Next.js, and Go.',
  pathname: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PersonSchema />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
        ]}
      />

      <div>
        <article className='mx-auto mb-16 flex flex-col gap-8 sm:mb-20'>
          <AboutHeader />

          <div className='grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10'>
            <AboutAsciiBird className='order-1 lg:order-2' />

            <div className='order-2 space-y-8 lg:order-1'>
              <section className='space-y-4'>
                <Heading as='h2'>Experience</Heading>
                <Experience />
              </section>

              <section className='space-y-4'>
                <Heading as='h2'>Resume</Heading>
                <ResumeSection />
              </section>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
