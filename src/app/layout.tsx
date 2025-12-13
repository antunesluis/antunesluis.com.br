import { Space_Grotesk } from 'next/font/google';

import type { Metadata } from 'next';
import './globals.css';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastifyContainer } from '@/components/ui/ToastifyContainer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { createMetadata } from '@/lib/metadata';

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description:
    'Blog pessoal sobre desenvolvimento de software, tecnologia e projetos. Estudante de Ciência da Computação na UFSM.',
  pathname: '/',
});

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang='pt-BR'
      className={`${space_grotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name='theme-color' content='#1e293b' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Luis Antunes' />
      </head>

      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Container>
            <Header />

            {children}

            <Footer />
          </Container>

          <ToastifyContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
