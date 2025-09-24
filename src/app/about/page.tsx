import { AboutHeader } from '@/components/about/AboutHeader';
import { ResumeSection } from '@/components/about/ResumeSection';
import { SocialLinks } from '@/components/about/SocialLinks';

export default function AboutPage() {
  return (
    <section className='mb-16'>
      <div className='flex flex-col gap-8 max-w-2xl mx-auto'>
        <AboutHeader />

        <div className='flex flex-col gap-6'>
          <p className='text-slate-800 leading-relaxed'>
            Olá, sou o Luis Fernando! 👋
          </p>

          <p>
            Estudante de Ciência da Computação na Universidade Federal de Santa
            Maria, atualmente no 4º semestre. Sou apaixonado por desenvolvimento
            web e estou sempre em busca de novos desafios para expandir minhas
            habilidades técnicas.
          </p>

          <p>
            Quando não estou programando, exploro novas tecnologias, contribuo
            para projetos open source e estudo sobre design e experiência do
            usuário. Acredito que a combinação de código limpo com design
            pensado é essencial para criar produtos digitais excepcionais.
          </p>
        </div>

        <SocialLinks />
        <ResumeSection />
      </div>
    </section>
  );
}
