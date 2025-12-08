import { Metadata } from 'next';
import { siteConfig } from './siteMetadata';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  // keywords: siteConfig.keywords,

  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],

  creator: siteConfig.author.name,

  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.ogImageAlt,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter,
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
  const url = `${siteConfig.url}/post/${slug}`;
  const ogImage = coverImage || siteConfig.ogImage;
  const description = excerpt || siteConfig.description;

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
      authors: [siteConfig.author.name],
      siteName: siteConfig.name,
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
      creator: siteConfig.social.twitter,
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
  const url = `${siteConfig.url}/projects/${slug}`;
  const ogImage = coverImage || siteConfig.ogImage;

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
      siteName: siteConfig.name,
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
      creator: siteConfig.social.twitter,
    },
  };
}
