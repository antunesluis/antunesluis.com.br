import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastifyContainer } from '@/components/ui/ToastifyContainer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { createMetadata } from '@/lib/metadata';

const inter_font = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const bricolage_grotesque_font = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage-grotesque',
});

const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
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
      className={`${inter_font.variable} ${jetbrains_mono.variable} ${bricolage_grotesque_font.variable}`}
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
            <main id='main-content'>{children}</main>
            <Footer />
          </Container>
          <ToastifyContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
