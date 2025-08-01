import type { Metadata } from 'next';
import './globals.css';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: {
    default: 'Blog Markdown Next.js + TypeScript',
    template: '%s | Blog Markdown',
  },
  description: 'Blog built with Next.js and TypeScript for Markdown content',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang='pt-BR'>
      <body>
        <Container>
          <Header />

          {children}

          <footer className='text-4xl font-bold text-center py-8'>
            <p>Footer</p>
          </footer>
        </Container>
      </body>
    </html>
  );
}
