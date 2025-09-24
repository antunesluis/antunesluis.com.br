export interface NavigationLink {
  href: string;
  label: string;
}

export const navigationLinks: NavigationLink[] = [
  {
    href: '/',
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
