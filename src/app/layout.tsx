import { Space_Grotesk } from 'next/font/google';

import type { Metadata } from 'next';
import './globals.css';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastifyContainer } from '@/components/ui/ToastifyContainer';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { siteMetadata } from '@/config/siteMetadata';

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.name}`,
  },

  description: siteMetadata.description,

  authors: [
    {
      name: siteMetadata.author.name,
      url: siteMetadata.url,
    },
  ],

  creator: siteMetadata.author.name,

  openGraph: {
    type: 'website',
    locale: siteMetadata.locale,
    url: siteMetadata.url,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.name,
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: siteMetadata.ogImageAlt,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.ogImage],
    creator: siteMetadata.social.twitter,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  manifest: '/manifest.json',
};

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
