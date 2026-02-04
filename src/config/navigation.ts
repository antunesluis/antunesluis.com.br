export interface NavigationLink {
  href: string;
  label: string;
}

export const navigationLinks: NavigationLink[] = [
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/projects',
    label: 'Projects',
  },
  {
    href: '/about',
    label: 'About',
  },
];
