import { JsonLd } from '@/components/seo/JsonLd';
import {
  SITE_URL,
  FULL_NAME,
  MY_NAME,
  SITE_DESCRIPTION,
} from '@/config/constants';

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: MY_NAME,
    alternateName: FULL_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: ['pt-BR', 'en-US'],
    image: `${SITE_URL}/og-image.png`,
    author: {
      '@type': 'Person',
      name: FULL_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: FULL_NAME,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={schema} />;
}
