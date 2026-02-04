import { Heading } from '@/components/ui/Heading';
import Image from 'next/image';

export function AboutHeader() {
  return (
    <div className='flex flex-col md:flex-row gap-8 items-start'>
      <div className='w-full md:w-84 shrink-0'>
        <div className='relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg ring-1 ring-border'>
          <Image
            src='/images/hero-bw.jpg'
            alt='Luis Fernando Antunes'
            width={336}
            height={336}
            className='object-cover'
            priority
            sizes='(max-width: 768px) 100vw, 336px'
          />
        </div>
      </div>

      <div className='flex-1 space-y-6'>
        <Heading as='h1' className='md:text-5xl/tight'>
          /about
        </Heading>

        <div className='space-y-4 text-foreground leading-relaxed'>
          <p>
            Tenho 21 anos e estou no 6º semestre de Ciência da Computação na
            UFSM. Comecei a programar em 2022 e desde então venho me dedicando a
            aprender e construir coisas incríveis com código.
          </p>

          <p>
            Minha paixão é desenvolver com linguagens tipadas como{' '}
            <strong>TypeScript</strong> e <strong>Go</strong>. Também tenho
            grande interesse em DevOps e infraestrutura — uso Linux há alguns
            anos e dedico bastante tempo explorando esse universo.
          </p>

          <p>
            Atualmente, foco em aprender a construir aplicações completas e
            aprimorar minhas habilidades em backend e sistemas distribuídos.
          </p>
        </div>
      </div>
    </div>
  );
}
