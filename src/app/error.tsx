'use client';

import ErrorMessage from '@/components/ErrorMessage';

export default function RootErrorPage() {
  return (
    <ErrorMessage
      statusCode={501}
      title='Algo deu errado!'
      content='Ocorreu um erro interno do qual a aplicação não conseguiu se recuperar. Tente recarregar a página ou volte mais tarde.'
    />
  );
}
