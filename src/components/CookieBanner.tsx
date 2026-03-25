import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const COOKIE_KEY = "artlypet-cookie-consent";

export const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    // Reload to trigger useAnalytics with consent
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up">
      <div className="max-w-lg mx-auto bg-card border border-border rounded-xl shadow-luxury p-4 flex flex-col sm:flex-row items-center gap-3">
        <p className="text-sm text-muted-foreground flex-1">
          {t("cookie.message")}{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            {t("cookie.learnMore")}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="ghost" onClick={handleDecline}>
            {t("cookie.decline")}
          </Button>
          <Button size="sm" onClick={handleAccept} className="rounded-full">
            {t("cookie.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
};
