import { ButtonLink } from '@/components/ui';
import { StatusAsciiBird, StatusPage } from '@/features/status';
import { ArrowLeftIcon } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Página não encontrada',
};

export default function NotFoundPage() {
  return (
    <StatusPage
      statusCode='404'
      title='Página não encontrada'
      content='A página que você está tentando acessar não existe ou foi movida.'
      actions={
        <ButtonLink href='/' size='md' className='min-h-12'>
          <ArrowLeftIcon aria-hidden='true' />
          Voltar ao início
        </ButtonLink>
      }
      visual={<StatusAsciiBird variant='not-found' />}
    />
  );
}
