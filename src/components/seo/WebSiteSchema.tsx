import { JsonLd } from '@/components/seo/JsonLd';
import {
  SITE_URL,
  FULL_NAME,
  MY_NAME,
  SITE_DESCRIPTION,
} from '@/config/constants';
import type { WebSite, WithContext } from 'schema-dts';

export function WebSiteSchema() {
  const schema: WithContext<WebSite> = {
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
  };

  return <JsonLd data={schema} />;
}
