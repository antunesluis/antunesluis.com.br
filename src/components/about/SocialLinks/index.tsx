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
  color: string;
};

const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/antunesluis',
    icon: GithubIcon,
    color: 'hover:text-slate-900',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/luisantuness',
    icon: LinkedinIcon,
    color: 'hover:text-blue-600',
  },
  {
    name: 'Email',
    url: 'mailto:antunesluisbr@gmail.com',
    icon: MailIcon,
    color: 'hover:text-emerald-600',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/aantunesluis/',
    icon: InstagramIcon,
    color: 'hover:text-pink-600',
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
                text-slate-600 ${social.color}
                bg-slate-50 hover:bg-slate-100
                rounded-lg border border-slate-200
                transition-all duration-200 ease-in-out
                hover:shadow-sm hover:border-slate-300
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
