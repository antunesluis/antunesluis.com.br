'use client';

import { Button, ButtonLink } from '@/components/ui';
import { StatusAsciiBird, StatusPage } from '@/features/status';
import { ArrowLeftIcon, RotateCcwIcon } from 'lucide-react';

type RootErrorPageProps = {
  reset: () => void;
};

export default function RootErrorPage({ reset }: RootErrorPageProps) {
  return (
    <StatusPage
      statusCode='500'
      title='Algo deu errado!'
      content='Ocorreu um erro interno do qual a aplicação não conseguiu se recuperar. Tente recarregar a página ou volte mais tarde.'
      actions={
        <>
          <Button
            type='button'
            size='md'
            className='min-h-12 rounded-lg'
            onClick={reset}
          >
            <RotateCcwIcon aria-hidden='true' />
            Tentar novamente
          </Button>

          <ButtonLink href='/' variant='ghost' size='md' className='min-h-12'>
            <ArrowLeftIcon aria-hidden='true' />
            Voltar ao início
          </ButtonLink>
        </>
      }
      visual={<StatusAsciiBird variant='error' />}
    />
  );
}
