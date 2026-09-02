import Link from 'next/link';
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from 'lucide-react';
import { SOCIAL } from '@/config/constants';

const socialLinks = [
  {
    name: 'Email',
    href: `mailto:${SOCIAL.email}`,
    icon: MailIcon,
  },
  {
    name: 'GitHub',
    href: `https://github.com/${SOCIAL.github}`,
    icon: GithubIcon,
  },
  {
    name: 'LinkedIn',
    href: `https://linkedin.com/in/${SOCIAL.linkedin}`,
    icon: LinkedinIcon,
  },
  {
    name: 'Instagram',
    href: `https://instagram.com/${SOCIAL.instagram}`,
    icon: InstagramIcon,
  },
] as const;

export function Footer() {
  return (
    <footer className='py-5'>
      <nav aria-label='Social links'>
        <ul className='flex items-center justify-center gap-3 sm:gap-7'>
          {socialLinks.map(({ name, href, icon: Icon }) => {
            const isExternal = href.startsWith('http');

            return (
              <li key={name}>
                <Link
                  href={href}
                  aria-label={name}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className='group inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-sm font-medium lowercase text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-0 sm:min-w-0 sm:gap-1.5 sm:rounded-sm'
                >
                  <span aria-hidden='true' className='hidden sm:inline'>
                    {name}
                  </span>
                  <Icon
                    aria-hidden='true'
                    className='size-5 shrink-0 sm:size-4 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100'
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
