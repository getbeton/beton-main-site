import { SITE } from './site';

export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE.title;
  return `${pageTitle} | ${SITE.name}`;
}

export function buildCanonicalUrl(path: string): string {
  const base = SITE.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const withSlash = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${base}${withSlash}`;
}

export function buildOgImageUrl(ogImage?: string): string {
  if (ogImage) {
    if (ogImage.startsWith('http')) return ogImage;
    return `${SITE.url}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  }
  return `${SITE.url}/og-default.png`;
}
