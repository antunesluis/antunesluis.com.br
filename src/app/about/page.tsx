import { AboutHeader } from '@/components/about/AboutHeader';
import { ResumeSection } from '@/components/about/ResumeSection';
import { SocialLinks } from '@/components/about/SocialLinks';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { PersonSchema } from '@/components/seo/PersonSchema';
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

      <section className='mb-16'>
        <div className='flex flex-col gap-8 mx-auto'>
          <AboutHeader />
          <div className='flex flex-col gap-6'>
            <p>
              Este site foi desenvolvido com diversas das ferramentas que mais
              gosto, e pretendo mantê-lo sempre atualizado com meus projetos e
              ideias sobre tecnologia. Fique à vontade para explorar o conteúdo
              e entrar em contato!
            </p>
          </div>
          <SocialLinks />
          <ResumeSection />
        </div>
      </section>
    </>
  );
}
