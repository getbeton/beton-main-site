import { SITE } from './site';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const mainNav: NavLink[] = [
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'About', href: '/about/' },
  { label: 'Team', href: '/team/' },
];

export const externalNav: NavLink[] = [
  { label: 'Blog', href: SITE.external.blog, external: true },
  { label: 'GitHub', href: SITE.social.github, external: true },
];

export const footerNav = {
  company: [
    { label: 'Pricing', href: '/pricing/' },
    { label: 'About', href: '/about/' },
    { label: 'Team', href: '/team/' },
    { label: 'Blog', href: SITE.external.blog, external: true },
  ] as NavLink[],
  resources: [
    { label: 'GitHub', href: SITE.social.github, external: true },
    { label: 'App', href: SITE.external.app, external: true },
  ] as NavLink[],
  legal: [
    { label: 'Terms and Conditions', href: '/terms/' },
    { label: 'Privacy Policy', href: '/privacy/' },
  ] as NavLink[],
};

export const socialLinks = [
  { label: 'GitHub', href: SITE.social.github, icon: 'github' },
  { label: 'LinkedIn', href: SITE.social.linkedin, icon: 'linkedin' },
  { label: 'X', href: SITE.social.twitter, icon: 'twitter' },
] as const;
