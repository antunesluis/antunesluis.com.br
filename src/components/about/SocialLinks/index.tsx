import Link from 'next/link';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';
import { Heading } from '@/components/ui/Heading';
import clsx from 'clsx';

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
    <div className='space-y-4'>
      <Heading as='h3'>Vamos nos conectar!</Heading>
      <div className='flex flex-wrap gap-4 justify-center sm:justify-start'>
        {socialLinks.map(social => {
          const Icon = social.icon;
          return (
            <Link
              key={social.name}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              className={clsx(
                'flex items-center gap-2 px-4 py-2',
                'text-foreground text-sm font-medium',
                'bg-muted hover:bg-muted/70 border border-border rounded-lg',
                'hover:shadow-sm transition-all duration-200',
                social.colorLight,
                social.colorDark,
              )}
            >
              <Icon className='w-4 h-4' />
              {social.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
