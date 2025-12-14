export const MY_NAME = 'Luis Antunes';
export const FULL_NAME = 'Luis Fernando Antunes';
export const SITE_TITLE = 'Luis Antunes - Desenvolvedor Full Stack';
export const SITE_DESCRIPTION =
  'Blog pessoal sobre desenvolvimento de software, tecnologia e projetos. Estudante de Ciência da Computação na UFSM.';
export const SITE_LOCALE = 'pt_BR';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://antunesluis.com.br';

export const SOCIAL = {
  twitter: '@aantunesluis',
  github: 'antunesluis',
  email: 'antunesluisbr@gmail.com',
  linkedin: 'luisantuness',
} as const;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = 'image/png';
export const OG_IMAGE_ALT = 'Luis Fernando Antunes - Blog';
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export const SITE_KEYWORDS = [
  'desenvolvimento web',
  'programação',
  'typescript',
  'react',
  'next.js',
  'full stack',
  'blog de tecnologia',
  'ciência da computação',
  'UFSM',
  'golang',
  'devops',
  'linux',
];
