import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { createMetadata } from '@/lib/metadata';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Container, Header, Footer } from '@/components/layout';

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  preload: false,
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name='theme-color' content='#08070b' />
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
            <a
              href='#main-content'
              className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-md'
            >
              Pular para o conteúdo principal
            </a>
            <Header />
            <main id='main-content' className='flex min-h-0 flex-1 flex-col'>
              {children}
            </main>
            <Footer />
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
