import { AboutHeader } from '@/components/about/AboutHeader';
import { ResumeSection } from '@/components/about/ResumeSection';
import { SocialLinks } from '@/components/about/SocialLinks';

export default function AboutPage() {
  return (
    <section className='mb-16'>
      <div className='flex flex-col gap-8 max-w-2xl mx-auto'>
        <AboutHeader />
        <div className='flex flex-col gap-6'>
          <p className='leading-relaxed'>
            Olá, sou o Luis Fernando, prazer! 👋
          </p>
          <p>
            Sou estudante de Ciência da Computação na Universidade Federal de
            Santa Maria, atualmente no 6º semestre. Tenho 21 anos e comecei a
            programar em 2022, no final do meu ensino médio.
          </p>
          <p>
            Gosto de programar especialmente em linguagens tipadas como
            TypeScript e Go. Também tenho interesse em DevOps e infraestrutura,
            uso Linux há alguns anos e é algo ao qual dedico bastante tempo.
            Atualmente, meus principais objetivos de estudo se relacionam com
            aprender a construir aplicações completas e melhorar minhas
            habilidades em backend e sistemas distribuídos.
          </p>
          <p>
            Construí esse site com muito amor e usando tudo que eu gosto,
            pretendo mantê-lo atualizado com meus projetos e pensamentos sobre
            tecnologia. Sinta-se à vontade para explorar e entrar em contato!
          </p>
        </div>
        <SocialLinks />
        <ResumeSection />
      </div>
    </section>
  );
}
