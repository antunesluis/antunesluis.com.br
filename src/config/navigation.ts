export interface NavigationLink {
  href: string;
  label: string;
}

export const navigationLinks: NavigationLink[] = [
  {
    href: '/post',
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
