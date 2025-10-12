import Link from 'next/link';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';
import { Heading } from '@/components/ui/Heading';

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
    colorLight: 'hover:text-slate-900',
    colorDark: 'dark:hover:text-slate-100',
  },
];

export function SocialLinks() {
  return (
    <div className='space-y-4'>
      <Heading as='h3'>Vamos nos conectar!</Heading>
      <div className='flex flex-wrap gap-4'>
        {socialLinks.map(social => {
          const Icon = social.icon;
          return (
            <Link
              key={social.name}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              className={`
                flex items-center gap-2 px-4 py-2
                text-slate-600 dark:text-slate-300
                ${social.colorLight} ${social.colorDark}
                bg-slate-50 hover:bg-slate-100
                dark:bg-slate-800 dark:hover:bg-slate-700
                rounded-lg border border-slate-200 dark:border-slate-700
                transition-all duration-200 ease-in-out
                hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-600
                text-sm font-medium
              `}
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
