import { SITE } from './site';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const mainNav: NavLink[] = [
  { label: 'Use Cases', href: '/use-cases/' },
  { label: 'Industries', href: '/industries/' },
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
    { label: 'AI Agents', href: '/for/' },
    { label: 'Alternatives', href: '/alternatives/' },
    { label: 'GitHub', href: SITE.social.github, external: true },
    { label: 'App', href: SITE.external.app, external: true },
  ] as NavLink[],
  comparisons: [
    { label: 'Beton vs Pocus', href: '/alternatives/pocus/' },
    { label: 'Beton vs MadKudu', href: '/alternatives/madkudu/' },
    { label: 'Beton vs Common Room', href: '/alternatives/common-room/' },
    { label: 'Beton vs Breadcrumbs', href: '/alternatives/breadcrumbs/' },
    { label: 'Beton vs Clay', href: '/alternatives/clay/' },
    { label: 'Beton vs Excel/Sheets', href: '/alternatives/excel-google-sheets/' },
    { label: 'Beton vs Claude Code', href: '/alternatives/claude-code/' },
    { label: 'Beton vs OpenClaw', href: '/alternatives/openclaw/' },
    { label: 'Beton vs Cursor', href: '/alternatives/cursor/' },
    { label: 'Beton vs Claude Cowork', href: '/alternatives/claude-cowork/' },
    { label: 'Pocus vs MadKudu', href: '/compare/pocus-vs-madkudu/' },
    { label: 'Pocus vs Common Room', href: '/compare/pocus-vs-common-room/' },
    { label: 'Clay vs MadKudu', href: '/compare/clay-vs-madkudu/' },
  ] as NavLink[],
  agents: [
    { label: 'Beton + Claude Code', href: '/for/claude-code/' },
    { label: 'Beton + Cursor', href: '/for/cursor/' },
    { label: 'Beton + Gemini CLI', href: '/for/gemini/' },
    { label: 'Beton + OpenClaw', href: '/for/openclaw/' },
    { label: 'Beton + Windsurf', href: '/for/windsurf/' },
    { label: 'Beton + Cline', href: '/for/cline/' },
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
