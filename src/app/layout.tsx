import { Inter, Bricolage_Grotesque } from 'next/font/google';

import type { Metadata } from 'next';
import './globals.css';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastifyContainer } from '@/components/ui/ToastifyContainer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'Blog Markdown Next.js + TypeScript',
    template: '%s | Blog Markdown',
  },
  description: 'Blog built with Next.js and TypeScript for Markdown content',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage-grotesque',
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang='pt-BR'
      className={`${inter.variable} ${bricolageGrotesque.variable}`}
      suppressHydrationWarning
    >
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
