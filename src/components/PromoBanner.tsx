import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
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
    const timer = setInterval(() => {
      const remaining = getTimeLeft(PROMO_END_DATE);
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("artlypet_promo_dismissed", "true");
  };

  if (dismissed || !timeLeft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className="relative z-40 bg-foreground text-background border-b border-foreground/10"
        role="region"
        aria-label="Promo"
      >
        <div className="container px-5 lg:px-10 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm">
          <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-primary animate-breath" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
          </span>

          <span className="text-background/85 truncate">
            {t("promo.banner", "Offerta lancio: €{{price}} invece di €{{regular}} — termina tra", {
              price: PREMIUM_PRICE,
              regular: REGULAR_PRICE,
            })}
          </span>

          <span className="font-mono tabular text-background font-semibold whitespace-nowrap">
            {timeLeft.days}{t("promo.days", "g")} {timeLeft.hours}{t("promo.hours", "h")} {timeLeft.minutes}{t("promo.minutes", "m")}
          </span>

          <Link
            to="/signup"
            className="hidden sm:inline-flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            <span>{t("promo.cta", "Approfittane")}</span>
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
          </Link>

          <button
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full text-background/60 hover:text-background hover:bg-background/10 transition-colors"
            aria-label={t("promo.dismiss", "Chiudi")}
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
