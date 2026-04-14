import { SITE } from './site';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const mainNav: NavLink[] = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Integrations', href: '/integrations/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'About', href: '/about/' },
  { label: 'Team', href: '/team/' },
];

export const externalNav: NavLink[] = [
  { label: 'GitHub', href: SITE.social.github, external: true },
];

export const footerNav = {
  company: [
    { label: 'Pricing', href: '/pricing/' },
    { label: 'About', href: '/about/' },
    { label: 'Team', href: '/team/' },
    { label: 'Blog', href: '/blog/' },
  ] as NavLink[],
  tools: [
    { label: 'seqd', href: '/seqd/' },
    { label: 'openclaw-gtm-skills', href: 'https://github.com/getbeton/openclaw-gtm-skills', external: true },
  ] as NavLink[],
  resources: [
    { label: 'GitHub', href: SITE.social.github, external: true },
    { label: 'App', href: SITE.external.app, external: true },
    { label: 'llms.txt', href: '/llms.txt' },
    { label: 'Sell to Scientists', href: 'https://www.selltoscientists.com', external: true },
    { label: 'Sell to State', href: 'https://www.selltostate.com', external: true },
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
