import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUpRight } from "lucide-react";
import { PREMIUM_PRICE } from "@/lib/constants";

export const MobileStickyBar = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setShow(false);
      return;
    }
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pricingEl = document.getElementById("pricing");
      const pricingTop = pricingEl?.getBoundingClientRect().top ?? Infinity;
      const pricingVisible = pricingTop < window.innerHeight && pricingTop > 0;
      setShow(scrollY > 600 && !pricingVisible);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 glass-refraction border-t border-border px-4 py-3 flex items-center justify-between gap-3"
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono tabular text-base font-bold text-foreground">€{PREMIUM_PRICE}</span>
              <span className="text-[10px] text-muted-foreground">{t("pricing.oneTime", "una volta sola")}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{t("mobileCta.subtitle", "Inizia gratis")}</p>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 rounded-full h-11 px-5 text-sm font-semibold bg-primary text-primary-foreground shadow-tinted btn-press"
          >
            <span>{t("mobileCta.title", "Crea il ritratto")}</span>
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
