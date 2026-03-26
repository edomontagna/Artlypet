import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const COOKIE_KEY = "artlypet-cookie-consent";

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const getConsent = (): CookieConsent | null => {
  const raw = localStorage.getItem(COOKIE_KEY);
  if (!raw) return null;
  // Backward compat: old format stored "accepted"/"declined"
  if (raw === "accepted") return { essential: true, analytics: true, marketing: true };
  if (raw === "declined") return { essential: true, analytics: false, marketing: false };
  try { return JSON.parse(raw); } catch { return null; }
};

export const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleDeclineAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent({ essential: true, analytics, marketing });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up">
      <div className="max-w-lg mx-auto bg-card border border-border rounded-xl shadow-luxury p-4">
        <p className="text-sm text-muted-foreground mb-3">
          {t("cookie.message")}{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            {t("cookie.learnMore")}
          </Link>
        </p>

        {showCustomize && (
          <div className="space-y-2 mb-3 p-3 bg-muted/50 rounded-lg text-sm">
            <label className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("cookie.essential", "Essential cookies")}</span>
              <input type="checkbox" checked disabled className="accent-primary h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-muted-foreground">{t("cookie.analytics", "Analytics (Google Analytics)")}</span>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-primary h-4 w-4" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-muted-foreground">{t("cookie.marketing", "Marketing (Meta Pixel)")}</span>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-primary h-4 w-4" />
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {showCustomize ? (
            <Button size="sm" onClick={handleSavePreferences} className="rounded-full">
              {t("cookie.savePreferences", "Save Preferences")}
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={handleDeclineAll}>
                {t("cookie.decline")}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCustomize(true)}>
                {t("cookie.customize", "Customize")}
              </Button>
              <Button size="sm" onClick={handleAcceptAll} className="rounded-full">
                {t("cookie.accept")}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
