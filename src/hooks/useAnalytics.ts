import { useEffect, useState } from "react";
import { getConsent } from "@/components/CookieBanner";

const COOKIE_KEY = "artlypet-cookie-consent";

const initGA = () => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId && !document.querySelector(`script[src*="googletagmanager"]`)) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId);
    }
};

const initPixel = () => {
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (pixelId && !window.fbq) {
      const f = window as Record<string, unknown>;
      const n = (f.fbq = function fbq() {
        // eslint-disable-next-line prefer-rest-params
        (n as { callMethod?: (...a: unknown[]) => void; queue: unknown[] }).callMethod
          ? (n as { callMethod: (...a: unknown[]) => void }).callMethod.apply(n, arguments as unknown as unknown[])
          : (n as { queue: unknown[] }).queue.push(arguments);
      }) as unknown as { push: typeof Array.prototype.push; loaded: boolean; version: string; queue: unknown[] };
      if (!f._fbq) f._fbq = n;
      n.push = n.push;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);

      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
};

const initAnalytics = () => {
  const consent = getConsent();
  if (!consent) return;
  if (consent.analytics) initGA();
  if (consent.marketing) initPixel();
};

// Conversion event utilities — call these from components after user actions
export const trackEvent = (fbEvent: string, gaEvent: string, params?: Record<string, unknown>) => {
  if (!fbEvent || !gaEvent) return;
  if (window.fbq) window.fbq("track", fbEvent, params);
  if (window.gtag) window.gtag("event", gaEvent, params);
};

export const trackCompleteRegistration = (method?: string) => {
  trackEvent("CompleteRegistration", "sign_up", { method: method ?? "email", currency: "EUR" });
};

export const trackLead = (contentName?: string) => {
  trackEvent("Lead", "generate_lead", { content_name: contentName });
};

export const trackInitiateCheckout = (value: number, contentName: string) => {
  if (value <= 0 || !contentName) return;
  trackEvent("InitiateCheckout", "begin_checkout", { value, currency: "EUR", content_name: contentName });
};

export const trackPurchase = (value: number, contentName: string, transactionId?: string) => {
  if (value <= 0 || !contentName) return;
  trackEvent("Purchase", "purchase", { value, currency: "EUR", content_name: contentName, transaction_id: transactionId });
};

export const trackViewContent = (contentName: string, value?: number) => {
  trackEvent("ViewContent", "view_item", { content_name: contentName, value, currency: "EUR" });
};

export const useAnalytics = () => {
  const [, setConsentTrigger] = useState(0);

  useEffect(() => {
    const consent = getConsent();
    if (consent) initAnalytics();

    // Listen for consent changes from CookieBanner
    const handler = () => {
      initAnalytics();
      setConsentTrigger((c) => c + 1);
    };
    window.addEventListener("cookie-consent-changed", handler);
    return () => window.removeEventListener("cookie-consent-changed", handler);
  }, []);
};
