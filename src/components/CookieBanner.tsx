import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { safeGetItem, safeSetItem } from "@/lib/storage";

const COOKIE_KEY = "artlypet-cookie-consent";

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const getConsent = (): CookieConsent | null => {
  const raw = safeGetItem(COOKIE_KEY);
  if (!raw) return null;
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

/**
 * Compact bottom-right corner card. Stays out of the hero CTA's way.
 * Granular consent stays available via "Personalizza" expand.
 */
export const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  const saveConsent = (consent: CookieConsent) => {
    safeSetItem(COOKIE_KEY, JSON.stringify(consent));
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleAcceptAll = () => saveConsent({ essential: true, analytics: true, marketing: true });
  const handleEssentialOnly = () => saveConsent({ essential: true, analytics: false, marketing: false });
  const handleSavePreferences = () => saveConsent({ essential: true, analytics, marketing });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          role="dialog"
          aria-label={t("cookie.title", "Cookie")}
          className="fixed bottom-20 sm:bottom-4 right-4 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm"
        >
          <div className="relative rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-diffusion-lg p-4 pr-9">
            {/* Dismiss = essential only */}
            <button
              onClick={handleEssentialOnly}
              className="absolute top-2.5 right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={t("cookie.dismiss", "Chiudi")}
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>

            <p className="text-xs text-muted-foreground leading-relaxed pr-2">
              {t("cookie.compactDescription", "Usiamo cookie essenziali. Quelli analitici sono opzionali — ci aiutano a migliorare.")}{" "}
              <Link to="/privacy" className="text-foreground hover:underline font-medium">
                {t("cookie.learnMore", "Dettagli")}
              </Link>
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="inline-flex items-center justify-center rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-4 h-9 text-xs font-semibold transition-colors btn-press flex-1"
              >
                {t("cookie.acceptAll", "Accetta")}
              </button>
              <button
                onClick={() => setShowCustomize((s) => !s)}
                className="inline-flex items-center justify-center rounded-full border border-border hover:border-foreground/40 px-4 h-9 text-xs font-medium text-foreground transition-colors btn-press"
              >
                {showCustomize
                  ? t("cookie.collapse", "Chiudi")
                  : t("cookie.customize", "Personalizza")}
              </button>
            </div>

            {showCustomize && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <label className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("cookie.essential", "Essenziali")}</span>
                  <input type="checkbox" checked disabled className="accent-primary h-3.5 w-3.5" />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-muted-foreground">{t("cookie.analytics", "Analytics")}</span>
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-primary h-3.5 w-3.5" />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-muted-foreground">{t("cookie.marketing", "Marketing")}</span>
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-primary h-3.5 w-3.5" />
                </label>
                <button
                  onClick={handleSavePreferences}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary px-4 h-8 text-xs font-medium text-foreground transition-colors btn-press"
                >
                  {t("cookie.savePreferences", "Salva preferenze")}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
