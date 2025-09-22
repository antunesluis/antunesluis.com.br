import ErrorMessage from '@/components/ui/ErrorMessage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFoundPage() {
  return (
    <ErrorMessage
      statusCode='404'
      title='Página não encontrada'
      content='A página que você está tentando acessar não existe ou foi movida.'
    />
  );
}
