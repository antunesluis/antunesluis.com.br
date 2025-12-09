import { Metadata } from 'next';
import { siteMetadata } from './siteMetadata';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),

  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.name}`,
  },

  description: siteMetadata.description,
  // keywords: siteConfig.keywords,

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

export function generatePostMetadata({
  title,
  excerpt,
  slug,
  coverImage,
  publishedAt,
}: {
  title: string;
  excerpt?: string | null;
  slug: string;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
}): Metadata {
  const url = `${siteMetadata.url}/post/${slug}`;
  const ogImage = coverImage || siteMetadata.ogImage;
  const description = excerpt || siteMetadata.description;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: publishedAt
        ? new Date(publishedAt).toISOString()
        : undefined,
      authors: [siteMetadata.author.name],
      siteName: siteMetadata.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteMetadata.social.twitter,
    },
  };
}

export function generateProjectMetadata({
  name,
  description,
  slug,
  coverImage,
}: {
  name: string;
  description: string;
  slug: string;
  coverImage?: string | null;
}): Metadata {
  const url = `${siteMetadata.url}/projects/${slug}`;
  const ogImage = coverImage || siteMetadata.ogImage;

  return {
    title: {
      absolute: name,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title: name,
      description,
      siteName: siteMetadata.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: [ogImage],
      creator: siteMetadata.social.twitter,
    },
  };
}
