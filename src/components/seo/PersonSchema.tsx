import { JsonLd } from './JsonLd';
import { SITE_URL, FULL_NAME, MY_NAME, SOCIAL } from '@/config/constants';

export function PersonSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: FULL_NAME,
    alternateName: MY_NAME,
    url: SITE_URL,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      caption: 'Luis Antunes Profile Picture',
    },
    jobTitle: 'Full Stack Developer',
    description:
      'Computer Science student at UFSM. Full Stack Developer specialized in TypeScript, React, Next.js and Go.',
    knowsAbout: [
      'Web Development',
      'TypeScript',
      'React',
      'Next.js',
      'Go',
      'DevOps',
      'Linux',
      'Full Stack Development',
    ],
    email: SOCIAL.email,
    sameAs: [
      `https://github.com/${SOCIAL.github}`,
      `https://twitter.com/${SOCIAL.twitter}`,
      `https://www.linkedin.com/in/${SOCIAL.linkedin}`,
    ],
  };

  return <JsonLd data={schema} />;
}
