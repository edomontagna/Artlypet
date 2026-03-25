import { useEffect, useState } from "react";

const COOKIE_KEY = "artlypet-cookie-consent";

const initAnalytics = () => {

    // Google Analytics 4
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

    // Meta Pixel — inject script dynamically
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

export const useAnalytics = () => {
  const [, setConsentTrigger] = useState(0);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (consent === "accepted") initAnalytics();

    // Listen for consent changes from CookieBanner
    const handler = () => {
      if (localStorage.getItem(COOKIE_KEY) === "accepted") {
        initAnalytics();
        setConsentTrigger((c) => c + 1);
      }
    };
    window.addEventListener("cookie-consent-changed", handler);
    return () => window.removeEventListener("cookie-consent-changed", handler);
  }, []);
};
