import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';
import clsx from 'clsx';
import { ButtonLink } from '@/components/ui/ButtonLink';

type SocialLink = {
  name: string;
  url: string;
  icon: React.ElementType;
  colorLight: string;
  colorDark: string;
};

const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/luisantuness',
    icon: LinkedinIcon,
    colorLight: 'hover:text-blue-600',
    colorDark: 'dark:hover:text-blue-400',
  },
  {
    name: 'Email',
    url: 'mailto:antunesluisbr@gmail.com',
    icon: MailIcon,
    colorLight: 'hover:text-emerald-600',
    colorDark: 'dark:hover:text-emerald-400',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/aantunesluis/',
    icon: InstagramIcon,
    colorLight: 'hover:text-pink-600',
    colorDark: 'dark:hover:text-pink-400',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/antunesluis',
    icon: GithubIcon,
    colorLight: 'hover:text-slate-400',
    colorDark: 'dark:hover:text-slate-300',
  },
];

export function SocialLinks() {
  return (
    <div className='flex flex-wrap gap-4 justify-center sm:justify-start'>
      {socialLinks.map(({ name, url, icon: Icon, colorLight, colorDark }) => (
        <ButtonLink
          key={name}
          href={url}
          target='_blank'
          variant='ghost'
          size='sm'
          className={clsx('gap-2', colorLight, colorDark)}
        >
          <Icon className='w-4 h-4' />
          {name}
        </ButtonLink>
      ))}
    </div>
  );
}
