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
        <div className='flex flex-col gap-8 max-w-2xl mx-auto'>
          <AboutHeader />
          <div className='flex flex-col gap-6'>
            <p>Olá, sou o Luis Fernando, prazer! 👋</p>
            <p>
              Sou estudante de Ciência da Computação na Universidade Federal de
              Santa Maria, atualmente no 6º semestre. Tenho 21 anos e comecei a
              programar em 2022, no final do meu ensino médio.
            </p>
            <p>
              Gosto de programar especialmente em linguagens tipadas como
              TypeScript e Go. Também tenho interesse em DevOps e
              infraestrutura, uso Linux há alguns anos e é algo ao qual dedico
              bastante tempo. Atualmente, meus principais objetivos de estudo se
              relacionam com aprender a construir aplicações completas e
              melhorar minhas habilidades em backend e sistemas distribuídos.
            </p>
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
