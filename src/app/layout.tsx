import { Inter, Bricolage_Grotesque } from 'next/font/google';

import type { Metadata } from 'next';
import './globals.css';
import { Container } from '@/components/Container';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastifyContainer } from '@/components/ToastifyContainer';

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
    >
      <body suppressHydrationWarning={true}>
        <Container>
          <Header />

          {children}

          <Footer />
        </Container>

        <ToastifyContainer />
      </body>
    </html>
  );
}
