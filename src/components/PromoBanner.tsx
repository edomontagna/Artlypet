import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PROMO_END_DATE, REGULAR_PRICE, PREMIUM_PRICE } from "@/lib/constants";

const getTimeLeft = (endDate: string) => {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
  };
};

export const PromoBanner = () => {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("artlypet_promo_dismissed") === "true");
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(PROMO_END_DATE));

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      const remaining = getTimeLeft(PROMO_END_DATE);
      if (!remaining) {
        clearInterval(timer);
      }
      setTimeLeft(remaining);
    }, 60000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("artlypet_promo_dismissed", "true");
  };

  if (dismissed || !timeLeft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-gold text-gold-foreground relative z-40"
      >
        <div className="container px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
          <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse-gold" />
          <span className="font-medium">
            {t("promo.banner", "Launch offer: €{{price}} instead of €{{regular}} — ends in", {
              price: PREMIUM_PRICE,
              regular: REGULAR_PRICE,
            })}
          </span>
          <span className="font-bold tabular-nums">
            {timeLeft.days}{t("promo.days", "d")} {timeLeft.hours}{t("promo.hours", "h")} {timeLeft.minutes}{t("promo.minutes", "m")}
          </span>
          <Button
            asChild
            size="sm"
            className="h-7 rounded-full px-4 text-xs font-semibold bg-gold-foreground text-gold hover:bg-gold-foreground/90"
          >
            <Link to="/signup">{t("promo.cta", "Claim Now")}</Link>
          </Button>
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
