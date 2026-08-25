import { useEffect } from 'react';

// This is a client-rendered SPA (Vite + React Router, no SSR/prerendering),
// so index.html's static <title>/<meta> tags would otherwise apply
// identically to every route — the single biggest SEO gap for an app built
// this way. This hook lets each page set its own title/description/social
// tags once it mounts.
//
// Implemented as plain DOM mutation (find-existing-or-create-once, then set
// content) rather than relying on React 19's newer automatic <title>/<meta>
// hoisting — this guarantees exactly one of each tag ever exists (no risk
// of a second copy alongside the ones already hard-coded in index.html,
// which stay there as the fallback for crawlers/link-unfurlers that don't
// execute JS at all). Same "hand-rolled over framework magic" approach as
// ShoutoutModal's own focus trap and EventDetail's own lightbox elsewhere
// in this codebase.
//
// IMPORTANT: SITE_URL points at the site's actual current production
// origin. It is NOT mariettanepalisamaj.org — per wrangler.toml's own
// comment, that custom domain isn't attached yet. Update this the same
// day the custom domain goes live, alongside the Worker's ALLOWED_ORIGIN.
const SITE_URL = 'https://mns-hazel.vercel.app';
const SITE_NAME = 'Marietta Nepali Samaj';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface PageMetaOptions {
  /** Page-specific title. The site name is appended automatically (skip
   *  that by passing `appendSiteName: false`, used only for the homepage). */
  title: string;
  description: string;
  /** Path from the site root, e.g. "/about" — drives canonical + og:url. */
  path: string;
  /** Absolute image URL for link previews. Defaults to the site's general
   *  share image (og-image.jpg, public/) when omitted. */
  image?: string;
  appendSiteName?: boolean;
  /** For transactional/confirmation pages (donation-success, donation-
   *  cancelled) that shouldn't be indexed or show up in search results. */
  noindex?: boolean;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let tag = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

export function usePageMeta({ title, description, path, image, appendSiteName = true, noindex = false }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = appendSiteName ? `${title} | ${SITE_NAME}` : title;
    const url = `${SITE_URL}${path}`;
    const ogImage = image || DEFAULT_OG_IMAGE;

    document.title = fullTitle;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setLinkTag('canonical', url);

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', SITE_NAME);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
  }, [title, description, path, image, appendSiteName, noindex]);
}
