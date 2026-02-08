import { BreadcrumbSchema, PersonSchema } from '@/components/seo';
import { Heading } from '@/components/ui';
import { AboutHeader, ResumeSection, SocialLinks } from '@/features/about';
import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = createMetadata({
  title: 'Sobre',
  description:
    'Luis Fernando Antunes - Estudante de Ciência da Computação na UFSM. Desenvolvedor Full Stack especializado em TypeScript, React, Next.js e Go.',
  pathname: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PersonSchema />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Sobre', url: '/about' },
        ]}
      />

      <main>
        <article className='flex flex-col gap-8 mx-auto mb-24'>
          <AboutHeader />

          <section className='flex flex-col gap-4'>
            <Heading as='h2'>Site</Heading>
            <p>
              This website was built using several of the tools I enjoy the
              most, and I plan to keep it constantly updated with my projects
              and ideas about technology. Feel free to explore the content and
              get in touch!
            </p>
          </section>

          <section className='space-y-4'>
            <Heading as='h2'>Let’s connect!</Heading>
            <SocialLinks />
          </section>

          <section className='space-y-4'>
            <Heading as='h2'>Resume</Heading>
            <ResumeSection />
          </section>
        </article>
      </main>
    </>
  );
}
