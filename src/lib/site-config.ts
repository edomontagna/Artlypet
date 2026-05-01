/**
 * Site-wide config — single source of truth for URLs, contact addresses, and brand identifiers.
 * In production, override via Vite env vars (VITE_SITE_URL, VITE_EMAIL_*).
 *
 * Why centralised: previously SITE_URL was duplicated across 6 files and 5 emails were scattered
 * through pages and edge functions. A domain change or rebrand was a search-and-replace nightmare.
 */

const env = import.meta.env;

export const SITE_URL: string =
  (env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") || "https://artlypet.com";

export const SITE_NAME = "Artlypet";

export const CONTACT = {
  /** General inquiries, contact form */
  info: (env.VITE_EMAIL_INFO as string | undefined) || "info@artlypet.com",
  /** Bug reports, technical support */
  support: (env.VITE_EMAIL_SUPPORT as string | undefined) || "support@artlypet.com",
  /** GDPR / privacy requests */
  privacy: (env.VITE_EMAIL_PRIVACY as string | undefined) || "privacy@artlypet.com",
  /** Legal / terms inquiries */
  legal: (env.VITE_EMAIL_LEGAL as string | undefined) || "legal@artlypet.com",
  /** B2B sales / partnership inquiries */
  business: (env.VITE_EMAIL_BUSINESS as string | undefined) || "business@artlypet.com",
} as const;

export const SOCIAL = {
  instagram: "https://instagram.com/artlypet",
  twitter: "https://x.com/artlypet",
  facebook: "https://facebook.com/artlypet",
  tiktok: "https://tiktok.com/@artlypet",
} as const;

/** Build a fully-qualified URL on the canonical site domain */
export const siteUrl = (path = "/"): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};
