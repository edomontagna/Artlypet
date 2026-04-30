import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SITE_URL } from "@/lib/site-config";

const SUPPORTED_LANGUAGES = ["en", "it", "de", "fr", "es"];

const DEFAULT_TITLE = "Artlypet — AI Pet Portraits";
const DEFAULT_DESCRIPTION =
  "Transform your pet's photo into stunning AI-generated art portraits. Choose from 12+ art styles. Free to start.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-cover.webp`;

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
}

const setMetaTag = (
  attribute: string,
  value: string,
  content: string
): void => {
  let element = document.querySelector(
    `meta[${attribute}="${value}"]`
  ) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setLinkTag = (rel: string, href: string, attrs?: Record<string, string>): HTMLLinkElement => {
  const selector = attrs
    ? `link[rel="${rel}"]` + Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join("")
    : `link[rel="${rel}"]`;
  let element = document.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => element!.setAttribute(k, v));
    }
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
  return element;
};

const removeLinkTags = (rel: string, attrs?: Record<string, string>): void => {
  const selector = attrs
    ? `link[rel="${rel}"]` + Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join("")
    : `link[rel="${rel}"]`;
  document.querySelectorAll(selector).forEach((el) => el.remove());
};

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
}: SEOHeadProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.substring(0, 2) || "en";

  // Update document lang attribute
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Update meta tags
  useEffect(() => {
    const fullCanonical = canonical.startsWith("http")
      ? canonical
      : `${SITE_URL}${canonical}`;
    const fullOgImage = ogImage || DEFAULT_OG_IMAGE;

    // Title
    document.title = title;

    // Meta description
    setMetaTag("name", "description", description);

    // Canonical
    setLinkTag("canonical", fullCanonical);

    // Open Graph
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", fullCanonical);
    setMetaTag("property", "og:image", fullOgImage);

    // Twitter Card
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", fullOgImage);

    // Hreflang tags
    const pathWithoutLang = canonical.startsWith("http")
      ? new URL(canonical).pathname
      : canonical;

    SUPPORTED_LANGUAGES.forEach((lang) => {
      setLinkTag("alternate", `${SITE_URL}${pathWithoutLang}`, {
        hreflang: lang,
      });
    });
    setLinkTag("alternate", `${SITE_URL}${pathWithoutLang}`, {
      hreflang: "x-default",
    });

    // Cleanup on unmount — restore defaults
    return () => {
      document.title = DEFAULT_TITLE;
      setMetaTag("name", "description", DEFAULT_DESCRIPTION);
      setMetaTag("property", "og:title", DEFAULT_TITLE);
      setMetaTag("property", "og:description", DEFAULT_DESCRIPTION);
      setMetaTag("property", "og:type", "website");
      setMetaTag("property", "og:url", SITE_URL);
      setMetaTag("property", "og:image", DEFAULT_OG_IMAGE);
      setMetaTag("name", "twitter:title", DEFAULT_TITLE);
      setMetaTag("name", "twitter:description", DEFAULT_DESCRIPTION);
      setMetaTag("name", "twitter:image", DEFAULT_OG_IMAGE);
      setLinkTag("canonical", SITE_URL);

      // Remove hreflang tags
      SUPPORTED_LANGUAGES.forEach((lang) => {
        removeLinkTags("alternate", { hreflang: lang });
      });
      removeLinkTags("alternate", { hreflang: "x-default" });
    };
  }, [title, description, canonical, ogImage, ogType]);

  return null;
};
