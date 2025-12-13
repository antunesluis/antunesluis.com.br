import {
  MY_NAME,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  SITE_LOCALE,
  SITE_URL,
  SOCIAL,
  SITE_KEYWORDS,
} from '@/config/constants';
import { Metadata } from 'next';

type CreateMetadataOptions = {
  pathname?: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  tags?: string[];
} & Partial<Metadata>;

export function createMetadata(options: CreateMetadataOptions): Metadata {
  const {
    pathname = '/',
    title,
    description,
    image = OG_IMAGE_URL,
    type = 'website',
    publishedTime,
    author,
    tags,
    ...rest
  } = options;

  const url = `${SITE_URL}${pathname}`;
  const pageTitle = `${title} - ${MY_NAME}`;

  return {
    title: pageTitle,
    description,
    keywords: tags ? [...SITE_KEYWORDS, ...tags] : SITE_KEYWORDS,
    authors: {
      name: author || MY_NAME,
      url: SITE_URL,
    },
    creator: MY_NAME,
    publisher: MY_NAME,
    manifest: `${SITE_URL}/manifest.json`,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
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
    openGraph: {
      type,
      locale: SITE_LOCALE,
      url,
      title: pageTitle,
      description,
      siteName: MY_NAME,
      images: [
        {
          url: image,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
          type: OG_IMAGE_TYPE,
        },
      ],
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            authors: [author || MY_NAME],
            ...(tags && { tags }),
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image],
      creator: SOCIAL.twitter,
    },
    icons: {
      icon: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          url: '/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
          sizes: 'any',
        },
        {
          rel: 'icon',
          type: 'image/png',
          url: '/icon-192.png',
          sizes: '192x192',
        },
        {
          rel: 'icon',
          type: 'image/png',
          url: '/icon-512.png',
          sizes: '512x512',
        },
      ],
      apple: [
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/apple-icon.png',
          sizes: '180x180',
        },
      ],
    },
    ...rest,
  };
}
