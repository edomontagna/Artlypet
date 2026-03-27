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
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && typeof parsed.analytics === "boolean") {
      return parsed;
    }
    return null;
  } catch { return null; }
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

  const handleEssentialOnly = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent({ essential: true, analytics, marketing });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up">
      <div className="container max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-card/80 rounded-2xl p-5 shadow-lg border border-border">
          {/* Main content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                {t("cookie.title", "We use cookies")}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("cookie.description", "Essential cookies keep the site working. Analytics cookies help us improve your experience.")}{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  {t("cookie.learnMore", "Learn more")}
                </Link>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={showCustomize ? handleSavePreferences : () => setShowCustomize(true)}
                className="rounded-full text-xs flex-1 sm:flex-none"
              >
                {showCustomize
                  ? t("cookie.savePreferences", "Save Preferences")
                  : t("cookie.essentialOnly", "Essential Only")}
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="rounded-full text-xs flex-1 sm:flex-none"
              >
                {t("cookie.acceptAll", "Accept All")}
              </Button>
            </div>
          </div>

          {/* Granular preferences (expandable) */}
          {showCustomize && (
            <div className="mt-4 pt-4 border-t border-border space-y-2.5">
              <label className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t("cookie.essential", "Essential cookies")}</span>
                <input type="checkbox" checked disabled className="accent-primary h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">{t("cookie.analytics", "Analytics (Google Analytics)")}</span>
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-primary h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-muted-foreground">{t("cookie.marketing", "Marketing (Meta Pixel)")}</span>
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-primary h-4 w-4" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
