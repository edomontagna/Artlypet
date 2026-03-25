import { useEffect } from "react";

export const useAnalytics = () => {
  useEffect(() => {
    // Google Analytics 4
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaId) {
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

    // Meta Pixel
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (pixelId && typeof window.fbq === "function") {
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
  }, []);
};
